import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'HEIC to JPG – Free Online Converter',
  description:
    'Convert HEIC to JPG online for free. Upload your iPhone photos, convert them in seconds, and download high-quality JPG files. Files are deleted automatically.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-gray-200/70 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                HEIC to JPG
              </Link>
              <nav className="flex items-center gap-6 text-sm text-gray-600">
                <Link href="/privacy" className="hover:text-gray-900">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-gray-900">
                  Terms
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-gray-200 bg-white/70">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
              <p>Free HEIC to JPG conversion with temporary file processing only.</p>
              <div className="flex gap-5">
                <Link href="/privacy" className="hover:text-gray-900">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-gray-900">
                  Terms of Use
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
