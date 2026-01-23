import type { Metadata } from 'next';
import './globals.css';
import { MainLayout } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Wind Law Management System',
  description: 'Comprehensive personal injury law firm management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
