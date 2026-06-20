import { redirect } from 'next/navigation';
import { getAdminSessionDetails } from '@/lib/auth';
import { getAllJobsForAdmin, getCategories } from '@/lib/db';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AssistantAdminDashboardPage() {
  const session = await getAdminSessionDetails();
  
  if (!session.isAuthenticated || session.role !== 'ADMIN') {
    redirect('/assistantlogin');
  }

  const [jobs, categories] = await Promise.all([
    getAllJobsForAdmin(),
    getCategories()
  ]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <AdminDashboard 
        initialJobs={jobs} 
        adminRole={session.role} 
        adminUsername={session.username} 
        initialCategories={categories}
      />
    </div>
  );
}
