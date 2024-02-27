import { NextResponse, NextRequest } from 'next/server';
import authPool from '../../../../../server/db/auth';
import bcrypt from 'bcrypt';
import { serialize, CookieSerializeOptions } from 'cookie';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
  }

  try {
    const userResult = await authPool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }
    const user = userResult.rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    // Generate a session identifier
    const sessionId = generateSessionId(); // Implement this according to your needs

    // Adjusting the type of sameSite to match the expected type
    const cookieOptions: CookieSerializeOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict', // Correctly typed as 'strict', 'lax', or 'none'
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    };
    const serializedCookie = serialize('sessionId', sessionId, cookieOptions);

    // Use NextResponse to set cookie and return response
    const newResponse = new NextResponse(JSON.stringify({ message: 'Login successful' }));
    newResponse.headers.set('Set-Cookie', serializedCookie);
    return newResponse;
  } catch (error) {
    return new Response(JSON.stringify({ message: 'An error occurred' }), { status: 500 });
  }
}

function generateSessionId() {
  // This could be a random string, a UUID, or any other method you prefer
  return 'randomSessionId123'; // Placeholder, replace with actual logic
}
