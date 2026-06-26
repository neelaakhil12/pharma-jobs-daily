'use client';

import { useState, useRef, useEffect } from 'react';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  description: string;
  applyUrl?: string;
  company?: string;
  location?: string;
  salary?: string;
  experience?: string;
  qualification?: string;
  shareUrl?: string;
  customTitle?: string;
}

export default function ShareButton({ title, applyUrl, company, location, experience, qualification, shareUrl, customTitle }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [instacopied, setInstacopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageUrl = () => {
    if (shareUrl) return shareUrl;
    return typeof window !== 'undefined' ? window.location.href : '';
  };

  // WhatsApp/social media share template matching user's layout
  const getShareMessage = () => {
    const pageUrl = getPageUrl();
    const cleanTitle = title.trim();
    const cleanCompany = company?.trim() || '';
    const cleanCustomTitle = customTitle?.trim() || '';
    const displayTitle = cleanCustomTitle !== ''
      ? cleanCustomTitle
      : (cleanCompany !== ''
        ? `${cleanCompany} Hiring For ${cleanTitle}`
        : cleanTitle);

    return [
      displayTitle,
      '',
      qualification || '',
      '',
      `Apply Here 🔗`,
      pageUrl,
    ].join('\n');
  };

  const openDeepLink = (appUri: string, webUri: string) => {
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      const start = Date.now();
      window.location.href = appUri;
      
      setTimeout(() => {
        // If the browser hasn't lost focus or context (indicating the native app did not open),
        // we open the fallback web link in a new tab.
        if (Date.now() - start < 1800) {
          window.open(webUri, '_blank');
        }
      }, 1500);
    } else {
      window.open(webUri, '_blank');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const handleInstagramShare = async () => {
    try {
      await navigator.clipboard.writeText(getShareMessage());
      setInstacopied(true);
      setTimeout(() => setInstacopied(false), 3000);
      openDeepLink("instagram://", "https://www.instagram.com/");
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const channels = [
    {
      name: 'WhatsApp',
      color: 'hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.007a9.86 9.86 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      action: () => {
        const shareMsg = getShareMessage();
        openDeepLink(
          `whatsapp://send?text=${encodeURIComponent(shareMsg)}`,
          `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`
        );
      },
    },
    {
      name: 'Telegram',
      color: 'hover:bg-sky-50 text-sky-500 hover:text-sky-600',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.984-1.362 7.127-.168.905-.503 1.208-.825 1.238-.7.064-1.23-.462-1.908-.907-1.06-.695-1.66-1.127-2.69-1.803-1.192-.782-.42-1.212.26-1.921.178-.185 3.27-2.998 3.33-3.256.007-.03.014-.15-.056-.21-.07-.06-.175-.04-.25-.022-.11.025-1.8 1.144-5.087 3.362-.48.33-.918.494-1.312.485-.436-.01-1.27-.247-1.893-.45-.762-.248-1.37-.379-1.318-.802.027-.22.33-.448.91-.682 3.56-1.549 5.932-2.57 7.117-3.06 3.39-1.402 4.093-1.646 4.552-1.654.101-.002.327.023.473.142.122.1.156.24.168.341.01.08.017.26-.002.433z" />
        </svg>
      ),
      action: () => {
        const shareMsg = getShareMessage();
        openDeepLink(
          `tg://msg_url?url=&text=${encodeURIComponent(shareMsg)}`,
          `https://t.me/share/url?url=&text=${encodeURIComponent(shareMsg)}`
        );
      },
    },
    {
      name: 'LinkedIn',
      color: 'hover:bg-blue-50 text-blue-600 hover:text-blue-700',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      action: async () => {
        try {
          await navigator.clipboard.writeText(getShareMessage());
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {}
        openDeepLink(
          `linkedin://`,
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getPageUrl())}`
        );
      },
    },
    {
      name: 'Instagram',
      color: 'hover:bg-pink-50 text-pink-600 hover:text-pink-700',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      action: handleInstagramShare,
    },
    {
      name: 'Copy Link',
      color: 'hover:bg-slate-100 text-slate-600 hover:text-slate-700 border-t border-slate-100 mt-1 pt-1.5',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      ),
      action: handleCopyLink,
    },
  ];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
      >
        <Share2 className="w-4 h-4 text-slate-500" /> Share Vacancy
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-white border border-slate-150 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Share To
          </div>
          {channels.map((ch) => (
            <button
              key={ch.name}
              type="button"
              onClick={() => {
                ch.action();
                if (ch.name !== 'Instagram' && ch.name !== 'Copy Link') setIsOpen(false);
              }}
              className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer text-left ${ch.color}`}
            >
              {ch.icon}
              <span className="flex-1 truncate">{ch.name}</span>
            </button>
          ))}

          {(copied || instacopied) && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-md whitespace-nowrap z-50 animate-bounce">
              {copied ? 'Vacancy copied to clipboard!' : 'Message copied! Paste in Instagram.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
