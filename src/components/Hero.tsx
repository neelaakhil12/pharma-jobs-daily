'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: 'https://whatsapp.com/channel/0029Va54XvB0G0Xg3b8hXj0s',
    telegram: 'https://t.me/pharmajobsdaily',
    instagram: 'https://instagram.com/pharmajobsdaily',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com/@pharmajobsdaily'
  });

  const [advertisementSlides, setAdvertisementSlides] = useState<Array<{ id?: string; title: string; image: string; path: string }>>([
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
  ]);

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const res = await fetch('/api/social-links');
        const data = await res.json();
        if (res.ok && data.success && data.links) {
          setSocialLinks(data.links);
        }
      } catch (error) {
        console.error('Failed to load social links in Hero:', error);
      }
    }
    async function fetchHeroSlides() {
      try {
        const res = await fetch('/api/hero-slides');
        const data = await res.json();
        if (res.ok && data.success && data.slides) {
          setAdvertisementSlides(data.slides);
        }
      } catch (error) {
        console.error('Failed to load hero slides in Hero:', error);
      }
    }
    fetchSocialLinks();
    fetchHeroSlides();
  }, []);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const rotatingTexts = [
    'Pharmaceutical Opportunities',
    'Staff Nursing Roles',
    'Paramedical Careers',
    'JRF & SRF Fellowships',
    'Healthcare Vacancies',
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
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-primary/10 via-accent-sky/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-accent-sky/10 via-primary/5 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Animated Geometric Healthcare Capsules */}
      <div className="absolute hidden xl:block top-1/4 right-12 w-16 h-28 bg-gradient-to-br from-primary/10 to-accent-sky/20 rounded-full blur-[1px] border border-primary/20 animate-float-slow" />
      <div className="absolute hidden xl:block bottom-1/4 left-12 w-20 h-10 bg-gradient-to-r from-accent-sky/10 to-primary/20 rounded-full blur-[1px] border border-accent-sky/20 animate-float-medium" />
      <div className="absolute hidden xl:block top-1/3 left-1/4 w-12 h-12 bg-gradient-to-tr from-secondary/10 to-accent-sky/20 rounded-full blur-[1px] border border-secondary/20 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text & Search Box Area */}
          <div className="lg:col-span-7 space-y-8" data-aos="fade-right">
            {/* Social follow buttons */}
            <div className="grid grid-cols-2 gap-2 items-center">
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-1.5 sm:gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all font-bold text-[#20ba59] rounded-full cursor-pointer shadow-sm hover:shadow-md w-full min-w-0 overflow-hidden"
              >
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.69 1.97 14.221.945 11.6.943c-5.445 0-9.87 4.372-9.874 9.802-.001 1.758.465 3.479 1.346 5.025l-.995 3.637 3.737-.978zm11.567-5.56c-.32-.16-1.89-.93-2.185-1.04-.294-.11-.51-.16-.723.16-.214.32-.83.104-1.016.32-.186.216-.373.24-.693.08-.32-.16-1.353-.5-2.577-1.6-.952-.85-1.593-1.9-1.78-2.22-.187-.32-.02-.49.14-.65.144-.14.32-.37.48-.56.16-.19.214-.32.32-.53.11-.21.055-.4-.027-.56-.083-.16-.723-1.74-.992-2.39-.262-.64-.528-.55-.723-.55-.19 0-.408-.01-.625-.01-.217 0-.57.08-.87.408-.3.32-1.148 1.12-1.148 2.73s1.175 3.17 1.34 3.39c.163.22 2.31 3.53 5.596 4.95" />
                </svg>
                <span className="text-xs sm:text-sm truncate">WhatsApp</span>
                <span className="text-xs sm:text-sm font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#20ba59]/20 group-hover:bg-[#20ba59]/35 group-hover:scale-105 flex items-center justify-center transition-all leading-none shrink-0">+</span>
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-1.5 sm:gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-pink-50 border border-pink-100 hover:bg-pink-100/60 transition-all font-bold text-pink-700 rounded-full cursor-pointer shadow-sm hover:shadow-md w-full min-w-0 overflow-hidden"
              >
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-pink-600 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span className="text-xs sm:text-sm truncate">Instagram</span>
                <span className="text-xs sm:text-sm font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-pink-500/10 group-hover:bg-pink-550/25 group-hover:scale-105 flex items-center justify-center transition-all leading-none shrink-0">+</span>
              </a>
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-1.5 sm:gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-sky-50 border border-sky-100 hover:bg-sky-100/60 transition-all font-bold text-sky-700 rounded-full cursor-pointer shadow-sm hover:shadow-md w-full min-w-0 overflow-hidden"
              >
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.003 2.002c-5.52 0-9.99 4.47-9.99 9.99 0 5.52 4.47 9.99 9.99 9.99 5.52 0 9.99-4.47 9.99-9.99 0-5.52-4.47-9.99-9.99-9.99zm4.59 6.75l-1.53 7.21c-.11.51-.41.63-.84.39l-2.33-1.72-1.12 1.08c-.12.12-.22.23-.45.23l.17-2.38 4.34-3.92c.19-.17-.04-.26-.29-.1l-5.36 3.37-2.31-.72c-.5-.16-.51-.5.1-.74l9.01-3.47c.42-.15.79.11.62.9z" />
                </svg>
                <span className="text-xs sm:text-sm truncate">Telegram</span>
                <span className="text-xs sm:text-sm font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-sky-500/10 group-hover:bg-sky-500/20 group-hover:scale-105 flex items-center justify-center transition-all leading-none shrink-0">+</span>
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-1.5 sm:gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-blue-50 border border-blue-100 hover:bg-blue-100/60 transition-all font-bold text-blue-700 rounded-full cursor-pointer shadow-sm hover:shadow-md w-full min-w-0 overflow-hidden"
              >
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-blue-600 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="text-xs sm:text-sm truncate">LinkedIn</span>
                <span className="text-xs sm:text-sm font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500/10 group-hover:bg-blue-500/25 group-hover:scale-105 flex items-center justify-center transition-all leading-none shrink-0">+</span>
              </a>
              {/* YouTube */}
              <a
                href={socialLinks.youtube || 'https://youtube.com/@pharmajobsdaily'}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-1.5 sm:gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-red-50 border border-red-100 hover:bg-red-100/60 transition-all font-bold text-red-600 rounded-full cursor-pointer shadow-sm hover:shadow-md w-full min-w-0 overflow-hidden"
              >
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-red-600 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                </svg>
                <span className="text-xs sm:text-sm truncate">YouTube</span>
                <span className="text-xs sm:text-sm font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500/10 group-hover:bg-red-500/20 group-hover:scale-105 flex items-center justify-center transition-all leading-none shrink-0">+</span>
              </a>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl min-[360px]:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Discover Daily <br />
                <span className="relative inline-block mt-1 sm:mt-2 max-w-full">
                  <span className="absolute -inset-1 bg-gradient-to-r from-primary-light to-blue-100 rounded-lg blur-xs -z-10 hidden sm:block" />
                  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent transition-all duration-500 leading-normal block sm:inline">
                    {rotatingTexts[textIndex]}
                  </span>
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Your daily source for Pharma, Staff Nurse, Paramedical, Engineering, Healthcare, Research, Government, and Private Sector job updates. Discover the latest vacancies, recruitment notifications, internships, and career opportunities here.
              </p>
            </div>

            {/* Dynamic Search Box */}
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-3 bg-white shadow-xl shadow-blue-900/5 border border-slate-100 rounded-2xl sm:rounded-3xl max-w-2xl flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
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
                className="px-8 py-4 sm:py-3.5 bg-gradient-to-r from-primary to-accent-sky text-sm font-bold text-white rounded-xl sm:rounded-2xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-101 active:scale-99 transition-all duration-300"
              >
                Search Vacancies
              </button>
            </form>

            {/* Micro Tags */}
            <div className="flex flex-wrap gap-2.5 items-center">
              <span className="text-xs font-semibold text-slate-500">Popular:</span>
              {['R&D', 'QA', 'QC', 'TT', 'RA', 'Production', 'Warehouse', 'Packing', 'Pharmacovigilance', 'medical coding', 'Engineering', 'Internship', 'Other jobs'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchTerm(tag);
                    router.push(`/jobs?search=${encodeURIComponent(tag)}`);
                  }}
                  className="text-xs px-3.5 py-1.5 bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-650 font-bold rounded-full transition-all cursor-pointer"
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
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent-sky/5 rounded-3xl blur-2xl -z-10" />

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
                        idx === activeSlide ? 'w-6 bg-primary' : 'w-2 bg-slate-200 hover:bg-slate-350'
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
