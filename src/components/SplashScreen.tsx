'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    // Show the splash screen
    setShow(true);

    // Trigger slight viewport shake exactly on impact (at 1.2s delay from mount)
    const shakeTimer = setTimeout(() => {
      setShouldShake(true);
    }, 1180);

    // Start fade out at 2.5s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    // Remove from DOM completely at 3.0s
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(shakeTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50 select-none overflow-hidden ${
        isFading ? 'animate-splash-fadeout' : ''
      } ${shouldShake ? 'animate-shake' : ''}`}
    >
      {/* 
        Center-Anchored Layout Wrapper:
        The Circle is placed at the exact center of this relative container, 
        ensuring the Circle is perfectly dead-center in the viewport on ALL screen widths.
        We scale down the entire container on mobile screens using responsive scale filters
        to guarantee perfect fit and alignment on 320px screens!
      */}
      <div className="relative w-52 h-52 flex items-center justify-center transform scale-[0.75] min-[375px]:scale-[0.85] sm:scale-100 transition-transform duration-300">
        
        {/* 1. FUTURISTIC LASER GUN (positioned absolutely to the left of the centered circle) */}
        {/* Enters at 0.0s, muzzle charge at 0.5s, recoil at 0.7s firing */}
        <div 
          className="absolute right-[calc(100%+24px)] sm:right-[calc(100%+64px)] top-[79px] w-20 h-16 animate-gun-appear z-20"
        >
          {/* Firing Recoil wrapper (recoils at 0.7s) */}
          <div 
            className="w-full h-full relative"
            style={{ animation: 'gun-recoil 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards', animationDelay: '0.7s' }}
          >
            {/* The Laser Gun SVG */}
            <svg className="w-full h-full text-slate-700" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Handle / Grip */}
              <path d="M28 28 L18 52 C16 55, 22 57, 24 55 L34 34 Z" fill="currentColor" />
              {/* Main Receiver Body */}
              <rect x="25" y="16" width="45" height="16" rx="3" fill="currentColor" />
              {/* Barrel (Emerald Green) */}
              <rect x="70" y="20" width="18" height="8" rx="1.5" fill="#16A34A" />
              {/* Laser Sight / Scope (Orange) */}
              <rect x="36" y="10" width="22" height="6" rx="1" fill="#F97316" />
              {/* Trigger Guard */}
              <circle cx="30" cy="33" r="6" stroke="currentColor" strokeWidth="3" fill="none" />
              {/* Trigger */}
              <path d="M30 30 L28 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              
              {/* Firing Muzzle Charge Glow (pulses at 0.5s - 0.7s) */}
              <circle 
                cx="88" 
                cy="24" 
                r="7" 
                fill="#F97316" 
                className="opacity-0" 
                style={{ 
                  animation: 'circle-appear 0.2s cubic-bezier(0.25, 1, 0.5, 1) infinite alternate', 
                  animationDelay: '0.5s' 
                }} 
              />
            </svg>
          </div>

          {/* 2. THE BULLET (released from blaster barrel at 0.7s, takes 0.5s to hit circle edge at 1.2s) */}
          <div 
            className="absolute left-[88px] top-[24px] -translate-y-1/2 z-20 animate-bullet-fly opacity-0 pointer-events-none flex items-center [--bullet-distance:22px] sm:[--bullet-distance:62px]"
            style={{ animationDelay: '0.7s' }}
          >
            {/* Blazing laser tracer bullet */}
            <div className="w-8 h-2.5 bg-gradient-to-r from-[#F97316] to-[#EAB308] rounded-full shadow-lg shadow-orange-500/70" />
          </div>
        </div>

        {/* 3. CENTERED LOGO CIRCLE SECTION (exactly centered inside parent relative container) */}
        <div className="relative w-52 h-52 flex items-center justify-center z-10">
          
          {/* Impact Ripple Rings (expand at 1.2s impact) */}
          <div 
            className="absolute w-56 h-56 rounded-full border-2 border-[#F97316] animate-impact-ripple opacity-0 z-0 pointer-events-none"
            style={{ animationDelay: '1.2s' }}
          />
          <div 
            className="absolute w-56 h-56 rounded-full border-2 border-[#16A34A] animate-impact-ripple opacity-0 z-0 pointer-events-none"
            style={{ animationDelay: '1.3s' }}
          />

          {/* Main Enlarged White Circle (w-52 h-52 = 208px) */}
          <div 
            className="w-52 h-52 rounded-full bg-white border-4 border-slate-200/80 shadow-2xl flex items-center justify-center p-7 z-10 animate-circle-appear overflow-hidden relative"
          >
            {/* Logo Image (reveals at 1.2s impact) */}
            <div 
              className="w-full h-full relative animate-logo-reveal opacity-0"
              style={{ animationDelay: '1.2s' }}
            >
              <Image
                src="/logo-v2.png"
                alt="Pharma Jobs Daily"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
