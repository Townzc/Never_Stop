'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '首页', labelEn: 'Home', icon: '🏠' },
  { href: '/lesson/read_aloud_1', label: '课程', labelEn: 'Learn', icon: '📚' },
  { href: '/progress', label: '进度', labelEn: 'Progress', icon: '📊' },
  { href: '/onboarding', label: '我的', labelEn: 'Profile', icon: '👤' },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide nav on onboarding and assessment pages
  if (pathname === '/onboarding' || pathname === '/assessment') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full min-h-[48px] transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
