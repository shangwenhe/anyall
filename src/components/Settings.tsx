import React, { useState, useEffect } from 'react';
import type { Settings as SettingsType } from '../types';
import { getSettings, saveSettings, clearAllData } from '../utils/storage';
import { DEFAULT_SETTINGS } from '../constants';
import Message from './Message';
import './Settings.css';

interface SettingsProps {
  onSettingsChange: (settings: SettingsType) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<SettingsType>({
    ...DEFAULT_SETTINGS,
  } as SettingsType);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Show message
  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setMessageType(type);
  };

  // Load settings from storage
  useEffect(() => {
    const savedSettings = getSettings();
    setSettings(savedSettings);
    onSettingsChange(savedSettings);
  }, []);

  // Update settings
  const updateSettings = (key: keyof SettingsType, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value,
    } as SettingsType;
    setSettings(newSettings);
    saveSettings(newSettings);
    onSettingsChange(newSettings);
  };

  // Clear all data
  const handleClearData = () => {
    if (window.confirm('确定要清空所有练习记录和游戏数据吗？此操作无法撤销！')) {
      clearAllData();
      showMessage('所有数据已清空！', 'success');
    }
  };

  return (
    <div className="settings">
      <Message
        message={message}
        type={messageType}
        onClose={() => setMessage(null)}
      />
      <div className="settings-header">
        <h2>设置</h2>
        <p>配置打字练习程序的偏好设置</p>
      </div>

      <div className="settings-content">
        <div className="setting-section">
          <h3>界面设置</h3>

          <div className="setting-item">
            <label className="setting-label">字体大小</label>
            <div className="setting-control">
              <select
                value={settings.fontSize}
                onChange={(e) => updateSettings('fontSize', e.target.value)}
                className="setting-select"
              >
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
              </select>
            </div>
          </div>

          <div className="setting-item">
            <label className="setting-label">主题</label>
            <div className="setting-control">
              <select
                value={settings.theme}
                onChange={(e) => updateSettings('theme', e.target.value)}
                className="setting-select"
              >
                <option value="light">浅色</option>
                <option value="dark">深色</option>
              </select>
            </div>
          </div>
        </div>

        <div className="setting-section">
          <h3>音效设置</h3>

          <div className="setting-item">
            <label className="setting-label">按键音效</label>
            <div className="setting-control">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSettings('soundEnabled', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="setting-section">
          <h3>数据管理</h3>

          <div className="setting-item">
            <label className="setting-label">数据清理</label>
            <div className="setting-control">
              <button
                className="btn-danger"
                onClick={handleClearData}
              >
                清空所有数据
              </button>
            </div>
            <div className="setting-description">
              清空所有练习记录、游戏最高分和错误键位统计
            </div>
          </div>
        </div>

        <div className="setting-section">
          <h3>关于</h3>

          <div className="setting-item">
            <div className="setting-control">
              <div className="about-info">
                <p>打字练习程序 v1.0</p>
                <p>帮助你快速熟悉键盘布局并提升打字效率</p>
                <p>使用 React + TypeScript + Vite 开发</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;