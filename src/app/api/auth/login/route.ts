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
    if (db.admin.username === username && db.admin.password === password) {
      await setAdminSession();
      return NextResponse.json({ success: true, message: 'Authenticated successfully' }, { status: 200 });
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
