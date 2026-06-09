'use client';

import { useState } from 'react';
import { Send, FileText, CheckCircle, Loader2 } from 'lucide-react';

interface QuickApplyFormProps {
  jobTitle: string;
  applyUrl: string;
}

export default function QuickApplyForm({ jobTitle, applyUrl }: QuickApplyFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate premium upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setSubmitting(false);
          setSubmitted(true);
        }, 3000);
      }
    }, 100);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center bg-white border border-primary/20 rounded-3xl shadow-lg space-y-4 animate-zoom-in">
        <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-lg text-slate-800">Application Submitted!</h3>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
          Your profile details and credentials have been forwarded to the HR department of <strong>{jobTitle}</strong>. Monitor your phone and email for direct contact.
        </p>
        <div className="pt-2">
          <a
            href={applyUrl}
            className="inline-block text-xs font-bold px-6 py-2.5 bg-gradient-to-r from-primary to-accent-sky text-white rounded-xl shadow-md"
          >
            Direct Recruiter Apply Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-slate-100 shadow-xl shadow-slate-100 rounded-3xl space-y-6">
      <div>
        <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Quick Application Form
        </h3>
        <p className="text-slate-450 text-[11px] mt-0.5">Submit your basic profile to apply instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary placeholder-slate-450"
            disabled={submitting}
          />
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary placeholder-slate-450"
              disabled={submitting}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="e.g. 8919278961"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary placeholder-slate-450"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Professional Cover Note */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resume Cover Note / Experience Summary</label>
          <textarea
            rows={3}
            required
            placeholder="Summarize your highest qualifications, current location, and relevant experience..."
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary placeholder-slate-450 resize-none"
            disabled={submitting}
          />
        </div>

        {/* Submit / Progress Section */}
        {submitting ? (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-450">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                Uploading application profile...
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent-sky transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary to-accent-sky hover:bg-right bg-[size:200%_auto] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-99 transition-all duration-300 cursor-pointer"
          >
            <Send className="w-4.5 h-4.5" />
            Send Application Profile
          </button>
        )}
      </form>
    </div>
  );
}
