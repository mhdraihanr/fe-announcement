'use client';

import CalendarView from '@/components/CalendarView';
import { useUser } from '@/contexts/UserContext';

export default function CalendarPage() {
  const { currentUser } = useUser();
  
  return (
    <CalendarView currentUser={currentUser} />
  );
}