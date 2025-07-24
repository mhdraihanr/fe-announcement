'use client';

import { useState } from 'react';
import type { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  BarChart3,
  Eye,
  FileText,
  Bell,
  Users,
  TrendingUp,
  Calendar,
  Download
} from 'lucide-react';

interface AnalyticsProps {
  currentUser: User;
}

interface ViewAnalytics {
  id: number;
  title: string;
  type: 'announcement' | 'document';
  views: number;
  uniqueViews: number;
  department: string;
  createdDate: string;
  viewers: Array<{
    name: string;
    avatar: string;
    viewedAt: string;
    department: string;
    role: string;
  }>;
}

export default function Analytics({ currentUser }: AnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedType, setSelectedType] = useState('all');

  const analyticsData: ViewAnalytics[] = [
    {
      id: 1,
      title: 'System Maintenance Scheduled',
      type: 'announcement',
      views: 145,
      uniqueViews: 89,
      department: 'IT',
      createdDate: '2024-03-08',
      viewers: [
        {
          name: 'Sarah Johnson',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-08 09:15',
          department: 'Marketing',
          role: 'Manager'
        },
        {
          name: 'Mike Wilson',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-08 09:30',
          department: 'Sales',
          role: 'Employee'
        },
        {
          name: 'Emily Davis',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-08 10:45',
          department: 'Finance',
          role: 'Manager'
        },
        {
          name: 'John Smith',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-08 11:20',
          department: 'HR',
          role: 'Employee'
        }
      ]
    },
    {
      id: 2,
      title: 'Q4_Financial_Report.pdf',
      type: 'document',
      views: 67,
      uniqueViews: 45,
      department: 'Finance',
      createdDate: '2024-03-07',
      viewers: [
        {
          name: 'Robert Johnson',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-07 14:30',
          department: 'Executive',
          role: 'Admin'
        },
        {
          name: 'Lisa Anderson',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-07 15:15',
          department: 'Marketing',
          role: 'Manager'
        },
        {
          name: 'David Wilson',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-07 16:00',
          department: 'Sales',
          role: 'Manager'
        }
      ]
    },
    {
      id: 3,
      title: 'New Employee Welcome',
      type: 'announcement',
      views: 203,
      uniqueViews: 156,
      department: 'HR',
      createdDate: '2024-03-06',
      viewers: [
        {
          name: 'Maria Garcia',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-06 08:45',
          department: 'HR',
          role: 'Manager'
        },
        {
          name: 'James Rodriguez',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-06 09:20',
          department: 'Engineering',
          role: 'Manager'
        },
        {
          name: 'Jennifer Brown',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-06 10:15',
          department: 'Marketing',
          role: 'Employee'
        }
      ]
    },
    {
      id: 4,
      title: 'Budget_Analysis.xlsx',
      type: 'document',
      views: 34,
      uniqueViews: 28,
      department: 'Finance',
      createdDate: '2024-03-05',
      viewers: [
        {
          name: 'Amanda Taylor',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-05 13:30',
          department: 'Finance',
          role: 'Employee'
        },
        {
          name: 'Christopher Davis',
          avatar: '/api/placeholder/32/32',
          viewedAt: '2024-03-05 14:45',
          department: 'Finance',
          role: 'Employee'
        }
      ]
    }
  ];

  const filteredData = analyticsData.filter(item => {
    if (selectedType === 'all') return true;
    return item.type === selectedType;
  });

  const totalViews = filteredData.reduce((sum, item) => sum + item.views, 0);
  const totalUniqueViews = filteredData.reduce((sum, item) => sum + item.uniqueViews, 0);
  const avgEngagement = totalViews > 0 ? ((totalUniqueViews / totalViews) * 100).toFixed(1) : '0';

  const getTypeIcon = (type: string) => {
    return type === 'announcement' ? Bell : FileText;
  };

  const getTypeColor = (type: string) => {
    return type === 'announcement' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track engagement and views for announcements and documents</p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="announcement">Announcements</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Views</p>
                <p className="text-2xl font-bold">{totalUniqueViews}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">{avgEngagement}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{filteredData.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="space-y-4">
        {filteredData.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          return (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{item.department}</span>
                        <span>{new Date(item.createdDate).toLocaleDateString()}</span>
                        <Badge className={getTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{item.views}</p>
                        <p className="text-xs text-muted-foreground">Total Views</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{item.uniqueViews}</p>
                        <p className="text-xs text-muted-foreground">Unique Views</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="viewers" className="w-full">
                  <TabsList>
                    <TabsTrigger value="viewers">Recent Viewers</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                  </TabsList>
                  <TabsContent value="viewers" className="space-y-4">
                    <div className="grid gap-3">
                      {item.viewers.map((viewer, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={viewer.avatar} alt={viewer.name} />
                              <AvatarFallback>{viewer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{viewer.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{viewer.department}</span>
                                <Badge variant="outline" className="text-xs">
                                  {viewer.role}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{new Date(viewer.viewedAt).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="stats" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">View Rate</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {((item.uniqueViews / item.views) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Days Active</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {Math.ceil((new Date().getTime() - new Date(item.createdDate).getTime()) / (1000 * 60 * 60 * 24))}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Avg Daily Views</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {(item.views / Math.max(1, Math.ceil((new Date().getTime() - new Date(item.createdDate).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}