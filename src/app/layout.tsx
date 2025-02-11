import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CineMagic - AI-Powered Movie Recommendations 🎬✨',
  description: 'Discover your next favorite movie with CineMagic! Our AI-powered system uses Machine Learning & NLP to provide personalized recommendations based on your taste.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'CineMagic - AI-Powered Movie Recommendations 🎬✨',
    description: 'Find movies you’ll love with our AI-driven recommendation engine! Powered by Machine Learning and NLP for smarter suggestions.',
    url: 'https://cine-magic-five.vercel.app',
    type: 'website',
    images: [
      {
        url: 'https://cine-magic-five.vercel.app/preview-image.png',
        width: 1200,
        height: 630,
        alt: 'CineMagic Preview Image',
      },
    ],
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
