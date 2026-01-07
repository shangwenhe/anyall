import React, { useState } from 'react';
import type { Difficulty, KeyboardRegion, GameType, PracticeRecord, GameScore } from './types';
import TypingPractice from './components/TypingPractice';
import KeyboardPractice from './components/KeyboardPractice';
import FallingGame from './components/FallingGame';
import TimedGame from './components/TimedGame';
import ErrorKeyGame from './components/ErrorKeyGame';
import SettingsComponent from './components/Settings';
import Message from './components/Message';
import './App.css';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('typing'); // 'typing', 'keyboard', 'games', 'settings'
  const [typingDifficulty, setTypingDifficulty] = useState<Difficulty>('beginner');
  const [keyboardRegion, setKeyboardRegion] = useState<KeyboardRegion>('both');
  const [gameType, setGameType] = useState<GameType>('falling');
  const [gameDifficulty, setGameDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameDuration, setGameDuration] = useState<60 | 180>(60);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Show message
  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setMessageType(type);
  };

  // Handle typing practice completion
  const handleTypingPracticeComplete = (record: PracticeRecord) => {
    showMessage(`练习完成！速度: ${record.wpm} WPM，准确率: ${record.accuracy}%，错误: ${record.errors}次`, 'success');
  };

  // Handle keyboard practice completion
  const handleKeyboardPracticeComplete = () => {
    showMessage('恭喜完成键盘熟悉练习！', 'success');
  };

  // Handle game completion
  const handleGameComplete = (score: GameScore) => {
    showMessage(`游戏结束！得分: ${score.score}`, 'success');
  };

  // Render active view
  const renderActiveView = () => {
    switch (activeView) {
      case 'typing':
        return (
          <div className="main-content">
            <div className="quick-controls">
              <div className="difficulty-controls">
                <label className="control-label">难度:</label>
                <select
                  value={typingDifficulty}
                  onChange={(e) => setTypingDifficulty(e.target.value as Difficulty)}
                  className="control-select"
                >
                  <option value="beginner">初级</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                </select>
              </div>
              <div className="custom-input-controls">
                <button
                  className="custom-input-button"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                >
                  {showCustomInput ? '关闭自定义' : '自定义输入'}
                </button>
              </div>
              {showCustomInput && (
                <div className="custom-text-input">
                  <label className="control-label">自定义练习文本:</label>
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="请输入你要练习的文本..."
                    className="custom-textarea"
                  />
                  <button
                    className="confirm-button"
                    onClick={() => {
                      setShowCustomInput(false);
                      showMessage('自定义练习文本已设置', 'info');
                    }}
                  >
                    确认
                  </button>
                </div>
              )}
            </div>
            <TypingPractice
              difficulty={typingDifficulty}
              customText={customText.trim() || undefined}
              onComplete={handleTypingPracticeComplete}
            />
          </div>
        );

      case 'keyboard':
        return (
          <div className="main-content">
            <div className="quick-controls">
              <div className="region-controls">
                <label className="control-label">练习区域:</label>
                <select
                  value={keyboardRegion}
                  onChange={(e) => setKeyboardRegion(e.target.value as KeyboardRegion)}
                  className="control-select"
                >
                  <option value="both">全部字母区</option>
                  <option value="letters">纯字母区</option>
                  <option value="left">左手区</option>
                  <option value="right">右手区</option>
                  <option value="numbers">数字区</option>
                  <option value="symbols">符号区</option>
                </select>
              </div>
            </div>
            <KeyboardPractice
              region={keyboardRegion}
              onComplete={handleKeyboardPracticeComplete}
            />
          </div>
        );

      case 'games':
        return (
          <div className="main-content">
            <div className="quick-controls">
              <div className="game-type-controls">
                <label className="control-label">游戏类型:</label>
                <select
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value as GameType)}
                  className="control-select"
                >
                  <option value="falling">键位下落消消乐</option>
                  <option value="timed">限时打字挑战</option>
                  <option value="error">错误键位特训</option>
                </select>
              </div>
              {gameType === 'falling' && (
                <>
                  <div className="difficulty-controls">
                    <label className="control-label">难度:</label>
                    <select
                      value={gameDifficulty}
                      onChange={(e) => setGameDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                      className="control-select"
                    >
                      <option value="easy">简单</option>
                      <option value="medium">中等</option>
                      <option value="hard">困难</option>
                    </select>
                  </div>
                  <div className="region-controls">
                    <label className="control-label">练习区域:</label>
                    <select
                      value={keyboardRegion}
                      onChange={(e) => setKeyboardRegion(e.target.value as KeyboardRegion)}
                      className="control-select"
                    >
                      <option value="both">全部字母区</option>
                      <option value="letters">纯字母区</option>
                      <option value="left">左手区</option>
                      <option value="right">右手区</option>
                      <option value="numbers">数字区</option>
                      <option value="symbols">符号区</option>
                    </select>
                  </div>
                </>
              )}
              {gameType === 'timed' && (
                <>
                  <div className="duration-controls">
                    <label className="control-label">时间:</label>
                    <select
                      value={gameDuration}
                      onChange={(e) => setGameDuration(parseInt(e.target.value) as 60 | 180)}
                      className="control-select"
                    >
                      <option value={60}>1分钟</option>
                      <option value={180}>3分钟</option>
                    </select>
                  </div>
                  <div className="difficulty-controls">
                    <label className="control-label">难度:</label>
                    <select
                      value={typingDifficulty}
                      onChange={(e) => setTypingDifficulty(e.target.value as Difficulty)}
                      className="control-select"
                    >
                      <option value="beginner">初级</option>
                      <option value="intermediate">中级</option>
                      <option value="advanced">高级</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            {gameType === 'falling' && (
              <FallingGame
                difficulty={gameDifficulty}
                region={keyboardRegion}
                onComplete={handleGameComplete}
              />
            )}
            {gameType === 'timed' && (
              <TimedGame
                duration={gameDuration}
                difficulty={typingDifficulty}
                onComplete={handleGameComplete}
              />
            )}
            {gameType === 'error' && (
              <ErrorKeyGame
                targetCount={20}
                onComplete={handleGameComplete}
              />
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="main-content">
            <SettingsComponent onSettingsChange={() => {}} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Message
        message={message}
        type={messageType}
        onClose={() => setMessage(null)}
      />

      <div className="app-header-container">
        <header className="app-header">
          <h1>打字练习程序</h1>
          <p>快速开始，提升打字效率</p>
        </header>

        <nav className="app-nav">
          <div
            className={`nav-item ${activeView === 'typing' ? 'active' : ''}`}
            onClick={() => setActiveView('typing')}
          >
            <span>打字练习</span>
          </div>
          <div
            className={`nav-item ${activeView === 'keyboard' ? 'active' : ''}`}
            onClick={() => setActiveView('keyboard')}
          >
            <span>键盘熟悉</span>
          </div>
          <div
            className={`nav-item ${activeView === 'games' ? 'active' : ''}`}
            onClick={() => setActiveView('games')}
          >
            <span>游戏模式</span>
          </div>
          <div
            className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveView('settings')}
          >
            <span>设置</span>
          </div>
        </nav>
      </div>

      <main className="app-main">
        {renderActiveView()}
      </main>

      <footer className="app-footer">
        <p>使用 React + TypeScript + Vite 开发</p>
      </footer>
    </div>
  );
};

export default App;