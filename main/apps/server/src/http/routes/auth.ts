// main/apps/server/src/http/routes/auth.ts
/**
 * Auth routes — same wire behavior as the former Next.js /api/auth handlers.
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import {
  confirmEmail,
  login,
  requestPasswordReset,
  resetPassword,
  signUpUser,
  verifyResetPasswordToken,
  type SignUpData,
} from '@server/core/auth';
import { logoutSession, validateSession, type SessionData } from '@server/core/sessions';
import { extractRequestMeta, extractSessionToken, SESSION_COOKIE } from '../../bootstrap/context';

const setSessionCookie = (reply: FastifyReply, token: string, expires: Date): void => {
  reply.setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    path: '/',
    expires,
    secure: true,
    sameSite: 'strict',
  });
};

interface LoginBody {
  email?: string;
  password?: string;
}

export function registerAuthRoutes(app: FastifyInstance): void {
  app.post('/auth/login', async (req: FastifyRequest<{ Body: LoginBody }>, reply) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return reply.status(400).send({ message: 'Email and password are required' });
    }
    const result = await login(email, password, extractRequestMeta(req));
    if (!result.ok) return reply.status(401).send({ message: 'Invalid credentials' });

    setSessionCookie(reply, result.sessionToken, result.expiresAt);
    return reply.status(200).send({ message: 'Login successful' });
  });

  app.post('/auth/logout', async (req, reply) => {
    const token = extractSessionToken(req);
    if (!token) return reply.status(401).send({ success: false, message: 'Unauthorized' });

    await logoutSession(token);
    reply.clearCookie(SESSION_COOKIE, { path: '/' });
    return reply.status(200).send({ success: true, message: 'Logged out successfully' });
  });

  app.post('/auth/signup', async (req: FastifyRequest<{ Body: SignUpData }>, reply) => {
    const { firstName, lastName, email, username, password } = req.body ?? ({} as SignUpData);
    const result = await signUpUser({ firstName, lastName, email, username, password });
    return reply.status(result.status).send({
      message: result.message,
      userId: result.userId,
      redirectToVerifyEmail: result.redirectToVerifyEmail,
    });
  });

  app.get('/auth/security/check-session', async (req, reply) => {
    const token = extractSessionToken(req);
    if (!token) return reply.status(401).send({ authenticated: false });

    const session: SessionData | null = await validateSession(token);
    if (!session) return reply.status(401).send({ authenticated: false });

    return reply.status(200).send({
      authenticated: true,
      username: session.username,
      email: session.email,
      firstName: session.first_name,
      lastName: session.last_name,
      artistCreatorName: session.artist_creator_name,
      phoneNumber: session.phone_number,
      gender: session.gender,
      dateOfBirth: session.date_of_birth,
      city: session.city,
      state: session.state,
      country: session.country,
      userType: session.user_type,
      occupation: session.occupation,
      preferredLanguage: session.preferred_language,
      marketingConsent: session.marketing_consent,
      profileCreated: session.profile_created,
    });
  });

  app.get(
    '/auth/security/confirm-email',
    async (req: FastifyRequest<{ Querystring: { token?: string } }>, reply) => {
      const { token } = req.query;
      if (!token) return reply.status(400).send({ message: 'Token is required' });

      const result = await confirmEmail(token, extractRequestMeta(req));
      if (result.alreadyConfirmed) {
        return reply.status(200).send({ success: true, message: 'Email is already confirmed.' });
      }
      setSessionCookie(reply, result.sessionToken!, result.expiresAt!);
      return reply.status(201).send({ success: true, message: 'Email confirmed successfully.' });
    },
  );

  app.post(
    '/auth/security/reset-password',
    async (req: FastifyRequest<{ Body: { email?: string } }>, reply) => {
      const { email } = req.body ?? {};
      if (!email) return reply.status(400).send({ message: 'Email is required' });

      await requestPasswordReset(email);
      return reply.status(200).send({
        message: 'If an account with that email exists, we have sent a password reset email.',
      });
    },
  );

  app.get(
    '/auth/security/reset-password/verify',
    async (req: FastifyRequest<{ Querystring: { token?: string } }>, reply) => {
      const { token } = req.query;
      if (!token) return reply.status(400).send({ message: 'Token is required' });

      const result = await verifyResetPasswordToken(token);
      if (result.alreadyConfirmed) {
        return reply.status(200).send({ success: true, message: 'Email is already confirmed.' });
      }
      return reply.status(201).send({ success: true, message: 'Email confirmed successfully.' });
    },
  );

  app.post(
    '/auth/security/reset-password/create',
    async (req: FastifyRequest<{ Body: { token?: string; newPassword?: string } }>, reply) => {
      const { token, newPassword } = req.body ?? {};
      if (!token || !newPassword) {
        return reply.status(400).send({ message: 'Token and new password are required' });
      }
      const { sessionToken, expiresAt } = await resetPassword(
        token,
        newPassword,
        extractRequestMeta(req),
      );
      setSessionCookie(reply, sessionToken, expiresAt);
      return reply.status(200).send({ success: true, message: 'Password reset successfully.' });
    },
  );
}
