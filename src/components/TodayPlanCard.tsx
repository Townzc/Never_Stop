'use client';

import Link from 'next/link';
import type { Lesson } from '@/types';
import { useStore } from '@/lib/store';

const typeLabels: Record<string, { label: string; icon: string }> = {
  read_aloud: { label: '跟读练习', icon: '🎤' },
  dialogue: { label: '场景对话', icon: '💬' },
  signage: { label: '标识识别', icon: '🔤' },
  listening: { label: '听力训练', icon: '👂' },
  vocab: { label: '词汇学习', icon: '📖' },
};

export default function TodayPlanCard() {
  const { todayPlan, lessonProgress } = useStore();

  if (!todayPlan) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-500 text-center">正在准备今日课程...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Plan header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold">今日学习计划</h2>
            <p className="text-blue-100 text-sm mt-1">
              {todayPlan.totalMinutes} 分钟 · {todayPlan.lessons.length} 节课
            </p>
          </div>
          <div className="text-4xl">📅</div>
        </div>
        <div className="w-full bg-blue-400/30 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{
              width: `${(todayPlan.completedCount / todayPlan.lessons.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-blue-100 text-xs mt-2">
          已完成 {todayPlan.completedCount}/{todayPlan.lessons.length}
        </p>
      </div>

      {/* Lesson cards */}
      <div className="space-y-3">
        {todayPlan.lessons.map((lesson, index) => {
          const progress = lessonProgress[lesson.id];
          const isCompleted = progress?.status === 'completed';
          const typeInfo = typeLabels[lesson.type] || { label: lesson.type, icon: '📖' };

          return (
            <Link
              key={lesson.id}
              href={`/lesson/${lesson.id}`}
              className={`block bg-white rounded-xl p-4 shadow-sm border transition-all hover:shadow-md ${
                isCompleted
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-gray-100 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    isCompleted ? 'bg-green-100' : 'bg-blue-50'
                  }`}
                >
                  {isCompleted ? '✅' : typeInfo.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-400">
                      第 {index + 1} 课
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {typeInfo.label}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 truncate">
                    {lesson.titleCn}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {Math.round(lesson.durationSec / 60)} 分钟 · {lesson.description}
                  </p>
                </div>
                <div className="text-gray-400 text-xl">
                  {isCompleted ? '' : '›'}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
