'use client';

import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

interface Testifier {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export default function Testimonials() {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const testifiers: Testifier[] = [
    {
      name: 'Dr. Ramesh Kumar',
      role: 'Associate Professor, Pharmaceutical Chemistry',
      quote: 'Pharma Jobs Daily made it extremely easy to locate JRF/SRF vacancies. I found my current research role within two weeks of using the platform.',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=120&auto=format&fit=crop'
    },
    {
      name: 'Sneha Reddy',
      role: 'Registered ICU Staff Nurse',
      quote: 'The nurse vacancies are updated daily and verified. The direct email apply links saved me from filling out long forms. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=120&auto=format&fit=crop'
    },
    {
      name: 'Venkatesh Rao',
      role: 'QA Associate - Formulations',
      quote: 'I secured a position at Aurobindo Pharma through this portal. The B.Pharm specific updates are accurate, reliable, and absolutely free!',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=120&auto=format&fit=crop'
    }
  ];

  const getInitials = (name: string) => {
    // Strip prefixes like Dr., Mr., etc.
    const cleanName = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, '');
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  };

  const gradients = [
    'from-green-600 to-emerald-500',
    'from-emerald-600 to-teal-500',
    'from-teal-600 to-green-500'
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC] border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16" data-aos="fade-up">
          <span className="text-xs font-extrabold text-[#16A34A] uppercase tracking-widest bg-green-50 px-3.5 py-1.5 rounded-full border border-green-100">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            What Healthcare Seekers Say
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Real success stories from graduates and clinical professionals who took control of their healthcare careers using our daily boards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testifiers.map((t, i) => {
            const hasFailed = failedImages[t.name];
            const initials = getInitials(t.name);
            const gradient = gradients[i % gradients.length];

            return (
              <div
                key={i}
                className="bg-white border border-slate-100 shadow-md p-6 sm:p-8 rounded-2xl flex flex-col justify-between relative transform hover:-translate-y-1 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                {/* Quote decoration */}
                <Quote className="w-10 h-10 text-slate-100 absolute top-4 right-4 -z-0" />
                <div className="space-y-4 relative z-10">
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-500 italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex gap-3 items-center pt-6 border-t border-slate-50 mt-6 relative z-10">
                  {/* Avatar Container */}
                  <div className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    {/* Fallback Initials Layer */}
                    <span className="text-xs font-black text-white tracking-wider">
                      {initials}
                    </span>

                    {/* Image Layer - smooth fade/hide on failure */}
                    {mounted && !hasFailed && (
                      <img
                        src={t.avatar}
                        alt=""
                        style={{ color: 'transparent' }}
                        className="absolute inset-0 w-full h-full object-cover rounded-full transition-opacity duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          setFailedImages((prev) => ({ ...prev, [t.name]: true }));
                        }}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-extrabold text-slate-850 truncate">{t.name}</span>
                    <span className="block text-[10px] text-slate-450 font-medium truncate">{t.role}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
