import { NextResponse } from 'next/server';
import { getAdminsList, updateAdminsList } from '@/lib/db';
import { getAdminSessionDetails } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSessionDetails();
    if (!session.isAuthenticated || session.role !== 'SUPER ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Super Admin access required.' }, { status: 401 });
    }
    const admins = await getAdminsList();
    return NextResponse.json({ success: true, admins }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admins API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAdminSessionDetails();
    if (!session.isAuthenticated || session.role !== 'SUPER ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Super Admin access required.' }, { status: 401 });
    }
    
    const body = await request.json();
    if (!body || !Array.isArray(body.admins)) {
      return NextResponse.json({ success: false, error: 'Admins list is required' }, { status: 400 });
    }

    // Validate that each admin has username and password
    for (const admin of body.admins) {
      if (!admin.username || !admin.password) {
        return NextResponse.json({ success: false, error: 'Username and password are required for all accounts.' }, { status: 400 });
      }
    }

    const updated = await updateAdminsList(body.admins);
    return NextResponse.json({ success: true, admins: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating admins API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
