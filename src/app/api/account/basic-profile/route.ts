import { NextRequest, NextResponse } from 'next/server';
import authPool from '../../../../../server/db/auth';
import bcrypt from 'bcrypt';
import { setHttpOnlyCookie } from '../../../../../server/utils/cookie';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest, response: NextResponse) {
  console.log("Request received:", request.method, request.url);

  const { email, password } = await request.json();

  if (!email || !password) {
    console.log("Email or password missing in request body");
    return new NextResponse(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
  }

  try {
    const userResult = await authPool.query('SELECT * FROM auth.users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      console.log("User not found for email:", email);
      return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }
    
    const user = userResult.rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log("Invalid password for email:", email);
      return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    console.log("User logged in successfully:", email);
    
    const sessionToken = uuidv4();
    const refreshToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await authPool.query(
      'INSERT INTO auth.sessions (user_id, session_token, refresh_token, ip_address, user_agent, status, expires_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [user.uuid, sessionToken, refreshToken, request.ip, request.headers.get('user-agent') || '', 'active', expiresAt]
    );

    const response = new NextResponse(JSON.stringify({ message: 'Login successful' }), { status: 200 });

    setHttpOnlyCookie(response, 'sessionToken', sessionToken, {
      httpOnly: true,
      path: '/',
      expires: expiresAt,
    });

    console.log("Response:", response.status);

    return response;
  } catch (error) {
    console.error("An error occurred during login:", error);
    return new NextResponse(JSON.stringify({ message: 'An unexpected error occurred' }), { status: 500 });
  }
};
