import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Protect the route using Vercel's CRON_SECRET if configured.
  // If not configured, we allow the request so that simple pings can work (e.g. from GitHub actions or local tests).
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Perform a lightweight query on the settings table to keep Supabase active
    const { data, error } = await supabase.from('settings').select('key').limit(1);

    if (error) {
      console.error('[Cron Keep-Alive] Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Supabase pinged successfully. Database is active.',
        timestamp: new Date().toISOString(),
        data 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Cron Keep-Alive] Internal error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
