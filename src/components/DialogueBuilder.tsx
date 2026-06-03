'use client';

import { useState, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { speak, playCorrectSound, playIncorrectSound, playCompleteSound } from '@/lib/audio';
import type { DialogueScene } from '@/types';

interface DialogueBuilderProps {
  scene: DialogueScene;
  onComplete?: (score: number) => void;
}

export default function DialogueBuilder({ scene, onComplete }: DialogueBuilderProps) {
  const { playbackSpeed } = useStore();
  const [currentTurn, setCurrentTurn] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRescue, setShowRescue] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const turn = scene.turns[currentTurn];
  const progress = ((currentTurn) / scene.turns.length) * 100;

  const handlePlayNpc = useCallback(async () => {
    if (!turn?.npcText) return;
    setIsPlaying(true);
    try {
      await speak(turn.npcText, playbackSpeed);
    } catch {
      // fallback
    }
    setIsPlaying(false);
  }, [turn, playbackSpeed]);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (showFeedback) return;
      setSelectedOption(optionId);
      setShowFeedback(true);

      const option = turn?.options?.find((o) => o.id === optionId);
      if (option?.isCorrect) {
        setCorrectCount((c) => c + 1);
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    },
    [showFeedback, turn]
  );

  const handleNext = useCallback(() => {
    if (currentTurn < scene.turns.length - 1) {
      setCurrentTurn((t) => t + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setShowRescue(false);
    } else {
      setIsFinished(true);
      playCompleteSound();
      const score = Math.round((correctCount / scene.turns.length) * 100);
      onComplete?.(score);
    }
  }, [currentTurn, scene.turns.length, correctCount, onComplete]);

  const handleFinish = useCallback(() => {
    const score = Math.round((correctCount / scene.turns.length) * 100);
    onComplete?.(score);
  }, [correctCount, scene.turns.length, onComplete]);

  if (isFinished) {
    const score = Math.round((correctCount / scene.turns.length) * 100);
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-center py-8">
          <div className="text-5xl mb-4">
            {score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            对话完成！
          </h3>
          <p className="text-gray-600 mb-4">
            正确 {correctCount}/{scene.turns.length} 题 · 得分 {score} 分
          </p>
          <p className="text-lg font-semibold text-blue-600">
            {score >= 80
              ? '太棒了！你已经掌握了这个场景！'
              : score >= 60
              ? '做得不错，再练习一次会更好！'
              : '别担心，多练几次就熟练了！'}
          </p>
          <button
            onClick={handleFinish}
            className="mt-6 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
          >
            ✅ 完成
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{scene.icon}</span>
        <div>
          <h3 className="font-bold text-gray-800">{scene.titleCn}</h3>
          <p className="text-sm text-gray-500">{scene.title}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
        <div
          className="bg-blue-500 rounded-full h-2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right mb-4">
        {currentTurn + 1}/{scene.turns.length}
      </p>

      {/* NPC dialogue */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg flex-shrink-0">
            👤
          </div>
          <div className="flex-1">
            <p className="text-gray-800 font-medium leading-relaxed">
              {turn?.npcText}
            </p>
            <p className="text-sm text-gray-500 mt-1">{turn?.npcTextCn}</p>
            <button
              onClick={handlePlayNpc}
              disabled={isPlaying}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              {isPlaying ? '🔊 播放中...' : '🔊 听发音'}
            </button>
          </div>
        </div>
      </div>

      {/* User options */}
      <div className="space-y-3 mb-4">
        <p className="text-sm font-medium text-gray-600">
          选择最合适的回答：
        </p>
        {turn?.options?.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = option.isCorrect;

          let bgColor = 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50';
          if (showFeedback && isSelected) {
            bgColor = isCorrect
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300';
          } else if (showFeedback && isCorrect) {
            bgColor = 'bg-green-50 border-green-200';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option.id)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all min-h-[48px] ${bgColor}`}
            >
              <p className="font-medium text-gray-800">{option.text}</p>
              <p className="text-sm text-gray-500 mt-0.5">{option.textCn}</p>
              {showFeedback && isSelected && (
                <p className={`text-sm mt-1 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✅ 正确！' : '❌ 不太合适，试试其他选项'}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Rescue lines */}
      <div className="mb-4">
        <button
          onClick={() => setShowRescue(!showRescue)}
          className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          🆘 救场表达
        </button>
        {showRescue && (
          <div className="mt-2 bg-orange-50 rounded-lg p-3 space-y-1">
            {scene.rescueLines.map((line, i) => (
              <p key={i} className="text-sm text-orange-800">
                • {line}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Next button */}
      {showFeedback && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
        >
          {currentTurn < scene.turns.length - 1 ? '下一句 →' : '完成对话 ✅'}
        </button>
      )}
    </div>
  );
}
