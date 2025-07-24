'use client';

import { useState, useRef, useEffect } from 'react';
import type { User, ChatChannel, Message } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MessageCircle,
  Send,
  Users,
  Hash,
  Settings,
  UserPlus,
  MoreHorizontal
} from 'lucide-react';

interface ChatSystemProps {
  currentUser: User;
}

export default function ChatSystem({ currentUser }: ChatSystemProps) {
  const [activeChannel, setActiveChannel] = useState('general');
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels: ChatChannel[] = [
    {
      id: 'general',
      name: 'General',
      type: 'public',
      members: 156,
      unread: 0,
      requiredRole: 'Guest'
    },
    {
      id: 'announcements',
      name: 'Announcements',
      type: 'public',
      members: 156,
      unread: 3,
      requiredRole: 'Guest'
    },
    {
      id: 'it-support',
      name: 'IT Support',
      type: 'public',
      members: 45,
      unread: 1,
      requiredRole: 'Employee'
    },
    {
      id: 'management',
      name: 'Management',
      type: 'private',
      members: 12,
      unread: 0,
      requiredRole: 'Manager'
    },
    {
      id: 'admin',
      name: 'Admin Only',
      type: 'private',
      members: 3,
      unread: 0,
      requiredRole: 'Admin'
    },
    {
      id: 'sales-team',
      name: 'Sales Team',
      type: 'department',
      members: 25,
      unread: 2,
      requiredRole: 'Employee',
      department: 'Sales'
    },
    {
      id: 'marketing-team',
      name: 'Marketing Team',
      type: 'department',
      members: 18,
      unread: 0,
      requiredRole: 'Employee',
      department: 'Marketing'
    }
  ];

  const [messages, setMessages] = useState<Record<string, any[]>>({
    'general': [
      {
        id: 1,
        user: 'Sarah Johnson',
        role: 'Manager',
        message: 'Good morning everyone! Hope you all have a productive day.',
        timestamp: '09:15 AM',
        avatar: '/api/placeholder/32/32'
      },
      {
        id: 2,
        user: 'Mike Wilson',
        role: 'Employee',
        message: 'Thanks Sarah! Looking forward to the team meeting later.',
        timestamp: '09:18 AM',
        avatar: '/api/placeholder/32/32'
      },
      {
        id: 3,
        user: 'IT Department',
        role: 'Admin',
        message: 'Reminder: System maintenance tonight from 11 PM to 1 AM.',
        timestamp: '10:30 AM',
        avatar: '/api/placeholder/32/32',
        isSystem: true
      }
    ],
    'announcements': [
      {
        id: 1,
        user: 'HR Department',
        role: 'Admin',
        message: 'New employee orientation scheduled for next Monday at 9 AM.',
        timestamp: '08:00 AM',
        avatar: '/api/placeholder/32/32',
        isSystem: true
      }
    ],
    'it-support': [
      {
        id: 1,
        user: 'John Doe',
        role: 'Employee',
        message: 'Having issues with the VPN connection. Can someone help?',
        timestamp: '02:30 PM',
        avatar: '/api/placeholder/32/32'
      }
    ]
  });

  const canAccessChannel = (channel: any) => {
    const roleHierarchy = ['Guest', 'Employee', 'Manager', 'Admin'];
    const userRoleIndex = roleHierarchy.indexOf(currentUser.role);
    const requiredRoleIndex = roleHierarchy.indexOf(channel.requiredRole);
    
    if (userRoleIndex < requiredRoleIndex) return false;
    if (channel.department && channel.department !== currentUser.department) return false;
    
    return true;
  };

  const accessibleChannels = channels.filter(canAccessChannel);

  const currentChannelMessages = messages[activeChannel] || [];

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: (currentChannelMessages.length + 1),
        user: currentUser.name,
        role: currentUser.role,
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: '/api/placeholder/32/32'
      };

      setMessages(prev => ({
        ...prev,
        [activeChannel]: [...(prev[activeChannel] || []), newMessage]
      }));

      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChannelMessages]);

  const activeChannelInfo = channels.find(c => c.id === activeChannel);

  return (
    <div className="h-[calc(100vh-200px)] flex">
      {/* Channels Sidebar */}
      <div className="w-80 bg-background border-r border-border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Chat Channels</h3>
          <p className="text-sm text-muted-foreground">Role-based communication</p>
        </div>
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {accessibleChannels.map((channel) => (
              <Button
                key={channel.id}
                variant={activeChannel === channel.id ? "default" : "ghost"}
                className="w-full justify-start h-auto p-3"
                onClick={() => setActiveChannel(channel.id)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="flex items-center space-x-2">
                    {channel.type === 'private' ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      <Hash className="h-4 w-4" />
                    )}
                    <span className="font-medium">{channel.name}</span>
                  </div>
                  <div className="ml-auto flex items-center space-x-1">
                    {channel.unread > 0 && (
                      <Badge variant="destructive" className="text-xs h-5 min-w-[20px] rounded-full">
                        {channel.unread}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{channel.members}</span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {activeChannelInfo?.type === 'private' ? (
                <Users className="h-5 w-5" />
              ) : (
                <Hash className="h-5 w-5" />
              )}
              <div>
                <h3 className="font-semibold">{activeChannelInfo?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {activeChannelInfo?.members} members • {activeChannelInfo?.type} channel
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <UserPlus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentChannelMessages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.avatar} alt={msg.user} />
                  <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{msg.user}</span>
                    <Badge variant="outline" className="text-xs">
                      {msg.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                  </div>
                  <p className={`text-sm mt-1 ${msg.isSystem ? 'bg-blue-50 dark:bg-blue-950/30 p-2 rounded italic' : ''}`}>
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex items-center space-x-2">
            <Input
              placeholder={`Message #${activeChannelInfo?.name}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={sendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}