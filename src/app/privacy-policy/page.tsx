'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors mb-8 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Return to Dashboard
        </Link>

        {/* Card Panel */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-10 space-y-8">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="p-3 bg-primary-light rounded-2xl text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Last Updated: June 10, 2026
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
            <p>
              At <strong>Pharma Jobs Daily</strong>, we respect your privacy and are committed to protecting any information you provide while using our website.
            </p>

            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-slate-800">Information We Collect</h2>
              
              <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide, such as:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-550">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Contact information</li>
                  <li>Information submitted through contact forms</li>
                </ul>
              </div>

              <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Non-Personal Information</h3>
                <p>We may automatically collect:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-550">
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>IP address</li>
                  <li>Pages visited</li>
                  <li>Date and time of visits</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">How We Use Information</h2>
              <p>We may use collected information to:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-550">
                <li>Improve website content and user experience</li>
                <li>Respond to inquiries</li>
                <li>Send updates or newsletters (if subscribed)</li>
                <li>Monitor website performance and security</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Cookies</h2>
              <p>
                Our website may use cookies to improve user experience and analyze website traffic. Users can disable cookies through their browser settings.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Third-Party Services</h2>
              <p>We may use third-party services such as:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-550">
                <li>Google Analytics</li>
                <li>Google AdSense</li>
                <li>Email marketing platforms</li>
              </ul>
              <p className="text-xs text-slate-500">
                These services may collect information according to their own privacy policies.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Data Security</h2>
              <p>
                We implement reasonable security measures to protect user information. However, no online transmission or storage method is completely secure.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Third-Party Links</h2>
              <p>
                Our website may contain links to external websites. We are not responsible for their privacy practices or content.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Children&apos;s Privacy</h2>
              <p>
                Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Changes to This Policy</h2>
              <p>
                We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h2 className="text-base font-extrabold text-slate-800">Contact Us</h2>
              <p>For any privacy-related concerns, contact us at:</p>
              <p className="font-bold text-primary">
                Email: <a href="mailto:pharmajobsdaily@gmail.com" className="hover:underline">pharmajobsdaily@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
