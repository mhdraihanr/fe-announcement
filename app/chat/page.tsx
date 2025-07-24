'use client';

import ChatSystem from '@/components/ChatSystem';
import { useUser } from '@/contexts/UserContext';

export default function ChatPage() {
  const { currentUser } = useUser();
  
  return (
    <ChatSystem currentUser={currentUser} />
  );
}