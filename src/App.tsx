import React, { useState } from 'react';
import type { Difficulty, KeyboardRegion, GameType, PracticeRecord, GameScore } from './types';
import KeyboardPractice from './components/KeyboardPractice';
import TypingPractice from './components/TypingPractice';
import FallingGame from './components/FallingGame';
import TimedGame from './components/TimedGame';
import ErrorKeyGame from './components/ErrorKeyGame';
import SettingsComponent from './components/Settings';
import Message from './components/Message';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('practice'); // 'practice', 'games', 'settings'
  const [practiceMode, setPracticeMode] = useState('keyboard'); // 'keyboard', 'typing', 'custom'
  const [keyboardRegion, setKeyboardRegion] = useState<KeyboardRegion>('both');
  const [typingDifficulty, setTypingDifficulty] = useState<Difficulty>('beginner');
  const [customText, setCustomText] = useState('');
  const [gameType, setGameType] = useState<GameType>('falling');
  const [gameDifficulty, setGameDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameDuration, setGameDuration] = useState<60 | 180>(60);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  // const [settings, setSettings] = useState<Settings>(getSettings());

  // Show message
  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setMessageType(type);
  };

  // Handle keyboard practice completion
  const handleKeyboardPracticeComplete = () => {
    showMessage('恭喜完成键盘熟悉练习！', 'success');
  };

  // Handle typing practice completion
  const handleTypingPracticeComplete = (record: PracticeRecord) => {
    showMessage(`练习完成！速度: ${record.wpm} WPM，准确率: ${record.accuracy}%，错误: ${record.errors}次`, 'success');
  };

  // Handle game completion
  const handleGameComplete = (score: GameScore) => {
    showMessage(`游戏结束！得分: ${score.score}`, 'success');
  };

  // Render practice content
  const renderPracticeContent = () => {
    switch (practiceMode) {
      case 'keyboard':
        return (
          <div className="practice-content">
            <div className="practice-controls">
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

      case 'typing':
        return (
          <div className="practice-content">
            <div className="practice-controls">
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
            </div>
            <TypingPractice
              difficulty={typingDifficulty}
              customText={customText.trim() || undefined}
              onComplete={handleTypingPracticeComplete}
            />
          </div>
        );

      case 'custom':
        return (
          <div className="practice-content">
            <div className="custom-text-controls">
              <label className="control-label">自定义练习文本:</label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="请输入你要练习的文本..."
                className="custom-textarea"
              />
            </div>
            {customText.trim() ? (
              <div className="custom-practice-controls">
                <button
                  className="save-button"
                  onClick={() => {
                    setPracticeMode('typing');
                  }}
                >
                  保存并开始练习
                </button>
              </div>
            ) : (
              <div className="empty-prompt">
                <h3>请输入练习文本</h3>
                <p>输入你想要练习的任意文本，程序将自动提取字符供你练习</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Render games content
  const renderGamesContent = () => {
    switch (gameType) {
      case 'falling':
        return (
          <div className="game-content">
            <div className="game-controls">
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
            </div>
            <FallingGame
              difficulty={gameDifficulty}
              region={keyboardRegion}
              onComplete={handleGameComplete}
            />
          </div>
        );

      case 'timed':
        return (
          <div className="game-content">
            <div className="game-controls">
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
            </div>
            <TimedGame
              duration={gameDuration}
              difficulty={typingDifficulty}
              onComplete={handleGameComplete}
            />
          </div>
        );

      case 'error':
        return (
          <div className="game-content">
            <div className="game-controls">
              <div className="target-controls">
                <label className="control-label">目标次数:</label>
                <select
                  value="20"
                  className="control-select"
                  disabled
                >
                  <option value="20">20次</option>
                </select>
              </div>
            </div>
            <ErrorKeyGame
              targetCount={20}
              onComplete={handleGameComplete}
            />
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
      <header className="app-header">
        <h1>打字练习程序</h1>
        <p>快速熟悉键盘 · 提升打字效率</p>
      </header>

      <nav className="app-nav">
        <div
          className={`nav-item ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <span>练习模式</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          <span>游戏模式</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span>设置</span>
        </div>
      </nav>

      <main className="app-main">
        {activeTab === 'practice' && (
          <div className="practice-section">
            <div className="practice-mode-tabs">
              <div
                className={`mode-tab ${practiceMode === 'keyboard' ? 'active' : ''}`}
                onClick={() => setPracticeMode('keyboard')}
              >
                键盘熟悉
              </div>
              <div
                className={`mode-tab ${practiceMode === 'typing' ? 'active' : ''}`}
                onClick={() => setPracticeMode('typing')}
              >
                打字练习
              </div>
              <div
                className={`mode-tab ${practiceMode === 'custom' ? 'active' : ''}`}
                onClick={() => setPracticeMode('custom')}
              >
                自定义练习
              </div>
            </div>
            {renderPracticeContent()}
          </div>
        )}

        {activeTab === 'games' && (
          <div className="games-section">
            <div className="game-mode-tabs">
              <div
                className={`mode-tab ${gameType === 'falling' ? 'active' : ''}`}
                onClick={() => setGameType('falling')}
              >
                键位下落消消乐
              </div>
              <div
                className={`mode-tab ${gameType === 'timed' ? 'active' : ''}`}
                onClick={() => setGameType('timed')}
              >
                限时打字挑战
              </div>
              <div
                className={`mode-tab ${gameType === 'error' ? 'active' : ''}`}
                onClick={() => setGameType('error')}
              >
                错误键位特训
              </div>
            </div>
            {renderGamesContent()}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <SettingsComponent onSettingsChange={() => {}} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>使用 React + TypeScript + Vite 开发</p>
      </footer>
    </div>
  );
};

export default App;