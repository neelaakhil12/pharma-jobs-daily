import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AOSProvider from '@/components/AOSProvider';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import SocialChannelsPopup from '@/components/SocialChannelsPopup';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Pharma Jobs Daily | Daily Pharma & Healthcare Vacancies',
  description:
    'Trusted pharmaceutical and healthcare recruitment updates since 2020. Get daily handpicked jobs for B.Pharm, M.Pharm, Staff Nurse, Paramedical, JRF, and SRF sectors.',
  keywords: [
    'Pharma Jobs',
    'Healthcare Careers',
    'Staff Nurse Vacancies',
    'Paramedical Jobs',
    'B.Pharm Jobs',
    'M.Pharm Jobs',
    'JRF Opportunities',
    'SRF Recruitment India',
  ],
  authors: [{ name: 'Pharma Jobs Daily' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <SocialChannelsPopup />
        <AOSProvider>
          <Navbar />
          <main className="flex-grow pb-20 md:pb-0">{children}</main>
          <Footer />
          <WhatsAppWidget />
        </AOSProvider>
      </body>
    </html>
  );
}
