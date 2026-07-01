import Link from 'next/link';
import { MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Job } from '@/lib/db';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  // Determine left border styling based on category
  const getStyleCategory = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('government') || cat.includes('govt')) {
      return 'border-l-4 border-l-secondary';
    }
    if (cat.includes('engineering')) {
      return 'border-l-4 border-l-accent-sky';
    }
    if (cat.includes('private')) {
      return 'border-l-4 border-l-emerald-500';
    }
    return 'border-l-4 border-l-primary';
  };

  const borderStyle = getStyleCategory(job.category);

  return (
    <Link
      href={`/jobs/${job.id}`}
      data-aos="fade-up"
      className={`bg-white rounded-3xl hover:shadow-xl shadow-md border border-slate-100 hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col justify-between p-6 space-y-5 cursor-pointer ${borderStyle}`}
    >
      <div className="space-y-4">
        {/* Title and Company */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 line-clamp-2 leading-snug">
            {job.title}
          </h3>
          {job.company && job.company.trim() !== '' && (
            <p className="text-sm font-semibold text-slate-500 line-clamp-1">{job.company}</p>
          )}
        </div>

        {/* Metadata Stack (Stacked layout matching the screenshot) */}
        {((job.qualification && job.qualification.trim() !== '') ||
          (job.location && job.location.trim() !== '') ||
          (job.experience && job.experience.trim() !== '')) && (
          <div className="space-y-3 pt-1 text-xs font-semibold text-slate-600">
            {job.qualification && job.qualification.trim() !== '' && (
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{job.qualification}</span>
              </div>
            )}
            {job.location && job.location.trim() !== '' && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
            )}
            {job.experience && job.experience.trim() !== '' && (
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{job.experience}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Badge Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className={`text-[11px] font-extrabold truncate ${job.postedBy === 'ADMIN' ? 'text-emerald-650' : 'text-primary'}`}>
          {(() => {
            if (!job.postedDate) return '';
            const d = new Date(job.postedDate);
            if (isNaN(d.getTime())) return job.postedDate;
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
          })()}
        </div>

        {/* Apply Button */}
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-extrabold text-white bg-gradient-to-r from-primary to-accent-sky shadow-sm hover:shadow-blue-300/40 hover:brightness-110 transition-all duration-200 shrink-0">
          Apply Now →
        </span>
      </div>
    </Link>
  );
}
