
import nodemailer from 'nodemailer';
import pool from '../db/auth';
import dotenv from 'dotenv';

dotenv.config();

async function sendConfirmationEmail(userEmail: string, confirmationToken: string): Promise<{ success: boolean; message: string; }> {
    console.log("Sending confirmation email to:", userEmail, "Token:", confirmationToken);

    const websiteDomain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : `https://${process.env.WEBSITE_DOMAIN}`;
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    let mailOptions = {
        from: `"${process.env.WEBSITE_NAME}" <${process.env.EMAIL_USERNAME}>`,
        to: userEmail,
        subject: 'Email Confirmation',
        html: `<b>Please click the link to confirm your email address:</b> <a href="${websiteDomain}/auth/confirm-email?token=${confirmationToken}">Confirm Email</a>`,
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