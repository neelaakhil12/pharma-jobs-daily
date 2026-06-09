'use client';

import Link from 'next/link';
import { MapPin, Calendar, Briefcase, ChevronRight, GraduationCap, IndianRupee } from 'lucide-react';
import { Job } from '@/lib/db';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  // Determine gradient color mapping based on job category/type (strictly no blue or navy!)
  const getStyleCategory = (category: string) => {
    switch (category) {
      case 'Government Pharma Jobs':
        return {
          border: 'border-l-4 border-l-secondary',
          badgeBg: 'bg-secondary/10 text-secondary border-secondary/20',
          dot: 'bg-secondary'
        };
      case 'JRF & SRF Jobs':
        return {
          border: 'border-l-4 border-l-accent-sky',
          badgeBg: 'bg-accent-sky/10 text-accent-sky border-accent-sky/20',
          dot: 'bg-accent-sky'
        };
      default:
        return {
          border: 'border-l-4 border-l-primary',
          badgeBg: 'bg-primary-light text-primary border-primary/20',
          dot: 'bg-primary'
        };
    }
  };

  const style = getStyleCategory(job.category);
  const formattedDate = new Date(job.postedDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div
      data-aos="fade-up"
      className={`bg-white rounded-2xl hover:shadow-xl shadow-md border border-slate-100 hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col justify-between ${style.border}`}
    >
      <div className="p-4 sm:p-6 space-y-4">
        {/* Header: Sector Tag & Posted Date */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border tracking-wide uppercase self-start ${style.badgeBg}`}>
            {job.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 self-start sm:self-auto">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            {formattedDate}
          </span>
        </div>

        {/* Title & Company Name */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-1 hover:text-primary transition-colors duration-200">
            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>
          <p className="text-sm font-semibold text-slate-500 line-clamp-1">{job.company}</p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 pt-2 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2 text-slate-500">
            <GraduationCap className="w-4 h-4 text-accent-sky shrink-0" />
            <span className="truncate">{job.qualification} Required</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

        </div>

        {/* Simple inline description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1 border-t border-slate-100">
          {job.description}
        </p>
      </div>

      {/* Card Action Footer */}
      <div className="px-4 sm:px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center gap-4">
        <Link
          href={`/jobs/${job.id}`}
          className="text-xs font-bold text-slate-500 hover:text-primary transition-colors duration-200"
        >
          View Details
        </Link>
        <Link
          href={`/jobs/${job.id}`}
          className="px-4.5 py-2 text-center text-[11px] font-extrabold text-white bg-gradient-to-r from-primary via-accent-sky to-secondary hover:bg-right bg-[size:200%_auto] rounded-xl shadow-md hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
