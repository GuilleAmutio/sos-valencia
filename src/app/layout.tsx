import type { Metadata } from 'next'
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  title: 'SOS Valencia',
  description: 'Ayudémonos entre todos',
  icons: {
    icon: '/Flag_of_the_Valencian_Community_(2x3).svg.png',
    apple: '/Flag_of_the_Valencian_Community_(2x3).svg.png',
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
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
