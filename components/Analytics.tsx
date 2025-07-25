"use client";

import { useState } from "react";
import type { User } from "@/types";
import { initialAnalyticsData, type ViewAnalytics } from "@/app/analytics/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Eye,
  FileText,
  Bell,
  Users,
  TrendingUp,
  Calendar,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AnalyticsProps {
  currentUser: User;
}

export default function Analytics({ currentUser }: AnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedType, setSelectedType] = useState("all");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const analyticsData: ViewAnalytics[] = initialAnalyticsData;

  const filteredData = analyticsData.filter((item) => {
    if (selectedType !== "all" && item.type !== selectedType) return false;

    const itemDate = new Date(item.createdDate);
    const today = new Date();
    const daysDiff = Math.floor(
      (today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (selectedPeriod) {
      case "7days":
        return daysDiff <= 7;
      case "30days":
        return daysDiff <= 30;
      case "90days":
        return daysDiff <= 90;
      default:
        return true;
    }
  });

  const totalReads = filteredData.reduce((sum, item) => sum + item.reads, 0);
  const totalUnreads = filteredData.reduce(
    (sum, item) => sum + (item.totalUsers - item.reads),
    0
  );
  const totalDownloads = filteredData
    .filter((item) => item.type === "document")
    .reduce((sum, item) => sum + (item.downloads || 0), 0);
  const totalUsers = filteredData.reduce(
    (sum, item) => sum + item.totalUsers,
    0
  );
  const readRate =
    totalUsers > 0 ? ((totalReads / totalUsers) * 100).toFixed(1) : "0";

  const getTypeIcon = (type: string) => {
    return type === "announcement" ? Bell : FileText;
  };

  const getTypeColor = (type: string) => {
    return type === "announcement"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const toggleExpanded = (itemId: number) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track engagement and views for announcements and documents
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[140px]">
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">
                  Total Read
                </p>
                <p className="text-xl lg:text-2xl font-bold">{totalReads}</p>
              </div>
              <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Unread
                </p>
                <p className="text-xl lg:text-2xl font-bold">{totalUnreads}</p>
              </div>
              <Users className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Downloads
                </p>
                <p className="text-xl lg:text-2xl font-bold">{totalDownloads}</p>
              </div>
              <Download className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Read Rate
                </p>
                <p className="text-xl lg:text-2xl font-bold">{readRate}%</p>
              </div>
              <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Items
                </p>
                <p className="text-xl lg:text-2xl font-bold">{filteredData.length}</p>
              </div>
              <BarChart3 className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="space-y-4">
        {filteredData.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          const isExpanded = expandedItems.includes(item.id);
          return (
            <Card key={item.id}>
              <CardHeader className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base lg:text-lg">{item.title}</CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs lg:text-sm text-muted-foreground">
                        <span>{item.department}</span>
                        <span>
                          {new Date(item.createdDate).toLocaleDateString()}
                        </span>
                        <Badge className={getTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 lg:gap-4">
                        <div className="text-center min-w-0">
                          <p className="text-lg lg:text-2xl font-bold text-blue-600">
                            {item.reads}
                          </p>
                          <p className="text-xs text-muted-foreground hidden sm:block">
                            Total Read
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg lg:text-2xl font-bold text-red-600">
                            {item.totalUsers - item.reads}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total Unread
                          </p>
                        </div>
                        {item.type === "document" && (
                          <div className="text-center">
                            <p className="text-lg lg:text-2xl font-bold text-green-600">
                              {item.downloads}
                            </p>
                            <p className="text-xs text-muted-foreground hidden sm:block">
                              Downloads
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpanded(item.id)}
                      className="flex items-center gap-1 lg:gap-2 text-sm lg:text-base"
                    >
                      Detail
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="p-4 lg:p-6">
                  <Tabs defaultValue="viewers" className="w-full">
                    <TabsList>
                      <TabsTrigger value="viewers">Recent Viewers</TabsTrigger>
                      <TabsTrigger value="stats">Statistics</TabsTrigger>
                    </TabsList>
                    <TabsContent value="viewers" className="space-y-4">
                      <div className="grid gap-2 lg:gap-3">
                        {item.viewers.map((viewer, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border space-y-2 sm:space-y-0"
                          >
                            <div className="flex items-center gap-2 lg:gap-3">
                              <Avatar className="h-7 w-7 lg:h-8 lg:w-8">
                                <AvatarImage
                                  src={viewer.avatar}
                                  alt={viewer.name}
                                />
                                <AvatarFallback>
                                  {viewer.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm lg:text-base">{viewer.name}</p>
                                <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm text-muted-foreground">
                                  <span>{viewer.department}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {viewer.role}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right sm:text-left lg:text-right">
                              <p className="text-xs lg:text-sm font-medium">
                                {new Date(viewer.viewedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="stats" className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
                        <div className="p-3 lg:p-4 rounded-lg border">
                          <div className="flex items-center gap-2">
                            {item.type === "document" ? (
                              <Download className="h-4 w-4 text-green-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-blue-600" />
                            )}
                            <span className="text-sm font-medium">
                              {item.type === "document"
                                ? "Download Rate"
                                : "View Rate"}
                            </span>
                          </div>
                          <p className="text-xl lg:text-2xl font-bold mt-2">
                            {item.type === "document" && item.downloads
                              ? ((item.downloads / item.reads) * 100).toFixed(1)
                              : ((item.reads / item.totalUsers) * 100).toFixed(
                                  1
                                )}
                            %
                          </p>
                        </div>
                        <div className="p-3 lg:p-4 rounded-lg border">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">
                              Days Active
                            </span>
                          </div>
                          <p className="text-xl lg:text-2xl font-bold mt-2">
                            {Math.ceil(
                              (new Date().getTime() -
                                new Date(item.createdDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg border">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">
                              Avg Daily Reads
                            </span>
                          </div>
                          <p className="text-2xl font-bold mt-2">
                            {(
                              item.reads /
                              Math.max(
                                1,
                                Math.ceil(
                                  (new Date().getTime() -
                                    new Date(item.createdDate).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )
                              )
                            ).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
