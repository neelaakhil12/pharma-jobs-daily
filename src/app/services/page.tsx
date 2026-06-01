import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  GraduationCap,
  BookOpen,
  Compass,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  Briefcase
} from 'lucide-react';

export default function ServicesPage() {
  const serviceCards = [
    {
      title: 'Daily Pharma Job Updates',
      desc: 'Handpicked private formulations and analytical development vacancy notifications. Designed specifically for B.Pharm and M.Pharm graduates seeking rapid hiring.',
      category: 'Pharma Job Updates',
      icon: Sparkles,
      color: '#16A34A',
      bg: 'bg-green-50/50',
      border: 'hover:border-green-300'
    },
    {
      title: 'Government Pharma Jobs',
      desc: 'Immediate announcements regarding central UPSC/SSC Drug Inspector examinations, state pharmacist walk-ins, and health ministry compliance posts.',
      category: 'Government Pharma Jobs',
      icon: ShieldCheck,
      color: '#F97316',
      bg: 'bg-orange-50/50',
      border: 'hover:border-orange-300'
    },
    {
      title: 'Private Pharma Jobs',
      desc: 'Corporate formulations IPQA, regulatory affairs, research, and QA vacancies at India’s top tier manufacturers like Aurobindo, Reddy Labs, and Cipla.',
      category: 'Private Pharma Jobs',
      icon: Briefcase,
      color: '#8B5CF6',
      bg: 'bg-purple-50/50',
      border: 'hover:border-purple-300'
    },
    {
      title: 'Staff Nurse Jobs',
      desc: 'Verified clinical vacancies in ICU, Critical Care, Ward Management, and specialized hospital settings for B.Sc. Nursing and GNM diploma holders.',
      category: 'Staff Nurse Jobs',
      icon: Zap,
      color: '#16A34A',
      bg: 'bg-green-50/50',
      border: 'hover:border-green-300'
    },
    {
      title: 'Paramedical Jobs',
      desc: 'Immediate listings for Medical Lab Technicians (DMLT/B.Sc MLT), Radiographers, Dialysis Technicians, and critical care support staff across private clinics.',
      category: 'Paramedical Jobs',
      icon: Layers,
      color: '#F97316',
      bg: 'bg-orange-50/50',
      border: 'hover:border-orange-300'
    },
    {
      title: 'JRF & SRF Fellowships',
      desc: 'Academic research associate notifications under CSIR, ICMR, NIPER, and DST-funded university projects for PhD and GPAT-qualified PG candidates.',
      category: 'JRF & SRF Jobs',
      icon: GraduationCap,
      color: '#8B5CF6',
      bg: 'bg-purple-50/50',
      border: 'hover:border-purple-300'
    },
    {
      title: 'Career Guidance & Reviews',
      desc: 'Comprehensive advice on GPAT/NIPER preparation schedules, industrial resume formatting tips, and clinical interview response strategies.',
      category: 'Guidance',
      icon: Compass,
      color: '#16A34A',
      bg: 'bg-green-50/50',
      border: 'hover:border-green-300'
    },
    {
      title: 'Professional Resources',
      desc: 'Direct repository of previous year drug inspector question banks, pharma PDF notes, resume templates, and state nursing registry manuals.',
      category: 'Resources',
      icon: BookOpen,
      color: '#F97316',
      bg: 'bg-orange-50/50',
      border: 'hover:border-orange-300'
    }
  ];

  return (
    <div className="bg-[#F8FAFC]">
      {/* Header banner */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-r from-green-50/40 via-orange-50/40 to-purple-50/40 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#16A34A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4" data-aos="fade-down">
          <span className="text-xs font-extrabold text-[#16A34A] uppercase tracking-widest bg-green-100 px-3.5 py-1.5 rounded-full border border-green-200/40">
            What We Offer
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
            Our Recruitment Services & Boards
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Pharma Jobs Daily acts as a comprehensive portal providing verified, daily vacancies and career resources across pharmaceutical and medical fields.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCards.map((service, i) => {
            const Icon = service.icon;
            const isResource = service.category === 'Guidance' || service.category === 'Resources';
            const targetUrl = isResource ? '/contact' : `/jobs?category=${encodeURIComponent(service.category)}`;
            
            return (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className={`bg-white rounded-3xl p-8 border border-slate-100 shadow-md transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between ${service.border}`}
              >
                <div className="space-y-6">
                  {/* Icon wrap */}
                  <div className={`w-14 h-14 rounded-2xl ${service.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                    <Icon className="w-7 h-7" style={{ color: service.color }} />
                  </div>
                  
                  {/* Title & Desc */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-slate-450 text-xs sm:text-sm leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>

                {/* Footer action trigger */}
                <div className="pt-6 border-t border-slate-50 mt-8">
                  <Link
                    href={targetUrl}
                    className="inline-flex items-center gap-1 text-xs font-bold transition-all group"
                    style={{ color: service.color }}
                  >
                    {isResource ? 'Access Resources' : 'Explore Open Vacancies'}
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Quote Banner */}
      <section className="py-20 bg-neutral-950 text-white relative overflow-hidden border-t border-neutral-900">
        <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-[#16A34A] to-[#F97316]" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8" data-aos="zoom-in">
          <FileSpreadsheet className="w-12 h-12 text-[#F97316] mx-auto animate-pulse" />
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Over 6+ Years Supporting Healthcare Institutions
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            We partner with university research coordinators, private corporate hospital HR executives, and public sector employment notifications to capture authentic opportunities.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/jobs"
              className="px-6 py-3 bg-gradient-to-r from-[#16A34A] to-[#F97316] text-xs font-bold rounded-xl shadow-lg"
            >
              Browse Jobs Board
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-neutral-800 text-xs font-bold rounded-xl hover:bg-neutral-900"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
