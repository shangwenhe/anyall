import React, { useState, useEffect, useCallback } from 'react';
import Keyboard from './Keyboard';
import type { KeyboardRegion } from '../types';
import { KEYBOARD_LAYOUT } from '../constants';
import './KeyboardPractice.css';

interface KeyboardPracticeProps {
  region: KeyboardRegion;
  onComplete: () => void;
}

const KeyboardPractice: React.FC<KeyboardPracticeProps> = ({
  region,
  onComplete,
}) => {
  const [currentKey, setCurrentKey] = useState<string>('');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Get keys for current region
  const regionKeys = KEYBOARD_LAYOUT.filter(
    (key) => {
      if (region === 'both') {
        return true;
      } else if (region === 'letters') {
        return key.region === 'left' || key.region === 'right';
      } else {
        return key.region === region;
      }
    }
  ).map((key) => key.value);

  // Start new practice
  const startNewPractice = useCallback(() => {
    const randomKey = regionKeys[Math.floor(Math.random() * regionKeys.length)];
    setCurrentKey(randomKey);
    setFeedback(null);
  }, [regionKeys]);

  // Initialize practice
  useEffect(() => {
    startNewPractice();
  }, [region]);

  // Handle key press
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const pressedKey = event.key.toLowerCase();
    const targetKey = currentKey.toLowerCase();

    if (pressedKey === targetKey) {
      setCorrectCount((prev) => prev + 1);
      setFeedback('correct');
      setTimeout(() => {
        if (correctCount + 1 >= 30) {
          onComplete();
        } else {
          startNewPractice();
        }
      }, 500);
    } else {
      setIncorrectCount((prev) => prev + 1);
      setFeedback('incorrect');
    }
  }, [currentKey, correctCount]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="keyboard-practice">
      <div className="practice-header">
        <h2>键盘熟悉练习</h2>
        <p>请按下屏幕高亮的键位</p>
      </div>

      <div className="practice-stats">
        <div className="stat-item">
          <span className="stat-label">正确</span>
          <span className="stat-value correct">{correctCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">错误</span>
          <span className="stat-value incorrect">{incorrectCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">进度</span>
          <span className="stat-value">{Math.min(correctCount + incorrectCount, 30)}/30</span>
        </div>
      </div>

      <div className="keyboard-container">
        <Keyboard
          highlightedKey={currentKey}
          correctKey={feedback === 'correct' ? currentKey : undefined}
          incorrectKey={feedback === 'incorrect' ? currentKey : undefined}
          region={region}
        />
      </div>

      <div className="practice-tips">
        <h4>练习提示：</h4>
        <ul>
          <li>保持正确的打字姿势</li>
          <li>眼睛看屏幕，不要看键盘</li>
          <li>使用指定的手指敲击对应键位</li>
          <li>尽量保持节奏稳定</li>
        </ul>
      </div>
    </div>
  );
};

export default KeyboardPractice;