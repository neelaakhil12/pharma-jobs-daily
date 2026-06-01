'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Home, Briefcase, Search, Mail, Phone } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Latest Jobs', path: '/jobs' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm py-2.5 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Branding - Image Only */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-40 h-13 sm:w-48 sm:h-16 md:w-56 md:h-18 group-hover:scale-103 transition-transform duration-300">
              <Image
                src="/logo-v2.png"
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
                    isActive ? 'text-[#16A34A] font-semibold' : 'text-gray-600 hover:text-[#F97316]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#16A34A] to-[#F97316] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Call to Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/jobs"
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#16A34A] via-[#F97316] to-[#8B5CF6] bg-[size:200%_auto] hover:bg-right rounded-xl shadow-lg shadow-green-500/10 hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-0.5"
            >
              Explore Jobs
            </Link>
          </div>

          {/* Mobile Right Contact Info Block */}
          <div className="md:hidden flex flex-col items-end gap-0.5 justify-center shrink-0">
            {/* Phone */}
            <a href="tel:8919278961" className="flex items-center gap-1 text-slate-700 hover:text-orange-500 transition-colors">
              <Phone className="w-2.5 h-2.5 text-[#F97316]" />
              <span className="text-[9.5px] min-[360px]:text-[10px] font-extrabold tracking-tight">+91 89192 78961</span>
            </a>
            {/* Email */}
            <a href="mailto:ifactstelugu@gmail.com" className="flex items-center gap-1 text-slate-550 hover:text-[#16A34A] transition-colors">
              <Mail className="w-2.5 h-2.5 text-[#16A34A]" />
              <span className="text-[8.5px] min-[360px]:text-[9px] font-extrabold tracking-tight">ifactstelugu@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Premium Native Mobile Bottom Navigation Bar (Touch the bottom & 100% Fit) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] py-2 px-1">
        <div className="flex justify-around items-center w-full max-w-md mx-auto">
          {[
            { name: 'Home', path: '/', icon: Home },
            { name: 'Services', path: '/services', icon: Briefcase },
            { name: 'Jobs', path: '/jobs', icon: Search },
            { name: 'Contact', path: '/contact', icon: Mail },
          ].map((link) => {
            const isActive = pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all duration-300 ${
                  isActive
                    ? 'text-[#16A34A] scale-102 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600 font-bold'
                }`}
              >
                <Icon className={`w-5.5 h-5.5 transition-transform duration-300 ${isActive ? 'scale-108 text-[#16A34A] stroke-[2.5px]' : 'stroke-[2px]'}`} />
                <span className="text-[9.5px] min-[360px]:text-[10px] tracking-wide font-extrabold uppercase mt-0.5">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
