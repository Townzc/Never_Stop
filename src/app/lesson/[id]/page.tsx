'use client';

import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import ReadAloudPanel from '@/components/ReadAloudPanel';
import DialogueBuilder from '@/components/DialogueBuilder';
import SignageCard from '@/components/SignageCard';
import {
  getLessonById,
  readAloudContents,
  dialogueScenes,
  signageQuestions,
} from '@/lib/mock-data';

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { startLesson, completeLesson } = useStore();

  const lesson = useMemo(() => getLessonById(id), [id]);

  // Start the lesson on mount
  useMemo(() => {
    if (lesson) {
      startLesson(lesson.id);
    }
  }, [lesson, startLesson]);

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">课程未找到</h2>
        <p className="text-gray-500 mb-4">请返回首页选择课程</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
        >
          返回首页
        </button>
      </div>
    );
  }

  const handleComplete = (score: number) => {
    completeLesson(lesson.id, score);
    router.push('/');
  };

  // Render different content based on lesson type
  if (lesson.type === 'read_aloud') {
    // Pick a random read-aloud content for this lesson
    const content = readAloudContents.find((c) => c.id === 'ra_001') || readAloudContents[0];
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push('/')}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2"
        >
          ← 返回首页
        </button>
        <ReadAloudPanel content={content} onComplete={handleComplete} />
      </div>
    );
  }

  if (lesson.type === 'dialogue') {
    const sceneMap: Record<string, string> = {
      lesson_dialogue_restaurant: 'scene_restaurant',
      lesson_dialogue_airport: 'scene_airport',
      lesson_dialogue_pharmacy: 'scene_pharmacy',
      lesson_dialogue_directions: 'scene_directions',
      lesson_dialogue_supermarket: 'scene_supermarket',
    };
    const sceneId = sceneMap[lesson.id] || 'scene_restaurant';
    const scene = dialogueScenes.find((s) => s.id === sceneId) || dialogueScenes[0];
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push('/')}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2"
        >
          ← 返回首页
        </button>
        <DialogueBuilder scene={scene} onComplete={handleComplete} />
      </div>
    );
  }

  if (lesson.type === 'signage') {
    // Filter signage questions by category based on lesson
    const categoryMap: Record<string, string> = {
      lesson_signage_airport: 'airport',
      lesson_signage_shop: 'shop',
      lesson_signage_transport: 'transport',
    };
    const category = categoryMap[lesson.id];
    const questions = category
      ? signageQuestions.filter((q) => q.signage.category === category)
      : signageQuestions;
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push('/')}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2"
        >
          ← 返回首页
        </button>
        <SignageCard questions={questions} onComplete={handleComplete} />
      </div>
    );
  }

  // Default fallback
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">📖</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">{lesson.titleCn}</h2>
      <p className="text-gray-500 mb-4">{lesson.description}</p>
      <button
        onClick={() => handleComplete(70)}
        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
      >
        完成课程
      </button>
    </div>
  );
}
