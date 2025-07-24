'use client';

import type { Stat, QuickAction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, FileText, MessageCircle, Users, Shield, Clock, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const stats: Stat[] = [
    {
      title: 'Active Documents',
      value: '248',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Team Members',
      value: '156',
      change: '+3%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Pending Approvals',
      value: '12',
      change: '-8%',
      icon: Shield,
      color: 'text-orange-600'
    },
    {
      title: 'This Week Events',
      value: '8',
      change: '+2',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      title: 'Upload Document',
      description: 'Share files with your team',
      icon: FileText,
      action: () => window.location.href = '/documents'
    },
    {
      title: 'New Announcement',
      description: 'Post company updates',
      icon: Bell,
      action: () => window.location.href = '/announcements'
    },
    {
      title: 'Schedule Meeting',
      description: 'Book conference rooms',
      icon: Calendar,
      action: () => window.location.href = '/calendar'
    },
    {
      title: 'Start Chat',
      description: 'Connect with colleagues',
      icon: MessageCircle,
      action: () => window.location.href = '/chat'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and shortcuts for your daily workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-accent"
                onClick={action.action}
              >
                <action.icon className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { action: 'Document uploaded', file: 'Q4_Report.pdf', time: '2 hours ago' },
              { action: 'Meeting scheduled', file: 'Team Standup', time: '4 hours ago' },
              { action: 'Announcement posted', file: 'Holiday Schedule', time: '1 day ago' },
              { action: 'Document shared', file: 'Budget_2024.xlsx', time: '2 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.file}</p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Latest Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: 'System Maintenance',
                content: 'Scheduled maintenance on Sunday 2 AM - 4 AM',
                priority: 'high',
                time: '1 hour ago'
              },
              {
                title: 'New Office Hours',
                content: 'Updated working hours effective next Monday',
                priority: 'medium',
                time: '3 hours ago'
              },
              {
                title: 'Team Building Event',
                content: 'Annual company retreat registration open',
                priority: 'low',
                time: '1 day ago'
              }
            ].map((announcement, index) => (
              <div key={index} className="p-3 rounded-lg border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{announcement.title}</p>
                      <Badge 
                        variant={announcement.priority === 'high' ? 'destructive' : 
                               announcement.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {announcement.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{announcement.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}