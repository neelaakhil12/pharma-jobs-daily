'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Search, Mail } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
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
        console.error('Failed to load social links in Navbar:', error);
      }
    }
    fetchSocialLinks();
  }, []);

  // Close menu on route change
  useEffect(() => {
    setTimeout(() => {
      setMobileOpen(false);
    }, 0);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Hide Navbar on admin area pages
  if (pathname && (pathname.startsWith('/admin') || pathname === '/adminlogin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'All Jobs', path: '/jobs', icon: Search },
    { name: 'Contact Us', path: '/contact', icon: Mail },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#00469b] border-b border-white/10 shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2.5">

            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative w-40 h-13 sm:w-48 sm:h-16 md:w-56 md:h-18 group-hover:scale-103 transition-transform duration-300">
                <Image
                  src="/logo-v6.png"
                  alt="Pharma Jobs Daily Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
                      isActive ? 'text-accent font-extrabold' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA: Social Media Icons */}
            <div className="hidden md:flex items-center gap-3">
              {/* WhatsApp */}
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                title="Join WhatsApp Channel"
                className="p-2.5 text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl shadow-md hover:shadow-[#25D366]/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.69 1.97 14.221.945 11.6.943c-5.445 0-9.87 4.372-9.874 9.802-.001 1.758.465 3.479 1.346 5.025l-.995 3.637 3.737-.978zm11.567-5.56c-.32-.16-1.89-.93-2.185-1.04-.294-.11-.51-.16-.723.16-.214.32-.83.104-1.016.32-.186.216-.373.24-.693.08-.32-.16-1.353-.5-2.577-1.6-.952-.85-1.593-1.9-1.78-2.22-.187-.32-.02-.49.14-.65.144-.14.32-.37.48-.56.16-.19.214-.32.32-.53.11-.21.055-.4-.027-.56-.083-.16-.723-1.74-.992-2.39-.262-.64-.528-.55-.723-.55-.19 0-.408-.01-.625-.01-.217 0-.57.08-.87.408-.3.32-1.148 1.12-1.148 2.73s1.175 3.17 1.34 3.39c.163.22 2.31 3.53 5.596 4.95" />
                </svg>
              </a>
              {/* Telegram */}
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                title="Join Telegram Channel"
                className="p-2.5 text-white bg-[#0088cc] hover:bg-[#0077b5] rounded-xl shadow-md hover:shadow-sky-500/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.003 2.002c-5.52 0-9.99 4.47-9.99 9.99 0 5.52 4.47 9.99 9.99 9.99 5.52 0 9.99-4.47 9.99-9.99 0-5.52-4.47-9.99-9.99-9.99zm4.59 6.75l-1.53 7.21c-.11.51-.41.63-.84.39l-2.33-1.72-1.12 1.08c-.12.12-.22.23-.45.23l.17-2.38 4.34-3.92c.19-.17-.04-.26-.29-.1l-5.36 3.37-2.31-.72c-.5-.16-.51-.5.1-.74l9.01-3.47c.42-.15.79.11.62.9z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Instagram Page"
                className="p-2.5 text-white bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] rounded-xl shadow-md hover:shadow-pink-500/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow LinkedIn Page"
                className="p-2.5 text-white bg-[#0077b5] hover:bg-[#006699] rounded-xl shadow-md hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/20 bg-white/10 hover:bg-white/25 hover:border-white/40 transition-all duration-200 focus:outline-none"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen
                ? <X className="w-5 h-5 text-white" />
                : <Menu className="w-5 h-5 text-white" />
              }
            </button>

          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-[#00469b] border-t border-white/10 px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-accent border border-white/10'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-accent' : 'text-white/40'}`} />
                  {link.name}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}

            {/* Mobile CTA: Social Grid */}
            <div className="grid grid-cols-4 gap-2.5 pt-2 border-t border-slate-100/50 mt-2">
              {/* WhatsApp */}
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all text-[10px] font-bold text-[#20ba59] cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.69 1.97 14.221.945 11.6.943c-5.445 0-9.87 4.372-9.874 9.802-.001 1.758.465 3.479 1.346 5.025l-.995 3.637 3.737-.978zm11.567-5.56c-.32-.16-1.89-.93-2.185-1.04-.294-.11-.51-.16-.723.16-.214.32-.83.104-1.016.32-.186.216-.373.24-.693.08-.32-.16-1.353-.5-2.577-1.6-.952-.85-1.593-1.9-1.78-2.22-.187-.32-.02-.49.14-.65.144-.14.32-.37.48-.56.16-.19.214-.32.32-.53.11-.21.055-.4-.027-.56-.083-.16-.723-1.74-.992-2.39-.262-.64-.528-.55-.723-.55-.19 0-.408-.01-.625-.01-.217 0-.57.08-.87.408-.3.32-1.148 1.12-1.148 2.73s1.175 3.17 1.34 3.39c.163.22 2.31 3.53 5.596 4.95" />
                </svg>
                WhatsApp
              </a>
              {/* Telegram */}
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-sky-50 border border-sky-100 hover:bg-sky-100/60 transition-all text-[10px] font-bold text-sky-700 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.003 2.002c-5.52 0-9.99 4.47-9.99 9.99 0 5.52 4.47 9.99 9.99 9.99 5.52 0 9.99-4.47 9.99-9.99 0-5.52-4.47-9.99-9.99-9.99zm4.59 6.75l-1.53 7.21c-.11.51-.41.63-.84.39l-2.33-1.72-1.12 1.08c-.12.12-.22.23-.45.23l.17-2.38 4.34-3.92c.19-.17-.04-.26-.29-.1l-5.36 3.37-2.31-.72c-.5-.16-.51-.5.1-.74l9.01-3.47c.42-.15.79.11.62.9z" />
                </svg>
                Telegram
              </a>
              {/* Instagram */}
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-pink-50 border border-pink-100 hover:bg-pink-100/60 transition-all text-[10px] font-bold text-pink-700 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Instagram
              </a>
              {/* LinkedIn */}
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100/60 transition-all text-[10px] font-bold text-blue-700 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current text-blue-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay backdrop when menu is open */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
