import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import authPool from '../../../../../../server/db/auth';

export async function GET(request: NextRequest) {
    console.log("Request received:", request.method, request.url);

    try {
        const cookieStore = cookies();
        const sessionCookie = cookieStore.get('sessionToken');
        const authorizationHeader = request.headers.get('Authorization');
        const sessionToken = sessionCookie?.value || authorizationHeader?.split('Bearer ')[1];

        if (!sessionToken) {
            console.log("Unauthorized request");
            return new NextResponse(JSON.stringify({ authenticated: false }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const sessionCheckResult = await authPool.query(`
            SELECT status, expires_at, u.email, u.first_name, u.last_name, u.username, u.profile_created, u.artist_creator_name, u.phone_number, u.gender, u.date_of_birth, u.city, u.state, u.country, u.user_type, u.occupation, u.preferred_language, u.marketing_consent FROM auth.sessions s JOIN users.profile u ON s.user_id = u.user_id
            WHERE s.session_token = $1 AND s.status = 'active'`,
            [sessionToken]
        );

        if (sessionCheckResult.rowCount === 0) {
            console.log("Session token not found or inactive");
            return new NextResponse(JSON.stringify({ authenticated: false }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { status, expires_at, email, first_name, last_name, username, profile_created, 
        artist_creator_name, phone_number, gender, date_of_birth, city, state, country,
        user_type, occupation, preferred_language, marketing_consent } = sessionCheckResult.rows[0];

        const currentTime = new Date();
        const expiresAt = new Date(expires_at);

        if (expiresAt < currentTime || status !== 'active') {
            console.log("Session token has expired or session is inactive");
            return new NextResponse(JSON.stringify({ authenticated: false }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Session token is valid and not expired
        console.log("Session token is valid and not expired");
        return new NextResponse(JSON.stringify({
            authenticated: true,
            username: username,
            email: email,
            firstName: first_name,
            lastName: last_name,
            artistCreatorName: artist_creator_name,
            phoneNumber: phone_number,
            gender: gender,
            dateOfBirth: date_of_birth,
            city: city,
            state: state,
            country: country,
            userType: user_type,
            occupation: occupation,
            preferredLanguage: preferred_language,
            marketingConsent: marketing_consent,
            profileCreated: profile_created,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        
    } catch (error) {
        console.error("An error occurred during session validation:", error);
        return new NextResponse(JSON.stringify({ authenticated: false, error: 'An error occurred during session validation' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
