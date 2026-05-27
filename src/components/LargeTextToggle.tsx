'use client';

import { useStore } from '@/lib/store';

export default function LargeTextToggle() {
  const { largeTextMode, toggleLargeText } = useStore();

  return (
    <button
      onClick={toggleLargeText}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors min-h-[48px]"
      aria-label={largeTextMode ? '切换标准字体' : '切换大字模式'}
    >
      <span className="text-lg">{largeTextMode ? '🔤' : '🔡'}</span>
      <span className="text-sm font-medium">
        {largeTextMode ? '标准' : '大字'}
      </span>
    </button>
  );
}
