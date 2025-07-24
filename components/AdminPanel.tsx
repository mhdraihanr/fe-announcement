"use client";

import { useState } from "react";
import type { Officer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Search,
  Edit,
  Save,
  X,
  Users,
  UserCheck,
  Crown,
  Star,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";

type Role = "Admin" | "SVP" | "VP" | "Officer" | "Employee";

interface AdminPanelProps {
  initialOfficers: Officer[];
}

const roleIcons = {
  Admin: Crown,
  SVP: Star,
  VP: UserCheck,
  Officer: Shield,
  Employee: User,
};

const roleColors = {
  Admin:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  SVP: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
  VP: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  Officer:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  Employee:
    "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
};

const roleDescriptions = {
  Admin: "Administrator - Full system access and leadership",
  SVP: "Senior Vice President - Strategic oversight",
  VP: "Vice President - Departmental leadership",
  Officer: "Officer - Team management and operations",
  Employee: "Standard employee access",
};

export default function AdminPanel({ initialOfficers }: AdminPanelProps) {
  const [officers, setOfficers] = useState<Officer[]>(initialOfficers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [newRole, setNewRole] = useState<Role>("Employee");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Filter officers based on search term
  const filteredOfficers = officers.filter(
    (officer) =>
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle role change
  const handleRoleChange = async () => {
    if (!editingOfficer) return;

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedOfficers = officers.map((officer) =>
        officer.id === editingOfficer.id
          ? { ...officer, position: newRole }
          : officer
      );

      setOfficers(updatedOfficers);
      setIsEditDialogOpen(false);
      setEditingOfficer(null);

      toast({
        title: "Role Updated Successfully",
        description: `${editingOfficer.name}'s role has been changed to ${newRole}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (officer: Officer) => {
    setEditingOfficer(officer);
    setNewRole(officer.position as Role);
    setIsEditDialogOpen(true);
  };

  // Get role statistics
  const roleStats = officers.reduce((acc, officer) => {
    const role = officer.position as Role;
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<Role, number>);

  // Calculate total officers
  const totalOfficers = officers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage officer roles and permissions • {totalOfficers} total
            officers
          </p>
        </div>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(roleStats).map(([role, count]) => {
          const IconComponent = roleIcons[role as Role];
          const percentage =
            totalOfficers > 0
              ? ((count / totalOfficers) * 100).toFixed(1)
              : "0";
          return (
            <Card key={role} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{role}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {percentage}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Officers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Officer Management
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search officers by name, role, department, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-muted-foreground">
              Found {filteredOfficers.length} officer
              {filteredOfficers.length !== 1 ? "s" : ""} matching &quot;
              {searchTerm}&quot;
            </p>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {filteredOfficers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">
                    {searchTerm ? "No officers found" : "No officers available"}
                  </p>
                  <p className="text-sm">
                    {searchTerm
                      ? "Try adjusting your search terms or clear the search to see all officers."
                      : "There are no officers in the system yet."}
                  </p>
                </div>
              ) : (
                filteredOfficers.map((officer) => {
                  const IconComponent = roleIcons[officer.position as Role];
                  return (
                    <div
                      key={officer.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar className="h-12 w-12 ring-2 ring-border">
                          <AvatarImage
                            src={officer.avatar}
                            alt={officer.name}
                          />
                          <AvatarFallback className="font-semibold">
                            {officer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold truncate">
                              {officer.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`flex items-center gap-1 ${
                                roleColors[officer.position as Role]
                              } flex-shrink-0`}
                            >
                              <IconComponent className="h-3 w-3" />
                              {officer.position}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {officer.department} • {officer.email}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-xs text-muted-foreground">
                              Joined:{" "}
                              {new Date(officer.joinDate).toLocaleDateString()}
                            </p>
                            {officer.directReports &&
                              officer.directReports > 0 && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {officer.directReports} direct reports
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(officer)}
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="h-3 w-3" />
                        Edit Role
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Officer Role
            </DialogTitle>
            <DialogDescription>
              Change the role and permissions for {editingOfficer?.name}
            </DialogDescription>
          </DialogHeader>
          {editingOfficer && (
            <div className="space-y-6 py-4">
              {/* Officer Info */}
              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-16 w-16 ring-2 ring-border">
                  <AvatarImage
                    src={editingOfficer.avatar}
                    alt={editingOfficer.name}
                  />
                  <AvatarFallback className="text-lg font-semibold">
                    {editingOfficer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {editingOfficer.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {editingOfficer.department} • {editingOfficer.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Joined:{" "}
                    {new Date(editingOfficer.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <Label htmlFor="role" className="text-base font-medium">
                  Select New Role
                </Label>
                <Select
                  value={newRole}
                  onValueChange={(value: Role) => setNewRole(value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleIcons).map(([role, IconComponent]) => (
                      <SelectItem key={role} value={role} className="py-3">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{role}</div>
                            <div className="text-xs text-muted-foreground">
                              {roleDescriptions[role as Role]}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Role:
                  </p>
                  <Badge
                    variant="outline"
                    className={`${
                      roleColors[editingOfficer.position as Role]
                    } justify-start p-2`}
                  >
                    {React.createElement(
                      roleIcons[editingOfficer.position as Role],
                      { className: "h-3 w-3 mr-1" }
                    )}
                    {editingOfficer.position}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    New Role:
                  </p>
                  <Badge
                    variant="outline"
                    className={`${roleColors[newRole]} justify-start p-2`}
                  >
                    {React.createElement(roleIcons[newRole], {
                      className: "h-3 w-3 mr-1",
                    })}
                    {newRole}
                  </Badge>
                </div>
              </div>

              {/* Warning for role changes */}
              {editingOfficer.position !== newRole && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Role Change Warning
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                      This will change the user&apos;s permissions and access
                      level. Make sure this change is authorized.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleRoleChange}
              disabled={isLoading || editingOfficer?.position === newRole}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
