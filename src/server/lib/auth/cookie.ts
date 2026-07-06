// src\server\lib\auth\cookie.ts
import { NextResponse } from 'next/server';

/**
 * Sets an httpOnly cookie on the response object with more flexible options.
 *
 * @param {NextResponse} response - The Next.js response object.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {Object} options - The options for the cookie.
 * @param {boolean} [options.httpOnly=true] - Marks the cookie to be accessible only by the web server.
 * @param {string} [options.path="/"] - Path where the cookie is usable.
 * @param {Date} options.expires - Expiration date of the cookie.
 * @returns {NextResponse}
 */
export function setHttpOnlyCookie(response: NextResponse, name: string, value: string, options: { httpOnly?: boolean, path?: string, expires: Date }): NextResponse {
    // Construct the cookie string with options
    let cookieValue = `${name}=${value}; Path=${options.path ?? '/'}; Expires=${options.expires.toUTCString()}`;
    if (options.httpOnly !== false) {
        cookieValue += '; HttpOnly';
    }
    cookieValue += '; Secure; SameSite=Strict';

    response.headers.append('Set-Cookie', cookieValue);

    return response;
}

/**
 * Sets both auth cookies: the access JWT in the existing `sessionToken` cookie and the
 * opaque rotating refresh token in `refreshToken`. Both cookie lifetimes match the
 * refresh window so browsers keep sending the (short-lived) JWT for refresh handling.
 */
export function setAuthCookies(
    response: NextResponse,
    tokens: { accessToken: string; refreshToken: string; refreshExpiresAt: Date },
): NextResponse {
    setHttpOnlyCookie(response, 'sessionToken', tokens.accessToken, {
        httpOnly: true,
        path: '/',
        expires: tokens.refreshExpiresAt,
    });
    return setHttpOnlyCookie(response, 'refreshToken', tokens.refreshToken, {
        httpOnly: true,
        path: '/',
        expires: tokens.refreshExpiresAt,
    });
}
