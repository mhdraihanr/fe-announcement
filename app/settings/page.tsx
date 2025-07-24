"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Building,
  Camera,
  Save,
  Crown,
  Star,
  Award,
  Shield,
  UserCheck,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function SettingsPage() {
  const { currentUser, setCurrentUser } = useUser();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser.name,
    phone: currentUser.phone,
    avatar: currentUser.avatar,
  });

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "CEO":
        return Crown;
      case "SVP":
        return Award;
      case "VP":
        return Star;
      case "Officer":
        return Shield;
      case "Employee":
        return UserCheck;
      default:
        return UserIcon;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "CEO":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "SVP":
        return "bg-red-100 text-red-800 border-red-200";
      case "VP":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Officer":
        return "bg-green-100 text-green-800 border-green-200";
      case "Employee":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSaveProfile = () => {
    setCurrentUser({
      ...currentUser,
      name: editForm.name,
      phone: editForm.phone,
      avatar: editForm.avatar,
    });
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: currentUser.name,
      phone: currentUser.phone,
      avatar: currentUser.avatar,
    });
    setIsEditingProfile(false);
  };

  const PositionIcon = getPositionIcon(currentUser.role);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your profile and account settings
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            View and edit your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-2xl font-semibold">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Change Profile Photo</DialogTitle>
                    <DialogDescription>
                      Upload a new profile photo or enter an image URL
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="avatar-url">Image URL</Label>
                      <Input
                        id="avatar-url"
                        value={editForm.avatar}
                        onChange={(e) =>
                          setEditForm({ ...editForm, avatar: e.target.value })
                        }
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setCurrentUser({
                              ...currentUser,
                              avatar: editForm.avatar,
                            });
                          }}
                        >
                          Save Photo
                        </Button>
                      </DialogTrigger>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">{currentUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getPositionColor(currentUser.role)}>
                      <PositionIcon className="h-3 w-3 mr-1" />
                      {currentUser.role}
                    </Badge>
                    <Badge
                      className={getStatusColor(currentUser.status || "active")}
                    >
                      {currentUser.status || "active"}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant={isEditingProfile ? "outline" : "default"}
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{currentUser.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{currentUser.email}</span>
                    <Badge variant="secondary" className="text-xs">
                      Cannot be changed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{currentUser.phone}</span>
                  </div>
                  {currentUser.joinDate && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Joined{" "}
                        {new Date(currentUser.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Two-Factor Authentication
                </span>
                <Badge variant="outline">Disabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Email Notifications</span>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Privacy Settings</span>
                <Badge variant="outline">Public</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Profile Views</span>
                <span className="font-semibold">127</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Announcements Created
                </span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Documents Shared</span>
                <span className="font-semibold">23</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
