import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { setAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password, type } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (type === 'super') {
      const db = await readDb();

      // ── Priority 1: db superAdmin credentials (updated dynamically via Forgot Password) ──
      if (db.superAdmin) {
        if (username === db.superAdmin.username && password === db.superAdmin.password) {
          await setAdminSession(username, 'SUPER ADMIN');
          return NextResponse.json({ success: true, message: 'Authenticated successfully' }, { status: 200 });
        }
        
        // Also check if they match the admin fallback (e.g. from the admin credentials list)
        if (db.admin && username === db.admin.username && password === db.admin.password) {
          await setAdminSession(username, 'SUPER ADMIN');
          return NextResponse.json({ success: true, message: 'Authenticated successfully' }, { status: 200 });
        }

        // Deny immediately if db.superAdmin is set but credentials did not match database records
        return NextResponse.json(
          { success: false, error: 'Invalid username or password for this login area' },
          { status: 401 }
        );
      }

      // ── Priority 2: env-var credentials (only used if db.superAdmin is not set) ──
      const envUser = process.env.SUPER_ADMIN_USERNAME;
      const envPass = process.env.SUPER_ADMIN_PASSWORD;

      if (envUser && envPass) {
        if (username === envUser && password === envPass) {
          await setAdminSession(username, 'SUPER ADMIN');
          return NextResponse.json({ success: true, message: 'Authenticated successfully' }, { status: 200 });
        }
        // Env vars are configured — deny any non-matching credentials immediately
        return NextResponse.json(
          { success: false, error: 'Invalid username or password for this login area' },
          { status: 401 }
        );
      }

      // ── Priority 3: Fallback db.admin credentials (only if db.superAdmin and env vars are not set) ──
      if (db.admin && username === db.admin.username && password === db.admin.password) {
        await setAdminSession(username, 'SUPER ADMIN');
        return NextResponse.json({ success: true, message: 'Authenticated successfully' }, { status: 200 });
      }
    } else if (type === 'assistant') {
      const db = await readDb();
      if (db.admins && Array.isArray(db.admins)) {
        const matched = db.admins.find(a => a.username === username && a.password === password);
        if (matched) {
          await setAdminSession(username, 'ADMIN');
          return NextResponse.json({ success: true, message: 'Authenticated successfully' }, { status: 200 });
        }
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid username or password for this login area' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
