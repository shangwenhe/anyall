import React, { useEffect } from 'react';
import './Message.css';

interface MessageProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Message: React.FC<MessageProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className={`message message-${type}`}>
      <div className="message-content">
        <span>{message}</span>
        <button className="message-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Message;
