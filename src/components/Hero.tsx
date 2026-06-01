'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Briefcase, Award, TrendingUp, Sparkles } from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const rotatingTexts = [
    'Pharmaceutical Opportunities',
    'Staff Nursing Roles',
    'Paramedical Careers',
    'JRF & SRF Fellowships',
    'Healthcare Vacancies',
  ];

  const advertisementSlides = [
    {
      title: 'Pharmaceutical Recruitment Drive Banner',
      image: '/ad-banner-1.png',
      path: '/jobs'
    },
    {
      title: 'Staff Nurse Vacancy Banner',
      image: '/ad-banner-2.png',
      path: '/services'
    },
    {
      title: 'JRF & SRF Fellowship Notice Board Banner',
      image: '/ad-banner-3.png',
      path: '/jobs?category=JRF%20%26%20SRF%20Jobs'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % advertisementSlides.length);
    }, 3000); // 3 seconds transition interval
    return () => clearInterval(interval);
  }, [isPaused, advertisementSlides.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/jobs');
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-20 lg:py-28 border-b border-gray-100">
      {/* Dynamic colorful decorative background grids (no blue/navy) */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-green-300/20 via-purple-300/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-orange-300/20 via-purple-300/10 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Animated Geometric Healthcare Capsules */}
      <div className="absolute hidden xl:block top-1/4 right-12 w-16 h-28 bg-gradient-to-br from-[#16A34A]/10 to-emerald-300/20 rounded-full blur-[1px] border border-[#16A34A]/20 animate-float-slow" />
      <div className="absolute hidden xl:block bottom-1/4 left-12 w-20 h-10 bg-gradient-to-r from-[#F97316]/10 to-orange-300/20 rounded-full blur-[1px] border border-[#F97316]/20 animate-float-medium" />
      <div className="absolute hidden xl:block top-1/3 left-1/4 w-12 h-12 bg-gradient-to-tr from-[#8B5CF6]/10 to-purple-300/20 rounded-full blur-[1px] border border-[#8B5CF6]/20 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text & Search Box Area */}
          <div className="lg:col-span-7 space-y-8" data-aos="fade-right">
            {/* Experience highlight badge */}
            <div className="max-w-full inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-50 to-orange-50 border border-green-200/50 rounded-2xl">
              <Award className="w-4.5 h-4.5 text-[#16A34A] shrink-0 animate-bounce" />
              <span className="text-[10px] min-[360px]:text-xs font-bold text-[#16A34A] uppercase tracking-wider">
                6+ Years of Trusted Recruitment Updates
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl min-[360px]:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Discover Daily Verified <br />
                <span className="relative inline-block mt-1 sm:mt-2 max-w-full">
                  <span className="absolute -inset-1 bg-gradient-to-r from-green-100 to-orange-100 rounded-lg blur-xs -z-10 hidden sm:block" />
                  <span className="bg-gradient-to-r from-[#16A34A] via-[#F97316] to-[#8B5CF6] bg-clip-text text-transparent transition-all duration-500 leading-normal block sm:inline">
                    {rotatingTexts[textIndex]}
                  </span>
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Connect with prime career updates in pharmaceuticals, clinical staff nursing, diagnostics, and high-impact academic fellowships (JRF & SRF). Your path to professional healthcare success starts here.
              </p>
            </div>

            {/* Dynamic Search Box */}
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-3 bg-white shadow-xl shadow-green-900/5 border border-slate-100 rounded-2xl sm:rounded-3xl max-w-2xl flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
            >
              <div className="flex-grow flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search jobs e.g., Pharmacist, ICU Nurse, SRF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-800 text-sm focus:outline-none focus:ring-0 placeholder-slate-400 py-2"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 sm:py-3.5 bg-gradient-to-r from-[#16A34A] to-[#F97316] text-sm font-bold text-white rounded-xl sm:rounded-2xl shadow-md shadow-green-500/10 hover:shadow-orange-500/20 hover:scale-101 active:scale-99 transition-all duration-300"
              >
                Search Vacancies
              </button>
            </form>

            {/* Micro Tags */}
            <div className="flex flex-wrap gap-2.5 items-center">
              <span className="text-xs font-semibold text-slate-500">Popular:</span>
              {['B.Pharm', 'Staff Nurse', 'JRF Fellowship', 'Government Jobs'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchTerm(tag);
                    router.push(`/jobs?search=${encodeURIComponent(tag)}`);
                  }}
                  className="text-xs px-3.5 py-1.5 bg-white border border-slate-200 hover:border-[#16A34A] hover:text-[#16A34A] text-slate-600 font-medium rounded-full transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Advertisement Slider Carousel */}
          <div 
            className="lg:col-span-5 relative w-full" 
            data-aos="zoom-in"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background glowing rings */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#16A34A]/5 to-[#8B5CF6]/5 rounded-3xl blur-2xl -z-10" />

            {/* Main Carousel Wrapper Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 shadow-2xl glass-panel h-[360px] sm:h-[400px] flex flex-col justify-between p-0">
              
              {/* Slides Container */}
              <div className="relative flex-grow flex items-center justify-center">
                {advertisementSlides.map((slide, idx) => {
                  const isActive = idx === activeSlide;
                  return (
                    <div
                      key={idx}
                      onClick={() => router.push(slide.path)}
                      className={`absolute inset-0 cursor-pointer overflow-hidden rounded-3xl transition-opacity duration-500 ease-out flex items-center justify-center bg-white ${
                        isActive 
                          ? 'opacity-100 pointer-events-auto' 
                          : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        loading="eager"
                        className="w-full h-full object-contain bg-white rounded-3xl hover:scale-[1.01] transition-transform duration-300"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Navigation Controllers (Centered Dots Overlay) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center z-20 bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/50 shadow-sm shrink-0">
                {/* Dots indicator */}
                <div className="flex gap-2 items-center">
                  {advertisementSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeSlide ? 'w-6 bg-[#16A34A]' : 'w-2 bg-slate-200 hover:bg-slate-350'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
