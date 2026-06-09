import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJobById } from '@/lib/db';
import QuickApplyForm from '@/components/QuickApplyForm';
import ShareButton from '@/components/ShareButton';
import {
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Phone,
  Mail,
  Award,
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  const formattedDate = new Date(job.postedDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link Nav */}
        <div className="mb-6" data-aos="fade-down">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs Board
          </Link>
        </div>

        {/* 1. Main Header Grid Card */}
        <div
          data-aos="fade-up"
          className="bg-gradient-to-tr from-white via-primary-light/20 to-accent-sky/10 rounded-3xl p-8 border border-white shadow-md mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden"
        >
          {/* Accent colored bottom highlight line */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent-sky to-secondary" />
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] font-extrabold px-3 py-1 bg-primary-light text-primary border border-primary/20 rounded-full tracking-wide uppercase">
              {job.category}
            </span>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                {job.title}
              </h1>
              <p className="text-base font-bold text-primary">{job.company}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {job.location}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-accent-sky" /> Posted on {formattedDate}</span>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end items-stretch lg:items-end w-full">
            <a
              href={job.applyUrl}
              className="px-6 py-3 text-center text-xs font-extrabold text-white bg-gradient-to-r from-primary to-accent-sky hover:bg-right bg-[size:200%_auto] rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Apply Now
            </a>
            <ShareButton title={job.title} description={job.description} />
          </div>
        </div>

        {/* 2. Detailed Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Job Details (Left) */}
          <div className="lg:col-span-8 space-y-8" data-aos="fade-right">
            
            {/* Job Summary Description */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md space-y-4">
              <h2 className="text-lg font-bold text-slate-855 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-primary shrink-0" />
                Job Overview
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md space-y-4">
                <h2 className="text-lg font-bold text-slate-855 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-accent-sky shrink-0" />
                  Core Responsibilities
                </h2>
                <ul className="space-y-3.5">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-slate-500 text-xs sm:text-sm leading-normal">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md space-y-4">
                <h2 className="text-lg font-bold text-slate-855 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-secondary shrink-0" />
                  Key Requirements & Skills
                </h2>
                <ul className="space-y-3.5">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-slate-500 text-xs sm:text-sm leading-normal font-medium">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md space-y-4">
                <h2 className="text-lg font-bold text-slate-855 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-primary shrink-0" />
                  Compensation & Benefits
                </h2>
                <ul className="space-y-3.5">
                  {job.benefits.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0 font-extrabold text-xs mt-0.5">•</span>
                      <span className="text-slate-500 text-xs sm:text-sm leading-normal">{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Area (Right) */}
          <aside className="lg:col-span-4 space-y-8" data-aos="fade-left">
            {/* Quick Job Details Specs */}
            <div className="bg-gradient-to-br from-primary-light/70 via-accent-sky/10 to-blue-50/50 rounded-3xl p-6 border border-white/60 shadow-lg space-y-4 backdrop-blur-md">
              <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-200/50 pb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                Vacancy Specifications
              </h3>
              
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Required Degree</span>
                    <span className="block text-xs font-extrabold text-slate-700">{job.qualification}</span>
                  </div>
                </div>



                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary-light text-primary shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience Level</span>
                    <span className="block text-xs font-extrabold text-slate-700">{job.experience}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Application Client Form */}
            <QuickApplyForm jobTitle={job.title} applyUrl={job.applyUrl} />

            {/* Fraud safety advisory */}
            <div className="bg-primary-light/50 border border-primary/20 rounded-3xl p-6 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-primary font-extrabold text-sm">
                <ShieldCheck className="w-5 h-5" />
                Anti-Fraud Safety Notice
              </div>
              <p className="text-blue-900/80 text-[11px] leading-relaxed">
                Pharma Jobs Daily is a completely free career service. We <strong>NEVER</strong> demand payments or processing fee commissions for hiring schedules or drug inspector mock forms. Avoid sharing private banking credentials.
              </p>
              <div className="text-[10px] text-slate-450">
                Need verification? Contact <a href="mailto:ifactstelugu@gmail.com" className="underline font-semibold hover:text-primary">ifactstelugu@gmail.com</a>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}
