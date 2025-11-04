import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Bubble Gum - AI-Powered Page Builder',
    template: '%s | Bubble Gum',
  },
  description: 'Create production-ready websites in 30 minutes with AI. No coding required.',
  keywords: ['website builder', 'AI', 'no-code', 'page builder', 'web design'],
  authors: [{ name: 'Bubble Gum' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bubblegum.app',
    title: 'Bubble Gum - AI-Powered Page Builder',
    description: 'Create production-ready websites in 30 minutes with AI',
    siteName: 'Bubble Gum',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bubble Gum - AI-Powered Page Builder',
    description: 'Create production-ready websites in 30 minutes with AI',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
