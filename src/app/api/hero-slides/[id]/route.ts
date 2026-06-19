import { NextResponse } from 'next/server';
import { updateHeroSlide, deleteHeroSlide } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const isAuthenticated = await getAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updatedSlide = await updateHeroSlide(id, body);

    if (!updatedSlide) {
      return NextResponse.json({ success: false, error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, slide: updatedSlide }, { status: 200 });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const isAuthenticated = await getAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const isDeleted = await deleteHeroSlide(id);
    if (!isDeleted) {
      return NextResponse.json({ success: false, error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Slide deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
