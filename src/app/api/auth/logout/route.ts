// app/api/auth/logout.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import authPool from '../../../../../server/db/auth';

export async function POST(request: NextRequest) {
    console.log("Request received:", request.method, request.url);

    try {
        const cookieStore = cookies();
        const sessionCookie = cookieStore.get('sessionToken');
        const authorizationHeader = request.headers.get('Authorization');
        const sessionToken = sessionCookie?.value || authorizationHeader?.split('Bearer ')[1];

        if (!sessionToken) {
            console.log("Unauthorized request");
            return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await authPool.query(`
            UPDATE auth.sessions
            SET status = 'inactive'
            WHERE session_token = $1`,
            [sessionToken]
        );

        console.log("User logged out successfully");
        return new NextResponse(JSON.stringify({ success: true, message: 'Logged out successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': 'sessionToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
            },
        });
        
    } catch (error) {
        console.error("An error occurred during logout:", error);
        return new NextResponse(JSON.stringify({ success: false, error: 'An error occurred during logout' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
