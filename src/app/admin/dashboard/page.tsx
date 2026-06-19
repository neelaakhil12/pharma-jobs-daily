import { redirect } from 'next/navigation';
import { getAdminSessionDetails } from '@/lib/auth';
import { getAllJobsForAdmin } from '@/lib/db';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getAdminSessionDetails();
  
  if (!session.isAuthenticated) {
    redirect('/adminlogin');
  }

  const jobs = await getAllJobsForAdmin();

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <AdminDashboard initialJobs={jobs} adminRole={session.role} adminUsername={session.username} />
    </div>
  );
}

