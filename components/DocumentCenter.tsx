'use client';

import { useState } from 'react';
import type { User, Document } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Calendar
} from 'lucide-react';

interface DocumentCenterProps {
  currentUser: User;
}

export default function DocumentCenter({ currentUser }: DocumentCenterProps) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: 'Q4_Financial_Report.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'John Smith',
      uploadDate: '2024-03-08',
      accessLevel: 'Manager',
      department: 'Finance',
      downloads: 45,
      views: 120,
      shared: true
    },
    {
      id: 2,
      name: 'Marketing_Strategy_2024.docx',
      type: 'document',
      size: '1.8 MB',
      uploadedBy: 'Sarah Johnson',
      uploadDate: '2024-03-07',
      accessLevel: 'Employee',
      department: 'Marketing',
      downloads: 23,
      views: 67,
      shared: false
    },
    {
      id: 3,
      name: 'Budget_Analysis.xlsx',
      type: 'spreadsheet',
      size: '845 KB',
      uploadedBy: 'Mike Wilson',
      uploadDate: '2024-03-06',
      accessLevel: 'Admin',
      department: 'Finance',
      downloads: 12,
      views: 34,
      shared: true
    },
    {
      id: 4,
      name: 'Team_Photo_2024.jpg',
      type: 'image',
      size: '3.2 MB',
      uploadedBy: 'HR Department',
      uploadDate: '2024-03-05',
      accessLevel: 'Guest',
      department: 'HR',
      downloads: 89,
      views: 203,
      shared: true
    }
  ]);

  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDocument, setNewDocument] = useState({
    accessLevel: 'Employee',
    department: currentUser.department
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return FileText;
      case 'image':
        return Image;
      case 'spreadsheet':
        return FileSpreadsheet;
      default:
        return FileText;
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'Admin': return 'destructive';
      case 'Manager': return 'default';
      case 'Employee': return 'secondary';
      case 'Guest': return 'outline';
      default: return 'secondary';
    }
  };

  const canAccessDocument = (document: any) => {
    const accessLevels = ['Guest', 'Employee', 'Manager', 'Admin'];
    const userLevel = accessLevels.indexOf(currentUser.role);
    const docLevel = accessLevels.indexOf(document.accessLevel);
    return userLevel >= docLevel;
  };

  const canUpload = ['Admin', 'Manager', 'Employee'].includes(currentUser.role);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadDocument = () => {
    if (selectedFile) {
      const fileType = selectedFile.type.includes('image') ? 'image' as const :
              selectedFile.type.includes('pdf') ? 'pdf' as const :
              selectedFile.type.includes('spreadsheet') ? 'spreadsheet' as const : 'document' as const;
              
      const newDoc: Document = {
        id: documents.length + 1,
        name: selectedFile.name,
        type: fileType,
        size: `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedBy: currentUser.name,
        uploadDate: new Date().toISOString().split('T')[0],
        accessLevel: newDocument.accessLevel as 'Admin' | 'Manager' | 'Employee' | 'Guest',
        department: newDocument.department,
        downloads: 0,
        views: 0,
        shared: false
      };

      setDocuments([newDoc, ...documents]);
      setSelectedFile(null);
      setUploadDialog(false);
    }
  };

  const accessibleDocuments = documents.filter(doc => canAccessDocument(doc));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Document Center</h2>
          <p className="text-muted-foreground">Manage and share documents with role-based access</p>
        </div>
        {canUpload && (
          <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={newDocument.accessLevel}
                    onValueChange={(value) => setNewDocument({...newDocument, accessLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Access Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Guest">Guest Access</SelectItem>
                      <SelectItem value="Employee">Employee Access</SelectItem>
                      <SelectItem value="Manager">Manager Access</SelectItem>
                      <SelectItem value="Admin">Admin Access</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Department"
                    value={newDocument.department}
                    onChange={(e) => setNewDocument({...newDocument, department: e.target.value})}
                  />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{accessibleDocuments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shared</p>
                <p className="text-2xl font-bold">{accessibleDocuments.filter(d => d.shared).length}</p>
              </div>
              <Share2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{accessibleDocuments.reduce((sum, d) => sum + d.views, 0)}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold">{accessibleDocuments.reduce((sum, d) => sum + d.downloads, 0)}</p>
              </div>
              <Download className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4">
        {accessibleDocuments.map((document) => {
          const FileIcon = getFileIcon(document.type);
          return (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{document.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
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
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getAccessLevelColor(document.accessLevel)}>
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
                    
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
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
                        {currentUser.role === 'Admin' && (
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