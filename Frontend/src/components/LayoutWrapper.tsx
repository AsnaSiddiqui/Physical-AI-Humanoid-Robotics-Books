import React from 'react';
import FloatingChatbot from './Chatbot/FloatingChatbot';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <FloatingChatbot />
    </>
  );
};

export default LayoutWrapper;