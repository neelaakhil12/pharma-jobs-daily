'use client';

import { useState, useEffect } from 'react';
import { X, Bell, Users, ExternalLink } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SocialChannelsPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: 'https://whatsapp.com/channel/0029Va54XvB0G0Xg3b8hXj0s',
    telegram: 'https://t.me/pharmajobsdaily',
    instagram: 'https://instagram.com/pharmajobsdaily',
    linkedin: 'https://linkedin.com'
  });

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const res = await fetch('/api/social-links');
        const data = await res.json();
        if (res.ok && data.success && data.links) {
          setSocialLinks(data.links);
        }
      } catch (error) {
        console.error('Failed to load social links in Popup:', error);
      }
    }
    fetchSocialLinks();
  }, []);

  useEffect(() => {
    // Graceful 10s delay before displaying the subscription modal
    const timer = setTimeout(() => {
      setShouldRender(true);
      // Micro-delay to trigger entry transition animation
      const animTimer = setTimeout(() => {
        setIsOpen(true);
      }, 100);
      return () => clearTimeout(animTimer);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Hide popup on admin area pages
  if (pathname && (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/superadmin') || 
    pathname.startsWith('/assistantadmin') || 
    pathname === '/superadminlogin' || 
    pathname === '/assistantlogin'
  )) {
    return null;
  }

  const handleDismiss = () => {
    setIsOpen(false);
    // Remove from DOM after transition completes
    setTimeout(() => {
      setShouldRender(false);
    }, 400);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-all duration-500 ease-out ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Dark backdrop blur */}
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleDismiss}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-[290px] sm:max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden transform transition-all duration-500 ease-out ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
        }`}
      >
        {/* Top Gradient Header Graphic - Hidden on Mobile */}
        <div className="hidden sm:flex relative h-36 bg-gradient-to-r from-primary via-secondary to-accent-sky items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          
          {/* Animated background ripples */}
          <div className="absolute w-64 h-64 bg-white/10 rounded-full -top-12 -right-12 animate-pulse" />
          <div className="absolute w-48 h-48 bg-white/5 rounded-full -bottom-8 -left-8 animate-pulse" />

          <div className="relative text-center text-white flex flex-col items-center gap-1.5 px-6">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner mb-1 animate-bounce">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold tracking-wide">Never Miss a Job Update!</h3>
            <p className="text-xs text-blue-100 max-w-xs leading-normal">
              Get handpicked pharma, nurse, and paramedical vacancies instantly.
            </p>
          </div>

          {/* Close Button Top Right */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white/90 hover:text-white transition-all cursor-pointer"
            aria-label="Close popup"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-2.5 sm:p-8 space-y-2.5 sm:space-y-6 relative">
          
          {/* Mobile Close Button - Top Right Corner */}
          <button
            onClick={handleDismiss}
            className="sm:hidden absolute top-2 right-2 p-0.5 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-full transition-all cursor-pointer z-50"
            aria-label="Close popup"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Title Block - Hidden on Desktop */}
          <div className="sm:hidden text-center space-y-0.5 pr-4 pl-1">
            <h3 className="text-slate-800 font-extrabold text-[12px] tracking-wide">Never Miss a Job Update!</h3>
            <p className="text-[9px] text-slate-450 font-medium">Join our premium channels for daily updates</p>
          </div>

          {/* Desktop Title Block - Hidden on Mobile */}
          <div className="hidden sm:block text-center space-y-2">
            <h4 className="text-slate-800 font-extrabold text-lg flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Join Our Premium Communities
            </h4>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
              We publish immediate recruiter notifications, direct application links & guides daily.
            </p>
          </div>

          {/* Social Channels Buttons list */}
          <div className="space-y-1 sm:space-y-3.5">
            {/* WhatsApp */}
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismiss}
              className="flex items-center justify-between py-1.5 px-2 sm:p-4 bg-primary-light hover:bg-primary-light/80 border border-primary/20 hover:border-primary/45 rounded-xl sm:rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 sm:gap-3.5">
                <div className="p-0.5 sm:p-2.5 bg-[#25D366] text-white rounded-lg sm:rounded-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.69 1.97 14.221.945 11.6.943c-5.445 0-9.87 4.372-9.874 9.802-.001 1.758.465 3.479 1.346 5.025l-.995 3.637 3.737-.978zm11.567-5.56c-.32-.16-1.89-.93-2.185-1.04-.294-.11-.51-.16-.723.16-.214.32-.83.104-1.016.32-.186.216-.373.24-.693.08-.32-.16-1.353-.5-2.577-1.6-.952-.85-1.593-1.9-1.78-2.22-.187-.32-.02-.49.14-.65.144-.14.32-.37.48-.56.16-.19.214-.32.32-.53.11-.21.055-.4-.027-.56-.083-.16-.723-1.74-.992-2.39-.262-.64-.528-.55-.723-.55-.19 0-.408-.01-.625-.01-.217 0-.57.08-.87.408-.3.32-1.148 1.12-1.148 2.73s1.175 3.17 1.34 3.39c.163.22 2.31 3.53 5.596 4.95" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-slate-800 font-extrabold text-[11px] sm:text-sm group-hover:text-primary transition-colors">WhatsApp Channel</span>
                  <span className="hidden sm:block text-[11px] text-slate-500 font-medium mt-0.5">Join for instant alerts</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/70 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </a>

            {/* Telegram */}
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismiss}
              className="flex items-center justify-between py-1.5 px-2 sm:p-4 bg-sky-50 hover:bg-sky-100/80 border border-sky-100 hover:border-sky-300 rounded-xl sm:rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 sm:gap-3.5">
                <div className="p-0.5 sm:p-2.5 bg-[#0088cc] text-white rounded-lg sm:rounded-xl shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.003 2.002c-5.52 0-9.99 4.47-9.99 9.99 0 5.52 4.47 9.99 9.99 9.99 5.52 0 9.99-4.47 9.99-9.99 0-5.52-4.47-9.99-9.99-9.99zm4.59 6.75l-1.53 7.21c-.11.51-.41.63-.84.39l-2.33-1.72-1.12 1.08c-.12.12-.22.23-.45.23l.17-2.38 4.34-3.92c.19-.17-.04-.26-.29-.1l-5.36 3.37-2.31-.72c-.5-.16-.51-.5.1-.74l9.01-3.47c.42-.15.79.11.62.9z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-slate-800 font-extrabold text-[11px] sm:text-sm group-hover:text-sky-600 transition-colors">Telegram Channel</span>
                  <span className="hidden sm:block text-[11px] text-slate-500 font-medium mt-0.5">Join updates discussion</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </a>

            {/* Instagram */}
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismiss}
              className="flex items-center justify-between py-1.5 px-2 sm:p-4 bg-pink-50 hover:bg-pink-100/80 border border-pink-100 hover:border-pink-300 rounded-xl sm:rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 sm:gap-3.5">
                <div className="p-0.5 sm:p-2.5 bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-lg sm:rounded-xl shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-slate-800 font-extrabold text-[11px] sm:text-sm group-hover:text-pink-600 transition-colors">Instagram Page</span>
                  <span className="hidden sm:block text-[11px] text-slate-500 font-medium mt-0.5">Follow daily highlights</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </a>

            {/* LinkedIn */}
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismiss}
              className="flex items-center justify-between py-1.5 px-2 sm:p-4 bg-blue-50 hover:bg-blue-100/80 border border-blue-100 hover:border-blue-350 rounded-xl sm:rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 sm:gap-3.5">
                <div className="p-0.5 sm:p-2.5 bg-[#0077b5] text-white rounded-lg sm:rounded-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-slate-800 font-extrabold text-[11px] sm:text-sm group-hover:text-blue-600 transition-colors">LinkedIn Page</span>
                  <span className="hidden sm:block text-[11px] text-slate-500 font-medium mt-0.5">Follow professional updates</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </a>
          </div>

          {/* Dismiss Text Link */}
          <div className="text-center pt-0.5">
            <button
              onClick={handleDismiss}
              className="text-[10.5px] sm:text-xs text-slate-450 hover:text-slate-700 font-bold transition-colors cursor-pointer select-none"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
