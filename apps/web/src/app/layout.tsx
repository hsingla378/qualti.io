import type { Metadata } from 'next';
import './globals.css';
import { Bricolage_Grotesque, Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from './providers';
import { SITE_URL } from '@/lib/marketing-content';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Qualti.io | Furniture Quality Inspection and Corrective Action Software',
    template: '%s | Qualti.io',
  },
  description:
    'Furniture quality inspection software for factory floors and pre-dispatch decisions. Capture measurements, defect photos, rework and buyer-ready reports in one record.',
  keywords: [
    'furniture quality inspection software',
    'pre-dispatch inspection',
    'corrective action tracking',
    'furniture QC checklist',
    'quality control reports',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/brand/qualti-icon.png', sizes: '1024x1024', type: 'image/png' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/brand/favicon-32.png',
  },
  openGraph: {
    title: 'Qualti.io | Furniture Quality Inspection and Corrective Action Software',
    description:
      'Furniture quality inspection software for factory floors and pre-dispatch decisions. Capture measurements, defect photos, rework and buyer-ready reports in one record.',
    url: '/',
    siteName: 'Qualti.io',
    type: 'website',
    images: [
      {
        url: '/brand/qualti-icon.png',
        width: 1024,
        height: 1024,
        alt: 'Qualti.io',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Qualti.io | Furniture Quality Inspection and Corrective Action Software',
    description:
      'Furniture quality inspection software for factory floors and pre-dispatch decisions. Capture measurements, defect photos, rework and buyer-ready reports in one record.',
    images: ['/brand/qualti-icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: '#0c1d17',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('font-sans', geist.variable, bricolage.variable)}>
      <body className="min-h-screen bg-marketing-stage text-slate-900 antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
