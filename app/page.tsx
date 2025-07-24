'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/app/dashboard/page';

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: 'John Doe',
    role: 'Manager',
    position: 'Officer',
    department: 'Sales',
    avatar: '/api/placeholder/40/40'
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentUser={currentUser} 
        activeTab="dashboard" 
        setActiveTab={() => {}}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}