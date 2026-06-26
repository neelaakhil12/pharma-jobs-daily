import { NextResponse } from 'next/server';
import { getCustomTitleOptions, updateCustomTitleOptions } from '@/lib/db';
import { getAdminSessionDetails } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const options = await getCustomTitleOptions();
    return NextResponse.json({ success: true, options }, { status: 200 });
  } catch (error) {
    console.error('Error fetching custom title options API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAdminSessionDetails();
    if (!session.isAuthenticated || !session.role) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    if (!body.options || !Array.isArray(body.options)) {
      return NextResponse.json({ success: false, error: 'Invalid options array' }, { status: 400 });
    }

    const updated = await updateCustomTitleOptions(body.options);

    return NextResponse.json({ success: true, options: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating custom title options API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
