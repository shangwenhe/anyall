import type { PracticeRecord, GameScore, ErrorKey, Settings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

// Storage keys
const PRACTICE_RECORDS_KEY = 'type-keyboard-practice-records';
const GAME_SCORES_KEY = 'type-keyboard-game-scores';
const ERROR_KEYS_KEY = 'type-keyboard-error-keys';
const SETTINGS_KEY = 'type-keyboard-settings';

// Practice records management
export const savePracticeRecord = (record: PracticeRecord): void => {
  const records = getPracticeRecords();
  records.push(record);
  // Keep only last 10 records
  const limitedRecords = records.slice(-10);
  localStorage.setItem(PRACTICE_RECORDS_KEY, JSON.stringify(limitedRecords));
};

export const getPracticeRecords = (): PracticeRecord[] => {
  const records = localStorage.getItem(PRACTICE_RECORDS_KEY);
  return records ? JSON.parse(records) : [];
};

export const clearPracticeRecords = (): void => {
  localStorage.removeItem(PRACTICE_RECORDS_KEY);
};

// Game scores management
export const saveGameScore = (score: GameScore): void => {
  const scores = getGameScores();
  const existingIndex = scores.findIndex(
    (s) => s.gameType === score.gameType &&
           s.difficulty === score.difficulty
  );

  if (existingIndex !== -1) {
    // Update if higher score
    if (score.score > scores[existingIndex].score) {
      scores[existingIndex] = score;
    }
  } else {
    scores.push(score);
  }

  localStorage.setItem(GAME_SCORES_KEY, JSON.stringify(scores));
};

export const getGameScores = (): GameScore[] => {
  const scores = localStorage.getItem(GAME_SCORES_KEY);
  return scores ? JSON.parse(scores) : [];
};

export const getHighScore = (gameType: string, difficulty?: string): number => {
  const scores = getGameScores();
  const score = scores.find(
    (s) => s.gameType === gameType &&
           (!difficulty || s.difficulty === difficulty)
  );
  return score?.score || 0;
};

export const clearGameScores = (): void => {
  localStorage.removeItem(GAME_SCORES_KEY);
};

// Error keys management
export const saveErrorKey = (key: string): void => {
  const errorKeys = getErrorKeys();
  const existingKey = errorKeys.find((k) => k.key === key);

  if (existingKey) {
    existingKey.count++;
  } else {
    errorKeys.push({ key, count: 1 });
  }

  localStorage.setItem(ERROR_KEYS_KEY, JSON.stringify(errorKeys));
};

export const getErrorKeys = (): ErrorKey[] => {
  const errorKeys = localStorage.getItem(ERROR_KEYS_KEY);
  return errorKeys ? JSON.parse(errorKeys) : [];
};

export const getTopErrorKeys = (count: number): string[] => {
  const errorKeys = getErrorKeys();
  return errorKeys
    .sort((a, b) => b.count - a.count)
    .slice(0, count)
    .map((k) => k.key);
};

export const clearErrorKeys = (): void => {
  localStorage.removeItem(ERROR_KEYS_KEY);
};

// Settings management
export const saveSettings = (settings: Settings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getSettings = (): Settings => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  if (settings) {
    const parsed = JSON.parse(settings);
    // 确保类型兼容性
    return {
      fontSize: ['small', 'medium', 'large'].includes(parsed.fontSize) ? (parsed.fontSize as 'small' | 'medium' | 'large') : 'medium',
      theme: ['light', 'dark'].includes(parsed.theme) ? (parsed.theme as 'light' | 'dark') : 'light',
      soundEnabled: !!parsed.soundEnabled,
    } as Settings;
  }
  return DEFAULT_SETTINGS as Settings;
};

// Clear all data
export const clearAllData = (): void => {
  clearPracticeRecords();
  clearGameScores();
  clearErrorKeys();
};