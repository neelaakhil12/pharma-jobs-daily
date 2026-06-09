'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Redirect to dashboard page
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failure, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-md w-full mx-auto space-y-8" data-aos="zoom-in">
        
        {/* Navigation Back */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Homepage
          </Link>
        </div>

        {/* Brand/Branding card */}
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-100 rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-primary to-accent text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/10 animate-pulse">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Administrative Area</h2>
            <p className="text-slate-455 text-xs">Verify credentials to operate daily job posts.</p>
          </div>

          {error && (
            <div className="p-3.5 text-xs font-bold bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-primary" /> Username
              </label>
              <input
                type="text"
                required
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                disabled={loading}
              />
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-orange-500" /> Password
              </label>
              <input
                type="password"
                required
                placeholder="e.g. password123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-accent hover:bg-right bg-[size:200%_auto] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-99 transition-all duration-300 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Access...
                </>
              ) : (
                <>Sign In Dashboard</>
              )}
            </button>

          </form>

          {/* Seed hint box */}
          <div className="p-3.5 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-1">
            <span className="block text-[10px] font-extrabold text-purple-700 uppercase tracking-wide">Developer Demo Credentials:</span>
            <div className="text-[10.5px] text-slate-500 flex justify-between">
              <span>Username: <strong className="text-slate-700 select-all">admin</strong></span>
              <span>Password: <strong className="text-slate-700 select-all">password123</strong></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
