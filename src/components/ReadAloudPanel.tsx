'use client';

import { useState, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { startRecording, stopRecording, mockPronounceScore, speak, isRecordingSupported } from '@/lib/audio';
import PlaybackSpeed from './PlaybackSpeed';
import type { ReadAloudContent, PronunciationScore } from '@/types';

interface ReadAloudPanelProps {
  content: ReadAloudContent;
  onComplete?: (score: number) => void;
}

export default function ReadAloudPanel({ content, onComplete }: ReadAloudPanelProps) {
  const { playbackSpeed } = useStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState<PronunciationScore | null>(null);
  const [step, setStep] = useState<'listen' | 'record' | 'review'>('listen');

  const handleListen = useCallback(async () => {
    setIsPlaying(true);
    try {
      await speak(content.text, playbackSpeed);
    } catch {
      // Fallback - just wait
    }
    setIsPlaying(false);
    setStep('record');
  }, [content.text, playbackSpeed]);

  const handleRecord = useCallback(async () => {
    if (isRecording) {
      setIsRecording(false);
      await stopRecording();
      // Mock scoring
      const result = mockPronounceScore(content.text);
      setScore(result);
      setStep('review');
    } else {
      try {
        await startRecording();
        setIsRecording(true);
      } catch {
        alert('无法访问麦克风，请检查浏览器权限设置。');
      }
    }
  }, [isRecording, content.text]);

  const handleRetry = useCallback(() => {
    setScore(null);
    setStep('record');
  }, []);

  const handleComplete = useCallback(() => {
    onComplete?.(score?.overall || 0);
  }, [onComplete, score]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">跟读练习</h3>
        <p className="text-sm text-gray-500">{content.textCn}</p>
      </div>

      {/* Reference text */}
      <div className="bg-blue-50 rounded-xl p-5 mb-6">
        <p className="text-xl font-semibold text-blue-900 leading-relaxed">
          {content.text}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {content.keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Playback speed */}
      <div className="mb-6">
        <PlaybackSpeed />
      </div>

      {/* Steps */}
      {step === 'listen' && (
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            第一步：先听一遍示范发音
          </p>
          <button
            onClick={handleListen}
            disabled={isPlaying}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-[56px]"
          >
            {isPlaying ? '🔊 播放中...' : '🔊 听示范发音'}
          </button>
        </div>
      )}

      {step === 'record' && (
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            第二步：按住按钮，大声朗读上面的句子
          </p>
          <button
            onClick={handleRecord}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors min-h-[56px] ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isRecording ? '⏹️ 停止录音' : '🎤 开始录音'}
          </button>
          {!isRecordingSupported() && (
            <p className="text-sm text-orange-500 text-center">
              您的浏览器不支持录音，将使用模拟评分
            </p>
          )}
        </div>
      )}

      {step === 'review' && score && (
        <div className="space-y-4">
          {/* Overall score */}
          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${
                score.overall >= 80
                  ? 'bg-green-100 text-green-700'
                  : score.overall >= 60
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {score.overall}
            </div>
            <p className="mt-2 text-gray-600">
              {score.overall >= 80
                ? '很棒！继续保持！'
                : score.overall >= 60
                ? '不错，再练一遍会更好！'
                : '别灰心，多试几遍就好了！'}
            </p>
          </div>

          {/* Dimension scores */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '准确度', value: score.accuracy, key: 'accuracy' },
              { label: '流利度', value: score.fluency, key: 'fluency' },
              { label: '完整度', value: score.completeness, key: 'completeness' },
              { label: '重音停顿', value: score.stressPause, key: 'stressPause' },
            ].map((dim) => (
              <div key={dim.key} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{dim.label}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`rounded-full h-2 transition-all ${
                        dim.value >= 80
                          ? 'bg-green-500'
                          : dim.value >= 60
                          ? 'bg-yellow-500'
                          : 'bg-orange-500'
                      }`}
                      style={{ width: `${dim.value}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-8">
                    {dim.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Error highlights */}
          {score.errorSpans.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-orange-800 mb-2">
                需要注意的发音：
              </p>
              <div className="space-y-2">
                {score.errorSpans.map((err, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="font-mono bg-orange-100 px-2 py-0.5 rounded text-orange-700">
                      {err.token}
                    </span>
                    <span className="text-gray-600">→</span>
                    <span className="text-orange-600">{err.hint}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors min-h-[48px]"
            >
              🔄 再试一遍
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
            >
              ✅ 完成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
