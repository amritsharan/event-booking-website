import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: {
    default: 'Gilded Events - Discover Your Next Experience',
    template: '%s | Gilded Events'
  },
  description: 'Book tickets to exclusive concerts, festivals, and cultural events. Discover and reserve your spot at the most sought-after events.',
  keywords: ['events', 'tickets', 'booking', 'concerts', 'festivals', 'entertainment', 'reservations'],
  authors: [{ name: 'Gilded Events' }],
  creator: 'Gilded Events',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gildedevents.com',
    title: 'Gilded Events - Discover Your Next Experience',
    description: 'Book tickets to exclusive concerts, festivals, and cultural events.',
    siteName: 'Gilded Events',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gilded Events - Discover Your Next Experience',
    description: 'Book tickets to exclusive concerts, festivals, and cultural events.',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <FirebaseClientProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
