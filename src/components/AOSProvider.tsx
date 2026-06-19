'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { usePathname } from 'next/navigation';

export default function AOSProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false,
      offset: 50,
      disable: 'mobile',
    });
  }, []);

  useEffect(() => {
    // Reset scroll position to top instantly when navigation occurs
    window.scrollTo(0, 0);
    // Refresh AOS so animations reset and trigger correctly on the new page layout
    AOS.refresh();
  }, [pathname]);

  return <>{children}</>;
}
