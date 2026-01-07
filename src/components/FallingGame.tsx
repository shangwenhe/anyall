import React, { useState, useEffect, useCallback } from 'react';
import type { GameScore } from '../types';
import { getHighScore, saveGameScore } from '../utils/storage';
import { KEYBOARD_LAYOUT } from '../constants';
import './FallingGame.css';

interface FallingGameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  region: string;
  onComplete: (score: GameScore) => void;
}

const FallingGame: React.FC<FallingGameProps> = ({
  difficulty,
  region,
  onComplete,
}) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [characters, setCharacters] = useState<Array<{
    id: string;
    value: string;
    x: number;
    y: number;
    speed: number;
  }>>([]);

  // Game constants
  const FALL_SPEEDS = { easy: 1, medium: 2, hard: 3 };
  const SPAWN_RATE = { easy: 1000, medium: 700, hard: 500 };
  const GROUND_LEVEL = 400;

  // Get keys for current region
  const regionKeys = KEYBOARD_LAYOUT.filter(
    (key) => region === 'both' || key.region === region
  ).map((key) => key.value);

  // Initialize high score
  useEffect(() => {
    const savedHighScore = getHighScore('falling', difficulty);
    setHighScore(savedHighScore);
  }, [difficulty]);

  // Spawn falling characters
  useEffect(() => {
    if (!gameActive || gamePaused || gameOver) return;

    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance to spawn
        spawnCharacter();
      }
    }, SPAWN_RATE[difficulty]);

    return () => clearInterval(spawnInterval);
  }, [gameActive, gamePaused, gameOver]);

  // Update falling characters
  useEffect(() => {
    if (!gameActive || gamePaused || gameOver) return;

    const updateInterval = setInterval(() => {
      setCharacters((prev) => {
        const updated = prev.map((char) => ({
          ...char,
          y: char.y + char.speed,
        }));

        // Check if any character hit the ground
        const hasGameOver = updated.some((char) => char.y >= GROUND_LEVEL);
        if (hasGameOver) {
          setGameOver(true);
          const scoreRecord: GameScore = {
            id: Date.now().toString(),
            gameType: 'falling',
            score,
            date: new Date().toISOString(),
            difficulty,
          };
          saveGameScore(scoreRecord);
          if (score > highScore) {
            setHighScore(score);
          }
          setTimeout(() => onComplete(scoreRecord), 1000);
        }

        // Remove characters that hit the ground
        return updated.filter((char) => char.y < GROUND_LEVEL);
      });
    }, 100);

    return () => clearInterval(updateInterval);
  }, [gameActive, gamePaused, gameOver]);

  // Spawn new character
  const spawnCharacter = () => {
    const value = regionKeys[Math.floor(Math.random() * regionKeys.length)];
    const newChar = {
      id: Date.now().toString() + Math.random().toString(),
      value,
      x: Math.random() * (window.innerWidth - 100) + 50,
      y: -50,
      speed: FALL_SPEEDS[difficulty],
    };
    setCharacters((prev) => [...prev, newChar]);
  };

  // Start game
  const startGame = () => {
    setGameActive(true);
    setGamePaused(false);
    setGameOver(false);
    setScore(0);
    setCharacters([]);
  };

  // Pause game
  const togglePause = () => {
    setGamePaused((prev) => !prev);
  };

  // Handle key press
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameActive || gamePaused || gameOver) return;

    const key = event.key.toLowerCase();
    const targetIndex = characters.findIndex((char) => char.value === key);

    if (targetIndex !== -1) {
      // Remove character
      setCharacters((prev) => prev.filter((_, index) => index !== targetIndex));
      setScore((prev) => prev + 10);
    }
  }, [characters, gameActive, gamePaused, gameOver]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="falling-game">
      <div className="game-header">
        <h2>键位下落消消乐</h2>
        <p>按对应键位消除下落的字符</p>
      </div>

      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">得分</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最高分</span>
          <span className="stat-value high">{highScore}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">当前难度</span>
          <span className="stat-value difficulty">{difficulty}</span>
        </div>
      </div>

      <div className="game-area">
        {characters.map((char) => (
          <div
            key={char.id}
            className="falling-char"
            style={{
              left: `${char.x}px`,
              top: `${char.y}px`,
              animation: `fall ${1000 / char.speed}ms linear infinite`,
            }}
          >
            {char.value}
          </div>
        ))}
        <div className="ground"></div>
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
          <h3>游戏结束</h3>
          <p>最终得分: {score}</p>
          {score === highScore && score > 0 && (
            <p className="new-record">新纪录！🎉</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FallingGame;