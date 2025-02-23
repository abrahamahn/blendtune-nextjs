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
