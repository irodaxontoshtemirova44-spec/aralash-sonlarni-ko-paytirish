import { UserProgress, UserProfile } from '../types';

const STORAGE_KEY = 'kasrlar_olami_progress_v1';

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  className: '5-A',
  language: 'uz',
  theme: 'light',
  soundEnabled: true,
  fontSize: 'normal',
};

export const DEFAULT_PROGRESS: UserProgress = {
  profile: DEFAULT_PROFILE,
  stars: 10, // initial welcoming stars
  completedLessons: [],
  practiceCount: 0,
  unlockedStations: {
    learn: true,
    practice: false,
    games: false,
    cases: false,
    test: false,
    certificate: false,
  },
  gameHighScores: {
    race: 0,
    memory: 0,
    chef: 0,
    detective: 0,
  },
  badges: ['welcome_badge'],
  testHistory: [],
  dailySolved: [],
  caseReflections: {},
  teacherUnlocked: false,
};

let inMemoryStorage: UserProgress = { ...DEFAULT_PROGRESS };

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      profile: {
        ...DEFAULT_PROFILE,
        ...parsed.profile,
      },
      unlockedStations: {
        ...DEFAULT_PROGRESS.unlockedStations,
        ...parsed.unlockedStations,
      },
      gameHighScores: {
        ...DEFAULT_PROGRESS.gameHighScores,
        ...parsed.gameHighScores,
      },
    };
  } catch (err) {
    console.warn('Failed to load from localStorage, using memory storage', err);
    return inMemoryStorage;
  }
}

export function saveUserProgress(progress: UserProgress): boolean {
  inMemoryStorage = progress;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (err) {
    console.warn('Failed to write to localStorage', err);
    return false;
  }
}

export function clearUserProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear localStorage', err);
  }
  inMemoryStorage = { ...DEFAULT_PROGRESS };
}
