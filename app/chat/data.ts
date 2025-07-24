import type { ChatChannel } from "@/types";

export const initialChannels: ChatChannel[] = [
  {
    id: "general",
    name: "General",
    type: "public",
    members: 156,
    unread: 0,
    requiredRole: "Employee",
  },
  {
    id: "it-support",
    name: "IT Support",
    type: "public",
    members: 45,
    unread: 1,
    requiredRole: "Employee",
  },
  {
    id: "management",
    name: "Management",
    type: "private",
    members: 12,
    unread: 0,
    requiredRole: "Officer",
  },
  {
    id: "admin",
    name: "Admin Only",
    type: "private",
    members: 3,
    unread: 0,
    requiredRole: "Admin",
  },
  {
    id: "sales-team",
    name: "Sales Team",
    type: "department",
    members: 25,
    unread: 2,
    requiredRole: "Employee",
    department: "Sales",
  },
  {
    id: "marketing-team",
    name: "Marketing Team",
    type: "department",
    members: 18,
    unread: 0,
    requiredRole: "Employee",
    department: "Marketing",
  },
];

export const initialMessages: Record<string, any[]> = {
  general: [
    {
      id: 1,
      user: "Sarah Johnson",
      role: "VP",
      message: "Good morning everyone! Hope you all have a productive day.",
      timestamp: "09:15 AM",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 2,
      user: "Mike Wilson",
      role: "Employee",
      message: "Thanks Sarah! Looking forward to the team meeting later.",
      timestamp: "09:18 AM",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 3,
      user: "IT Department",
      role: "Admin",
      message: "Reminder: System maintenance tonight from 11 PM to 1 AM.",
      timestamp: "10:30 AM",
      avatar: "/api/placeholder/32/32",
      isSystem: true,
    },
  ],
};