import { NextRequest, NextResponse } from 'next/server';
import authPool from '@/server/db/auth';
import { randomBytes } from 'crypto';

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    console.log("Received token:", token);

    if (!token) {
        console.log("Token is missing from request");
        return new NextResponse(JSON.stringify({ message: 'Token is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        await authPool.query('BEGIN');
        console.log("Database transaction started");

        const validateResult = await authPool.query(
            'SELECT uuid, first_name, last_name, email, email_confirmed FROM auth.users WHERE email_token = $1 AND email_token_expire > NOW()',
            [token]
        );

        if (validateResult.rowCount === 0) {
            console.log("No matching user found or token expired");
            await authPool.query('ROLLBACK');
            return new NextResponse(JSON.stringify({ success: false, message: 'Token is invalid or has expired.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = validateResult.rows[0];
        console.log("User found:", user);

        // Check if the email is already confirmed
        if (user.email_confirmed) {
            console.log("Email already confirmed. Skipping session creation.");
            await authPool.query('COMMIT');
            return new NextResponse(JSON.stringify({ success: true, message: 'Email is already confirmed.' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Proceed to confirm email and create session
        await authPool.query(
            'UPDATE auth.users SET email_confirmed = TRUE WHERE uuid = $1',
            [user.uuid]
        );

        const response = new NextResponse(JSON.stringify({ success: true, message: 'Email confirmed successfully.' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
        return response;

    } catch (error) {
        console.error("Error during email confirmation:", error);
        await authPool.query('ROLLBACK');
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new NextResponse(JSON.stringify({ success: false, message: `An error occurred: ${errorMessage}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
