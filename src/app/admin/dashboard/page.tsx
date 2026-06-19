import { redirect } from 'next/navigation';
import { getAdminSessionDetails } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getAdminSessionDetails();
  
  if (!session.isAuthenticated) {
    redirect('/superadminlogin');
  }

  if (session.role === 'SUPER ADMIN') {
    redirect('/superadmin/dashboard');
  } else {
    redirect('/assistantadmin/dashboard');
  }
}

