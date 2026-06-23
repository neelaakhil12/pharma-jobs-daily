'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Invalid reset token. Please request a new recovery link.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to reset password. The link may have expired.');
      }
    } catch (err) {
      setError('Connection failure, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-8" data-aos={mounted ? 'zoom-in' : undefined}>
      
      {/* Back button */}
      <div className="text-center">
        <Link href="/superadminlogin" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
      </div>

      <div className="bg-white border border-slate-100 shadow-xl shadow-slate-100 rounded-3xl p-8 space-y-6">
        
        {success ? (
          <div className="text-center space-y-5 py-4">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Password Reset Complete</h2>
              <p className="text-slate-455 text-xs">Your Super Admin credentials have been updated successfully.</p>
            </div>
            <div className="pt-2">
              <Link 
                href="/superadminlogin" 
                className="w-full py-3.5 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-99 transition-all cursor-pointer"
              >
                Sign In With New Password
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-gradient-to-tr from-primary to-accent text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Choose New Password</h2>
              <p className="text-slate-455 text-xs">Enter your new secure access credentials below.</p>
            </div>

            {error && (
              <div className="p-3.5 text-xs font-bold bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-center">
                {error}
              </div>
            )}

            {!token && (
              <div className="p-3.5 text-xs font-bold bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                No reset token provided. Please use the link sent to your email.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* New Password field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-primary" /> New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary font-semibold"
                    disabled={loading || !token}
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

              {/* Confirm Password field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-orange-550" /> Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary font-semibold"
                    disabled={loading || !token}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-accent hover:bg-right bg-[size:200%_auto] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-99 transition-all duration-300 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Password...
                  </>
                ) : (
                  <>Save New Password</>
                )}
              </button>

            </form>
          </>
        )}

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={
        <div className="max-w-md w-full mx-auto text-center p-8 bg-white border border-slate-100 rounded-3xl shadow-xl">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-xs font-bold text-slate-500">Loading reset form...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
