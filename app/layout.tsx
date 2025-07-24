"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const pathname = usePathname();

  useEffect(() => {
    // Set active tab based on current pathname
    const pathSegments = pathname.split("/");
    const currentPage = pathSegments[1] || "dashboard";
    setActiveTab(currentPage);
  }, [pathname]);

  // Check if current page should show sidebar (exclude root page)
  const shouldShowSidebar = pathname !== "/";

  if (!shouldShowSidebar) {
    return children;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Announcements Dashboard</title>
        <link rel="icon" href="/download__1_-removebg-preview.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <LayoutContent>{children}</LayoutContent>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
