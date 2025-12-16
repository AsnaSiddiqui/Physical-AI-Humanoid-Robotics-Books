import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import FloatingChatbot from '../components/Chatbot/FloatingChatbot';

type LayoutProps = {
  children: React.ReactNode;
  [key: string]: any;
};

export default function Layout(props: LayoutProps) {
  return (
    <>
      <OriginalLayout {...props}>{props.children}</OriginalLayout>
      <FloatingChatbot />
    </>
  );
}