'use client';

import Analytics from '@/components/Analytics';
import { useUser } from '@/contexts/UserContext';

export default function AnalyticsPage() {
  const { currentUser } = useUser();
  
  return (
    <Analytics currentUser={currentUser} />
  );
}