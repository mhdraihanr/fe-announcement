'use client';

import OfficerDirectory from '@/components/OfficerDirectory';
import { useUser } from '@/contexts/UserContext';

export default function OfficerPage() {
  const { currentUser } = useUser();
  
  return (
    <OfficerDirectory currentUser={currentUser} />
  );
}