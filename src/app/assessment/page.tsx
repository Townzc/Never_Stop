'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import SkillRadar from '@/components/SkillRadar';
import { readAloudContents, signageQuestions } from '@/lib/mock-data';
import { speak, playCorrectSound, playIncorrectSound, playCompleteSound, warmUpSpeech } from '@/lib/audio';
import type { AssessmentScores } from '@/types';

type AssessmentStep = 'intro' | 'vocab' | 'signage' | 'listening' | 'speaking' | 'result';

const vocabQuestions = [
  {
    word: 'pharmacy',
    phonetic: '/ˈfɑːrməsi/',
    options: ['医院', '药房', '学校', '银行'],
    correct: '药房',
  },
  {
    word: 'receipt',
    phonetic: '/rɪˈsiːt/',
    options: ['发票', '收据', '处方', '支票'],
    correct: '收据',
  },
  {
    word: 'boarding',
    phonetic: '/ˈbɔːrdɪŋ/',
    options: ['登机', '降落', '起飞', '中转'],
    correct: '登机',
  },
  {
    word: 'restroom',
    phonetic: '/ˈrestruːm/',
    options: ['卧室', '厨房', '洗手间', '客厅'],
    correct: '洗手间',
  },
  {
    word: 'refund',
    phonetic: '/ˈriːfʌnd/',
    options: ['折扣', '退款', '小费', '押金'],
    correct: '退款',
  },
];

const listeningSentences = [
  {
    text: 'Where is the nearest pharmacy?',
    options: ['最近的医院在哪里？', '最近的药房在哪里？', '最近的银行在哪里？', '最近的商店在哪里？'],
    correct: '最近的药房在哪里？',
  },
  {
    text: 'Can I pay by card?',
    options: ['可以用现金吗？', '可以刷卡吗？', '可以扫码吗？', '可以转账吗？'],
    correct: '可以刷卡吗？',
  },
];

export default function AssessmentPage() {
  const router = useRouter();
  const { setAssessment, isAssessed } = useStore();
  const [step, setStep] = useState<AssessmentStep>('intro');
  const [vocabScore, setVocabScore] = useState(0);
  const [signageScore, setSignageScore] = useState(0);
  const [listeningScore, setListeningScore] = useState(0);
  const [speakingScore, setSpeakingScore] = useState(0);
  const [pronunciationScore, setPronunciationScore] = useState(0);

  // Vocab state
  const [vocabIdx, setVocabIdx] = useState(0);
  const [vocabCorrect, setVocabCorrect] = useState(0);
  const [vocabAnswered, setVocabAnswered] = useState(false);
  const [vocabSelected, setVocabSelected] = useState<string | null>(null);

  // Signage state
  const [signageIdx, setSignageIdx] = useState(0);
  const [signageCorrect, setSignageCorrect] = useState(0);
  const [signageAnswered, setSignageAnswered] = useState(false);
  const [signageSelected, setSignageSelected] = useState<string | null>(null);

  // Listening state
  const [listeningIdx, setListeningIdx] = useState(0);
  const [listeningCorrect, setListeningCorrect] = useState(0);
  const [listeningAnswered, setListeningAnswered] = useState(false);
  const [listeningSelected, setListeningSelected] = useState<string | null>(null);
  const [isPlayingListening, setIsPlayingListening] = useState(false);

  // Speaking state
  const [speakingDone, setSpeakingDone] = useState(false);

  const signageQs = useMemo(() => signageQuestions.slice(0, 5), []);
  const readAloud = readAloudContents[0];

  // Pre-warm SpeechSynthesis on mount
  useEffect(() => {
    warmUpSpeech();
  }, []);

  // Auto-play word pronunciation immediately when vocab question changes
  useEffect(() => {
    if (step === 'vocab' && !vocabAnswered) {
      const word = vocabQuestions[vocabIdx].word;
      speak(word, 0.9).catch(() => {});
    }
  }, [step, vocabIdx, vocabAnswered]);

  // Vocab handlers
  const handleVocabAnswer = useCallback(
    (answer: string) => {
      if (vocabAnswered) return;
      setVocabSelected(answer);
      setVocabAnswered(true);
      if (answer === vocabQuestions[vocabIdx].correct) {
        setVocabCorrect((c) => c + 1);
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    },
    [vocabAnswered, vocabIdx]
  );

  const handleVocabNext = useCallback(() => {
    if (vocabIdx < vocabQuestions.length - 1) {
      setVocabIdx((i) => i + 1);
      setVocabAnswered(false);
      setVocabSelected(null);
    } else {
      const score = Math.round((vocabCorrect / vocabQuestions.length) * 100);
      setVocabScore(score);
      playCompleteSound();
      setStep('signage');
    }
  }, [vocabIdx, vocabCorrect]);

  // Signage handlers
  const handleSignageAnswer = useCallback(
    (answer: string) => {
      if (signageAnswered) return;
      setSignageSelected(answer);
      setSignageAnswered(true);
      if (answer === signageQs[signageIdx].correctAnswer) {
        setSignageCorrect((c) => c + 1);
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    },
    [signageAnswered, signageIdx, signageQs]
  );

  const handleSignageNext = useCallback(() => {
    if (signageIdx < signageQs.length - 1) {
      setSignageIdx((i) => i + 1);
      setSignageAnswered(false);
      setSignageSelected(null);
    } else {
      const score = Math.round((signageCorrect / signageQs.length) * 100);
      setSignageScore(score);
      playCompleteSound();
      setStep('listening');
    }
  }, [signageIdx, signageCorrect, signageQs]);

  // Listening handlers
  const handlePlayListening = useCallback(async () => {
    setIsPlayingListening(true);
    try {
      await speak(listeningSentences[listeningIdx].text, 1.0);
    } catch {
      // fallback
    }
    setIsPlayingListening(false);
  }, [listeningIdx]);

  const handleListeningAnswer = useCallback(
    (answer: string) => {
      if (listeningAnswered) return;
      setListeningSelected(answer);
      setListeningAnswered(true);
      if (answer === listeningSentences[listeningIdx].correct) {
        setListeningCorrect((c) => c + 1);
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    },
    [listeningAnswered, listeningIdx]
  );

  const handleListeningNext = useCallback(() => {
    if (listeningIdx < listeningSentences.length - 1) {
      setListeningIdx((i) => i + 1);
      setListeningAnswered(false);
      setListeningSelected(null);
    } else {
      const score = Math.round((listeningCorrect / listeningSentences.length) * 100);
      setListeningScore(score);
      playCompleteSound();
      setStep('speaking');
    }
  }, [listeningIdx, listeningCorrect]);

  // Speaking handler
  const handleSpeakingComplete = useCallback((score: number) => {
    setSpeakingScore(score);
    const pScore = 40 + Math.floor(Math.random() * 40);
    setPronunciationScore(pScore);
    setSpeakingDone(true);
    playCompleteSound();
  }, []);

  // Final submit
  const handleSubmit = useCallback(() => {
    const scores: AssessmentScores = {
      vocab: vocabScore,
      signage: signageScore,
      listening: listeningScore,
      speaking: speakingScore,
      pronunciation: pronunciationScore,
    };
    setAssessment({
      id: `a_${Date.now()}`,
      scores,
      completedAt: new Date().toISOString(),
      recommendedPath: '',
    });
    setStep('result');
  }, [vocabScore, signageScore, listeningScore, speakingScore, pronunciationScore, setAssessment]);

  // Play word audio button
  const handlePlayWord = useCallback(() => {
    speak(vocabQuestions[vocabIdx].word, 0.9).catch(() => {});
  }, [vocabIdx]);

  // If already assessed, show result
  if (isAssessed && step === 'intro') {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">已完成评估</h2>
          <p className="text-gray-500">你的学习路径已经生成</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors min-h-[56px]"
        >
          开始学习
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      {step !== 'intro' && step !== 'result' && (
        <div className="flex items-center gap-2">
          {['vocab', 'signage', 'listening', 'speaking'].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === s
                    ? 'bg-blue-600 text-white'
                    : i < ['vocab', 'signage', 'listening', 'speaking'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1}
              </div>
              {i < 3 && (
                <div
                  className={`h-0.5 flex-1 ${
                    i < ['vocab', 'signage', 'listening', 'speaking'].indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Intro */}
      {step === 'intro' && (
        <div className="text-center py-8 space-y-6">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-3xl font-bold text-gray-800">能力评估</h2>
          <p className="text-gray-500 text-lg">
            通过 4 个小测试，了解你的英语水平
          </p>
          <div className="bg-blue-50 rounded-xl p-4 text-left">
            <p className="text-sm text-blue-800">
              • 词汇测试：5 道选择题（带读音）
              <br />
              • 标识识别：5 道选择题
              <br />
              • 听力测试：2 道听力题
              <br />
              • 口语测试：1 句跟读
            </p>
          </div>
          <button
            onClick={() => setStep('vocab')}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors min-h-[56px]"
          >
            开始测试 →
          </button>
        </div>
      )}

      {/* Vocab */}
      {step === 'vocab' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">词汇测试</h2>
          <p className="text-gray-500">听读音，选出正确的中文意思</p>

          {/* Word card with play button */}
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-blue-900 mb-1">
              {vocabQuestions[vocabIdx].word}
            </p>
            <p className="text-sm text-blue-600 mb-3">
              {vocabQuestions[vocabIdx].phonetic}
            </p>
            <button
              onClick={handlePlayWord}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
            >
              🔊 再听一次
            </button>
          </div>

          <div className="space-y-3">
            {vocabQuestions[vocabIdx].options.map((option) => {
              const isSelected = vocabSelected === option;
              const isCorrect = option === vocabQuestions[vocabIdx].correct;
              let bg = 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50';
              if (vocabAnswered && isSelected) {
                bg = isCorrect
                  ? 'bg-green-50 border-green-400 ring-2 ring-green-200'
                  : 'bg-red-50 border-red-400 ring-2 ring-red-200';
              } else if (vocabAnswered && isCorrect) {
                bg = 'bg-green-50 border-green-300';
              }
              return (
                <button
                  key={option}
                  onClick={() => handleVocabAnswer(option)}
                  disabled={vocabAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all min-h-[56px] ${bg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 text-lg">{option}</span>
                    {vocabAnswered && isSelected && (
                      <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
                    )}
                    {vocabAnswered && !isSelected && isCorrect && (
                      <span className="text-xl">✅</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback text */}
          {vocabAnswered && (
            <div
              className={`rounded-xl p-4 text-center ${
                vocabSelected === vocabQuestions[vocabIdx].correct
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`font-semibold ${
                  vocabSelected === vocabQuestions[vocabIdx].correct
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}
              >
                {vocabSelected === vocabQuestions[vocabIdx].correct
                  ? '🎉 答对了！太棒了！'
                  : `😅 正确答案是「${vocabQuestions[vocabIdx].correct}」`}
              </p>
            </div>
          )}

          {vocabAnswered && (
            <button
              onClick={handleVocabNext}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
            >
              {vocabIdx < vocabQuestions.length - 1 ? '下一题 →' : '完成词汇测试 →'}
            </button>
          )}
        </div>
      )}

      {/* Signage */}
      {step === 'signage' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">标识识别</h2>
          <p className="text-gray-500">选出标识的中文意思</p>

          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">{signageQs[signageIdx].signage.icon}</div>
            <p className="text-3xl font-bold text-gray-800">
              {signageQs[signageIdx].signage.keyword}
            </p>
          </div>

          <div className="space-y-3">
            {signageQs[signageIdx].options.map((option) => {
              const isSelected = signageSelected === option;
              const isCorrect = option === signageQs[signageIdx].correctAnswer;
              let bg = 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50';
              if (signageAnswered && isSelected) {
                bg = isCorrect
                  ? 'bg-green-50 border-green-400 ring-2 ring-green-200'
                  : 'bg-red-50 border-red-400 ring-2 ring-red-200';
              } else if (signageAnswered && isCorrect) {
                bg = 'bg-green-50 border-green-300';
              }
              return (
                <button
                  key={option}
                  onClick={() => handleSignageAnswer(option)}
                  disabled={signageAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all min-h-[56px] ${bg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 text-lg">{option}</span>
                    {signageAnswered && isSelected && (
                      <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {signageAnswered && (
            <div
              className={`rounded-xl p-4 text-center ${
                signageSelected === signageQs[signageIdx].correctAnswer
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`font-semibold ${
                  signageSelected === signageQs[signageIdx].correctAnswer
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}
              >
                {signageSelected === signageQs[signageIdx].correctAnswer
                  ? '🎉 答对了！'
                  : `😅 正确答案是「${signageQs[signageIdx].correctAnswer}」`}
              </p>
            </div>
          )}

          {signageAnswered && (
            <button
              onClick={handleSignageNext}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors min-h-[48px]"
            >
              {signageIdx < signageQs.length - 1 ? '下一题 →' : '完成标识测试 →'}
            </button>
          )}
        </div>
      )}

      {/* Listening */}
      {step === 'listening' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">听力测试</h2>
          <p className="text-gray-500">听句子，选出正确的中文意思</p>

          <button
            onClick={handlePlayListening}
            disabled={isPlayingListening}
            className="w-full py-6 rounded-xl bg-green-50 border-2 border-green-200 text-green-700 font-semibold text-lg hover:bg-green-100 transition-colors min-h-[56px]"
          >
            {isPlayingListening ? '🔊 播放中...' : '🔊 点击播放句子'}
          </button>

          <div className="space-y-3">
            {listeningSentences[listeningIdx].options.map((option) => {
              const isSelected = listeningSelected === option;
              const isCorrect = option === listeningSentences[listeningIdx].correct;
              let bg = 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50';
              if (listeningAnswered && isSelected) {
                bg = isCorrect
                  ? 'bg-green-50 border-green-400 ring-2 ring-green-200'
                  : 'bg-red-50 border-red-400 ring-2 ring-red-200';
              } else if (listeningAnswered && isCorrect) {
                bg = 'bg-green-50 border-green-300';
              }
              return (
                <button
                  key={option}
                  onClick={() => handleListeningAnswer(option)}
                  disabled={listeningAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all min-h-[56px] ${bg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 text-lg">{option}</span>
                    {listeningAnswered && isSelected && (
                      <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {listeningAnswered && (
            <div
              className={`rounded-xl p-4 text-center ${
                listeningSelected === listeningSentences[listeningIdx].correct
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`font-semibold ${
                  listeningSelected === listeningSentences[listeningIdx].correct
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}
              >
                {listeningSelected === listeningSentences[listeningIdx].correct
                  ? '🎉 答对了！'
                  : `😅 正确答案是「${listeningSentences[listeningIdx].correct}」`}
              </p>
            </div>
          )}

          {listeningAnswered && (
            <button
              onClick={handleListeningNext}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
            >
              {listeningIdx < listeningSentences.length - 1 ? '下一题 →' : '完成听力测试 →'}
            </button>
          )}
        </div>
      )}

      {/* Speaking */}
      {step === 'speaking' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">口语测试</h2>
          <p className="text-gray-500">朗读下面的句子</p>

          <div className="bg-blue-50 rounded-xl p-6">
            <button
              onClick={() => speak(readAloud.text, 0.9).catch(() => {})}
              className="mb-3 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              🔊 听示范发音
            </button>
            <p className="text-xl font-semibold text-blue-900 text-center">
              {readAloud.text}
            </p>
            <p className="text-sm text-blue-700 text-center mt-2">
              {readAloud.textCn}
            </p>
          </div>

          <button
            onClick={() => handleSpeakingComplete(40 + Math.floor(Math.random() * 40))}
            className="w-full py-4 rounded-xl bg-orange-600 text-white font-semibold text-lg hover:bg-orange-700 transition-colors min-h-[56px]"
          >
            🎤 点击完成口语测试
          </button>

          {speakingDone && (
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors min-h-[56px]"
            >
              查看结果 →
            </button>
          )}
        </div>
      )}

      {/* Result */}
      {step === 'result' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">评估完成！</h2>
            <p className="text-gray-500">这是你的能力雷达图</p>
          </div>

          <SkillRadar
            scores={{
              vocab: vocabScore || 50,
              signage: signageScore || 50,
              listening: listeningScore || 50,
              speaking: speakingScore || 50,
              pronunciation: pronunciationScore || 50,
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '词汇', score: vocabScore || 50, color: 'blue' },
              { label: '标识', score: signageScore || 50, color: 'purple' },
              { label: '听力', score: listeningScore || 50, color: 'green' },
              { label: '口语', score: speakingScore || 50, color: 'orange' },
              { label: '发音', score: pronunciationScore || 50, color: 'red' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-xl p-3 border border-gray-100"
              >
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-gray-800">{item.score}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="text-green-800 font-medium">
              🎉 你的学习路径已经生成！每天 30 分钟，跟着计划走，进步看得见。
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors min-h-[56px]"
          >
            开始学习 →
          </button>
        </div>
      )}
    </div>
  );
}
