"use client";

import { useState } from "react";
import type { User, Document } from "@/types";
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
import { Label } from "@/components/ui/label";
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
import {
  Upload,
  FileText,
  Image,
  FileSpreadsheet,
  Download,
  Share2,
  MoreHorizontal,
  Eye,
  Trash2,
  Lock,
  Users,
  Calendar,
} from "lucide-react";
import { initialDocuments, departments } from "@/app/documents/data";

interface DocumentCenterProps {
  currentUser: User;
}

export default function DocumentCenter({ currentUser }: DocumentCenterProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDocument, setNewDocument] = useState({
    accessLevel: "Employee",
    departments: [] as string[],
  });



  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "document":
        return FileText;
      case "image":
        return Image;
      case "spreadsheet":
        return FileSpreadsheet;
      default:
        return FileText;
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "Admin":
        return "destructive";
      case "SVP":
        return "default";
      case "VP":
        return "default";
      case "Officer":
        return "secondary";
      case "Employee":
        return "outline";
      default:
        return "secondary";
    }
  };

  const canAccessDocument = (document: any) => {
    const accessLevels = ["Employee", "Officer", "VP", "SVP", "Admin"];
    const userLevel = accessLevels.indexOf(currentUser.role);
    const docLevel = accessLevels.indexOf(document.accessLevel);
    return userLevel >= docLevel;
  };

  const canUpload = ["Admin", "SVP", "VP", "Officer", "Employee"].includes(
    currentUser.role
  );
  const canDelete = ["Admin", "SVP", "VP"].includes(currentUser.role);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadDocument = () => {
    if (selectedFile) {
      const fileType = selectedFile.type.includes("image")
        ? ("image" as const)
        : selectedFile.type.includes("pdf")
        ? ("pdf" as const)
        : selectedFile.type.includes("spreadsheet")
        ? ("spreadsheet" as const)
        : ("document" as const);

      const newDoc: Document = {
        id: documents.length + 1,
        name: selectedFile.name,
        type: fileType,
        size: `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedBy: currentUser.name,
        uploadDate: new Date().toISOString().split("T")[0],
        accessLevel: newDocument.accessLevel as
          | "Administrator"
          | "SVP"
          | "VP"
          | "Officer"
          | "Employee",
        department: newDocument.departments.join(", "),
        downloads: 0,
        views: 0,
        shared: false,
      };

      setDocuments([newDoc, ...documents]);
      setSelectedFile(null);
      setUploadDialog(false);
    }
  };

  const accessibleDocuments = documents.filter((doc) => canAccessDocument(doc));

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Document Center</h2>
          <p className="text-sm lg:text-base text-muted-foreground">
            Manage and share documents with role-based access
          </p>
        </div>
        {canUpload && (
          <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] mx-2">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
                <DialogDescription>
                  Share a document with your team
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name} (
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                    </p>
                  )}
                </div>
                <Select
                  value={newDocument.accessLevel}
                  onValueChange={(value) =>
                    setNewDocument({ ...newDocument, accessLevel: value })
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
                          checked={newDocument.departments.includes(dept)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewDocument({
                                ...newDocument,
                                departments: [
                                  ...newDocument.departments,
                                  dept,
                                ],
                              });
                            } else {
                              setNewDocument({
                                ...newDocument,
                                departments: newDocument.departments.filter(
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
              </div>
              <DialogFooter>
                <Button onClick={handleUploadDocument} disabled={!selectedFile}>
                  Upload Document
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
        <Card>
          <CardContent className="p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">
                  Total Documents
                </p>
                <p className="text-lg lg:text-2xl font-bold">
                  {accessibleDocuments.length}
                </p>
              </div>
              <FileText className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
           <CardContent className="p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">
                  Shared
                </p>
                <p className="text-lg lg:text-2xl font-bold">
                  {accessibleDocuments.filter((d) => d.shared).length}
                </p>
              </div>
              <Share2 className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Views
                </p>
                <p className="text-2xl font-bold">
                  {accessibleDocuments.reduce((sum, d) => sum + d.views, 0)}
                </p>
              </div>
              <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Downloads
                </p>
                <p className="text-2xl font-bold">
                  {accessibleDocuments.reduce((sum, d) => sum + d.downloads, 0)}
                </p>
              </div>
              <Download className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4">
        {accessibleDocuments.map((document) => {
          const FileIcon = getFileIcon(document.type);
          return (
            <Card
              key={document.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
                  <div className="flex items-center space-x-2 lg:space-x-4 flex-1 min-w-0 w-full lg:w-auto">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm lg:text-base truncate">{document.name}</h3>
                      <div className="flex flex-wrap items-center gap-1 lg:gap-4 text-xs lg:text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {document.uploadedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(document.uploadDate).toLocaleDateString()}
                        </span>
                        <span>{document.size}</span>
                        <span>{document.department}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-4 flex-shrink-0">
                    <div className="flex flex-wrap items-center gap-1 lg:gap-2">
                      <Badge
                        variant={getAccessLevelColor(document.accessLevel)}
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        {document.accessLevel}
                      </Badge>
                      {document.shared && (
                        <Badge variant="outline">
                          <Share2 className="h-3 w-3 mr-1" />
                          Shared
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs lg:text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{document.views}</span>
                      <Download className="h-4 w-4 ml-2" />
                      <span>{document.downloads}</span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        {canDelete && (
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
