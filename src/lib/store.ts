import { create } from 'zustand';
import type {
  UserProfile,
  Assessment,
  AssessmentScores,
  LessonProgress,
  TodayPlan,
  UserProgress,
  GoalTag,
} from '@/types';
import { getTodayLessons, defaultScores, milestones as defaultMilestones } from './mock-data';

interface AppState {
  // User
  userProfile: UserProfile | null;
  isOnboarded: boolean;

  // Assessment
  assessment: Assessment | null;
  isAssessed: boolean;

  // Today's plan
  todayPlan: TodayPlan | null;

  // Lesson progress
  lessonProgress: Record<string, LessonProgress>;

  // Progress
  progress: UserProgress;

  // UI
  largeTextMode: boolean;
  playbackSpeed: number;

  // Actions
  setUserProfile: (profile: UserProfile) => void;
  setAssessment: (assessment: Assessment) => void;
  generateTodayPlan: () => void;
  startLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string, score?: number) => void;
  toggleLargeText: () => void;
  setPlaybackSpeed: (speed: number) => void;
  updateScores: (scores: Partial<AssessmentScores>) => void;
  getRecommendedPath: (scores: AssessmentScores) => string;
}

function calculateStreak(dailyRecords: { date: string }[]): number {
  if (dailyRecords.length === 0) return 0;
  const sorted = [...dailyRecords].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().split('T')[0];
  if (sorted[0].date !== today) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getRecommendedPath(scores: AssessmentScores): string {
  const min = Math.min(scores.vocab, scores.signage, scores.listening, scores.speaking, scores.pronunciation);
  if (min === scores.pronunciation) return 'pronunciation_focus';
  if (min === scores.listening) return 'listening_focus';
  if (min === scores.signage) return 'signage_focus';
  if (min === scores.speaking) return 'speaking_focus';
  return 'balanced';
}

// Load state from localStorage
function loadState(): Partial<AppState> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem('never_stop_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        userProfile: parsed.userProfile || null,
        isOnboarded: parsed.isOnboarded || false,
        assessment: parsed.assessment || null,
        isAssessed: parsed.isAssessed || false,
        lessonProgress: parsed.lessonProgress || {},
        progress: parsed.progress || {
          totalDays: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalLessons: 0,
          totalMinutes: 0,
          dailyRecords: [],
          scores: defaultScores,
          milestones: defaultMilestones,
          weakScenes: [],
          strongScenes: [],
        },
        largeTextMode: parsed.largeTextMode || false,
      };
    }
  } catch {
    // ignore
  }
  return {};
}

function saveState(state: Partial<AppState>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      'never_stop_state',
      JSON.stringify({
        userProfile: state.userProfile,
        isOnboarded: state.isOnboarded,
        assessment: state.assessment,
        isAssessed: state.isAssessed,
        lessonProgress: state.lessonProgress,
        progress: state.progress,
        largeTextMode: state.largeTextMode,
      })
    );
  } catch {
    // ignore
  }
}

const initialProgress: UserProgress = {
  totalDays: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalLessons: 0,
  totalMinutes: 0,
  dailyRecords: [],
  scores: defaultScores,
  milestones: defaultMilestones.map((m) => ({ ...m })),
  weakScenes: [],
  strongScenes: [],
};

export const useStore = create<AppState>((set, get) => {
  const saved = loadState();

  return {
    userProfile: saved.userProfile || null,
    isOnboarded: saved.isOnboarded || false,
    assessment: saved.assessment || null,
    isAssessed: saved.isAssessed || false,
    todayPlan: null,
    lessonProgress: saved.lessonProgress || {},
    progress: saved.progress || initialProgress,
    largeTextMode: saved.largeTextMode || false,
    playbackSpeed: 1.0,

    setUserProfile: (profile) => {
      set({ userProfile: profile, isOnboarded: true });
      saveState({ ...get(), userProfile: profile, isOnboarded: true });
    },

    setAssessment: (assessment) => {
      const progress = { ...get().progress, scores: assessment.scores };
      set({ assessment, isAssessed: true, progress });
      saveState({ ...get(), assessment, isAssessed: true, progress });
    },

    generateTodayPlan: () => {
      const { userProfile } = get();
      const todayLessons = getTodayLessons(userProfile?.goalTags || []);
      const plan: TodayPlan = {
        date: new Date().toISOString().split('T')[0],
        lessons: todayLessons,
        totalMinutes: Math.round(todayLessons.reduce((sum, l) => sum + l.durationSec, 0) / 60),
        completedCount: 0,
      };
      set({ todayPlan: plan });
    },

    startLesson: (lessonId) => {
      const progress = { ...get().lessonProgress };
      if (!progress[lessonId] || progress[lessonId].status === 'not_started') {
        progress[lessonId] = {
          lessonId,
          status: 'in_progress',
          startedAt: new Date().toISOString(),
          retryCount: 0,
        };
      }
      set({ lessonProgress: progress });
      saveState({ ...get(), lessonProgress: progress });
    },

    completeLesson: (lessonId, score) => {
      const { lessonProgress, progress, todayPlan } = get();
      const newLessonProgress = { ...lessonProgress };
      newLessonProgress[lessonId] = {
        ...newLessonProgress[lessonId],
        status: 'completed',
        score,
        completedAt: new Date().toISOString(),
        retryCount: (newLessonProgress[lessonId]?.retryCount || 0) + 1,
      };

      // Update overall progress
      const today = new Date().toISOString().split('T')[0];
      const newProgress = { ...progress };
      newProgress.totalLessons += 1;
      newProgress.totalMinutes += 5;

      // Update daily record
      const todayRecord = newProgress.dailyRecords.find((r) => r.date === today);
      if (todayRecord) {
        todayRecord.minutesSpent += 5;
        todayRecord.lessonsCompleted += 1;
      } else {
        newProgress.dailyRecords.push({
          date: today,
          minutesSpent: 5,
          lessonsCompleted: 1,
          pronunciationAvg: score || 0,
        });
        newProgress.totalDays += 1;
      }

      // Update streak
      newProgress.currentStreak = calculateStreak(newProgress.dailyRecords);
      newProgress.longestStreak = Math.max(newProgress.longestStreak, newProgress.currentStreak);

      // Check milestones
      const ms = [...newProgress.milestones];
      const ms1 = ms.find((m) => m.id === 'ms_1');
      if (ms1 && !ms1.achieved && newProgress.totalLessons >= 1) {
        ms1.achieved = true;
        ms1.achievedAt = today;
      }
      const ms2 = ms.find((m) => m.id === 'ms_2');
      if (ms2 && !ms2.achieved && newProgress.currentStreak >= 3) {
        ms2.achieved = true;
        ms2.achievedAt = today;
      }
      const ms3 = ms.find((m) => m.id === 'ms_3');
      if (ms3 && !ms3.achieved && newProgress.currentStreak >= 7) {
        ms3.achieved = true;
        ms3.achievedAt = today;
      }
      const ms4 = ms.find((m) => m.id === 'ms_4');
      if (ms4 && !ms4.achieved && newProgress.totalLessons >= 10) {
        ms4.achieved = true;
        ms4.achievedAt = today;
      }
      const ms8 = ms.find((m) => m.id === 'ms_8');
      if (ms8 && !ms8.achieved && newProgress.totalLessons >= 30) {
        ms8.achieved = true;
        ms8.achievedAt = today;
      }

      // Update today plan
      let newTodayPlan = todayPlan;
      if (newTodayPlan) {
        newTodayPlan = {
          ...newTodayPlan,
          completedCount: newTodayPlan.completedCount + 1,
        };
      }

      set({
        lessonProgress: newLessonProgress,
        progress: newProgress,
        todayPlan: newTodayPlan,
      });
      saveState({ ...get(), lessonProgress: newLessonProgress, progress: newProgress });
    },

    toggleLargeText: () => {
      const newValue = !get().largeTextMode;
      set({ largeTextMode: newValue });
      saveState({ ...get(), largeTextMode: newValue });
    },

    setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

    updateScores: (scores) => {
      const progress = { ...get().progress, scores: { ...get().progress.scores, ...scores } };
      set({ progress });
      saveState({ ...get(), progress });
    },

    getRecommendedPath,
  };
});
