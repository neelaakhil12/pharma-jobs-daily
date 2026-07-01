import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getJobById } from '@/lib/db';
import ShareButton from '@/components/ShareButton';
import JobImageGallery from '@/components/JobImageGallery';
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

function normalizeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return trimmed;
  }
  if (trimmed.includes('@') && !trimmed.includes('/')) {
    return `mailto:${trimmed}`;
  }
  return `https://${trimmed}`;
}

function stripHtml(html: string): string {
  if (!html) return '';
  let text = html.replace(/<[^>]*>/g, ' ');
  text = text.replace(/\s+/g, ' ');
  return text.trim();
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const partId = resolvedSearchParams?.part;
  const job = await getJobById(id);
  if (!job) {
    return {
      title: 'Job Not Found | Pharma Jobs Daily',
    };
  }

  // Use job's custom image if set, otherwise use logo as OG preview image
  const headersList = await headers();
  const host = headersList.get('host') || 'pharmajobsdaily.com';
  const proto = headersList.get('x-forwarded-proto') || 'https';
  const siteUrl = `${proto}://${host}`;

  let targetImage = job.imageUrl;
  let targetTitle = job.customTitle && job.customTitle.trim() !== ''
    ? job.customTitle.trim()
    : (job.company && job.company.trim() !== ''
      ? `${job.company.trim()} Hiring For ${job.title.trim()}`
      : job.title.trim());

  if (partId && typeof partId === 'string' && job.applyParts) {
    const matchingPart = job.applyParts.find((p) => p.id === partId);
    if (matchingPart && matchingPart.imageUrl) {
      targetImage = matchingPart.imageUrl;
      if (matchingPart.title) {
        targetTitle = job.customTitle && job.customTitle.trim() !== ''
          ? `${job.customTitle.trim()} - ${matchingPart.title.trim()}`
          : (job.company && job.company.trim() !== ''
            ? `${job.company.trim()} Hiring For ${matchingPart.title.trim()}`
            : matchingPart.title.trim());
      }
    }
  }

  const userAgent = headersList.get('user-agent') || '';
  const isWhatsApp = /whatsapp/i.test(userAgent);

  const cleanImage = (targetImage && typeof targetImage === 'string' && targetImage.trim() !== '' && targetImage !== 'null' && targetImage !== 'undefined')
    ? targetImage.trim()
    : '/logo-thumbnail.png';
  const rawImage = cleanImage;
  let ogImage = rawImage.startsWith('http://') || rawImage.startsWith('https://')
    ? rawImage
    : `${siteUrl}${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;

  const isSmallImage = isWhatsApp || cleanImage === '/logo-thumbnail.png';

  // If the request is from WhatsApp, and there is a custom image, we resize it to be < 300px wide (e.g. 256px)
  // so that WhatsApp renders it as a small thumbnail on the left.
  // For other platforms (like Instagram, Facebook, etc.), we keep the original large image.
  if (isWhatsApp && cleanImage !== '/logo-thumbnail.png') {
    ogImage = `${siteUrl}/_next/image?url=${encodeURIComponent(ogImage)}&w=256&q=75`;
  }
  
  const cleanDesc = stripHtml(job.description);
  const shortDesc = cleanDesc.length > 160 ? cleanDesc.slice(0, 157) + '...' : cleanDesc;

  return {
    title: `${targetTitle} | Pharma Jobs Daily`,
    description: shortDesc,
    openGraph: {
      title: targetTitle,
      description: shortDesc,
      type: 'article',
      url: `${siteUrl}/jobs/${id}${partId ? `?part=${partId}` : ''}`,
      siteName: 'Pharma Jobs Daily',
      images: [
        {
          url: ogImage,
          alt: targetTitle,
          ...(isSmallImage ? { width: 256, height: 256 } : {}),
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${targetTitle} | Pharma Jobs Daily`,
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

  // Prevent visitor access to future scheduled jobs
  if (job.scheduledTime && new Date(job.scheduledTime) > new Date()) {
    notFound();
  }

  const headersList = await headers();
  const host = headersList.get('host') || 'pharmajobsdaily.com';
  const proto = headersList.get('x-forwarded-proto') || 'https';
  const siteUrl = `${proto}://${host}`;

  const formattedDate = (() => {
    if (!job.postedDate) return '';
    const d = new Date(job.postedDate);
    if (isNaN(d.getTime())) return job.postedDate;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  })();

  const publishedDateString = (() => {
    if (!job.postedDate) return '';
    const parsed = new Date(job.postedDate);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return job.postedDate;
  })();

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
            
            <div className="space-y-4">
              {/* Keeping the title option above the card, matching Screenshot 2 */}
              {((job.company && job.company.trim() !== '') || (job.title && job.title.trim() !== '') || (job.customTitle && job.customTitle.trim() !== '')) && (
                <div className="border-t border-slate-200/80 pt-4 pb-1">
                  <h2 className="text-[17px] sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                    {job.customTitle && job.customTitle.trim() !== ''
                      ? job.customTitle.trim()
                      : (job.company ? `${job.company.trim()} Hiring For ${job.title.trim()}` : `Hiring For ${job.title.trim()}`)}
                  </h2>
                  <div className="flex justify-between items-center text-xs sm:text-sm text-slate-500 mt-2.5">
                    <span>Published on</span>
                    <span className="font-medium text-slate-700">{publishedDateString}</span>
                  </div>
                </div>
              )}

              {/* Zydus-style Job Header Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md space-y-5">
                {/* Title and Company Row */}
                <div className="space-y-1.5">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-snug">
                    {job.title}
                  </h1>
                  {job.company && job.company.trim() !== '' && (
                    <p className="text-sm sm:text-base font-semibold text-slate-500">{job.company}</p>
                  )}
                </div>

                {/* Metadata Stack */}
                {((job.qualification && job.qualification.trim() !== '') ||
                  (job.location && job.location.trim() !== '') ||
                  (job.experience && job.experience.trim() !== '')) && (
                  <div className="space-y-3 pt-1 text-xs font-semibold text-slate-600">
                    {job.qualification && job.qualification.trim() !== '' && (
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                        <span>{job.qualification}</span>
                      </div>
                    )}
                    {job.location && job.location.trim() !== '' && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.experience && job.experience.trim() !== '' && (
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                        <span>{job.experience}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Badge Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <span>Job Posted Date:</span>
                  <span className={`font-extrabold ${job.postedBy === 'ADMIN' ? 'text-emerald-600' : 'text-primary'}`}>
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Job Summary Description */}
            {job.description && job.description.trim() !== '' && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md space-y-4">
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .raw-html-content ul {
                      list-style-position: outside;
                      margin-left: 1.5rem;
                      margin-top: 0.5rem;
                      margin-bottom: 0.5rem;
                    }
                    .raw-html-content ol {
                      list-style-position: outside;
                      margin-left: 1.5rem;
                      margin-top: 0.5rem;
                      margin-bottom: 0.5rem;
                    }
                    .raw-html-content ul:not([style*="list-style-type"]) {
                      list-style-type: disc;
                    }
                    .raw-html-content ol:not([style*="list-style-type"]) {
                      list-style-type: decimal;
                    }
                    .raw-html-content li {
                      margin-bottom: 0.35rem;
                      line-height: 1.5;
                    }
                    .raw-html-content h1 {
                      font-size: 1.625rem;
                      font-weight: 800;
                      margin-top: 1.25rem;
                      margin-bottom: 0.625rem;
                      color: #1e293b;
                      line-height: 1.25;
                    }
                    .raw-html-content h2 {
                      font-size: 1.375rem;
                      font-weight: 700;
                      margin-top: 1rem;
                      margin-bottom: 0.5rem;
                      color: #1e293b;
                      line-height: 1.3;
                    }
                    .raw-html-content h3 {
                      font-size: 1.125rem;
                      font-weight: 600;
                      margin-top: 0.875rem;
                      margin-bottom: 0.375rem;
                      color: #1e293b;
                      line-height: 1.35;
                    }
                    .raw-html-content p {
                      margin-bottom: 0.75rem;
                      line-height: 1.6;
                    }
                  `
                }} />
                <h2 className="text-lg font-bold text-slate-855 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-primary shrink-0" />
                  Job Overview
                </h2>
                <div 
                  className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap raw-html-content"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>
            )}

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

            {/* Custom Sections */}
            {job.customSections && job.customSections.map((sec, secIdx) => (
              <div key={secIdx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md space-y-4">
                <h2 className="text-lg font-bold text-slate-855 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-primary shrink-0" />
                  {sec.title}
                </h2>
                <ul className="space-y-3.5">
                  {sec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-slate-500 text-xs sm:text-sm leading-normal">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}


             {/* How to Apply */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md space-y-6">
              <h2 className="text-lg font-bold text-slate-855 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-primary shrink-0" />
                How to Apply
              </h2>
              
              {job.applyParts && job.applyParts.length > 0 ? (
                <div className="space-y-8 divide-y divide-slate-100">
                  {job.applyParts.map((part, partIdx) => (
                    <div key={part.id} className={`${partIdx > 0 ? 'pt-8' : ''} flex flex-col md:flex-row gap-6 items-start`}>
                      {part.imageUrl && (
                        <div className="w-full md:w-[45%] shrink-0 space-y-3">
                          <div className="border border-slate-200 rounded-none overflow-hidden shadow-sm bg-slate-50">
                            <img
                              src={part.imageUrl}
                              alt={part.title || `Poster ${partIdx + 1}`}
                              className="w-full h-auto object-contain mx-auto"
                            />
                          </div>
                          {/* Share button placed down/below the image */}
                          <div className="relative w-full">
                            <ShareButton
                              title={`${job.title}${part.title ? ` - ${part.title}` : ''}`}
                              description={job.description}
                              applyUrl={part.applyLinks?.find(l => l.url && l.url.trim() !== '')?.url || job.applyUrl}
                              company={job.company}
                              location={job.location}
                              salary={job.salary}
                              experience={job.experience}
                              qualification={job.qualification}
                              shareUrl={`${siteUrl}/jobs/${job.id}?part=${part.id}`}
                              customTitle={job.customTitle ? `${job.customTitle}${part.title ? ` - ${part.title}` : ''}` : undefined}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-4 w-full">
                        {part.title && (
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-700 tracking-tight flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {part.title}
                          </h3>
                        )}
                        
                        <div className="flex flex-col gap-3 pt-1">
                          {part.applyLinks?.filter(link => link.url && link.url.trim() !== '').map((link, linkIdx) => {
                            const normalizedLink = normalizeUrl(link.url);
                            const isLinkEmail = normalizedLink.startsWith('mailto:');
                            const emailLinkAddress = isLinkEmail ? normalizedLink.replace('mailto:', '') : '';

                            if (isLinkEmail && !part.imageUrl) {
                              return (
                                <div key={linkIdx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left space-y-1 w-full sm:max-w-[280px]">
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">Recruiter Contact Email</span>
                                  <a
                                    href={normalizedLink}
                                    className="text-xs font-extrabold text-primary hover:underline hover:text-primary-dark transition-colors break-all"
                                  >
                                    {emailLinkAddress}
                                  </a>
                                  <p className="text-[9px] text-slate-400 font-semibold leading-tight">
                                    Send your resume directly to the email above to apply.
                                  </p>
                                </div>
                              );
                            }

                            return (
                              <a
                                key={linkIdx}
                                href={normalizedLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3.5 text-center text-xs font-extrabold text-white bg-gradient-to-r from-primary via-accent-sky to-secondary hover:bg-right bg-[size:200%_auto] rounded-xl shadow-md hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:max-w-[280px]"
                              >
                                {link.label && link.label.trim() !== '' && link.label.toLowerCase() !== 'apply now'
                                  ? link.label
                                  : (isLinkEmail
                                    ? 'Email Resume'
                                    : (part.applyLinks.length === 1 ? 'Apply Now' : `Apply Link ${linkIdx + 1}`))}
                              </a>
                            );
                          })}
                          
                          {/* Fallback Share button under apply links if there is no image */}
                          {!part.imageUrl && (
                            <div className="w-full sm:max-w-[280px] relative pt-1">
                              <ShareButton
                                title={`${job.title}${part.title ? ` - ${part.title}` : ''}`}
                                description={job.description}
                                applyUrl={part.applyLinks?.find(l => l.url && l.url.trim() !== '')?.url || job.applyUrl}
                                company={job.company}
                                location={job.location}
                                salary={job.salary}
                                experience={job.experience}
                                qualification={job.qualification}
                                shareUrl={`${siteUrl}/jobs/${job.id}?part=${part.id}`}
                                customTitle={job.customTitle ? `${job.customTitle}${part.title ? ` - ${part.title}` : ''}` : undefined}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {(() => {
                    const normalized = normalizeUrl(job.applyUrl);
                    const isEmail = normalized.startsWith('mailto:');
                    const emailAddress = isEmail ? normalized.replace('mailto:', '') : '';
                    const hasImages = (job.imageUrls && job.imageUrls.length > 0) || (job.imageUrl && job.imageUrl.trim() !== '');

                    return (
                      <>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                          {isEmail ? (
                            hasImages ? (
                              <>
                                Click <strong>Email Resume</strong> below to send your application directly to the recruiter's email: <strong>{emailAddress}</strong>.
                              </>
                            ) : (
                              <>
                                Please send your resume/application directly to the recruiter's email: <strong>{emailAddress}</strong>.
                              </>
                            )
                          ) : (
                            <>
                              Click <strong>Apply Now</strong> below to go to the official application page. Share this vacancy with friends using the <strong>Share</strong> button.
                            </>
                          )}
                        </p>

                        {/* Job Image Gallery Slideshow */}
                        {(hasImages || !isEmail) && (
                          <JobImageGallery
                            images={job.imageUrls && job.imageUrls.length > 0 ? job.imageUrls : (job.imageUrl ? [job.imageUrl] : [])}
                            alt={`${job.title} — ${job.company}`}
                          />
                        )}

                        {isEmail && !hasImages ? (
                          <div className="pt-2 flex flex-col items-center justify-center w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-2 max-w-[400px] mx-auto">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Recruiter Contact Email</span>
                            <a
                              href={normalized}
                              className="text-base font-extrabold text-primary hover:underline hover:text-primary-dark transition-colors break-all"
                            >
                              {emailAddress}
                            </a>
                            <p className="text-[10px] text-slate-400 font-semibold">
                              Send your resume directly to the email above to apply.
                            </p>
                          </div>
                        ) : (
                          <div className="pt-2 flex justify-center w-full">
                            <a
                              href={normalized}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-8 py-3.5 text-center text-sm font-extrabold text-white bg-gradient-to-r from-primary via-accent-sky to-secondary hover:bg-right bg-[size:200%_auto] rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 w-full max-w-[240px]"
                            >
                              {isEmail ? 'Email Resume' : 'Apply Now'}
                            </a>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>

            {/* Separate Share Vacancy Card (only for standard jobs without custom sections) */}
            {(!job.applyParts || job.applyParts.length === 0) && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">Share this Vacancy</h4>
                  <p className="text-slate-500 text-xs">Help your friends and colleagues find their next career opportunity.</p>
                </div>
                <div className="w-full sm:w-auto max-w-[200px] relative">
                  <ShareButton
                    title={job.title}
                    description={job.description}
                    applyUrl={job.applyUrl}
                    company={job.company}
                    location={job.location}
                    salary={job.salary}
                    experience={job.experience}
                    qualification={job.qualification}
                    customTitle={job.customTitle}
                  />
                </div>
              </div>
            )}
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
                Need verification? Contact <a href="mailto:pharmajobsdaily@gmail.com" className="underline font-semibold hover:text-primary">pharmajobsdaily@gmail.com</a>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}
