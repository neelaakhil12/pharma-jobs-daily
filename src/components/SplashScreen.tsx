'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds to fill the bar
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, intervalTime);

    // Start fade-out after progress bar fills
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, duration + 100);

    // Remove from DOM after fade finishes
    const removeTimer = setTimeout(() => {
      setShow(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('splashScreenFinished'));
      }
    }, duration + 700);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        transition: 'opacity 0.6s ease',
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? 'none' : 'all',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {/* Logo */}
        <div
          style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            background: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 8px 32px rgba(22, 163, 74, 0.15)',
            border: '2px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <Image
            src="/logo-v3.png"
            alt="Pharma Jobs Daily"
            width={120}
            height={120}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Progress bar track */}
        <div
          style={{
            width: '180px',
            height: '4px',
            backgroundColor: '#e2e8f0',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          {/* Filling bar */}
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(to right, #16A34A, #10B981)',
              borderRadius: '999px',
              transition: 'width 0.07s ease-out',
            }}
          />
        </div>
      </div>
    </div>
  );
}
