"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '@/types';

interface UserContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: "John Doe",
    role: "VP",
    department: "Sales",
    avatar: "/avatar.jpeg",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2020-04-15",
    status: "active",
  });

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}