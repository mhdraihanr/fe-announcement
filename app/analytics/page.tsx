'use client';

import { useState } from 'react';
import type { User } from '@/types';
import Analytics from '@/components/Analytics';

export default function AnalyticsPage() {
  const [currentUser] = useState<User>({
    id: 1,
    name: 'John Doe',
    role: 'Manager',
    position: 'Officer',
    department: 'Sales',
    avatar: '/api/placeholder/40/40'
  });

  return (
    <Analytics currentUser={currentUser} />
  );
}