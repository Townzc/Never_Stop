import type { Metadata, Viewport } from 'next';
import ClientLayout from './client-layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Never Stop - 中年英语学习',
  description: '为 40-65 岁中文母语者打造的生活英语学习平台',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
