// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NTGX Express & Freight — Ship Manager',
  description: 'Enterprise Parcel Delivery & International Freight Management System',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-canvas text-neutral-textPrimary antialiased">
        {children}
      </body>
    </html>
  );
}
