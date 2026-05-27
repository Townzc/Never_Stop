export type GoalTag = 'travel' | 'family_visit' | 'medical' | 'housing' | 'shopping';

export type LessonType = 'read_aloud' | 'dialogue' | 'signage' | 'listening' | 'vocab';

export type SkillDimension = 'vocab' | 'signage' | 'listening' | 'speaking' | 'pronunciation';

export interface UserProfile {
  id: string;
  goalTags: GoalTag[];
  dailyMinutes: number;
  hasFamilyPartner: boolean;
  travelingSoon: boolean;
  createdAt: string;
}

export interface AssessmentScores {
  vocab: number;
  signage: number;
  listening: number;
  speaking: number;
  pronunciation: number;
}

export interface Assessment {
  id: string;
  scores: AssessmentScores;
  completedAt: string;
  recommendedPath: string;
}

export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  titleCn: string;
  description: string;
  durationSec: number;
  level: 'A1' | 'A2' | 'B1';
  skills: SkillDimension[];
  sceneTag?: string;
}

export interface LessonProgress {
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
}

export interface TodayPlan {
  date: string;
  lessons: Lesson[];
  totalMinutes: number;
  completedCount: number;
}

export interface ReadAloudContent {
  id: string;
  text: string;
  textCn: string;
  audioUrl?: string;
  keywords: string[];
}

export interface DialogueScene {
  id: string;
  title: string;
  titleCn: string;
  icon: string;
  turns: DialogueTurn[];
  rescueLines: string[];
}

export interface DialogueTurn {
  id: string;
  speaker: 'user' | 'npc';
  npcText?: string;
  npcTextCn?: string;
  options?: DialogueOption[];
  correctChunk?: string;
}

export interface DialogueOption {
  id: string;
  text: string;
  textCn: string;
  isCorrect: boolean;
}

export interface SignageItem {
  id: string;
  keyword: string;
  keywordCn: string;
  category: 'airport' | 'shop' | 'hospital' | 'transport' | 'hotel';
  description: string;
  exampleSentence: string;
  icon: string;
}

export interface SignageQuestion {
  id: string;
  signage: SignageItem;
  options: string[];
  correctAnswer: string;
}

export interface PronunciationScore {
  accuracy: number;
  fluency: number;
  completeness: number;
  stressPause: number;
  overall: number;
  errorSpans: { token: string; issue: string; hint: string }[];
}

export interface DailyRecord {
  date: string;
  minutesSpent: number;
  lessonsCompleted: number;
  pronunciationAvg: number;
}

export interface UserProgress {
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  totalLessons: number;
  totalMinutes: number;
  dailyRecords: DailyRecord[];
  scores: AssessmentScores;
  milestones: Milestone[];
  weakScenes: string[];
  strongScenes: string[];
}

export interface Milestone {
  id: string;
  title: string;
  titleCn: string;
  icon: string;
  achieved: boolean;
  achievedAt?: string;
}
