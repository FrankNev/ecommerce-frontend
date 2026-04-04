import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthHydrator from '@/components/auth/AuthHydrator';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Mi Tienda',
    template: '%s | Mi Tienda',
  },
  description: 'La mejor tienda online de electrónica',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <Toaster position="top-right" richColors />
        <AuthHydrator />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
