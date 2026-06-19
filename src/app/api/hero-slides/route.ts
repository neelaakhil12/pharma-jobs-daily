import { NextResponse } from 'next/server';
import { getHeroSlides, addHeroSlide } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slides = await getHeroSlides();
    return NextResponse.json({ success: true, slides }, { status: 200 });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const isAuthenticated = await getAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Field validation
    if (!body.title || !body.image || !body.path) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, image, and path are required' },
        { status: 400 }
      );
    }

    const newSlide = await addHeroSlide({
      title: body.title,
      image: body.image,
      path: body.path
    });

    return NextResponse.json({ success: true, slide: newSlide }, { status: 201 });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
