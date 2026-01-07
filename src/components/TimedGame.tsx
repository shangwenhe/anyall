import React, { useState, useEffect, useCallback } from 'react';
import type { GameScore, Difficulty } from '../types';
import { calculateWPM, calculateAccuracy, generatePracticeContent } from '../utils/typing';
import { getHighScore, saveGameScore } from '../utils/storage';
import './TimedGame.css';

interface TimedGameProps {
  duration: 60 | 180; // 1 minute or 3 minutes in seconds
  difficulty: Difficulty;
  onComplete: (score: GameScore) => void;
}

const TimedGame: React.FC<TimedGameProps> = ({
  duration,
  difficulty,
  onComplete,
}) => {
  const [targetText, setTargetText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    correct: 0,
    incorrect: 0,
  });
  const [highScore, setHighScore] = useState(0);

  // Initialize high score
  useEffect(() => {
    const savedHighScore = getHighScore('timed', `${difficulty}-${duration}`);
    setHighScore(savedHighScore);
  }, [difficulty, duration]);

  // Generate practice content
  const generateContent = useCallback(() => {
    const content = generatePracticeContent(difficulty);
    setTargetText(content);
  }, [difficulty]);

  // Start game
  const startGame = () => {
    setGameActive(true);
    setGamePaused(false);
    setGameOver(false);
    setUserInput('');
    setTimeLeft(duration);
    generateContent();
  };

  // Pause game
  const togglePause = () => {
    setGamePaused((prev) => !prev);
  };

  // Update timer
  useEffect(() => {
    if (!gameActive || gamePaused || gameOver) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          const finalStats = calculateFinalStats();
          const scoreRecord: GameScore = {
            id: Date.now().toString(),
            gameType: 'timed',
            score: finalStats.wpm,
            date: new Date().toISOString(),
            difficulty: `${difficulty}-${duration}`,
          };
          saveGameScore(scoreRecord);
          if (finalStats.wpm > highScore) {
            setHighScore(finalStats.wpm);
          }
          setTimeout(() => onComplete(scoreRecord), 1000);
          return 0 as 60 | 180;
        }
        return (prev - 1) as 60 | 180;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameActive, gamePaused, gameOver]);

  // Calculate final statistics
  const calculateFinalStats = () => {
    let correctCount = 0;
    let incorrectCount = 0;

    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }

    const wpm = calculateWPM(correctCount, duration * 1000);
    const accuracy = calculateAccuracy(correctCount, userInput.length);

    return { wpm, accuracy, correct: correctCount, incorrect: incorrectCount };
  };

  // Handle key press
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameActive || gamePaused || gameOver) return;

    const key = event.key;

    if (key === 'Backspace') {
      setUserInput((prev) => prev.slice(0, -1));
    } else if (key.length === 1 && userInput.length < targetText.length) {
      setUserInput((prev) => prev + key);
    }
  }, [gameActive, gamePaused, gameOver, userInput, targetText]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Update real-time statistics
  useEffect(() => {
    if (!gameActive || userInput.length === 0) return;

    let correctCount = 0;
    let incorrectCount = 0;

    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }

    const timeElapsed = duration - timeLeft;
    const wpm = timeElapsed > 0 ? calculateWPM(correctCount, timeElapsed * 1000) : 0;
    const accuracy = calculateAccuracy(correctCount, userInput.length);

    setStats({ wpm, accuracy, correct: correctCount, incorrect: incorrectCount });
  }, [userInput, gameActive, timeLeft]);

  // Get character classes for highlighting
  const getCharClass = (index: number): string => {
    if (index >= userInput.length) return '';
    return userInput[index] === targetText[index] ? 'correct' : 'incorrect';
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timed-game">
      <div className="game-header">
        <h2>限时打字挑战</h2>
        <p>在{duration / 60}分钟内尽可能准确地输入文本</p>
      </div>

      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">时间</span>
          <span className="stat-value time">{formatTime(timeLeft)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">速度</span>
          <span className="stat-value">{stats.wpm} WPM</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">准确率</span>
          <span className="stat-value">{stats.accuracy}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最高分</span>
          <span className="stat-value high">{highScore} WPM</span>
        </div>
      </div>

      <div className="text-display">
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
      </div>

      <div className="game-controls">
        {!gameActive ? (
          <button className="btn-primary" onClick={startGame}>
            开始游戏
          </button>
        ) : gameOver ? (
          <button className="btn-primary" onClick={startGame}>
            重新开始
          </button>
        ) : (
          <button className="btn-secondary" onClick={togglePause}>
            {gamePaused ? '继续' : '暂停'}
          </button>
        )}
      </div>

      {gamePaused && (
        <div className="game-paused">
          <h3>游戏暂停</h3>
          <p>按暂停按钮继续</p>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h3>时间到！</h3>
          <p>最终速度: {stats.wpm} WPM</p>
          <p>准确率: {stats.accuracy}%</p>
          {stats.wpm === highScore && stats.wpm > 0 && (
            <p className="new-record">新纪录！🎉</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TimedGame;