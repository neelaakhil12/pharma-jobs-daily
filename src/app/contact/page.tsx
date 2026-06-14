'use client';

import { useState } from 'react';
import { Mail, MapPin, Send, MessageCircle, Globe, Share2, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate premium message dispatching
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen overflow-x-hidden">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-r from-primary-light/40 via-accent-sky/10 to-blue-50/30 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4" data-aos="fade-down">
          <span className="text-xs font-extrabold text-primary uppercase tracking-widest bg-primary-light px-3.5 py-1.5 rounded-full border border-primary/20">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
            Contact Pharma Jobs Daily
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have a question about a daily job update, need advice, or want to publish a verified recruiter notice? Reach out immediately.
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Call Widgets (5 Cols) */}
          <div className="lg:col-span-5 space-y-8" data-aos="fade-right">
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                Direct Communication Channels
              </h2>
              <p className="text-slate-550 text-sm leading-relaxed">
                Connect with our helpdesk administrators directly through instant support vectors.
              </p>
            </div>

            <div className="space-y-4">

              <a
                href="https://wa.me/918919278961"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4.5 sm:p-5 bg-white border border-slate-100 hover:border-primary/30 shadow-md rounded-2xl transition-all duration-300 transform hover:-translate-y-1 block"
              >
                <div className="p-3 bg-primary-light text-primary rounded-xl shrink-0">
                  <MessageCircle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">WhatsApp Support</span>
                  <span className="block text-sm font-extrabold text-slate-700 hover:text-primary transition-colors">Start Instant Chat</span>
                </div>
              </a>

              {/* Email Channel */}
              <a
                href="mailto:ifactstelugu@gmail.com"
                className="flex items-center gap-4 p-4.5 sm:p-5 bg-white border border-slate-100 hover:border-accent-sky/40 shadow-md rounded-2xl transition-all duration-300 transform hover:-translate-y-1 block"
              >
                <div className="p-3 bg-accent-sky/10 text-accent-sky rounded-xl shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Inquiry</span>
                  <span className="block text-xs sm:text-sm font-extrabold text-slate-700 hover:text-accent-sky transition-colors break-all">ifactstelugu@gmail.com</span>
                </div>
              </a>
            </div>

            {/* Social media connections */}
            <div className="p-5 sm:p-6 bg-white border border-slate-100 shadow-md rounded-3xl space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Globe className="w-4.5 h-4.5 text-primary" />
                Online Community Links
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {['WhatsApp', 'Telegram updates', 'LinkedIn', 'YouTube Channel'].map((social, i) => (
                  <button
                    key={i}
                    type="button"
                    className="text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 hover:border-primary hover:text-primary text-slate-655 font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Custom Message Form (7 Cols) */}
          <div className="lg:col-span-7" data-aos="fade-left">
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-100 rounded-3xl p-5 sm:p-8 space-y-6">
              
              {success ? (
                <div className="p-8 text-center space-y-4 animate-zoom-in">
                  <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-800">Message Dispatched Successfully!</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                    Thank you for contacting Pharma Jobs Daily helpdesk. An officer will review your inquiry and get in touch with you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent-sky text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-extrabold text-slate-850">Send An Anonymous Inquiry</h2>
                    <p className="text-slate-450 text-xs">Fill out the fields to transmit an instant letter to our headquarters.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inquiry Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Recruitments publishing, verification details..."
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Detailed Message</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Describe the nature of your query in detail..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-primary to-accent-sky hover:bg-right bg-[size:200%_auto] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-99 transition-all duration-300 cursor-pointer"
                  >
                    {loading ? (
                      <>Transmitting message...</>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>


    </div>
  );
}
