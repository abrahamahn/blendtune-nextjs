import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import authPool from '@/server/db/auth';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken')?.value;

  if (!sessionToken) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const sessionQueryResult = await authPool.query(`
      SELECT u.user_id, u.artist_creator_name, u.user_type, u.occupation, u.gender, u.date_of_birth, u.marketing_consent, u.profile_created
      FROM auth.sessions s
      JOIN users.profile u ON s.user_id = u.user_id
      WHERE s.session_token = $1 AND s.status = 'active'`, [sessionToken]);

    if (sessionQueryResult.rowCount === 0) {
      return new NextResponse(JSON.stringify({ message: 'Session not found or expired' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new NextResponse(JSON.stringify(sessionQueryResult.rows[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
