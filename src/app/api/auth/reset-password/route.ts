import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getResetToken, clearResetToken, updateSuperAdminCredentials } from '@/lib/db';

async function updateEnvFile(username: string, password: string) {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    let content = await fs.readFile(envPath, 'utf8');

    // Update SUPER_ADMIN_USERNAME
    if (content.includes('SUPER_ADMIN_USERNAME=')) {
      content = content.replace(/SUPER_ADMIN_USERNAME=.*/, `SUPER_ADMIN_USERNAME=${username}`);
    } else {
      content += `\nSUPER_ADMIN_USERNAME=${username}`;
    }

    // Update SUPER_ADMIN_PASSWORD
    if (content.includes('SUPER_ADMIN_PASSWORD=')) {
      content = content.replace(/SUPER_ADMIN_PASSWORD=.*/, `SUPER_ADMIN_PASSWORD=${password}`);
    } else {
      content += `\nSUPER_ADMIN_PASSWORD=${password}`;
    }

    await fs.writeFile(envPath, content, 'utf8');
  } catch (err) {
    console.error('Failed to write .env.local update:', err);
  }
}

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    // Retrieve active reset token data
    const tokenData = await getResetToken();

    if (!tokenData || tokenData.token !== token) {
      return NextResponse.json(
        { success: false, error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    // Check expiration
    if (Date.now() > tokenData.expires) {
      await clearResetToken();
      return NextResponse.json(
        { success: false, error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    const targetEmail = tokenData.email;

    // 1. Update Database Credentials
    await updateSuperAdminCredentials(targetEmail, password);

    // 2. Update .env.local file
    await updateEnvFile(targetEmail, password);

    // 3. Update in-memory process.env variables so they take effect immediately
    process.env.SUPER_ADMIN_USERNAME = targetEmail;
    process.env.SUPER_ADMIN_PASSWORD = password;

    // 4. Clear/Delete reset token
    await clearResetToken();

    return NextResponse.json({
      success: true,
      message: 'Super Admin password has been reset successfully.',
    });
  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
