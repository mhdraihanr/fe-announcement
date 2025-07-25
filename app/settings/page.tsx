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
      case "Administrator":
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
      case "Administrator":
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
    <div className="space-y-4 lg:space-y-6 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center sm:text-left">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Settings
          </h2>
          <p className="text-sm lg:text-base text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="max-w-full lg:max-w-2xl mx-auto">
        <CardHeader className="pb-4 lg:pb-6 text-center sm:text-left">
          <CardTitle className="flex items-center justify-center sm:justify-start gap-2 text-lg lg:text-xl">
            <UserIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-sm lg:text-base">
            View and edit your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative mx-auto sm:mx-0">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-xl sm:text-2xl font-semibold">
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
                    className="absolute -bottom-2 -right-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full p-0"
                  >
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="mx-4 sm:max-w-[425px]">
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
            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    {currentUser.name}
                  </h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
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
                  className="w-full sm:w-auto"
                >
                  {isEditingProfile ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{currentUser.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium break-all">{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{currentUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{currentUser.joinDate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
              Account Settings
            </CardTitle>
            <CardDescription className="text-sm">
              Manage your account preferences and security settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <p className="font-medium text-sm lg:text-base">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Badge variant="outline" className="self-start sm:self-center">
                  Disabled
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <p className="font-medium text-sm lg:text-base">
                    Email Notifications
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Receive updates about your account activity
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="self-start sm:self-center"
                >
                  Enabled
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <p className="font-medium text-sm lg:text-base">
                    Privacy Settings
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Control who can see your profile information
                  </p>
                </div>
                <Badge variant="outline" className="self-start sm:self-center">
                  Public
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <UserIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              Quick Stats
            </CardTitle>
            <CardDescription className="text-sm">
              Your activity overview and engagement metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-sm lg:text-base font-medium">
                  Profile Views
                </span>
                <span className="font-semibold text-lg lg:text-xl">127</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-sm lg:text-base font-medium">
                  Announcements Created
                </span>
                <span className="font-semibold text-lg lg:text-xl">8</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-sm lg:text-base font-medium">
                  Documents Shared
                </span>
                <span className="font-semibold text-lg lg:text-xl">23</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
