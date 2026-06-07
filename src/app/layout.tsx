import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MatchMarket',
  description: 'A marketplace app built with Next.js, Prisma, and Auth.js.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
