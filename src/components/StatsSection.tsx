'use client';

import { useState, useEffect, useRef } from 'react';
import { FileCheck, Users, Building, Award } from 'lucide-react';

const stats = [
  { label: 'Total Jobs Posted', value: 15000, suffix: '+', icon: FileCheck, col: 'from-green-600 to-emerald-500' },
  { label: 'Active Job Seekers', value: 50000, suffix: '+', icon: Users, col: 'from-emerald-600 to-teal-500' },
  { label: 'Recruitment Partners', value: 320, suffix: '+', icon: Building, col: 'from-teal-600 to-green-500' },
  { label: 'Years of Trusted Service', value: 6, suffix: '+ Years', icon: Award, col: 'from-green-500 to-emerald-600' },
];

function AnimatedCounter({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        } else {
          setHasStarted(false);
          setCount(0);
        }
      },
      { threshold: 0.05 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [hasStarted, target, duration]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <span ref={elementRef} className="tabular-nums">
      {formatNumber(count)}{suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-12 bg-white relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex items-center gap-4 px-4 pt-6 sm:pt-0 first:pt-0 sm:first:pt-0" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.col} text-white shadow-md shadow-slate-200 shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
