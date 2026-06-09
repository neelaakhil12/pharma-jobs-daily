'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Heart, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800">
      {/* Top Gradient Highlight Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent-sky to-secondary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About & Mission */}
          <div className="space-y-6">
            {/* Logo Branding - Image Only */}
            <Link href="/" className="flex items-center group">
              <div className="relative w-36 h-12 group-hover:scale-103 transition-transform duration-300">
                <Image
                  src="/logo-v5.png"
                  alt="Pharma Jobs Daily Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              Your trusted partner in healthcare & pharma career updates. Providing daily handpicked notifications for pharmaceutical, staff nurse, paramedical, JRF, and SRF vacancies.
            </p>
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent-sky mb-1">Our Mission</h4>
              <p className="text-xs text-neutral-400 leading-normal">
                To connect pharma and life sciences professionals with high-quality career paths supporting long-term growth and clinical innovation.
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white relative inline-block">
              Quick Navigation
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary rounded" />
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/" className="hover:text-accent-sky transition-colors duration-200 block py-0.5">
                  Home Dashboard
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-accent-sky transition-colors duration-200 block py-0.5">
                  Latest Job Board
                </Link>
              </li>
              <li>
                <Link href="/other-jobs" className="hover:text-accent-sky transition-colors duration-200 block py-0.5">
                  Other Technical Jobs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent-sky transition-colors duration-200 block py-0.5">
                  Get in Touch
                </Link>
              </li>
              <li>
                <Link href="/adminlogin" className="hover:text-accent-sky transition-colors duration-200 block py-0.5 text-xs text-neutral-500">
                  Administrator Area
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white relative inline-block">
              Direct Contact
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-accent-sky rounded" />
            </h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex gap-3 items-start">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-neutral-500">Email Enquiries</span>
                  <a href="mailto:ifactstelugu@gmail.com" className="hover:text-white transition-colors text-white font-medium">
                    ifactstelugu@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-accent-sky shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-neutral-500">Headquarters</span>
                  <span className="text-white font-medium block">Andhra Pradesh, India</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white relative inline-block">
              Instant Alerts
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary rounded" />
            </h3>
            <p className="text-sm leading-relaxed text-neutral-400">
              Subscribe to get immediate daily healthcare, nurse, and pharma vacancy notifications directly.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter email address"
                required
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-neutral-500 transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="p-3 bg-gradient-to-tr from-primary to-accent-sky rounded-xl text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© {currentYear} Pharma Jobs Daily. All Rights Reserved. Designed for premium healthcare recruitment.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-accent-sky fill-accent-sky" /> for Pharma & Nursing Career Growth.
          </p>
        </div>
      </div>
    </footer>
  );
}
