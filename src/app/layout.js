import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import AuthHydrator from '@/components/auth/AuthHydrator';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://ecommerce-frontend-nine-ebon.vercel.app'),
  title: {
    default: 'Mi Tienda | Electrónica y Tecnología',
    template: '%s | Mi Tienda',
  },
  description: 'Las mejores ofertas en electrónica, smartphones, computadoras y accesorios tecnológicos.',
  keywords: ['electrónica', 'tecnología', 'smartphones', 'celulares', 'accesorios'],
  authors: [{ name: 'Mi Tienda' }],
  creator: 'Mi Tienda',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://ecommerce-frontend-nine-ebon.vercel.app',
    siteName: 'Mi Tienda',
    title: 'Mi Tienda | Electrónica y Tecnología',
    description: 'Las mejores ofertas en electrónica y tecnología.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mi Tienda - Electrónica y Tecnología',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mi Tienda | Electrónica y Tecnología',
    description: 'Las mejores ofertas en electrónica y tecnología.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <Toaster position="top-right" richColors />
        <AuthHydrator />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
