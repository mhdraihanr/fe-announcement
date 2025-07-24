'use client';

import { useState } from 'react';
import type { User } from '@/types';
import DocumentCenter from '@/components/DocumentCenter';

export default function DocumentsPage() {
  const [currentUser] = useState<User>({
    id: 1,
    name: 'John Doe',
    role: 'Manager',
    position: 'Officer',
    department: 'Sales',
    avatar: '/api/placeholder/40/40'
  });

  return (
    <DocumentCenter currentUser={currentUser} />
  );
}