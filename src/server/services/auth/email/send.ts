// src/server/services/auth/email/send.ts
import nodemailer from 'nodemailer';
import pool from '../../../db/auth';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Sends a confirmation email for user signup or password reset
 * 
 * @param {string} userEmail - The recipient's email address
 * @param {string} confirmationToken - Unique token for email verification
 * @param {'signup' | 'resetpassword'} actionType - Type of email action
 * @returns {Promise<{ success: boolean; message: string; }>} 
 * - Result of email sending process with success status and message
 */
async function sendConfirmationEmail(
    userEmail: string, 
    confirmationToken: string, 
    actionType: 'signup' | 'resetpassword'
): Promise<{ success: boolean; message: string; }> {
    // Log email sending attempt for tracking and debugging
    console.log("Sending confirmation email to:", userEmail, "Token:", confirmationToken);

    // Determine website domain based on environment
    const websiteDomain = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : `https://${process.env.WEBSITE_DOMAIN}`;

    // Create email transporter using Gmail service
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Generate confirmation URL based on action type
    const confirmationUrl = actionType === 'signup' 
        ? `${websiteDomain}/auth/security/confirm-email?token=${confirmationToken}`
        : `${websiteDomain}/auth/security/new-password?token=${confirmationToken}`;

    // Generate email content based on action type
    const emailContent = actionType === 'signup'
        ? `<b>Please click the link to confirm your email address:</b> <a href="${confirmationUrl}">Confirm Email</a>`
        : `<b>You requested to reset your password. Please click the link to set a new password:</b> <a href="${confirmationUrl}">Reset Password</a>`;

    // Determine email subject based on action type
    const subject = actionType === 'signup' 
        ? 'Email Confirmation' 
        : 'Password Reset Request';

    // Prepare email options
    let mailOptions = {
        from: `"${process.env.WEBSITE_NAME}" <${process.env.EMAIL_USERNAME}>`,
        to: userEmail,
        subject: subject,
        html: emailContent,
    };

    try {
        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        // Update last email sent timestamp in the database
        await pool.query(
            'UPDATE auth.users SET last_email_sent = NOW() WHERE email = $1',
            [userEmail]
        );

        // Return success response
        return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
        // Log and handle email sending errors
        console.error('Error sending confirmation email:', error);
        return { success: false, message: 'Error sending confirmation email.' };
    }
}

export default sendConfirmationEmail;