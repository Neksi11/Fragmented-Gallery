import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = GeistSans; // Direct usage as per new geist examples
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'Fragment Gallery',
  description: 'An interactive photo gallery with a unique loading experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={`antialiased font-sans`}>
        {children}
        {/* InteractiveParticleBackground was removed here as it was not defined
            and the DitherBackground is handled within src/app/page.tsx */}
        <Toaster />
      </body>
    </html>
  );
}
