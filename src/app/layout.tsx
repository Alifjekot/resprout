import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'ReSprout | Waste-to-Value Sustainable Ideation & Validation',
  description: 'AI-powered digital platform for ideating and validating waste-to-value sustainable businesses. SDG 9 Target 9.B. Plant an idea. Grow a business.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#346b47',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className="min-h-screen flex flex-col font-sans text-stone-900 bg-earth-50/50 antialiased selection:bg-forest-100 selection:text-forest-900">
          <AuthProvider>
            <Navbar />
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
              {children}
            </main>
            <footer className="mt-auto border-t border-forest-100/80 bg-white/70 py-6 text-center text-xs text-stone-500">
              <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p>
                  <strong>ReSprout</strong> &bull; BIK 20803 Creativity & Innovation (UTHM) &bull; SDG 9 Target 9.B
                </p>
                <div className="flex items-center space-x-4">
                  <a href="/privacy" className="hover:text-forest-700 underline">PDPA Privacy Policy</a>
                  <a href="/terms" className="hover:text-forest-700 underline">Terms</a>
                </div>
              </div>
            </footer>
          </AuthProvider>
        </body>
      </html>
      );
}
