import React, { useState, useEffect, useRef } from 'react';
import type { Difficulty, PracticeRecord } from '../types';
import { calculateWPM, calculateAccuracy, generatePracticeContent } from '../utils/typing';
import { savePracticeRecord } from '../utils/storage';
import Keyboard from './Keyboard';
import './TypingPractice.css';

interface TypingPracticeProps {
  difficulty: Difficulty;
  customText?: string;
  onComplete: (record: PracticeRecord) => void;
}

const TypingPractice: React.FC<TypingPracticeProps> = ({
  difficulty,
  customText,
  onComplete,
}) => {
  const [targetText, setTargetText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    correct: 0,
    incorrect: 0,
  });
  const [highlightedKey, setHighlightedKey] = useState<string | undefined>();
  const [correctKey, setCorrectKey] = useState<string | undefined>();
  const [incorrectKey, setIncorrectKey] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate practice content
  useEffect(() => {
    const content = generatePracticeContent(difficulty, customText);
    setTargetText(content);
  }, [difficulty, customText]);

  // Focus input when clicking on text display
  const handleTextDisplayClick = () => {
    inputRef.current?.focus();
  };

  // Handle composition start (Chinese input method starts)
  const handleCompositionStart = () => {
    if (!isPracticeStarted) {
      setIsPracticeStarted(true);
      setStartTime(Date.now());
    }
  };

  // Handle composition end (Chinese input method completes)
  const handleCompositionEnd = (e: React.CompositionEvent) => {
    if (isPracticeComplete) return;

    const composedText = e.data;
    if (composedText) {
      setUserInput((prev) => {
        const newInput = prev + composedText;
        return newInput.slice(0, targetText.length);
      });
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPracticeStarted) {
      setIsPracticeStarted(true);
      setStartTime(Date.now());
    }

    if (isPracticeComplete) return;

    const inputValue = e.target.value;
    setUserInput(inputValue.slice(0, targetText.length));
  };

  // Handle keydown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isPracticeStarted) {
      setIsPracticeStarted(true);
      setStartTime(Date.now());
    }

    if (isPracticeComplete) return;

    setHighlightedKey(e.key);

    // Clear highlights after a short delay
    setTimeout(() => {
      setHighlightedKey(undefined);
      setCorrectKey(undefined);
      setIncorrectKey(undefined);
    }, 300);
  };

  // Handle key up for visual feedback
  const handleKeyUp = (e: React.KeyboardEvent) => {
    const key = e.key;

    if (key.length === 1 && userInput.length < targetText.length) {
      const expectedKey = targetText[userInput.length];
      if (key === expectedKey) {
        setCorrectKey(key);
        setIncorrectKey(undefined);
      } else {
        setIncorrectKey(key);
        setCorrectKey(undefined);
      }
    }
  };

  // Update statistics
  useEffect(() => {
    if (!isPracticeStarted || userInput.length === 0) return;

    const duration = Date.now() - startTime;
    let correctCount = 0;
    let incorrectCount = 0;

    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }

    const wpm = calculateWPM(correctCount, duration);
    const accuracy = calculateAccuracy(correctCount, userInput.length);

    setStats({
      wpm,
      accuracy,
      correct: correctCount,
      incorrect: incorrectCount,
    });

    // Check if practice is complete
    if (userInput.length === targetText.length) {
      setIsPracticeComplete(true);
      const record: PracticeRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration,
        wpm,
        accuracy,
        errors: incorrectCount,
        difficulty,
      };
      savePracticeRecord(record);
      setTimeout(() => onComplete(record), 500);
    }
  }, [userInput, isPracticeStarted]);

  // Get character classes for highlighting
  const getCharClass = (index: number): string => {
    if (index >= userInput.length) return '';
    return userInput[index] === targetText[index] ? 'correct' : 'incorrect';
  };

  return (
    <div className="typing-practice">
      <div className="practice-header">
        <h2>打字练习</h2>
        <p>请准确输入下方文本</p>
      </div>

      <div className="practice-stats">
        <div className="stat-item">
          <span className="stat-label">速度</span>
          <span className="stat-value">{stats.wpm} WPM</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">准确率</span>
          <span className="stat-value">{stats.accuracy}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">正确</span>
          <span className="stat-value correct">{stats.correct}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">错误</span>
          <span className="stat-value incorrect">{stats.incorrect}</span>
        </div>
      </div>

      <div
        className="text-display"
        onClick={handleTextDisplayClick}
      >
        <div className="target-text">
          {targetText.split('').map((char, index) => (
            <span
              key={index}
              className={`char ${getCharClass(index)} ${
                index === userInput.length ? 'current' : ''
              }`}
            >
              {char}
            </span>
          ))}
        </div>
        <div className="user-input">{userInput}</div>
        <input
          ref={inputRef}
          type="text"
          className="hidden-input"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          autoFocus
        />
      </div>

      {/* 键盘组件 */}
      <div className="keyboard-container">
        <Keyboard
          highlightedKey={highlightedKey}
          correctKey={correctKey}
          incorrectKey={incorrectKey}
          region="both"
        />
      </div>

      {!isPracticeStarted && (
        <div className="start-prompt">
          <h3>开始练习</h3>
          <p>点击文本区域开始输入...</p>
        </div>
      )}

      {isPracticeComplete && (
        <div className="complete-prompt">
          <h3>练习完成！</h3>
          <p>你的成绩已保存</p>
        </div>
      )}
    </div>
  );
};

export default TypingPractice;