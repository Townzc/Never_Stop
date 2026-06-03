'use client';

import { useState, useCallback, useMemo } from 'react';
import { playCorrectSound, playIncorrectSound, playCompleteSound } from '@/lib/audio';
import type { SignageItem, SignageQuestion } from '@/types';

interface SignageCardProps {
  questions: SignageQuestion[];
  onComplete?: (score: number) => void;
}

export default function SignageCard({ questions, onComplete }: SignageCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // Limit to 10 questions per session
  const sessionQuestions = useMemo(() => questions.slice(0, 10), [questions]);
  const question = sessionQuestions[currentIndex];
  const progress = ((currentIndex) / sessionQuestions.length) * 100;

  const handleSelect = useCallback(
    (answer: string) => {
      if (showFeedback) return;
      setSelectedAnswer(answer);
      setShowFeedback(true);

      if (answer === question?.correctAnswer) {
        setCorrectCount((c) => c + 1);
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    },
    [showFeedback, question]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowDetail(false);
    } else {
      setIsFinished(true);
      playCompleteSound();
      const score = Math.round((correctCount / sessionQuestions.length) * 100);
      onComplete?.(score);
    }
  }, [currentIndex, sessionQuestions.length, correctCount, onComplete]);

  if (isFinished) {
    const score = Math.round((correctCount / sessionQuestions.length) * 100);
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-center py-8">
          <div className="text-5xl mb-4">
            {score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            标识测试完成！
          </h3>
          <p className="text-gray-600 mb-4">
            正确 {correctCount}/{sessionQuestions.length} 题 · 得分 {score} 分
          </p>
          <p className="text-lg font-semibold text-blue-600">
            {score >= 80
              ? '太棒了！你已经认识了很多标识！'
              : score >= 60
              ? '做得不错，继续学习更多标识！'
              : '别担心，多看几次就记住了！'}
          </p>
          <button
            onClick={() => onComplete?.(score)}
            className="mt-6 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
          >
            ✅ 完成
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">标识识别</h3>
        <p className="text-sm text-gray-500">看标识，选中文意思</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
        <div
          className="bg-purple-500 rounded-full h-2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right mb-4">
        {currentIndex + 1}/{sessionQuestions.length}
      </p>

      {/* Signage display */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 text-center">
        <div className="text-5xl mb-3">{question.signage.icon}</div>
        <p className="text-3xl font-bold text-gray-800 mb-1">
          {question.signage.keyword}
        </p>
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {showDetail ? '收起详情' : '查看详情'}
        </button>
        {showDetail && (
          <div className="mt-3 text-left bg-white rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">说明：</span>
              {question.signage.description}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">例句：</span>
              <span className="italic">{question.signage.exampleSentence}</span>
            </p>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-4">
        <p className="text-sm font-medium text-gray-600">这个标识是什么意思？</p>
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.correctAnswer;

          let bgColor = 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50';
          if (showFeedback && isSelected) {
            bgColor = isCorrect
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300';
          } else if (showFeedback && isCorrect) {
            bgColor = 'bg-green-50 border-green-200';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all min-h-[48px] ${bgColor}`}
            >
              <span className="font-medium text-gray-800">{option}</span>
              {showFeedback && isSelected && (
                <span className={`ml-2 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✅' : '❌'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & next */}
      {showFeedback && (
        <div className="space-y-3">
          {selectedAnswer !== question.correctAnswer && (
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                <span className="font-medium">正确答案：</span>
                {question.correctAnswer}
              </p>
              <p className="text-sm text-orange-700 mt-1">
                {question.signage.description}
              </p>
            </div>
          )}
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors min-h-[48px]"
          >
            {currentIndex < sessionQuestions.length - 1 ? '下一题 →' : '完成 ✅'}
          </button>
        </div>
      )}
    </div>
  );
}
