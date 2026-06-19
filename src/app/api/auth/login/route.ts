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

    const db = await readDb();
    
    if (type === 'super') {
      const isSuper = (db.superAdmin && db.superAdmin.username === username && db.superAdmin.password === password) ||
                      (db.admin.username === username && db.admin.password === password);
      if (isSuper) {
        await setAdminSession(username, 'SUPER ADMIN');
        return NextResponse.json({ success: true, message: 'Authenticated successfully' }, { status: 200 });
      }
    } else if (type === 'assistant') {
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
