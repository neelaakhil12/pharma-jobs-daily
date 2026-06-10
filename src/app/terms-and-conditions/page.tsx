'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsAndConditionsPage() {
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
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Terms and Conditions</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Last Updated: June 10, 2026
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
            <p>
              Welcome to <strong>Pharma Jobs Daily</strong>. By accessing and using this website, you agree to the following terms and conditions.
            </p>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Acceptance of Terms</h2>
              <p>
                By using Pharma Jobs Daily, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Website Content</h2>
              <p>
                All content on this website is provided for informational purposes only. We reserve the right to modify, update, or remove content without prior notice.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">User Responsibilities</h2>
              <p>Users agree:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-550">
                <li>Not to misuse the website.</li>
                <li>Not to attempt unauthorized access to website systems.</li>
                <li>Not to post or transmit harmful, unlawful, or misleading content.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Intellectual Property</h2>
              <p>
                Unless otherwise stated, all content, logos, designs, text, and website materials are the property of Pharma Jobs Daily and are protected by applicable copyright laws.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Job Information</h2>
              <p>
                We make reasonable efforts to ensure job information is accurate; however, users should always verify details from official sources before applying.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Third-Party Links</h2>
              <p>
                Pharma Jobs Daily may contain links to external websites. We are not responsible for the content, services, or practices of third-party websites.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Limitation of Liability</h2>
              <p>
                Pharma Jobs Daily shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website or reliance on its content.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Advertisement Policy</h2>
              <p>
                This website may display advertisements from third-party advertising networks, including Google AdSense. We are not responsible for the products, services, or claims made by advertisers.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms and Conditions at any time. Continued use of the website constitutes acceptance of the updated terms.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Governing Law</h2>
              <p>
                These Terms and Conditions shall be governed by and interpreted in accordance with the laws of India.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h2 className="text-base font-extrabold text-slate-800">Contact Information</h2>
              <p>For questions regarding these Terms and Conditions, contact:</p>
              <div className="text-xs space-y-1 text-slate-550 mt-2">
                <p className="font-bold text-slate-800">Pharma Jobs Daily</p>
                <p>
                  Email: <a href="mailto:ifactstelugu@gmail.com" className="text-primary hover:underline font-semibold">ifactstelugu@gmail.com</a>
                </p>
                <p>
                  Website: <a href="https://pharmajobsdaily.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">https://pharmajobsdaily.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
