'use client';

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { User } from '@/types';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/providers/theme-provider';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: 'John Doe',
    role: 'Manager',
    position: 'Officer',
    department: 'Sales',
    avatar: '/api/placeholder/40/40'
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const pathname = usePathname();
  
  useEffect(() => {
    // Set active tab based on current pathname
    const pathSegments = pathname.split('/');
    const currentPage = pathSegments[1] || 'dashboard';
    setActiveTab(currentPage);
  }, [pathname]);
  
  // Check if current page should show sidebar (exclude root page)
  const shouldShowSidebar = pathname !== '/';
  
  if (!shouldShowSidebar) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen bg-background">
            <Sidebar 
              currentUser={currentUser} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
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
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
