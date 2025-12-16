import React, { useState, useEffect, useRef } from 'react';
import './FloatingChatbot.css';
import api from '@site/src/API/api';

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{id: number; text: string; isUser: boolean}>>([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you with the documentation?", isUser: false }
  ]);
  const nextId = useRef(2); // Start from 2 since we already have one message

  // Set mounted state after initial render to ensure client-side only rendering
  useEffect(() => {
    setIsMounted(true);

    // Get the current theme from the data-theme attribute on the html element
    const updateColorMode = () => {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-theme');
      setColorMode(currentTheme === 'dark' ? 'dark' : 'light');
    };

    // Initial update
    updateColorMode();

    // Create a MutationObserver to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme');
          setColorMode(newTheme === 'dark' ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onSendMessage = async (query:string) => {
    setInputValue(''); // Clear input after sending
    const response = await api.post("/api/chat",{message:query})
    console.log(response)
    return await response.data.reply
  }

  const handleSend = async () => {
    if (inputValue.trim() !== '') {
      // Add user message
      const userMessage = {
        id: nextId.current++,
        text: inputValue,
        isUser: true
      };

      setMessages(prev => [...prev, userMessage]);
      const result = await onSendMessage(inputValue)

      // In a real implementation, you would call the backend here
      // For now, we'll just add a simple response after a delay
      setTimeout(() => {
        const botMessage = {
          id: nextId.current++,
          text: result,
          isUser: false
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  // Don't render anything on the server to avoid hydration mismatches
  if (!isMounted) {
    return null;
  }

  return (
    <div className={`floating-chatbot ${colorMode}`}>
      {!isOpen ? (
        <button
          className="chatbot-icon"
          onClick={toggleChat}
          aria-label="Open chatbot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <circle cx="9" cy="8" r="1"/>
            <circle cx="15" cy="8" r="1"/>
            <path d="M8 12h.01"/>
            <path d="M14 12h.01"/>
          </svg>
        </button>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <span className="chat-title">AI Assistant</span>
            <div className="chat-actions">
              <button
                className="close-button"
                onClick={closeChat}
                aria-label="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="chat-content">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Type your question..."
              className="chat-input"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;