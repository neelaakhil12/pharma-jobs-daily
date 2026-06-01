import Link from 'next/link';
import Image from 'next/image';
import { getAllJobs } from '@/lib/db';
import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import JobCard from '@/components/JobCard';
import NewsletterForm from '@/components/NewsletterForm';
import Testimonials from '@/components/Testimonials';
import {
  Award,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const jobs = await getAllJobs();
  const latestJobs = jobs.slice(0, 3); // Display top 3 most recent jobs

  const categories = [
    { title: 'Pharma Job Updates', count: '120+', icon: Sparkles, color: '#16A34A', bg: 'bg-green-50' },
    { title: 'Government Pharma Jobs', count: '85+', icon: ShieldCheck, color: '#F97316', bg: 'bg-orange-50' },
    { title: 'Staff Nurse Jobs', count: '94+', icon: Zap, color: '#8B5CF6', bg: 'bg-purple-50' },
    { title: 'JRF & SRF Jobs', count: '48+', icon: GraduationCap, color: '#16A34A', bg: 'bg-green-50' },
  ];

  const qualifications = [
    'B.Pharm', 'M.Pharm', 'D.Pharm', 'PhD', 'BSc', 'MSc', 'Diploma', 'JRF', 'SRF', 'Staff Nurse'
  ];

  return (
    <div className="relative">
      {/* 1. Hero Landing Banner */}
      <Hero />

      {/* 2. Impact Stats & Counters (Animated Client Component) */}
      <StatsSection />

      {/* 3. Daily Job Categories Grid */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16" data-aos="fade-up">
          <span className="text-xs font-extrabold text-[#F97316] uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-100">
            Featured Sectors
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Explore Healthcare Job Sectors
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            We categorize job vacancies dynamically to ensure B.Pharm graduates, ICU staff nurses, diagnostic lab assistants, and researchers discover matching opportunities instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                href={`/jobs?category=${encodeURIComponent(cat.title)}`}
                key={i}
                className="group p-6 bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl shadow-md rounded-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-850 group-hover:text-[#16A34A] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-450 mt-1">Daily verified notices & direct contact lines.</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50 mt-6">
                  <span className="text-xs font-bold text-[#F97316]">{cat.count} Openings</span>
                  <span className="p-1 rounded-lg bg-slate-50 group-hover:bg-green-50 group-hover:text-[#16A34A] text-slate-400 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Latest Job Updates (Board Preview) */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="max-w-xl space-y-3" data-aos="fade-right">
              <span className="text-xs font-extrabold text-[#16A34A] uppercase tracking-widest bg-green-50 px-3.5 py-1.5 rounded-full border border-green-100">
                Latest Boards
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                Daily Verified Vacancies
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Handpicked career alerts uploaded directly by our recruiters within the last 24-48 hours. Secure direct application channels.
              </p>
            </div>
            <div data-aos="fade-left">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-[#16A34A] to-[#F97316] text-xs font-bold text-white rounded-xl shadow-lg hover:shadow-orange-500/10 hover:scale-102 transition-all duration-300"
              >
                View All Active Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestJobs.length > 0 ? (
              latestJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="col-span-full p-8 text-center text-slate-500">No active job listings found.</div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Qualification categories filter */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16" data-aos="fade-up">
          <span className="text-xs font-extrabold text-[#8B5CF6] uppercase tracking-widest bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100">
            Eligibility Search
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Search Jobs by Qualification
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Select your academic degree to discover specialized hospital placements, pharmaceutical research roles, and government inspector jobs matching your certificate level.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" data-aos="zoom-in">
          {qualifications.map((q, i) => {
            const colorIndex = i % 4;
            let cardStyle = '';
            if (colorIndex === 0) {
              cardStyle = 'bg-green-50/80 text-green-700 border-green-200/50 hover:bg-green-100/90 hover:border-green-350';
            } else if (colorIndex === 1) {
              cardStyle = 'bg-orange-50/80 text-orange-700 border-orange-200/50 hover:bg-orange-100/90 hover:border-orange-355';
            } else if (colorIndex === 2) {
              cardStyle = 'bg-purple-50/80 text-purple-700 border-purple-200/50 hover:bg-purple-100/90 hover:border-purple-355';
            } else {
              cardStyle = 'bg-amber-50/80 text-amber-700 border-amber-200/50 hover:bg-amber-100/90 hover:border-amber-350';
            }
            
            return (
              <Link
                key={i}
                href={`/jobs?qualification=${encodeURIComponent(q)}`}
                className={`p-4 sm:p-6 text-center border shadow-sm hover:shadow-md rounded-2xl font-extrabold text-sm transition-all duration-300 transform hover:-translate-y-1 ${cardStyle}`}
              >
                {q}
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. Why Choose Us (Trust section) */}
      <section className="py-20 lg:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Visual Brand Statement */}
            <div className="lg:col-span-5 relative" data-aos="fade-right">
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-300 to-orange-300 rounded-full blur-2xl opacity-30 -z-10" />
              <div className="p-6 sm:p-8 border border-slate-100 shadow-2xl rounded-3xl glass-panel relative">
                <div className="absolute -top-6 -right-6 p-4 bg-gradient-to-r from-[#16A34A] to-[#F97316] rounded-2xl text-white shadow-lg animate-bounce">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 leading-tight mb-4">
                  6+ Years of Proven Recruitment Trust
                </h3>
                <blockquote className="text-slate-500 text-sm leading-relaxed italic mb-6">
                  "Pharma Jobs Daily was born out of a single vision: to build a seamless path between hard-working healthcare practitioners and prime career placements without bureaucratic delays."
                </blockquote>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#16A34A] to-[#F97316] flex items-center justify-center font-bold text-white text-xs">
                    PJD
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-slate-800">Founder Board</span>
                    <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">
                      Pharma Jobs Daily
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Features Column */}
            <div className="lg:col-span-7 space-y-10" data-aos="fade-left">
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-[#F97316] uppercase tracking-widest">
                  Our Advantages
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-850 tracking-tight leading-tight">
                  Why Seek Opportunities Through Us?
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: '100% Handpicked & Verified Jobs',
                    desc: 'Every pharmaceutical, staff nurse, and researcher opening posted is reviewed by experts to prevent misleading advertisements.',
                    icon: ShieldCheck,
                    col: 'bg-green-50 text-[#16A34A]'
                  },
                  {
                    title: 'Immediate Daily Vacancy Bulletins',
                    desc: 'We publish alerts on active private lab jobs, government examinations, and college walk-in interviews immediately upon announcement.',
                    icon: Zap,
                    col: 'bg-orange-50 text-[#F97316]'
                  },
                  {
                    title: 'Zero Redirection, Direct Apply Contacts',
                    desc: 'Apply directly via email, WhatsApp, or official links. No paid agent redirections, no middleman interference, absolutely free.',
                    icon: FileCheck,
                    col: 'bg-purple-50 text-[#8B5CF6]'
                  }
                ].map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className={`p-3 rounded-xl ${feat.col} shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-base">{feat.title}</h4>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <Testimonials />

      {/* 8. Newsletter Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div
          data-aos="zoom-in"
          className="bg-gradient-to-tr from-[#16A34A]/95 via-[#F97316]/95 to-[#8B5CF6]/95 p-6 sm:p-12 md:p-16 rounded-3xl text-white shadow-2xl relative overflow-hidden"
        >
          {/* Subtle design graphics */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Get Handpicked Jobs Delivered Instantly
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              No spams, no advertisements. Just handpicked daily summaries of pharmaceutical, staff nurse, JRF, SRF and hospital vacancies directly in your inbox.
            </p>
            <NewsletterForm />
            <p className="text-[10px] text-white/50">
              *By subscribing, you agree to our standard terms and consent to receive daily career notifications.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
