"use client";

import { useState } from "react";
import type { User, Announcement } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Pin,
  Eye,
  ThumbsUp,
  MessageSquare,
  Filter,
  Check,
} from "lucide-react";

interface AnnouncementBoardProps {
  currentUser: User;
}

export default function AnnouncementBoard({
  currentUser,
}: AnnouncementBoardProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "System Maintenance Scheduled",
      content:
        "We will be performing system maintenance on Sunday, March 10th from 2:00 AM to 4:00 AM. During this time, the system will be unavailable.",
      author: "IT Department",
      department: "IT",
      priority: "high",
      pinned: true,
      date: "2024-03-08",
      views: 145,
      likes: 12,
      comments: 3,
      tags: ["maintenance", "system"],
      readBy: [1, 2, 3],
      viewers: [
        {
          userId: 1,
          name: "John Doe",
          avatar: "/api/placeholder/32/32",
          readAt: "2024-03-08 09:15",
          department: "Sales",
          role: "Manager",
        },
        {
          userId: 2,
          name: "Sarah Johnson",
          avatar: "/api/placeholder/32/32",
          readAt: "2024-03-08 09:30",
          department: "Marketing",
          role: "Manager",
        },
      ],
    },
    {
      id: 2,
      title: "New Employee Welcome",
      content:
        "Please join us in welcoming Sarah Johnson to the Marketing team. She will be starting as a Marketing Specialist on Monday.",
      author: "HR Department",
      department: "HR",
      priority: "medium",
      pinned: false,
      date: "2024-03-07",
      views: 89,
      likes: 25,
      comments: 8,
      tags: ["welcome", "team"],
      readBy: [1],
      viewers: [
        {
          userId: 1,
          name: "John Doe",
          avatar: "/api/placeholder/32/32",
          readAt: "2024-03-07 10:15",
          department: "Sales",
          role: "Manager",
        },
      ],
    },
    {
      id: 3,
      title: "Q1 Company Meeting",
      content:
        "The quarterly company meeting is scheduled for March 15th at 10:00 AM in the main conference room. Attendance is mandatory for all employees.",
      author: "Management",
      department: "Management",
      priority: "high",
      pinned: true,
      date: "2024-03-06",
      views: 203,
      likes: 18,
      comments: 5,
      tags: ["meeting", "quarterly"],
      readBy: [1, 2, 3, 4],
      viewers: [
        {
          userId: 1,
          name: "John Doe",
          avatar: "/api/placeholder/32/32",
          readAt: "2024-03-06 11:00",
          department: "Sales",
          role: "Manager",
        },
      ],
    },
    {
      id: 4,
      title: "Office Lunch Event",
      content:
        "Join us for a catered lunch event next Friday at 12:00 PM. Please RSVP by Wednesday to help us plan accordingly.",
      author: "Social Committee",
      department: "General",
      priority: "low",
      pinned: false,
      date: "2024-03-05",
      views: 156,
      likes: 45,
      comments: 12,
      tags: ["social", "lunch"],
      readBy: [],
      viewers: [],
    },
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "medium",
    department: "",
    tags: "",
  });

  const [filterPriority, setFilterPriority] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const departments = [
    "IT",
    "HR",
    "Management",
    "Sales",
    "Marketing",
    "Finance",
    "Engineering",
    "General",
  ];

  const canCreateAnnouncement = ["Admin", "Manager"].includes(currentUser.role);

  const filteredAnnouncements = announcements
    .filter(
      (announcement) =>
        filterPriority === "all" || announcement.priority === filterPriority
    )
    .filter(
      (announcement) =>
        filterDepartment === "all" ||
        announcement.department === filterDepartment
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handleCreateAnnouncement = () => {
    const announcement: Announcement = {
      id: announcements.length + 1,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: currentUser.name,
      department: newAnnouncement.department,
      priority: newAnnouncement.priority as "high" | "medium" | "low",
      pinned: false,
      date: new Date().toISOString().split("T")[0],
      views: 0,
      likes: 0,
      comments: 0,
      tags: newAnnouncement.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      readBy: [],
      viewers: [],
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: "",
      content: "",
      priority: "medium",
      department: "",
      tags: "",
    });
  };

  const markAsRead = (announcementId: number) => {
    setAnnouncements((prev) =>
      prev.map((announcement) => {
        if (
          announcement.id === announcementId &&
          !announcement.readBy.includes(currentUser.id)
        ) {
          return {
            ...announcement,
            readBy: [...announcement.readBy, currentUser.id],
            viewers: [
              ...announcement.viewers,
              {
                userId: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                readAt: new Date().toISOString(),
                department: currentUser.department,
                role: currentUser.role,
              },
            ],
          };
        }
        return announcement;
      })
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
          <p className="text-muted-foreground">
            Stay updated with company news and updates
          </p>
        </div>
        {canCreateAnnouncement && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogDescription>
                  Share important updates with your team
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Announcement title"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      title: e.target.value,
                    })
                  }
                />
                <Textarea
                  placeholder="Write your announcement here..."
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      content: e.target.value,
                    })
                  }
                  className="min-h-[100px]"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={newAnnouncement.priority}
                    onValueChange={(value) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        priority: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Select Department"
                    value={newAnnouncement.department}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        department: e.target.value,
                      })
                    }
                    list="departments"
                  />
                  <datalist id="departments">
                    {departments.map((dept) => (
                      <option key={dept} value={dept} />
                    ))}
                  </datalist>
                </div>
                <Input
                  placeholder="Tags (comma separated)"
                  value={newAnnouncement.tags}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      tags: e.target.value,
                    })
                  }
                />
              </div>
              <DialogFooter>
                <Button onClick={handleCreateAnnouncement}>
                  Post Announcement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Management">Management</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card
            key={announcement.id}
            className={`${announcement.pinned ? "ring-2 ring-primary" : ""} ${
              !announcement.readBy.includes(currentUser.id)
                ? "bg-blue-50/30 dark:bg-blue-950/30"
                : ""
            } hover:shadow-md transition-shadow`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.pinned && (
                      <Pin className="h-4 w-4 text-primary" />
                    )}
                    {!announcement.readBy.includes(currentUser.id) && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                    <CardTitle className="text-xl">
                      {announcement.title}
                    </CardTitle>
                    <Badge variant={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>By {announcement.author}</span>
                    <span>{announcement.department}</span>
                    <span>
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Avatar>
                  <AvatarFallback>
                    {announcement.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">{announcement.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {announcement.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {announcement.views}
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {announcement.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {announcement.comments}
                  </Button>
                  {!announcement.readBy.includes(currentUser.id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => markAsRead(announcement.id)}
                    >
                      <Check className="h-4 w-4" />
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
