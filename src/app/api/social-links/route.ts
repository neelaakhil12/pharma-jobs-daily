import { NextResponse } from 'next/server';
import { getSocialLinks, updateSocialLinks } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const links = await getSocialLinks();
    return NextResponse.json({ success: true, links }, { status: 200 });
  } catch (error) {
    console.error('Error fetching social links API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAuthenticated = await getAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Simple validation
    if (!body.whatsapp || !body.telegram || !body.instagram || !body.linkedin) {
      return NextResponse.json({ success: false, error: 'All social links are required' }, { status: 400 });
    }

    const updated = await updateSocialLinks({
      whatsapp: body.whatsapp,
      telegram: body.telegram,
      instagram: body.instagram,
      linkedin: body.linkedin
    });
    
    return NextResponse.json({ success: true, links: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating social links API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
