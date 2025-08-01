"use client";

import { useState } from "react";
import type { User, Officer } from "@/types";
import { initialOfficers } from "@/app/officer/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Building,
  UserCheck,
  Crown,
  Star,
  Award,
  Shield,
} from "lucide-react";

interface OfficerDirectoryProps {
  currentUser: User;
}

export default function OfficerDirectory({
  currentUser,
}: OfficerDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  const officers: Officer[] = initialOfficers;

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "Admin":
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
        return Users;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "Admin":
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

  const filteredOfficers = officers.filter((officer) => {
    const matchesSearch =
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition =
      filterPosition === "all" || officer.position === filterPosition;
    const matchesDepartment =
      filterDepartment === "all" || officer.department === filterDepartment;

    return matchesSearch && matchesPosition && matchesDepartment;
  });

  const positionHierarchy = ["Admin", "SVP", "VP", "Officer", "Employee"];
  const sortedOfficers = filteredOfficers.sort((a, b) => {
    const aIndex = positionHierarchy.indexOf(a.position);
    const bIndex = positionHierarchy.indexOf(b.position);
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.name.localeCompare(b.name);
  });

  const departments = Array.from(new Set(officers.map((o) => o.department)));
  const positionCounts = positionHierarchy.reduce((acc, position) => {
    acc[position] = officers.filter((o) => o.position === position).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Officer Directory
          </h2>
          <p className="text-sm lg:text-base text-muted-foreground">
            Company organizational structure and employee directory
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4">
        {positionHierarchy.map((position) => {
          const PositionIcon = getPositionIcon(position);
          return (
            <Card key={position}>
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-muted-foreground">
                      {position}
                    </p>
                    <p className="text-lg lg:text-2xl font-bold">
                      {positionCounts[position] || 0}
                    </p>
                  </div>
                  <PositionIcon className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, department, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positionHierarchy.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger className="w-full lg:w-[180px]">
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

      {/* Officer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {sortedOfficers.map((officer) => {
          const PositionIcon = getPositionIcon(officer.position);
          return (
            <Card
              key={officer.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start space-x-3 lg:space-x-4">
                  <Avatar className="h-12 w-12 lg:h-16 lg:w-16 flex-shrink-0">
                    <AvatarImage src={officer.avatar} alt={officer.name} />
                    <AvatarFallback className="text-sm lg:text-lg font-semibold">
                      {officer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-base lg:text-lg truncate">
                        {officer.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={getStatusColor(officer.status)}
                      >
                        {officer.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getPositionColor(officer.position)}>
                          <PositionIcon className="h-3 w-3 mr-1" />
                          {officer.position}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span className="truncate">{officer.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate text-xs lg:text-sm">{officer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="text-xs lg:text-sm">{officer.phone}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs lg:text-sm">
                          Joined{" "}
                          {new Date(officer.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 lg:mt-4 flex gap-1 lg:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedOfficer(officer)}
                  >
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Officer Detail Dialog */}
      <Dialog
        open={!!selectedOfficer}
        onOpenChange={() => setSelectedOfficer(null)}
      >
        <DialogContent className="w-[95vw] max-w-[500px] mx-2">
          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Avatar className="h-10 w-10 lg:h-12 lg:w-12 flex-shrink-0">
                <AvatarImage
                  src={selectedOfficer?.avatar}
                  alt={selectedOfficer?.name}
                />
                <AvatarFallback>
                  {selectedOfficer?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg lg:text-xl font-semibold">
                  {selectedOfficer?.name}
                </h3>
                <p className="text-sm lg:text-base text-muted-foreground">
                  {selectedOfficer?.position} - {selectedOfficer?.department}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedOfficer && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Position
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const PositionIcon = getPositionIcon(
                        selectedOfficer.position
                      );
                      return <PositionIcon className="h-4 w-4" />;
                    })()}
                    <span>{selectedOfficer.position}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedOfficer.status)}>
                      {selectedOfficer.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="mt-1">{selectedOfficer.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="mt-1">{selectedOfficer.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Department
                </label>
                <p className="mt-1">{selectedOfficer.department}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Join Date
                </label>
                <p className="mt-1">
                  {new Date(selectedOfficer.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* No Results */}
      {sortedOfficers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No officers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
