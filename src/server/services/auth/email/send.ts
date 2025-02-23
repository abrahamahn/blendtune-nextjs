// src\server\services\auth\email\send.ts
import nodemailer from 'nodemailer';
import pool from '../../../db/auth';
import dotenv from 'dotenv';

dotenv.config();

async function sendConfirmationEmail(
    userEmail: string, 
    confirmationToken: string, 
    actionType: 'signup' | 'resetpassword'
): Promise<{ success: boolean; message: string; }> {
    console.log("Sending confirmation email to:", userEmail, "Token:", confirmationToken);

    const websiteDomain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : `https://${process.env.WEBSITE_DOMAIN}`;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const confirmationUrl = actionType === 'signup' 
        ? `${websiteDomain}/auth/security/confirm-email?token=${confirmationToken}`
        : `${websiteDomain}/auth/security/new-password?token=${confirmationToken}`;

    const emailContent = actionType === 'signup'
        ? `<b>Please click the link to confirm your email address:</b> <a href="${confirmationUrl}">Confirm Email</a>`
        : `<b>You requested to reset your password. Please click the link to set a new password:</b> <a href="${confirmationUrl}">Reset Password</a>`;

    const subject = actionType === 'signup' 
        ? 'Email Confirmation' 
        : 'Password Reset Request';

    let mailOptions = {
        from: `"${process.env.WEBSITE_NAME}" <${process.env.EMAIL_USERNAME}>`,
        to: userEmail,
        subject: subject,
        html: emailContent,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        await pool.query(
            'UPDATE auth.users SET last_email_sent = NOW() WHERE email = $1',
            [userEmail]
        );

        return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return { success: false, message: 'Error sending confirmation email.' };
    }
}

export default sendConfirmationEmail;
