import Link from 'next/link';
import { MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Job } from '@/lib/db';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  // Determine left border styling based on category
  const getStyleCategory = (category: string) => {
    switch (category) {
      case 'Government Pharma Jobs':
        return 'border-l-4 border-l-secondary';
      case 'JRF & SRF Jobs':
        return 'border-l-4 border-l-accent-sky';
      default:
        return 'border-l-4 border-l-primary';
    }
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
          <p className="text-sm font-semibold text-slate-500 line-clamp-1">{job.company}</p>
        </div>

        {/* Metadata Stack (Stacked layout matching the screenshot) */}
        <div className="space-y-3 pt-1 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{job.qualification}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{job.experience}</span>
          </div>
        </div>
      </div>

      {/* Footer Badge Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Verified Job Check Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-primary">
          <span className="w-4.5 h-4.5 rounded-full bg-primary-light border border-primary/20 text-primary flex items-center justify-center shrink-0">
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
          </span>
          <span>Verified Job</span>
        </div>

        {/* Apply Button */}
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-extrabold text-white bg-gradient-to-r from-primary to-accent-sky shadow-sm hover:shadow-blue-300/40 hover:brightness-110 transition-all duration-200 shrink-0">
          Apply Now →
        </span>
      </div>
    </Link>
  );
}
