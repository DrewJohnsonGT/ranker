import { Lato } from 'next/font/google';
import { TooltipProvider } from '~/components/ui/Tooltip';

import './globals.css';

const font = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  weight: ['400', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
