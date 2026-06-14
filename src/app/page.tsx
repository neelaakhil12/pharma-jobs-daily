import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import Testimonials from '@/components/Testimonials';
import JobsClient from '@/components/JobsClient';
import { Suspense } from 'react';
import {
  Award,
  ShieldCheck,
  Zap,
  FileCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <div className="relative">
      {/* 1. Hero Landing Banner */}
      <Hero />

      {/* 2. Impact Stats & Counters */}
      <StatsSection />

      {/* 3. All Jobs Board */}
      <section className="py-16 lg:py-24 bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center space-y-3" data-aos="fade-up">
          <span className="inline-block text-xs font-extrabold text-primary uppercase tracking-widest bg-primary-light px-3.5 py-1.5 rounded-full border border-primary/20">
            Live Job Board
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
            Daily Vacancies
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Handpicked career alerts uploaded directly by our recruiters. Search, filter by qualification, category, or location and apply directly.
          </p>
        </div>
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-slate-400 text-sm">
            Loading jobs...
          </div>
        }>
          <JobsClient />
        </Suspense>
      </section>

      {/* 4. Why Choose Us (Trust section) */}
      <section className="py-20 lg:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Visual Brand Statement */}
            <div className="lg:col-span-5 relative" data-aos="fade-right">
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/30 to-accent-sky/20 rounded-full blur-2xl opacity-30 -z-10" />
              <div className="p-6 sm:p-8 border border-slate-100 shadow-2xl rounded-3xl glass-panel relative">
                <div className="absolute -top-6 -right-6 p-4 bg-gradient-to-r from-primary to-accent-sky rounded-2xl text-white shadow-lg animate-bounce">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 leading-tight mb-4">
                  6+ Years of Proven Recruitment Trust
                </h3>
                <blockquote className="text-slate-500 text-sm leading-relaxed italic mb-6">
                  &quot;Pharma Jobs Daily was born out of a single vision: to build a seamless path between hard-working healthcare practitioners and prime career placements without bureaucratic delays.&quot;
                </blockquote>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent-sky flex items-center justify-center font-bold text-white text-xs">
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
                <span className="text-xs font-extrabold text-primary uppercase tracking-widest">
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
                    col: 'bg-primary-light text-primary'
                  },
                  {
                    title: 'Immediate Daily Vacancy Bulletins',
                    desc: 'We publish alerts on active private lab jobs, government examinations, and college walk-in interviews immediately upon announcement.',
                    icon: Zap,
                    col: 'bg-accent-sky/10 text-accent-sky'
                  },
                  {
                    title: 'Zero Redirection, Direct Apply Contacts',
                    desc: 'Apply directly via email, WhatsApp, or official links. No paid agent redirections, no middleman interference, absolutely free.',
                    icon: FileCheck,
                    col: 'bg-secondary/15 text-secondary'
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


      {/* 5. Testimonials Section */}
      <Testimonials />
    </div>
  );
}
