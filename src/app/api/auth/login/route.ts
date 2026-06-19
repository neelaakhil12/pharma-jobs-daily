import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { setAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const db = await readDb();
    
    // Check credentials matching
    if (db.superAdmin && db.superAdmin.username === username && db.superAdmin.password === password) {
      await setAdminSession(username);
      return NextResponse.json({ success: true, message: 'Authenticated successfully' }, { status: 200 });
    } else if (db.admin.username === username && db.admin.password === password) {
      await setAdminSession(username);
      return NextResponse.json({ success: true, message: 'Authenticated successfully' }, { status: 200 });
    } else if (db.admins && Array.isArray(db.admins)) {
      const matched = db.admins.find(a => a.username === username && a.password === password);
      if (matched) {
        await setAdminSession(username);
        return NextResponse.json({ success: true, message: 'Authenticated successfully' }, { status: 200 });
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
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
