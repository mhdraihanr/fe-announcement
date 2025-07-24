'use client';

import { useState } from 'react';
import type { User } from '@/types';
import ChatSystem from '@/components/ChatSystem';

export default function ChatPage() {
  const [currentUser] = useState<User>({
    id: 1,
    name: 'John Doe',
    role: 'Manager',
    position: 'Officer',
    department: 'Sales',
    avatar: '/api/placeholder/40/40'
  });

  return (
    <ChatSystem currentUser={currentUser} />
  );
}