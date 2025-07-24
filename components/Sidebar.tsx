"use client";

import { useRouter, usePathname } from "next/navigation";
import type { User } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  FileText,
  MessageCircle,
  Calendar,
  Bell,
  Users,
  Settings,
  BarChart3,
  Shield,
} from "lucide-react";

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({
  currentUser,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigation: Array<{
    name: string;
    icon: any;
    key: string;
    href: string;
    roles: User["role"][];
    badge?: string;
  }> = [
    {
      name: "Dashboard",
      icon: Home,
      key: "dashboard",
      href: "/dashboard",
      roles: ["Admin", "SVP", "VP", "Officer", "Employee"],
    },
    {
      name: "Announcements",
      icon: Bell,
      key: "announcements",
      href: "/announcements",
      roles: ["Admin", "SVP", "VP", "Officer", "Employee"],
      badge: "3",
    },
    {
      name: "Documents",
      icon: FileText,
      key: "documents",
      href: "/documents",
      roles: ["Admin", "SVP", "VP", "Officer", "Employee"],
    },
    {
      name: "Chat",
      icon: MessageCircle,
      key: "chat",
      href: "/chat",
      roles: ["Admin", "SVP", "VP", "Officer", "Employee"],
      badge: "5",
    },
    {
      name: "Calendar",
      icon: Calendar,
      key: "calendar",
      href: "/calendar",
      roles: ["Admin", "SVP", "VP", "Officer", "Employee"],
    },
    {
      name: "Officer",
      icon: Users,
      key: "officer",
      href: "/officer",
      roles: ["Admin", "SVP", "VP"],
    },
    {
      name: "Analytics",
      icon: BarChart3,
      key: "analytics",
      href: "/analytics",
      roles: ["Admin", "SVP", "VP"],
    },
    {
      name: "Admin Panel",
      icon: Shield,
      key: "admin",
      href: "/admin",
      roles: ["Admin"],
    },
    {
      name: "Settings",
      icon: Settings,
      key: "settings",
      href: "/settings",
      roles: ["Admin", "SVP", "VP", "Officer", "Employee"],
    },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  const handleNavigation = (item: any) => {
    router.push(item.href);
    setActiveTab(item.key);
  };

  const isActive = (item: any) => {
    return pathname === item.href || activeTab === item.key;
  };

  return (
    <div
      className={cn(
        "bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64" : "w-0 overflow-hidden"
      )}
    >
      <div className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold text-xl">TI</span>
          </div>
          <h2 className="font-semibold text-foreground">Department</h2>
          <p className="text-sm text-muted-foreground">
            Teknologi Informasi (TI/IT)
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-1">
        {filteredNavigation.map((item) => (
          <Button
            key={item.key}
            variant={isActive(item) ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              isActive(item) && "bg-primary text-primary-foreground"
            )}
            onClick={() => handleNavigation(item)}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.name}
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm font-medium text-foreground">Need Help?</p>
          <p className="text-xs text-muted-foreground mt-1">
            Contact IT support for assistance
          </p>
          <Button size="sm" variant="outline" className="w-full mt-2">
            Get Support
          </Button>
        </div>
      </div>
    </div>
  );
}
