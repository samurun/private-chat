import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/components/provider';
import './globals.css';

const jetBrains_Mono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Private Chat',
    template: '%s | Private Chat',
  },
  description: 'A private chat, self-destruting room.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='dark'>
      <body className={`${jetBrains_Mono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
