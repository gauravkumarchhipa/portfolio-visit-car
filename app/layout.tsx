import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Gaurav Chhipa | 3D Interactive Portfolio',
  description: 'MERN Stack Developer & Senior Engineer — explore my work in a 3D driving experience.',
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-zinc-950 text-zinc-300 antialiased h-screen w-screen overflow-hidden">
        <div id="root" className="w-full h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
