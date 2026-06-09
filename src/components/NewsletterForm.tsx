'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate premium API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEmail('');
    }, 1200);
  };

  if (success) {
    return (
      <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-center text-xs font-bold text-accent animate-zoom-in max-w-lg mx-auto">
        ✓ Subscription active! You will now receive daily job alerts.
      </div>
    );
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-2" onSubmit={handleSubscribe}>
      <input
        type="email"
        placeholder="Enter your email address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-5 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder-white/50 text-sm transition-colors"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-8 py-3.5 bg-white text-slate-800 text-sm font-extrabold rounded-xl hover:bg-neutral-50 active:scale-99 shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-800" /> : 'Subscribe Now'}
      </button>
    </form>
  );
}
