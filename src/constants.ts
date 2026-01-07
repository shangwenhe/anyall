import type { Key } from './types';

export const KEYBOARD_LAYOUT: Key[] = [
  // Row 1 (Numbers) - 标准指法分配
  { value: '1', finger: 'L1', region: 'numbers', row: 0, col: 0, offset: 0 },
  { value: '2', finger: 'L2', region: 'numbers', row: 0, col: 1, offset: 0 },
  { value: '3', finger: 'L3', region: 'numbers', row: 0, col: 2, offset: 0 },
  { value: '4', finger: 'L4', region: 'numbers', row: 0, col: 3, offset: 0 },
  { value: '5', finger: 'L4', region: 'numbers', row: 0, col: 4, offset: 0 },
  { value: '6', finger: 'R4', region: 'numbers', row: 0, col: 5, offset: 0 },
  { value: '7', finger: 'R4', region: 'numbers', row: 0, col: 6, offset: 0 },
  { value: '8', finger: 'R3', region: 'numbers', row: 0, col: 7, offset: 0 },
  { value: '9', finger: 'R2', region: 'numbers', row: 0, col: 8, offset: 0 },
  { value: '0', finger: 'R1', region: 'numbers', row: 0, col: 9, offset: 0 },

  // Row 2 (Top letters) - offset right - 标准指法分配
  { value: 'q', finger: 'L1', region: 'left', row: 1, col: 0, offset: 15 },
  { value: 'w', finger: 'L2', region: 'left', row: 1, col: 1, offset: 15 },
  { value: 'e', finger: 'L3', region: 'left', row: 1, col: 2, offset: 15 },
  { value: 'r', finger: 'L4', region: 'left', row: 1, col: 3, offset: 15 },
  { value: 't', finger: 'L4', region: 'left', row: 1, col: 4, offset: 15 },
  { value: 'y', finger: 'R4', region: 'right', row: 1, col: 5, offset: 15 },
  { value: 'u', finger: 'R4', region: 'right', row: 1, col: 6, offset: 15 },
  { value: 'i', finger: 'R3', region: 'right', row: 1, col: 7, offset: 15 },
  { value: 'o', finger: 'R2', region: 'right', row: 1, col: 8, offset: 15 },
  { value: 'p', finger: 'R1', region: 'right', row: 1, col: 9, offset: 15 },

  // Row 3 (Home row) - offset right more - 标准指法分配
  { value: 'a', finger: 'L1', region: 'left', row: 2, col: 0, offset: 30 },
  { value: 's', finger: 'L2', region: 'left', row: 2, col: 1, offset: 30 },
  { value: 'd', finger: 'L3', region: 'left', row: 2, col: 2, offset: 30 },
  { value: 'f', finger: 'L4', region: 'left', row: 2, col: 3, offset: 30 },
  { value: 'g', finger: 'L4', region: 'left', row: 2, col: 4, offset: 30 },
  { value: 'h', finger: 'R4', region: 'right', row: 2, col: 5, offset: 30 },
  { value: 'j', finger: 'R4', region: 'right', row: 2, col: 6, offset: 30 },
  { value: 'k', finger: 'R3', region: 'right', row: 2, col: 7, offset: 30 },
  { value: 'l', finger: 'R2', region: 'right', row: 2, col: 8, offset: 30 },
  { value: ';', finger: 'R1', region: 'symbols', row: 2, col: 9, offset: 30 },

  // Row 4 (Bottom letters) - offset right even more - 标准指法分配
  { value: 'z', finger: 'L1', region: 'left', row: 3, col: 0, offset: 45 },
  { value: 'x', finger: 'L2', region: 'left', row: 3, col: 1, offset: 45 },
  { value: 'c', finger: 'L3', region: 'left', row: 3, col: 2, offset: 45 },
  { value: 'v', finger: 'L4', region: 'left', row: 3, col: 3, offset: 45 },
  { value: 'b', finger: 'L4', region: 'left', row: 3, col: 4, offset: 45 },
  { value: 'n', finger: 'R4', region: 'right', row: 3, col: 5, offset: 45 },
  { value: 'm', finger: 'R4', region: 'right', row: 3, col: 6, offset: 45 },
  { value: ',', finger: 'R3', region: 'symbols', row: 3, col: 7, offset: 45 },
  { value: '.', finger: 'R2', region: 'symbols', row: 3, col: 8, offset: 45 },
  { value: '/', finger: 'R1', region: 'symbols', row: 3, col: 9, offset: 45 },
];

export const WORD_LISTS = {
  beginner: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
             'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
             '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  intermediate: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
                 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
                 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'cat',
                 'dog', 'car', 'big', 'run', 'say', 'red', 'blue', 'green', 'play', 'work'],
  advanced: ['programming', 'development', 'keyboard', 'practice', 'computer', 'technology',
             'algorithm', 'interface', 'application', 'function', 'variable', 'constant',
             'database', 'network', 'security', 'software', 'hardware', 'memory', 'processor',
             'display', 'keyboard', 'mouse', 'monitor', 'printer', 'scanner', 'speaker', 'microphone'],
};

export const PRACTICE_TEXT = {
  beginner: 'The quick brown fox jumps over the lazy dog.',
  intermediate: 'Practice makes perfect. The more you type, the faster and more accurate you become.',
  advanced: 'In the middle of difficulty lies opportunity. Success is not final, failure is not fatal: it is the courage to continue that counts.',
};

export const DEFAULT_SETTINGS = {
  fontSize: 'medium',
  theme: 'light',
  soundEnabled: true,
};

export const FINGER_NAMES: Record<string, string> = {
  L1: '左手小指',
  L2: '左手无名指',
  L3: '左手中指',
  L4: '左手食指',
  R1: '右手小指',
  R2: '右手无名指',
  R3: '右手中指',
  R4: '右手食指',
};