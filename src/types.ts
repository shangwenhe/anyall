export type KeyboardRegion = 'left' | 'right' | 'both' | 'numbers' | 'symbols' | 'letters';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type GameType = 'falling' | 'timed' | 'error';

export interface Key {
  value: string;
  finger: string;
  region: KeyboardRegion;
  row: number;
  col: number;
  offset?: number;
}

export interface PracticeRecord {
  id: string;
  date: string;
  duration: number;
  wpm: number;
  accuracy: number;
  errors: number;
  difficulty: Difficulty;
}

export interface GameScore {
  id: string;
  gameType: GameType;
  score: number;
  date: string;
  difficulty?: string;
}

export interface ErrorKey {
  key: string;
  count: number;
}

export interface Settings {
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
  soundEnabled: boolean;
}