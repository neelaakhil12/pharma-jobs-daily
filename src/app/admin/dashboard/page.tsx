import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getAllJobsForAdmin } from '@/lib/db';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const isAuthenticated = await getAdminSession();
  
  if (!isAuthenticated) {
    redirect('/adminlogin');
  }

  const jobs = await getAllJobsForAdmin();

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <AdminDashboard initialJobs={jobs} />
    </div>
  );
}

