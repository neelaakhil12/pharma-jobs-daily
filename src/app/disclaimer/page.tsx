'use client';

import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
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
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Disclaimer</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Last Updated: June 10, 2026
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
            <p>
              Welcome to <strong>Pharma Jobs Daily</strong>. The information provided on this website is published for general informational and educational purposes only.
            </p>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Job Information</h2>
              <p>
                Pharma Jobs Daily publishes job notifications, recruitment updates, internships, fellowships, walk-in interviews, and career-related information collected from official websites, employment news, organizations, and other publicly available sources. While we strive to provide accurate and timely information, we do not guarantee the completeness, reliability, or accuracy of any content.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">No Employment Guarantee</h2>
              <p>
                Pharma Jobs Daily is not a recruitment agency and does not offer employment opportunities directly. We do not guarantee job placement, interview calls, selection, or employment outcomes.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Verification of Information</h2>
              <p>
                Users are advised to verify all details, including eligibility criteria, application deadlines, fees, and selection processes, from the official recruitment notification before applying.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">External Links</h2>
              <p>
                Our website may contain links to third-party websites. We have no control over the content, policies, or practices of these websites and are not responsible for any losses or damages arising from their use.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800">Limitation of Liability</h2>
              <p>
                Pharma Jobs Daily shall not be held liable for any loss, damage, or inconvenience resulting from the use of information available on this website.
              </p>
            </div>

            <p className="pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
              By using our website, you agree to this disclaimer and its terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
