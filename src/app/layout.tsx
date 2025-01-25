import { Metadata } from 'next';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Lato } from 'next/font/google';
import { Toaster } from '~/components/ui/Toaster';
import { TooltipProvider } from '~/components/ui/Tooltip';

import './globals.css';

export const metadata: Metadata = {
  title: 'Rankings',
  description: 'Rankings',
};

const font = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  weight: ['400', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <TooltipProvider>
          <NextThemesProvider attribute="class" defaultTheme="light">
            {children}
            <Toaster />
          </NextThemesProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
