"use client";

import { useState } from "react";
import type { User, Announcement } from "@/types";
import { initialAnnouncements, departments } from "@/app/announcements/data";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pin,
  Eye,
  ThumbsUp,
  MessageSquare,
  Filter,
  Check,
  Edit,
  Trash2,
  MoreVertical,
  PinOff,
  Upload,
  X,
} from "lucide-react";

interface AnnouncementBoardProps {
  currentUser: User;
}

export default function AnnouncementBoard({
  currentUser,
}: AnnouncementBoardProps) {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "medium",
    departments: [] as string[],
    tags: "",
    accessLevel: "Employee",
    imageUrl: "",
    linkUrl: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [filterPriority, setFilterPriority] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const canCreateAnnouncement = ["Admin", "SVP", "VP", "Officer"].includes(
    currentUser.role
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImagePreview(base64String);
        setNewAnnouncement({
          ...newAnnouncement,
          imageUrl: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setNewAnnouncement({
      ...newAnnouncement,
      imageUrl: "",
    });
  };

  // Role hierarchy for access control
  const getRoleHierarchy = (role: string): number => {
    switch (role) {
      case "Admin": return 5;
      case "SVP": return 4;
      case "VP": return 3;
      case "Officer": return 2;
      case "Employee": return 1;
      default: return 0;
    }
  };

  const canViewAnnouncement = (announcement: Announcement): boolean => {
    const userRoleLevel = getRoleHierarchy(currentUser.role);
    const announcementAccessLevel = getRoleHierarchy(announcement.accessLevel);
    
    // User can view announcements at their level or below
    return userRoleLevel >= announcementAccessLevel;
  };

  const filteredAnnouncements = announcements
    .filter(canViewAnnouncement)
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
      department: newAnnouncement.departments.join(", "),
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
      accessLevel: newAnnouncement.accessLevel as
        | "Admin"
        | "SVP"
        | "VP"
        | "Officer"
        | "Employee",
      imageUrl: newAnnouncement.imageUrl,
      linkUrl: newAnnouncement.linkUrl,
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: "",
      content: "",
      priority: "medium",
      departments: [],
      tags: "",
      accessLevel: "Employee",
      imageUrl: "",
      linkUrl: "",
    });
    setSelectedImage(null);
    setImagePreview("");
    setDialogOpen(false);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      departments: announcement.department.split(", "),
      tags: announcement.tags.join(", "),
      accessLevel: announcement.accessLevel || "Employee",
      imageUrl: announcement.imageUrl || "",
      linkUrl: announcement.linkUrl || "",
    });
    setSelectedImage(null);
    setImagePreview(announcement.imageUrl || "");
    setDialogOpen(true);
  };

  const handleUpdateAnnouncement = () => {
    if (!editingAnnouncement) return;

    const updatedAnnouncement: Announcement = {
      ...editingAnnouncement,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      department: newAnnouncement.departments.join(", "),
      priority: newAnnouncement.priority as "high" | "medium" | "low",
      tags: newAnnouncement.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      accessLevel: newAnnouncement.accessLevel as
        | "Admin"
        | "SVP"
        | "VP"
        | "Officer"
        | "Employee",
      imageUrl: newAnnouncement.imageUrl,
      linkUrl: newAnnouncement.linkUrl,
    };

    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === editingAnnouncement.id
          ? updatedAnnouncement
          : announcement
      )
    );

    setEditingAnnouncement(null);
    setNewAnnouncement({
      title: "",
      content: "",
      priority: "medium",
      departments: [],
      tags: "",
      accessLevel: "Employee",
      imageUrl: "",
      linkUrl: "",
    });
    setSelectedImage(null);
    setImagePreview("");
    setDialogOpen(false);
  };

  const handleDeleteAnnouncement = (announcementId: number) => {
    setAnnouncements((prev) =>
      prev.filter((announcement) => announcement.id !== announcementId)
    );
  };

  const canEditOrDelete = (announcement: Announcement) => {
    return (
      announcement.author === currentUser.name || currentUser.role === "Admin"
    );
  };

  const canPin = (announcement: Announcement) => {
    return (
      ["Admin", "SVP", "VP"].includes(currentUser.role) ||
      announcement.author === currentUser.name
    );
  };

  const handleTogglePin = (announcementId: number) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === announcementId
          ? { ...announcement, pinned: !announcement.pinned }
          : announcement
      )
    );
  };

  const markAsRead = (announcementId: number) => {
    setAnnouncements((prev) =>
      prev.map((announcement) => {
        if (announcement.id === announcementId) {
          const isAlreadyRead = announcement.readBy.includes(currentUser.id);

          if (!isAlreadyRead) {
            return {
              ...announcement,
              readBy: [...announcement.readBy, currentUser.id],
              views: announcement.views + 1,
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
          } else {
            // If already read, unmark it
            return {
              ...announcement,
              readBy: announcement.readBy.filter((id) => id !== currentUser.id),
              viewers: announcement.viewers.filter(
                (viewer) => viewer.userId !== currentUser.id
              ),
            };
          }
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
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Announcements
          </h2>
          <p className="text-sm lg:text-base text-muted-foreground">
            Stay updated with company news and updates
          </p>
        </div>
        {canCreateAnnouncement && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[600px] mx-2 max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAnnouncement
                    ? "Edit Announcement"
                    : "Create New Announcement"}
                </DialogTitle>
                <DialogDescription>
                  {editingAnnouncement
                    ? "Update your announcement"
                    : "Share important updates with your team"}
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Image (optional)
                  </Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="flex-1"
                      />
                      {(selectedImage || newAnnouncement.imageUrl) && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Or paste image URL"
                      value={newAnnouncement.imageUrl}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          imageUrl: e.target.value,
                        })
                      }
                    />
                    {(imagePreview || newAnnouncement.imageUrl) && (
                      <div className="mt-2">
                        <img
                          src={imagePreview || newAnnouncement.imageUrl}
                          alt="Preview"
                          className="max-w-full h-32 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Input
                  placeholder="Link URL (optional)"
                  value={newAnnouncement.linkUrl}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      linkUrl: e.target.value,
                    })
                  }
                />
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
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Pilih Departemen:
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {departments.map((dept) => (
                      <div key={dept} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={dept}
                          name="departments"
                          aria-label={`Select ${dept}`}
                          checked={newAnnouncement.departments.includes(dept)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAnnouncement({
                                ...newAnnouncement,
                                departments: [
                                  ...newAnnouncement.departments,
                                  dept,
                                ],
                              });
                            } else {
                              setNewAnnouncement({
                                ...newAnnouncement,
                                departments: newAnnouncement.departments.filter(
                                  (d) => d !== dept
                                ),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label
                          htmlFor={dept}
                          className="text-sm cursor-pointer"
                        >
                          {dept}
                        </Label>
                      </div>
                    ))}
                  </div>
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
                <Select
                  value={newAnnouncement.accessLevel}
                  onValueChange={(value) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      accessLevel: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Access Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employee">Employee Access</SelectItem>
                    <SelectItem value="Officer">Officer Access</SelectItem>
                    <SelectItem value="VP">VP Access</SelectItem>
                    <SelectItem value="SVP">SVP Access</SelectItem>
                    <SelectItem value="Admin">Admin Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  onClick={
                    editingAnnouncement
                      ? handleUpdateAnnouncement
                      : handleCreateAnnouncement
                  }
                >
                  {editingAnnouncement
                    ? "Update Announcement"
                    : "Post Announcement"}
                </Button>
                {editingAnnouncement && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingAnnouncement(null);
                      setNewAnnouncement({
                        title: "",
                        content: "",
                        priority: "medium",
                        accessLevel: "Employee",
                        departments: [],
                        tags: "",
                        imageUrl: "",
                        linkUrl: "",
                      });
                      setSelectedImage(null);
                      setImagePreview("");
                      setDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                )}
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
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
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
            <CardHeader className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-3 lg:gap-0">
                <div className="flex-1 min-w-0 w-full lg:w-auto">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {announcement.pinned && (
                      <Pin className="h-4 w-4 text-primary" />
                    )}
                    {!announcement.readBy.includes(currentUser.id) && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                    <CardTitle className="text-lg lg:text-xl break-words">
                      {announcement.title}
                    </CardTitle>
                    <Badge variant={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                    <span>By {announcement.author}</span>
                    <span>{announcement.department}</span>
                    <span>
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {(canEditOrDelete(announcement) || canPin(announcement)) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canEditOrDelete(announcement) && (
                          <DropdownMenuItem
                            onClick={() => handleEditAnnouncement(announcement)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {canPin(announcement) && (
                          <DropdownMenuItem
                            onClick={() => handleTogglePin(announcement.id)}
                          >
                            {announcement.pinned ? (
                              <PinOff className="mr-2 h-4 w-4" />
                            ) : (
                              <Pin className="mr-2 h-4 w-4" />
                            )}
                            {announcement.pinned ? "Unpin" : "Pin"}
                          </DropdownMenuItem>
                        )}
                        {canEditOrDelete(announcement) && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteAnnouncement(announcement.id)
                            }
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                    <AvatarFallback>
                      {announcement.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              <p className="text-sm lg:text-base text-foreground mb-4 break-words">
                {announcement.content}
              </p>

              {announcement.imageUrl && (
                <div className="mb-4">
                  <img
                    src={announcement.imageUrl}
                    alt="Announcement image"
                    className="max-w-full h-auto rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {announcement.linkUrl && (
                <div className="mb-4">
                  <a
                    href={announcement.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    🔗 {announcement.linkUrl}
                  </a>
                </div>
              )}

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
                <div className="flex flex-wrap gap-1 lg:gap-2">
                  {announcement.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
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
                  <Button
                    variant={
                      announcement.readBy.includes(currentUser.id)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className={`gap-1 ${
                      announcement.readBy.includes(currentUser.id)
                        ? "bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
                        : "text-black dark:text-white border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                    }`}
                    onClick={() => markAsRead(announcement.id)}
                  >
                    {announcement.readBy.includes(currentUser.id) && (
                      <Check className="h-4 w-4" />
                    )}
                    {announcement.readBy.includes(currentUser.id)
                      ? "Read"
                      : "Mark as Read"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
