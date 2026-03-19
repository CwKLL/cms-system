import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AwardProvider } from '@/context/AwardContext';
import { I18nProvider } from '@/context/I18nContext';
import MuiThemeProvider from '@/components/MuiThemeProvider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CMS Achievement Leaderboard',
  description: 'School Achievement & Competition Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MuiThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <AwardProvider>
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
              </AwardProvider>
            </AuthProvider>
          </I18nProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
