'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [view, setView] = useState<'login' | 'forgot'>('login');
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Login States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, type: 'super' }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
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

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setError('');
    setForgotSuccess('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setForgotSuccess(data.message);
      } else {
        setError(data.error || 'Failed to request password reset link.');
      }
    } catch (err) {
      setError('Connection failure, please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto space-y-8" data-aos={mounted ? 'zoom-in' : undefined}>
        
        {/* Navigation Back */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Homepage
          </Link>
        </div>

        {/* Brand/Branding card */}
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-100 rounded-3xl p-8 space-y-6">
          
          {view === 'login' ? (
            <>
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-gradient-to-tr from-primary to-accent text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/10 animate-pulse">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Super Admin Panel</h2>
                <p className="text-slate-455 text-xs">Verify credentials to operate daily job posts.</p>
              </div>

              {error && (
                <div className="p-3.5 text-xs font-bold bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Email field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. pharmajobsdaily@gmail.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary font-semibold"
                    disabled={loading}
                  />
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-orange-500" /> Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setView('forgot');
                        setError('');
                        setForgotSuccess('');
                      }}
                      className="text-[10px] font-bold text-primary hover:text-accent-sky transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
            </>
          ) : (
            <>
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-gradient-to-tr from-primary to-accent text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/10">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Reset Password</h2>
                <p className="text-slate-455 text-xs">Verify your registered email to request a reset link.</p>
              </div>

              {error && (
                <div className="p-3.5 text-xs font-bold bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-center">
                  {error}
                </div>
              )}

              {forgotSuccess && (
                <div className="p-3.5 text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-center">
                  {forgotSuccess}
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                
                {/* Email field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="pharmajobsdaily@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary font-semibold"
                    disabled={forgotLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-accent hover:bg-right bg-[size:200%_auto] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-99 transition-all duration-300 cursor-pointer"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Requesting link...
                    </>
                  ) : (
                    <>Request Password Reset</>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setView('login');
                      setError('');
                      setForgotSuccess('');
                    }}
                    className="text-xs font-bold text-slate-455 hover:text-primary transition-colors cursor-pointer"
                  >
                    Back to Dashboard Login
                  </button>
                </div>

              </form>
            </>
          )}

          <div className="text-center pt-2 border-t border-slate-100">
            <Link href="/assistantlogin" className="text-xs font-bold text-primary hover:text-accent-sky transition-colors">
              Are you an Assistant Admin? Sign In Here
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
