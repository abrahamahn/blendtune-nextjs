import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import authPool from '../../../../../../server/db/auth';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const sessionCookie = cookieStore.get('sessionToken');
        const authorizationHeader = request.headers.get('Authorization');
        const sessionToken = sessionCookie?.value || authorizationHeader?.split('Bearer ')[1];

        if (!sessionToken) {
            return new NextResponse(JSON.stringify({ authenticated: false }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const sessionCheckResult = await authPool.query(`
            SELECT s.status, u.email, u.first_name, u.last_name
            FROM auth.sessions s
            JOIN users.profile u ON s.user_id = u.user_id
            WHERE s.session_token = $1 AND s.status = 'active'`,
            [sessionToken]
        );

        if (sessionCheckResult.rowCount === 0) {
            return new NextResponse(JSON.stringify({ authenticated: false }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { email, first_name, last_name } = sessionCheckResult.rows[0];

        return new NextResponse(JSON.stringify({ authenticated: true, email, firstName: first_name, lastName: last_name }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        
    } catch (error) {
        return new NextResponse(JSON.stringify({ authenticated: false, error: 'An error occurred during session validation' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}