import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Social Events Platform (SEP)',
  description: 'Community service & volunteer events coordination platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

