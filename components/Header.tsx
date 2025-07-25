/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User, Notification } from "@/types";
import {
  Bell,
  Search,
  Settings,
  LogOut,
  UserIcon,
  Menu,
  Palette,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({
  currentUser,
  setCurrentUser,
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {
  const router = useRouter();
  const [notifications] = useState<Notification[]>([
    { id: 1, title: "New document shared", time: "5 min ago", unread: true },
    { id: 2, title: "Meeting reminder", time: "10 min ago", unread: true },
    { id: 3, title: "System update", time: "1 hour ago", unread: false },
  ]);

  const roles: Array<{ value: User["role"]; label: string }> = [
    { value: "Admin", label: "Administrator" },
    { value: "SVP", label: "Superior Vice President" },
    { value: "VP", label: "Vice President" },
    { value: "Officer", label: "Officer" },
    { value: "Employee", label: "Employee" },
  ];

  const handleRoleChange = (newRole: User["role"]) => {
    setCurrentUser({
      ...currentUser,
      role: newRole,
    });
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="bg-background border-b border-border px-3 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 lg:space-x-2">
          {/* Desktop hamburger menu - left side */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
          <div className="flex items-center space-x-1 lg:space-x-2">
            <img
              src="/download__1_-removebg-preview.png"
              alt="PT. Pupuk Kujang Logo"
              width={24}
              height={24}
              className="lg:w-8 lg:h-8 flex-shrink-0 object-contain"

            />
            <h1 className="text-lg lg:text-xl font-semibold text-foreground hidden sm:block">
              PT. Pupuk Kujang
            </h1>
          </div>
        </div>

        <div className="flex-1 max-w-xs lg:max-w-sm mx-2 lg:mx-6 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 h-9"
            />
          </div>
        </div>

        <div className="flex items-center space-x-1 lg:space-x-3">
          {/* Mobile menu trigger - only show when sidebar is closed */}
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          {/* Role Selector */}
          <Select value={currentUser.role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-16 lg:w-24 h-8 text-xs hidden sm:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value} className="text-xs">
                  {role.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 lg:w-80" align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 p-3"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.unread ? "bg-blue-500" : "bg-muted"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-1 lg:space-x-2 p-1 lg:p-2"
              >
                <Avatar className="h-7 w-7 lg:h-8 lg:w-8">
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium truncate max-w-24">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser.role}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


        </div>
      </div>
    </header>
  );
}
