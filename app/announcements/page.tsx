'use client';

import AnnouncementBoard from '@/components/AnnouncementBoard';
import { useUser } from '@/contexts/UserContext';

export default function AnnouncementsPage() {
  const { currentUser } = useUser();
  
  return (
    <AnnouncementBoard currentUser={currentUser} />
  );
}