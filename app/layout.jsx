import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Portfolio | Open World 3D',
  description: 'A 3D interactive portfolio experience.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-zinc-950 text-zinc-300 antialiased h-screen w-screen overflow-hidden">
        <div id="root" className="w-full h-full">{children}</div>
      </body>
    </html>
  );
}
