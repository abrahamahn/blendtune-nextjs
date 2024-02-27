import { NextResponse } from 'next/server';
import cookie from 'cookie';

/**
 * Sets an httpOnly cookie on the response object.
 *
 * @param {NextApiResponse} res - The Next.js response object.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} maxAge - The maximum age of the cookie in seconds.
 */
export function setHttpOnlyCookie(response: NextResponse, name: string, value: string, maxAge = 60 * 60 * 24 * 7) {
    const serializedCookie = cookie.serialize(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        path: '/',
        maxAge,
    });

    return new NextResponse(response.body, {
        status: response.status,
        headers: {
            ...response.headers,
            'Set-Cookie': serializedCookie
        }
    });
}
