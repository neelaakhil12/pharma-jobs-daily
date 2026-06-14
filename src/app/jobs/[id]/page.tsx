import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJobById } from '@/lib/db';
import ShareButton from '@/components/ShareButton';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  MapPin
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) {
    return {
      title: 'Job Not Found | Pharma Jobs Daily',
    };
  }

  // Use job's custom image if set, otherwise use logo as OG preview image
  const ogImage = job.imageUrl || '/logo-v6.png';
  const shortDesc = job.description.slice(0, 160);

  return {
    title: `${job.title} at ${job.company} | Pharma Jobs Daily`,
    description: shortDesc,
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: shortDesc,
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 800,
          height: 600,
          alt: `${job.title} — ${job.company}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} at ${job.company} | Pharma Jobs Daily`,
      description: shortDesc,
      images: [ogImage],
    },
  };
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



        {/* 2. Detailed Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Job Details (Left) */}
          <div className="lg:col-span-8 space-y-8" data-aos="fade-right">
            
            {/* Zydus-style Job Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md space-y-5">
              {/* Title and Company Row */}
              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-snug">
                  {job.title}
                </h1>
                <p className="text-sm sm:text-base font-semibold text-slate-500">{job.company}</p>
              </div>

              {/* Metadata Stack */}
              <div className="space-y-3 pt-1 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span>{job.qualification}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span>{job.experience}</span>
                </div>
              </div>

              {/* Footer Badge Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                {/* Verified Job Check Badge */}
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <span className="w-4.5 h-4.5 rounded-full bg-primary-light border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                    </svg>
                  </span>
                  <span>Verified Job</span>
                </div>
              </div>
            </div>

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

             {/* How to Apply */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md space-y-6">
              <h2 className="text-lg font-bold text-slate-855 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-primary shrink-0" />
                How to Apply
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Click <strong>Apply Now</strong> below to go to the official application page. Share this vacancy with friends using the <strong>Share</strong> button.
              </p>

              {/* Job Image — use job's custom image or fallback to default */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-50 max-w-[150px] sm:max-w-[180px] mx-auto">
                <img
                  src={job.imageUrl || '/image-copy-3.png'}
                  alt={`${job.title} — ${job.company}`}
                  className="w-full h-auto mx-auto object-contain"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 text-center text-sm font-extrabold text-white bg-gradient-to-r from-primary via-accent-sky to-secondary hover:bg-right bg-[size:200%_auto] rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto flex-1 max-w-[200px]"
                >
                  Apply Now
                </a>
                <div className="w-full sm:w-auto flex-1 max-w-[200px] relative">
                  <ShareButton
                    title={job.title}
                    description={job.description}
                    applyUrl={job.applyUrl}
                    company={job.company}
                    location={job.location}
                    salary={job.salary}
                    experience={job.experience}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <aside className="lg:col-span-4 space-y-8" data-aos="fade-left">

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
