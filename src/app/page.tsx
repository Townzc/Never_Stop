'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import TodayPlanCard from '@/components/TodayPlanCard';

export default function HomePage() {
  const router = useRouter();
  const { isOnboarded, isAssessed, generateTodayPlan, todayPlan, progress } = useStore();

  useEffect(() => {
    if (!isOnboarded) {
      router.push('/onboarding');
      return;
    }
    if (!isAssessed) {
      router.push('/assessment');
      return;
    }
    if (!todayPlan) {
      generateTodayPlan();
    }
  }, [isOnboarded, isAssessed, todayPlan, generateTodayPlan, router]);

  if (!isOnboarded || !isAssessed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🌍</div>
          <p className="text-gray-500">正在准备...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            你好！{' '}
            {new Date().getHours() < 12
              ? '早上好'
              : new Date().getHours() < 18
              ? '下午好'
              : '晚上好'}
            👋
          </h2>
          <p className="text-gray-500 mt-1">今天也要加油学习哦</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-orange-500">
            <span className="text-lg">🔥</span>
            <span className="font-bold text-lg">{progress.currentStreak}</span>
          </div>
          <p className="text-xs text-gray-400">连续天数</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">{progress.totalLessons}</p>
          <p className="text-xs text-gray-500">已完成课程</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-green-600">{progress.totalMinutes}</p>
          <p className="text-xs text-gray-500">学习分钟</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-purple-600">{progress.longestStreak}</p>
          <p className="text-xs text-gray-500">最长连续</p>
        </div>
      </div>

      {/* Today's plan */}
      <TodayPlanCard />

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-amber-800 mb-1">学习小贴士</p>
            <p className="text-sm text-amber-700">
              每天坚持 30 分钟，比一次学 3 小时更有效。利用碎片时间，坐公交、等人都可以复习哦！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
