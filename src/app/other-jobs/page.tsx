import Link from 'next/link';
import { getAllJobs } from '@/lib/db';
import JobCard from '@/components/JobCard';
import { Wrench, ArrowLeft, Search, GraduationCap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Engineering & Technical Jobs | Pharma Jobs Daily',
  description: 'Browse verified engineering, instrumentation, calibration, and automation vacancies in pharmaceutical manufacturing and healthcare.',
};

export default async function OtherJobsPage() {
  const allJobs = await getAllJobs();
  
  // Helper to map job categories to general tabs
  const getJobSector = (catName: string): 'government' | 'private' | 'other' => {
    const cat = catName.toLowerCase();
    if (
      cat.includes('government') ||
      cat.includes('govt') ||
      cat.includes('staff nurse') ||
      cat.includes('paramedical') ||
      cat.includes('jrf') ||
      cat.includes('srf')
    ) {
      return 'government';
    }
    if (cat.includes('private')) {
      return 'private';
    }
    return 'other';
  };

  // Filter for engineering-related / other jobs (anything in 'other' sector)
  const engineeringJobs = allJobs.filter(
    (job) => getJobSector(job.category) === 'other'
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6" data-aos="fade-down">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Main Jobs Board
          </Link>
        </div>

        {/* Premium Page Header Panel */}
        <div
          data-aos="fade-up"
          className="bg-gradient-to-tr from-white via-primary-light/20 to-accent-sky/10 rounded-3xl p-8 border border-white shadow-md mb-10 relative overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent-sky to-secondary" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold px-3 py-1 bg-primary-light text-primary border border-primary/20 rounded-full tracking-wide uppercase">
                Technical Sector
              </span>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight flex items-center gap-2">
                <Wrench className="w-7 h-7 text-primary" />
                Engineering & Other Technical Jobs
              </h1>
              <p className="text-slate-550 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Find instrumentation, automation, calibration, and chemical process engineering vacancies in leading pharmaceutical industries.
              </p>
            </div>
            
            <div className="bg-accent-sky/10 border border-accent-sky/20 rounded-2xl px-5 py-4 shrink-0 text-center md:text-right">
              <span className="block text-2xl font-extrabold text-accent-sky">{engineeringJobs.length}</span>
              <span className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-wide mt-0.5">
                Active Listings
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Job Cards Grid */}
        {engineeringJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-aos="fade-up">
            {engineeringJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          /* Premium Empty State */
          <div className="p-16 text-center border border-slate-100 bg-white shadow-md rounded-3xl space-y-4" data-aos="fade-up">
            <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto shadow-sm">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-800">No Technical Vacancies Currently Listed</h3>
            <p className="text-slate-450 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              We update vacancies daily. Currently, there are no engineering or technical roles published. Check back in a few hours or contact us directly.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-primary to-accent-sky text-xs font-bold text-white rounded-xl shadow-md"
            >
              Enquire Via Recruiter
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
