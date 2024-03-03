import { NextRequest, NextResponse } from 'next/server';
import authPool from '../../../../../server/db/auth';
import sendConfirmationEmail from '../../../../../server/services/authEmail';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    try {
        console.log("Request body:", req.body);

        const { firstName, lastName, email, username, password } = await req.json();
        console.log("Received data:", { firstName, lastName, email });

        const emailCheckResult = await authPool.query('SELECT * FROM auth.users WHERE email = $1', [email]);

        if (emailCheckResult.rows.length > 0) {
            const existingUser = emailCheckResult.rows[0];
            const passwordMatch = await bcrypt.compare(password, existingUser.password);
            console.log("Password match:", passwordMatch);

            if (passwordMatch) {
                if (!existingUser.email_confirmed) {
                    const confirmationToken = uuidv4();
                    const emailTokenExpire = new Date(new Date().getTime() + 15 * 60000);

                    await authPool.query('UPDATE auth.users SET email_token = $1, email_token_expire = $2 WHERE email = $3', [confirmationToken, emailTokenExpire, email]);

                    console.log("Resending confirmation email...");
                    await sendConfirmationEmail(email, confirmationToken, 'signup');

                    return new NextResponse(JSON.stringify({ redirectToVerifyEmail: true }), {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } else {
                    return new NextResponse(JSON.stringify({ message: 'Email already exists. Please log in.' }), {
                        status: 409,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }
            } else {
                return new NextResponse(JSON.stringify({ message: 'Incorrect password for existing email' }), {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const confirmationToken = uuidv4();
            const createdAt = new Date().toISOString();
            const emailTokenExpire = new Date(new Date().getTime() + 15 * 60000);

            const result = await authPool.query(
                'INSERT INTO auth.users (first_name, last_name, email, username, password, created_at, email_confirmed, email_token, last_email_sent, email_token_expire, signup_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, uuid',
                [firstName, lastName, email, username, hashedPassword, createdAt, false, confirmationToken, createdAt, emailTokenExpire, 'email']
            );


            // Send the confirmation email with the token
            await sendConfirmationEmail(email, confirmationToken,'signup');

            return new NextResponse(JSON.stringify({ message: 'User created successfully', userId: result.rows[0].id }), {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error("Error:", error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new NextResponse(JSON.stringify({ message: 'An error occurred', error: message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
