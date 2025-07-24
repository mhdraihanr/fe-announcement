'use client';

import { useState } from 'react';
import type { User } from '@/types';
import CalendarView from '@/components/CalendarView';

export default function CalendarPage() {
  const [currentUser] = useState<User>({
    id: 1,
    name: 'John Doe',
    role: 'Manager',
    position: 'Officer',
    department: 'Sales',
    avatar: '/api/placeholder/40/40'
  });

  return (
    <CalendarView currentUser={currentUser} />
  );
}