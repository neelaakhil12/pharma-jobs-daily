import { NextResponse } from 'next/server';
import { getCategories, updateCategories, renameCategoriesInJobs } from '@/lib/db';
import { getAdminSessionDetails } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories API:', error);
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
    if (!body.categories || !Array.isArray(body.categories)) {
      return NextResponse.json({ success: false, error: 'Invalid categories array' }, { status: 400 });
    }

    const updated = await updateCategories(body.categories);

    // If there are renames or deletions, update the jobs
    const renames = body.renames || {};
    const deletions = body.deletions || [];
    if (Object.keys(renames).length > 0 || deletions.length > 0) {
      const fallback = body.categories.includes('Other Jobs')
        ? 'Other Jobs'
        : (body.categories[0] || 'Other Jobs');
      await renameCategoriesInJobs(renames, deletions, fallback);
    }

    return NextResponse.json({ success: true, categories: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating categories API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

