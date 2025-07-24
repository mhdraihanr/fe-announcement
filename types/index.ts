export interface User {
  id: number;
  name: string;
  role: 'Admin' | 'Manager' | 'Employee' | 'Guest';
  position: 'Staff' | 'Officer' | 'VP' | 'SVP' | 'CEO';
  department: string;
  avatar: string;
  email?: string;
  phone?: string;
  joinDate?: string;
  reportingTo?: string;
}

export interface Officer {
  id: number;
  name: string;
  position: 'Staff' | 'Officer' | 'VP' | 'SVP' | 'CEO';
  department: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  reportingTo?: string;
  directReports?: number;
  status: 'active' | 'inactive' | 'on-leave';
}

export interface Document {
  id: number;
  name: string;
  type: 'pdf' | 'document' | 'spreadsheet' | 'image';
  size: string;
  uploadedBy: string;
  uploadDate: string;
  accessLevel: 'Admin' | 'Manager' | 'Employee' | 'Guest';
  department: string;
  downloads: number;
  views: number;
  shared: boolean;
}

export interface Message {
  id: number;
  user: string;
  role: string;
  message: string;
  timestamp: string;
  avatar: string;
  isSystem?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'department';
  members: number;
  unread: number;
  requiredRole: 'Admin' | 'Manager' | 'Employee' | 'Guest';
  department?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'meeting' | 'presentation' | 'training' | 'maintenance';
  organizer: string;
  attendees: string[];
  department: string;
  isPrivate: boolean;
  color: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  department: string;
  priority: 'high' | 'medium' | 'low';
  pinned: boolean;
  date: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  readBy: number[];
  viewers: Array<{
    userId: number;
    name: string;
    avatar: string;
    readAt: string;
    department: string;
    role: string;
  }>;
}

export interface Notification {
  id: number;
  title: string;
  time: string;
  unread: boolean;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: any;
  action: () => void;
}

export interface Stat {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}