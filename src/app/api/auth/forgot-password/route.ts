import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { saveResetToken } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Standard Super Admin email to protect is pharmajobsdaily@gmail.com
    const targetEmail = 'pharmajobsdaily@gmail.com';

    // We only send the email if it matches, but return a general success message to prevent user enumeration
    if (email.toLowerCase().trim() === targetEmail) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = Date.now() + 3600000; // 1 hour validity

      await saveResetToken(token, targetEmail, expires);

      // Resolve origin host header
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const resetLink = `${protocol}://${host}/superadminlogin/reset-password?token=${token}`;

      // SMTP Configuration from env
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
      const smtpUser = process.env.SMTP_USER || '';
      const smtpPass = process.env.SMTP_PASSWORD || '';
      const smtpFrom = process.env.SMTP_FROM || `"Pharma Jobs Daily" <${smtpUser}>`;

      // Set up email transporter
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // Use SSL/TLS for port 465, false for 587
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Send reset mail
      await transporter.sendMail({
        from: smtpFrom,
        to: targetEmail,
        replyTo: targetEmail, // Reply back directly to pharmajobsdaily@gmail.com
        subject: 'Reset Password - Pharma Jobs Daily Super Admin',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #3b82f6; margin: 0; font-size: 24px; font-weight: 800;">Pharma Jobs Daily</h2>
              <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Super Admin Access Recovery</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
            <p style="font-size: 14px; font-weight: bold;">Hello,</p>
            <p style="font-size: 14px;">You are receiving this email because a password reset request was initiated for the Pharma Jobs Daily Super Admin account.</p>
            <p style="font-size: 14px; margin-bottom: 28px;">To reset your password, please click the button below. This recovery link is valid for <strong>1 hour</strong>.</p>
            <div style="text-align: center; margin-bottom: 28px;">
              <a href="${resetLink}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);">
                Reset Super Admin Password
              </a>
            </div>
            <p style="font-size: 12px; color: #64748b;">If the button above does not work, please copy and paste the following link directly into your browser address bar:</p>
            <p style="font-size: 12px; word-break: break-all;"><a href="${resetLink}" style="color: #3b82f6; text-decoration: underline;">${resetLink}</a></p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 28px 0 20px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">This is an automated system notification. Please do not reply directly to this message.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'If the email matches the Super Admin account, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
