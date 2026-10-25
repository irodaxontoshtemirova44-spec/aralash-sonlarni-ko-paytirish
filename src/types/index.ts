export type Language = 'uz' | 'ru' | 'en';

export type Theme = 'light' | 'dark';

export type FontSize = 'normal' | 'large';

export interface Fraction {
  whole?: number;
  num: number;
  den: number;
}

export type MascotMood = 'happy' | 'thinking' | 'cheering' | 'explaining' | 'proud' | 'confused';

export interface UserProfile {
  name: string;
  className?: string;
  language: Language;
  theme: Theme;
  soundEnabled: boolean;
  fontSize: FontSize;
}

export interface TestResult {
  id: string;
  date: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  grade: number; // 2, 3, 4, 5 in Uzbek school grading
  topicScores: {
    mixedByNatural: { correct: number; total: number };
    fractionMultiplication: { correct: number; total: number };
    wordProblems: { correct: number; total: number };
  };
  details: {
    questionId: string;
    topic: 'mixedByNatural' | 'fractionMultiplication' | 'wordProblems';
    questionText: string;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface UserProgress {
  profile: UserProfile;
  stars: number;
  completedLessons: string[];
  practiceCount: number;
  unlockedStations: {
    learn: boolean;
    practice: boolean;
    games: boolean;
    cases: boolean;
    test: boolean;
    certificate: boolean;
  };
  gameHighScores: {
    race: number;
    memory: number;
    chef: number;
    detective: number;
  };
  badges: string[];
  testHistory: TestResult[];
  dailySolved: string[];
  caseReflections: { [caseId: string]: string };
  teacherUnlocked: boolean;
}

export type QuestionType = 'multipleChoice' | 'fractionInput' | 'trueFalse' | 'wordProblem';

export interface TestQuestion {
  id: string;
  topic: 'mixedByNatural' | 'fractionMultiplication' | 'wordProblems';
  type: QuestionType;
  prompt: {
    uz: string;
    ru: string;
    en: string;
  };
  options?: {
    uz: string[];
    ru: string[];
    en: string[];
  };
  correctAnswer: {
    whole?: number;
    num: number;
    den: number;
    text?: string;
    boolValue?: boolean;
    optionIndex?: number;
  };
  explanation: {
    uz: string;
    ru: string;
    en: string;
  };
}
