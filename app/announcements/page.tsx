'use client';

import { useState } from 'react';
import type { User } from '@/types';
import AnnouncementBoard from '@/components/AnnouncementBoard';

export default function AnnouncementsPage() {
  const [currentUser] = useState<User>({
    id: 1,
    name: 'John Doe',
    role: 'Manager',
    position: 'Officer',
    department: 'Sales',
    avatar: '/api/placeholder/40/40'
  });

  return (
    <AnnouncementBoard currentUser={currentUser} />
  );
}