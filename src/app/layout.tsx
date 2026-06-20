import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AOSProvider from '@/components/AOSProvider';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pharmajobsdaily.com'),
  title: {
    default: 'Pharma Jobs Daily | Daily Pharma & Healthcare Vacancies',
    template: '%s | Pharma Jobs Daily',
  },
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
    'Pharmacist Jobs',
    'QA Jobs Pharma',
    'QC Jobs Pharma',
    'Drug Inspector Vacancies',
    'Government Pharma Jobs',
    'Private Pharma Jobs',
  ],
  authors: [{ name: 'Pharma Jobs Daily' }],
  creator: 'Pharma Jobs Daily',
  publisher: 'Pharma Jobs Daily',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://pharmajobsdaily.com',
    siteName: 'Pharma Jobs Daily',
    title: 'Pharma Jobs Daily | Daily Pharma & Healthcare Vacancies',
    description: 'Trusted pharmaceutical and healthcare recruitment updates since 2020. Get daily handpicked jobs for B.Pharm, M.Pharm, Staff Nurse, Paramedical, JRF, and SRF sectors.',
    images: [
      {
        url: '/logo-v6.png',
        width: 800,
        height: 600,
        alt: 'Pharma Jobs Daily Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pharma Jobs Daily | Daily Pharma & Healthcare Vacancies',
    description: 'Trusted pharmaceutical and healthcare recruitment updates since 2020. Get daily handpicked jobs for B.Pharm, M.Pharm, Staff Nurse, Paramedical, JRF, and SRF sectors.',
    images: ['/logo-v6.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full scroll-smooth antialiased overflow-x-hidden w-full max-w-full`}
    >
      <body className="flex flex-col min-h-screen bg-[#F8FAFC] overflow-x-hidden w-full max-w-full relative">
        <SocialChannelsPopup />
        <AOSProvider>
          <Navbar />
          <main className="flex-grow pb-20 md:pb-0 overflow-x-hidden w-full max-w-full relative">{children}</main>
          <Footer />
        </AOSProvider>
      </body>
    </html>
  );
}
