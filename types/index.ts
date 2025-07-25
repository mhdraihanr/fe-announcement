export interface User {
  id: number;
  name: string;
  role: "Admin" | "SVP" | "VP" | "Officer" | "Employee";
  department: string;
  avatar: string;
  email?: string;
  phone?: string;
  joinDate?: string;
  status?: "active" | "inactive" | "on-leave";
}

export interface Officer {
  id: number;
  name: string;
  position: "Admin" | "SVP" | "VP" | "Officer" | "Employee";
  department: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  reportingTo?: string;
  directReports?: number;
  status: "active" | "inactive" | "on-leave";
}

export interface Document {
  id: number;
  name: string;
  type: "pdf" | "document" | "spreadsheet" | "image";
  size: string;
  uploadedBy: string;
  uploadDate: string;
  accessLevel: "Administrator" | "SVP" | "VP" | "Officer" | "Employee";
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
  type: "public" | "private" | "department";
  members: number;
  unread: number;
  requiredRole: "Admin" | "SVP" | "VP" | "Officer" | "Employee";
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
  type: "meeting" | "presentation" | "training" | "maintenance";
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
  accessLevel: "Admin" | "SVP" | "VP" | "Officer" | "Employee";
  priority: "high" | "medium" | "low";
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
  imageUrl?: string;
  linkUrl?: string;
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
