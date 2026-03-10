import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chano Studio | Indecent Audio Works',
  description: 'CHANO STUDIO: PROFESSIONAL MASTERING AND MIXING FOR CLUB-ORIENTED ELECTRONIC MUSIC WITH OVER 10 YEARS OF EXPERIENCE.',
  keywords: 'MASTERING, MIXING, ELECTRONIC MUSIC, CLUB MUSIC, AUDIO MASTERING, FRAN ZARAGOZA, FRANKYDRAMA, DEPAART, STUDIO',
  authors: [{ name: 'CHANO STUDIO' }],
  openGraph: {
    title: 'Chano Studio | Indecent Audio Works',
    description: 'Specialists in club oriented electronic music',
    url: 'https://chano.studio/',
    siteName: 'CHANO STUDIO',
    type: 'website',
    images: [{ url: 'https://chano.studio/img/LOGO_RED_WHITE.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CHANO STUDIO | MASTERING & MIXING',
    description: 'chano studio | indecent audio works',
    images: ['https://chano.studio/img/LOGO_RED_WHITE.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
