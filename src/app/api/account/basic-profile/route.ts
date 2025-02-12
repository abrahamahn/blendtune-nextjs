import { NextRequest, NextResponse } from 'next/server';
import authPool from '@/server/db/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  if (request.method === 'POST') {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;

    if (!sessionToken) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized: No session token provided' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    try {
      const sessionQueryResult = await authPool.query(`
        SELECT user_id
        FROM auth.sessions
        WHERE session_token = $1 AND status = 'active'`, [sessionToken]);

      if (sessionQueryResult.rowCount === 0) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized: Invalid or expired session token' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const userId = sessionQueryResult.rows[0].user_id;
      const userData = await request.json();

      const { userArtistCreatorName, userType, userOccupation, userGender, userDateOfBirth, userMarketingConsent } = userData;

      const updateQuery = `
        UPDATE users.profile
        SET
          artist_creator_name = $1,
          user_type = $2,
          occupation = $3,
          gender = $4,
          date_of_birth = $5,
          marketing_consent = $6,
          profile_created = true
        WHERE user_id = $7;`;

      await authPool.query(updateQuery, [
        userArtistCreatorName,
        userType,
        userOccupation,
        userGender,
        userDateOfBirth,
        userMarketingConsent,
        userId,
      ]);

      return new NextResponse(JSON.stringify({ message: 'Profile updated successfully' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } else {
    return new NextResponse(null, {
      status: 405,
    });
  };
};