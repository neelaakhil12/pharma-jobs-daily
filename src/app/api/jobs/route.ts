import { NextResponse } from 'next/server';
import { getAllJobs, addJob } from '@/lib/db';
import { getAdminSession, getAdminSessionDetails } from '@/lib/auth';

// GET /api/jobs (supports query filters)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const qualification = searchParams.get('qualification') || '';
    const category = searchParams.get('category') || '';
    const type = searchParams.get('type') || '';
    const location = searchParams.get('location')?.toLowerCase() || '';

    let jobs = await getAllJobs();

    // Filter out future scheduled jobs for visitors
    const now = new Date();
    jobs = jobs.filter(
      (job) => !job.scheduledTime || new Date(job.scheduledTime) <= now
    );

    // Search filter
    if (search) {
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(search) ||
          job.company.toLowerCase().includes(search) ||
          job.description.toLowerCase().includes(search)
      );
    }

    // Qualification filter
    if (qualification && qualification !== 'All') {
      const qLower = qualification.toLowerCase();
      jobs = jobs.filter((job) => {
        const jqLower = job.qualification.toLowerCase();
        return jqLower === qLower || (qLower === 'b.tech' && jqLower.includes('b.tech'));
      });
    }

    // Category filter
    if (category && category !== 'All') {
      jobs = jobs.filter(
        (job) => job.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Job Type filter (Full-time, Contract, etc.)
    if (type && type !== 'All') {
      jobs = jobs.filter(
        (job) => job.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Location filter
    if (location) {
      jobs = jobs.filter((job) => job.location.toLowerCase().includes(location));
    }

    return NextResponse.json({ success: true, jobs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/jobs (Secure - Create a new job)
export async function POST(request: Request) {
  try {
    const session = await getAdminSessionDetails();
    if (!session.isAuthenticated || !session.role) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Simple validation
    const requiredFields = ['title', 'company', 'category', 'type', 'qualification', 'location', 'salary', 'experience', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newJob = await addJob({
      title: body.title,
      company: body.company,
      category: body.category,
      type: body.type,
      qualification: body.qualification,
      location: body.location,
      salary: body.salary,
      experience: body.experience,
      description: body.description,
      responsibilities: body.responsibilities || [],
      requirements: body.requirements || [],
      benefits: body.benefits || [],
      applyUrl: body.applyUrl || 'mailto:ifactselugu@gmail.com',
      imageUrl: body.imageUrl || '',
      imageUrls: body.imageUrls || [],
      applyParts: body.applyParts || [],
      scheduledTime: body.scheduledTime || undefined,
      postedBy: session.role
    });

    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
