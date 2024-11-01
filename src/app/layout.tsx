import type { Metadata } from 'next'
import localFont from "next/font/local";
import "./globals.css";
import { Ubuntu } from 'next/font/google';

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
  title: 'SOS Valencia',
  description: 'Ayudémonos entre todos',
  icons: {
    icon: '/aid-svgrepo-com.svg',
    apple: '/aid-svgrepo-com.svg',
  },
  openGraph: {
    title: 'SOS Valencia',
    description: 'Ayudémonos entre todos',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOS Valencia',
    description: 'Ayudémonos entre todos',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/aid-svgrepo-com.svg"
          type="image/svg+xml"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
