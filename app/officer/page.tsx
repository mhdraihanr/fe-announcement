'use client';

import { useState } from 'react';
import type { User } from '@/types';
import OfficerDirectory from '@/components/OfficerDirectory';

export default function OfficerPage() {
  const [currentUser] = useState<User>({
    id: 1,
    name: 'John Doe',
    role: 'Manager',
    position: 'Officer',
    department: 'Sales',
    avatar: '/api/placeholder/40/40'
  });

  return (
    <OfficerDirectory currentUser={currentUser} />
  );
}