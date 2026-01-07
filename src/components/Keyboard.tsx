import React from 'react';
import type { Key } from '../types';
import { KEYBOARD_LAYOUT, FINGER_NAMES } from '../constants';
import './Keyboard.css';

interface KeyboardProps {
  highlightedKey?: string;
  correctKey?: string;
  incorrectKey?: string;
  region: string;
}

const Keyboard: React.FC<KeyboardProps> = ({
  highlightedKey,
  correctKey,
  incorrectKey,
  region,
}) => {
  const getKeyClass = (key: Key): string => {
    const classes: string[] = ['key'];

    if (region === 'both') {
      classes.push('visible');
    } else if (region === 'letters') {
      // 纯字母区：只显示左手区和右手区的键
      if (key.region === 'left' || key.region === 'right') {
        classes.push('visible');
      } else {
        classes.push('hidden');
      }
    } else if (key.region === region) {
      classes.push('visible');
    } else {
      classes.push('hidden');
    }

    if (key.value === highlightedKey) {
      classes.push('highlighted');
    }

    if (key.value === correctKey) {
      classes.push('correct');
    }

    if (key.value === incorrectKey) {
      classes.push('incorrect');
    }

    return classes.join(' ');
  };

  return (
    <div className="keyboard">
      {[0, 1, 2, 3].map((row) => (
        <div
          key={row}
          className="keyboard-row"
          style={{ marginLeft: row > 0 ? `${row * 26}px` : '0' }}
        >
          {KEYBOARD_LAYOUT.filter((key) => key.row === row).map((key) => (
            <div
              key={key.value}
              className={getKeyClass(key)}
              data-key={key.value}
            >
              <div className="key-value">
                {key.value.match(/[a-z]/) ? (
                  <>
                    <span className="key-value-uppercase">{key.value.toUpperCase()}</span>
                    <span className="key-value-lowercase">{key.value}</span>
                  </>
                ) : (
                  key.value
                )}
              </div>
              <span className="key-finger">{FINGER_NAMES[key.finger]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;