import type { Difficulty } from '../types';
import { WORD_LISTS, PRACTICE_TEXT } from '../constants';

export const calculateWPM = (
  correctCharacters: number,
  duration: number
): number => {
  const words = correctCharacters / 5; // 5 characters per word
  const minutes = duration / 60000;
  return Math.round(words / minutes);
};

export const calculateAccuracy = (
  correctCharacters: number,
  totalCharacters: number
): number => {
  if (totalCharacters === 0) return 100;
  return Math.round((correctCharacters / totalCharacters) * 100);
};

export const generatePracticeContent = (
  difficulty: Difficulty,
  customText?: string
): string => {
  if (customText) {
    // 保留所有字符，原样返回
    return customText;
  }

  switch (difficulty) {
    case 'beginner':
      return generateRandomCharacters(WORD_LISTS.beginner, 20);
    case 'intermediate':
      return generateRandomWords(WORD_LISTS.intermediate, 15);
    case 'advanced':
      return generateRandomText(PRACTICE_TEXT.advanced, 300);
    default:
      return generateRandomCharacters(WORD_LISTS.beginner, 10);
  }
};

const generateRandomCharacters = (characters: string[], count: number): string => {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
};

const generateRandomWords = (words: string[], count: number): string => {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }
  return result.join(' ');
};

const generateRandomText = (text: string, length: number): string => {
  const start = Math.floor(Math.random() * (text.length - length));
  return text.substring(start, start + length);
};

export const generateErrorKeyPractice = (errorKeys: string[], length: number): string => {
  if (errorKeys.length === 0) {
    return generateRandomCharacters(WORD_LISTS.beginner, length);
  }
  let result = '';
  for (let i = 0; i < length; i++) {
    result += errorKeys[Math.floor(Math.random() * errorKeys.length)];
  }
  return result;
};