'use client';

import { useStore } from '@/lib/store';
import SkillRadar from '@/components/SkillRadar';

export default function ProgressPage() {
  const { progress, isAssessed } = useStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">学习进度</h2>
        <p className="text-gray-500">看看你的成长轨迹</p>
      </div>

      {/* Streak card */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">连续学习</p>
            <p className="text-5xl font-bold mt-1">{progress.currentStreak}</p>
            <p className="text-orange-100 text-sm mt-1">天</p>
          </div>
          <div className="text-6xl">🔥</div>
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <div>
            <p className="text-orange-100">最长连续</p>
            <p className="font-bold text-lg">{progress.longestStreak} 天</p>
          </div>
          <div>
            <p className="text-orange-100">总学习天数</p>
            <p className="font-bold text-lg">{progress.totalDays} 天</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">完成课程</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{progress.totalLessons}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">学习时长</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{progress.totalMinutes}分</p>
        </div>
      </div>

      {/* Skill radar */}
      {isAssessed && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">能力雷达图</h3>
          <SkillRadar scores={progress.scores} />
          <div className="grid grid-cols-5 gap-2 mt-4">
            {Object.entries(progress.scores).map(([key, value]) => {
              const labels: Record<string, string> = {
                vocab: '词汇',
                signage: '标识',
                listening: '听力',
                speaking: '口语',
                pronunciation: '发音',
              };
              return (
                <div key={key} className="text-center">
                  <p className="text-xs text-gray-500">{labels[key]}</p>
                  <p className="text-lg font-bold text-gray-800">{value}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly heatmap */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">最近 7 天</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toISOString().split('T')[0];
            const record = progress.dailyRecords.find((r) => r.date === dateStr);
            const minutes = record?.minutesSpent || 0;
            const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
            const dayName = dayNames[date.getDay()];

            let bgColor = 'bg-gray-100';
            if (minutes >= 30) bgColor = 'bg-green-500';
            else if (minutes >= 15) bgColor = 'bg-green-300';
            else if (minutes > 0) bgColor = 'bg-green-100';

            return (
              <div key={i} className="text-center">
                <p className="text-xs text-gray-400 mb-1">{dayName}</p>
                <div
                  className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}
                >
                  {minutes > 0 && (
                    <span className="text-xs font-bold text-gray-700">{minutes}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <div className="w-4 h-4 bg-gray-100 rounded" />
          <span className="text-xs text-gray-400">0</span>
          <div className="w-4 h-4 bg-green-100 rounded" />
          <span className="text-xs text-gray-400">&lt;15</span>
          <div className="w-4 h-4 bg-green-300 rounded" />
          <span className="text-xs text-gray-400">&lt;30</span>
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-xs text-gray-400">30+</span>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">里程碑</h3>
        <div className="space-y-3">
          {progress.milestones.map((ms) => (
            <div
              key={ms.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                ms.achieved ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <span className="text-2xl">{ms.icon}</span>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    ms.achieved ? 'text-green-800' : 'text-gray-500'
                  }`}
                >
                  {ms.titleCn}
                </p>
                {ms.achieved && ms.achievedAt && (
                  <p className="text-xs text-green-600">{ms.achievedAt}</p>
                )}
              </div>
              {ms.achieved ? (
                <span className="text-green-600">✅</span>
              ) : (
                <span className="text-gray-300">⬜</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💪</span>
          <div>
            <p className="font-semibold text-blue-800 mb-1">继续加油！</p>
            <p className="text-sm text-blue-700">
              {progress.currentStreak > 0
                ? `你已经连续学习 ${progress.currentStreak} 天了，保持这个节奏！`
                : '今天还没有学习哦，打开首页开始今日课程吧！'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
