import type { Metadata } from 'next'
import localFont from "next/font/local";
import "./globals.css";
import { Ubuntu } from 'next/font/google';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import Header from '@/components/Header';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const ubuntu = Ubuntu({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SOS Valencia | Ayuda DANA Valencia 2024',
  description: 'Plataforma de ayuda para afectados por la DANA e inundaciones en Valencia. Encuentra y ofrece ayuda, información sobre emergencias y recursos para damnificados.',
  keywords: 'DANA Valencia, inundaciones Valencia, ayuda Valencia, emergencias Valencia, SOS Valencia, temporal Valencia, lluvia torrencial Valencia, damnificados Valencia, 2024',
  openGraph: {
    title: 'SOS Valencia | Ayuda DANA Valencia 2024',
    description: 'Plataforma de ayuda para afectados por la DANA e inundaciones en Valencia. Encuentra y ofrece ayuda, información sobre emergencias y recursos para damnificados.',
    url: 'https://sosvalencia.com',
    siteName: 'SOS Valencia',
    locale: 'es_ES',
    type: 'website',
  },
  icons: {
    icon: '/aid-svgrepo-com.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'TMs3KabLdmegjnnFi7n9pjehlIaOxRnQMDCOrbgX1Z4',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={ubuntu.className}>
        <main className="min-h-screen bg-white w-full pb-[100px]">
          <div className="max-w-4xl mx-auto px-4 pb-20 bg-white pt-0 mt-0">
            <Header />
            {children}
          </div>
        </main>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
