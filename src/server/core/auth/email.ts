// src/server/core/auth/email.ts
/**
 * Transactional auth emails (signup confirmation / password reset).
 * Behavior preserved from services/auth/email/send.ts.
 */

import nodemailer from 'nodemailer';

import { db } from '@server/db';
import { createUsersRepository } from '@server/db/repositories/users';

export type AuthEmailAction = 'signup' | 'resetpassword';

export interface SendEmailResult {
  success: boolean;
  message: string;
}

/**
 * Send a confirmation/reset email and stamp last_email_sent on the user.
 */
export async function sendConfirmationEmail(
  userEmail: string,
  confirmationToken: string,
  actionType: AuthEmailAction,
): Promise<SendEmailResult> {
  const websiteDomain =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `https://${process.env.WEBSITE_DOMAIN}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD },
  });

  const confirmationUrl =
    actionType === 'signup'
      ? `${websiteDomain}/auth/security/confirm-email?token=${confirmationToken}`
      : `${websiteDomain}/auth/security/new-password?token=${confirmationToken}`;

  const emailContent =
    actionType === 'signup'
      ? `<b>Please click the link to confirm your email address:</b> <a href="${confirmationUrl}">Confirm Email</a>`
      : `<b>You requested to reset your password. Please click the link to set a new password:</b> <a href="${confirmationUrl}">Reset Password</a>`;

  const subject = actionType === 'signup' ? 'Email Confirmation' : 'Password Reset Request';

  const mailOptions = {
    from: `"${process.env.WEBSITE_NAME}" <${process.env.EMAIL_USERNAME}>`,
    to: userEmail,
    subject,
    html: emailContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    await createUsersRepository(db).touchLastEmailSent(userEmail);
    return { success: true, message: 'Email sent successfully.' };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, message: 'Error sending confirmation email.' };
  }
}
