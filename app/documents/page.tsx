'use client';

import DocumentCenter from '@/components/DocumentCenter';
import { useUser } from '@/contexts/UserContext';

export default function DocumentsPage() {
  const { currentUser } = useUser();
  
  return (
    <DocumentCenter currentUser={currentUser} />
  );
}