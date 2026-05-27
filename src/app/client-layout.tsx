'use client';

import { useStore } from '@/lib/store';
import BottomNav from '@/components/BottomNav';
import LargeTextToggle from '@/components/LargeTextToggle';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { largeTextMode } = useStore();

  return (
    <div className={`min-h-full flex flex-col ${largeTextMode ? 'large-text' : ''}`}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <h1 className="text-lg font-bold text-gray-800">Never Stop</h1>
          </div>
          <LargeTextToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20">
        <div className="max-w-lg mx-auto px-4 py-4">
          {children}
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
