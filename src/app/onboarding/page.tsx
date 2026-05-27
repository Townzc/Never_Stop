'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import type { GoalTag, UserProfile } from '@/types';

const goalOptions: { tag: GoalTag; label: string; icon: string; description: string }[] = [
  { tag: 'travel', label: '出国旅行', icon: '✈️', description: '去国外旅游时能用英语沟通' },
  { tag: 'family_visit', label: '探亲访友', icon: '👨‍👩‍👧', description: '看望在海外的家人或朋友' },
  { tag: 'medical', label: '看病就医', icon: '🏥', description: '在国外能描述症状、买药' },
  { tag: 'housing', label: '租房生活', icon: '🏠', description: '与房东、物业沟通' },
  { tag: 'shopping', label: '购物消费', icon: '🛒', description: '在商店、餐厅、超市交流' },
];

const timeOptions = [
  { minutes: 15, label: '15 分钟', description: '碎片时间' },
  { minutes: 30, label: '30 分钟', description: '每天一小段' },
  { minutes: 45, label: '45 分钟', description: '推荐时长' },
  { minutes: 60, label: '60 分钟', description: '认真学习' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setUserProfile, isOnboarded } = useStore();
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<GoalTag[]>([]);
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [hasFamilyPartner, setHasFamilyPartner] = useState(false);
  const [travelingSoon, setTravelingSoon] = useState(false);

  const toggleGoal = useCallback((tag: GoalTag) => {
    setGoals((prev) =>
      prev.includes(tag) ? prev.filter((g) => g !== tag) : [...prev, tag]
    );
  }, []);

  const handleComplete = useCallback(() => {
    const profile: UserProfile = {
      id: `u_${Date.now()}`,
      goalTags: goals.length > 0 ? goals : ['travel'],
      dailyMinutes,
      hasFamilyPartner,
      travelingSoon,
      createdAt: new Date().toISOString(),
    };
    setUserProfile(profile);
    router.push('/assessment');
  }, [goals, dailyMinutes, hasFamilyPartner, travelingSoon, setUserProfile, router]);

  // If already onboarded, show profile view
  if (isOnboarded && step === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">已完成设置</h2>
          <p className="text-gray-500">你已经开始学习之旅了！</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors min-h-[56px]"
        >
          返回首页
        </button>
        <button
          onClick={() => {
            setStep(1);
          }}
          className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-semibold text-lg hover:bg-gray-200 transition-colors min-h-[56px]"
        >
          重新设置
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full flex-1 transition-colors ${
              i <= step ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step 0: Welcome */}
      {step === 0 && (
        <div className="text-center py-8 space-y-6">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-3xl font-bold text-gray-800">
            欢迎来到 Never Stop
          </h2>
          <p className="text-gray-500 text-lg">
            专为中文母语者打造的生活英语学习平台
          </p>
          <p className="text-gray-400">
            只需要 2 分钟设置，就能开始你的学习之旅
          </p>
          <button
            onClick={() => setStep(1)}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors min-h-[56px]"
          >
            开始设置 →
          </button>
        </div>
      )}

      {/* Step 1: Goals */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              你学英语是为了什么？
            </h2>
            <p className="text-gray-500">可以选择多个目标</p>
          </div>
          <div className="space-y-3">
            {goalOptions.map((option) => {
              const isSelected = goals.includes(option.tag);
              return (
                <button
                  key={option.tag}
                  onClick={() => toggleGoal(option.tag)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all min-h-[48px] ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{option.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{option.label}</p>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                    {isSelected && (
                      <span className="ml-auto text-blue-600 text-xl">✓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors min-h-[56px]"
          >
            下一步 →
          </button>
        </div>
      )}

      {/* Step 2: Time */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              每天能花多少时间学习？
            </h2>
            <p className="text-gray-500">我们会根据你的时间安排课程</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {timeOptions.map((option) => {
              const isSelected = dailyMinutes === option.minutes;
              return (
                <button
                  key={option.minutes}
                  onClick={() => setDailyMinutes(option.minutes)}
                  className={`p-4 rounded-xl border-2 transition-all min-h-[48px] ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <p className="text-2xl font-bold text-gray-800">{option.label}</p>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </button>
              );
            })}
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={() => setHasFamilyPartner(!hasFamilyPartner)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all min-h-[48px] ${
                hasFamilyPartner
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👨‍👩‍👧</span>
                <div>
                  <p className="font-semibold text-gray-800">有家人一起学习</p>
                  <p className="text-sm text-gray-500">开启家庭陪练模式</p>
                </div>
                {hasFamilyPartner && (
                  <span className="ml-auto text-green-600 text-xl">✓</span>
                )}
              </div>
            </button>

            <button
              onClick={() => setTravelingSoon(!travelingSoon)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all min-h-[48px] ${
                travelingSoon
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="font-semibold text-gray-800">即将出国</p>
                  <p className="text-sm text-gray-500">优先学习旅行必备表达</p>
                </div>
                {travelingSoon && (
                  <span className="ml-auto text-orange-600 text-xl">✓</span>
                )}
              </div>
            </button>
          </div>

          <button
            onClick={handleComplete}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors min-h-[56px]"
          >
            完成设置 →
          </button>
        </div>
      )}
    </div>
  );
}
