'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  description: string;
}

export default function ShareButton({ title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title,
      text: description.substring(0, 100) + '...',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed or cancelled:', err);
      }
    } else {
      // Fallback: Copy current location URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`px-6 py-3 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
        copied
          ? 'bg-green-50 border-green-300 text-green-700 shadow-sm'
          : 'bg-white border-slate-250 hover:border-slate-400 hover:bg-slate-50 text-slate-700'
      }`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600 animate-bounce" /> URL Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 text-slate-500" /> Share Vacancy
        </>
      )}
    </button>
  );
}
