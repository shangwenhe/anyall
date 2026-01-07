import React, { useState, useEffect, useCallback } from 'react';
import type { GameScore } from '../types';
import { getTopErrorKeys, saveGameScore } from '../utils/storage';
import { generateErrorKeyPractice } from '../utils/typing';
import './ErrorKeyGame.css';

interface ErrorKeyGameProps {
  targetCount: number;
  onComplete: (score: GameScore) => void;
}

const ErrorKeyGame: React.FC<ErrorKeyGameProps> = ({
  targetCount,
  onComplete,
}) => {
  const [errorKeys, setErrorKeys] = useState<string[]>([]);
  const [practiceContent, setPracticeContent] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  // Get error keys from storage
  useEffect(() => {
    const keys = getTopErrorKeys(5);
    setErrorKeys(keys);
  }, []);

  // Generate practice content based on error keys
  const generateContent = useCallback(() => {
    const content = generateErrorKeyPractice(errorKeys, targetCount * 2);
    setPracticeContent(content);
  }, [errorKeys]);

  // Start game
  const startGame = () => {
    setGameActive(true);
    setGameComplete(false);
    setUserInput('');
    setCorrectCount(0);
    setIncorrectCount(0);
    generateContent();
  };

  // Handle key press
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameActive || gameComplete) return;

    const key = event.key.toLowerCase();

    if (key === 'Backspace') {
      setUserInput((prev) => prev.slice(0, -1));
    } else if (key.length === 1 && userInput.length < practiceContent.length) {
      setUserInput((prev) => prev + key);
    }
  }, [gameActive, gameComplete, userInput, practiceContent]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Update statistics
  useEffect(() => {
    if (!gameActive || userInput.length === 0) return;

    let newCorrectCount = 0;
    let newIncorrectCount = 0;

    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === practiceContent[i]) {
        newCorrectCount++;
      } else {
        newIncorrectCount++;
      }
    }

    setCorrectCount(newCorrectCount);
    setIncorrectCount(newIncorrectCount);

    // Check if target count is reached
    if (newCorrectCount >= targetCount) {
      setGameComplete(true);
      const scoreRecord: GameScore = {
        id: Date.now().toString(),
        gameType: 'error',
        score: targetCount,
        date: new Date().toISOString(),
        difficulty: 'special',
      };
      saveGameScore(scoreRecord);
      setTimeout(() => onComplete(scoreRecord), 1000);
    }
  }, [userInput, gameActive]);

  // Get character classes for highlighting
  const getCharClass = (index: number): string => {
    if (index >= userInput.length) return '';
    return userInput[index] === practiceContent[index] ? 'correct' : 'incorrect';
  };

  return (
    <div className="error-key-game">
      <div className="game-header">
        <h2>错误键位特训</h2>
        <p>重点练习你最容易出错的键位</p>
      </div>

      {errorKeys.length > 0 ? (
        <>
          <div className="error-keys-info">
            <h4>需要重点练习的键位：</h4>
            <div className="error-keys">
              {errorKeys.map((key) => (
                <span key={key} className="error-key">
                  {key}
                </span>
              ))}
            </div>
          </div>

          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">正确</span>
              <span className="stat-value correct">{correctCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">目标</span>
              <span className="stat-value target">{targetCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">错误</span>
              <span className="stat-value incorrect">{incorrectCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">准确率</span>
              <span className="stat-value">
                {userInput.length > 0
                  ? Math.round((correctCount / userInput.length) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>

          <div className="text-display">
            <div className="target-text">
              {practiceContent.split('').map((char, index) => (
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
          </div>

          <div className="game-controls">
            {!gameActive ? (
              <button className="btn-primary" onClick={startGame}>
                开始特训
              </button>
            ) : gameComplete ? (
              <button className="btn-primary" onClick={startGame}>
                重新开始
              </button>
            ) : (
              <button className="btn-secondary" onClick={() => setGameActive(false)}>
                停止练习
              </button>
            )}
          </div>

          {gameComplete && (
            <div className="game-complete">
              <h3>特训完成！🎉</h3>
              <p>你已经成功完成了目标</p>
              <p>准确率: {Math.round((correctCount / (correctCount + incorrectCount)) * 100)}%</p>
            </div>
          )}
        </>
      ) : (
        <div className="no-errors">
          <h3>没有找到错误键位</h3>
          <p>继续练习以收集错误统计</p>
        </div>
      )}
    </div>
  );
};

export default ErrorKeyGame;