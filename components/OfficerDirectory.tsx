'use client';

import { useState } from 'react';
import type { User, Officer } from '@/types';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Shield
} from 'lucide-react';

interface OfficerDirectoryProps {
  currentUser: User;
}

export default function OfficerDirectory({ currentUser }: OfficerDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  const officers: Officer[] = [
    // CEO Level
    {
      id: 1,
      name: 'Robert Johnson',
      position: 'CEO',
      department: 'Executive',
      email: 'robert.johnson@company.com',
      phone: '+1 (555) 001-0001',
      avatar: '/api/placeholder/64/64',
      joinDate: '2018-01-15',
      directReports: 4,
      status: 'active'
    },
    
    // SVP Level
    {
      id: 2,
      name: 'Sarah Williams',
      position: 'SVP',
      department: 'Operations',
      email: 'sarah.williams@company.com',
      phone: '+1 (555) 002-0002',
      avatar: '/api/placeholder/64/64',
      joinDate: '2019-03-20',
      reportingTo: 'Robert Johnson',
      directReports: 3,
      status: 'active'
    },
    {
      id: 3,
      name: 'Michael Chen',
      position: 'SVP',
      department: 'Technology',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 003-0003',
      avatar: '/api/placeholder/64/64',
      joinDate: '2019-06-10',
      reportingTo: 'Robert Johnson',
      directReports: 4,
      status: 'active'
    },
    {
      id: 4,
      name: 'Emily Davis',
      position: 'SVP',
      department: 'Finance',
      email: 'emily.davis@company.com',
      phone: '+1 (555) 004-0004',
      avatar: '/api/placeholder/64/64',
      joinDate: '2020-01-08',
      reportingTo: 'Robert Johnson',
      directReports: 2,
      status: 'active'
    },
    
    // VP Level
    {
      id: 5,
      name: 'David Wilson',
      position: 'VP',
      department: 'Sales',
      email: 'david.wilson@company.com',
      phone: '+1 (555) 005-0005',
      avatar: '/api/placeholder/64/64',
      joinDate: '2020-04-15',
      reportingTo: 'Sarah Williams',
      directReports: 5,
      status: 'active'
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      position: 'VP',
      department: 'Marketing',
      email: 'lisa.anderson@company.com',
      phone: '+1 (555) 006-0006',
      avatar: '/api/placeholder/64/64',
      joinDate: '2020-07-22',
      reportingTo: 'Sarah Williams',
      directReports: 4,
      status: 'active'
    },
    {
      id: 7,
      name: 'James Rodriguez',
      position: 'VP',
      department: 'Engineering',
      email: 'james.rodriguez@company.com',
      phone: '+1 (555) 007-0007',
      avatar: '/api/placeholder/64/64',
      joinDate: '2021-02-10',
      reportingTo: 'Michael Chen',
      directReports: 8,
      status: 'active'
    },
    {
      id: 8,
      name: 'Maria Garcia',
      position: 'VP',
      department: 'HR',
      email: 'maria.garcia@company.com',
      phone: '+1 (555) 008-0008',
      avatar: '/api/placeholder/64/64',
      joinDate: '2021-05-18',
      reportingTo: 'Sarah Williams',
      directReports: 3,
      status: 'active'
    },
    
    // Officer Level
    {
      id: 9,
      name: 'John Smith',
      position: 'Officer',
      department: 'Sales',
      email: 'john.smith@company.com',
      phone: '+1 (555) 009-0009',
      avatar: '/api/placeholder/64/64',
      joinDate: '2021-08-12',
      reportingTo: 'David Wilson',
      directReports: 6,
      status: 'active'
    },
    {
      id: 10,
      name: 'Jennifer Brown',
      position: 'Officer',
      department: 'Marketing',
      email: 'jennifer.brown@company.com',
      phone: '+1 (555) 010-0010',
      avatar: '/api/placeholder/64/64',
      joinDate: '2021-11-03',
      reportingTo: 'Lisa Anderson',
      directReports: 4,
      status: 'active'
    },
    {
      id: 11,
      name: 'Thomas Lee',
      position: 'Officer',
      department: 'Engineering',
      email: 'thomas.lee@company.com',
      phone: '+1 (555) 011-0011',
      avatar: '/api/placeholder/64/64',
      joinDate: '2022-01-20',
      reportingTo: 'James Rodriguez',
      directReports: 5,
      status: 'active'
    },
    {
      id: 12,
      name: 'Amanda Taylor',
      position: 'Officer',
      department: 'Finance',
      email: 'amanda.taylor@company.com',
      phone: '+1 (555) 012-0012',
      avatar: '/api/placeholder/64/64',
      joinDate: '2022-03-15',
      reportingTo: 'Emily Davis',
      directReports: 3,
      status: 'active'
    },
    
    // Staff Level
    {
      id: 13,
      name: 'Kevin Johnson',
      position: 'Staff',
      department: 'Sales',
      email: 'kevin.johnson@company.com',
      phone: '+1 (555) 013-0013',
      avatar: '/api/placeholder/64/64',
      joinDate: '2022-06-08',
      reportingTo: 'John Smith',
      directReports: 0,
      status: 'active'
    },
    {
      id: 14,
      name: 'Rachel White',
      position: 'Staff',
      department: 'Marketing',
      email: 'rachel.white@company.com',
      phone: '+1 (555) 014-0014',
      avatar: '/api/placeholder/64/64',
      joinDate: '2022-08-22',
      reportingTo: 'Jennifer Brown',
      directReports: 0,
      status: 'active'
    },
    {
      id: 15,
      name: 'Daniel Martinez',
      position: 'Staff',
      department: 'Engineering',
      email: 'daniel.martinez@company.com',
      phone: '+1 (555) 015-0015',
      avatar: '/api/placeholder/64/64',
      joinDate: '2022-10-10',
      reportingTo: 'Thomas Lee',
      directReports: 0,
      status: 'active'
    },
    {
      id: 16,
      name: 'Michelle Clark',
      position: 'Staff',
      department: 'HR',
      email: 'michelle.clark@company.com',
      phone: '+1 (555) 016-0016',
      avatar: '/api/placeholder/64/64',
      joinDate: '2023-01-12',
      reportingTo: 'Maria Garcia',
      directReports: 0,
      status: 'on-leave'
    },
    {
      id: 17,
      name: 'Christopher Davis',
      position: 'Staff',
      department: 'Finance',
      email: 'christopher.davis@company.com',
      phone: '+1 (555) 017-0017',
      avatar: '/api/placeholder/64/64',
      joinDate: '2023-03-20',
      reportingTo: 'Amanda Taylor',
      directReports: 0,
      status: 'active'
    },
    {
      id: 18,
      name: 'Ashley Wilson',
      position: 'Staff',
      department: 'Sales',
      email: 'ashley.wilson@company.com',
      phone: '+1 (555) 018-0018',
      avatar: '/api/placeholder/64/64',
      joinDate: '2023-05-15',
      reportingTo: 'John Smith',
      directReports: 0,
      status: 'active'
    }
  ];

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'CEO': return Crown;
      case 'SVP': return Award;
      case 'VP': return Star;
      case 'Officer': return Shield;
      case 'Staff': return UserCheck;
      default: return Users;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'CEO': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SVP': return 'bg-red-100 text-red-800 border-red-200';
      case 'VP': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Officer': return 'bg-green-100 text-green-800 border-green-200';
      case 'Staff': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOfficers = officers.filter(officer => {
    const matchesSearch = officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === 'all' || officer.position === filterPosition;
    const matchesDepartment = filterDepartment === 'all' || officer.department === filterDepartment;
    
    return matchesSearch && matchesPosition && matchesDepartment;
  });

  const positionHierarchy = ['CEO', 'SVP', 'VP', 'Officer', 'Staff'];
  const sortedOfficers = filteredOfficers.sort((a, b) => {
    const aIndex = positionHierarchy.indexOf(a.position);
    const bIndex = positionHierarchy.indexOf(b.position);
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.name.localeCompare(b.name);
  });

  const departments = Array.from(new Set(officers.map(o => o.department)));
  const positionCounts = positionHierarchy.reduce((acc, position) => {
    acc[position] = officers.filter(o => o.position === position).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Officer Directory</h2>
          <p className="text-muted-foreground">Company organizational structure and employee directory</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {positionHierarchy.map((position) => {
          const PositionIcon = getPositionIcon(position);
          return (
            <Card key={position}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{position}</p>
                    <p className="text-2xl font-bold">{positionCounts[position] || 0}</p>
                  </div>
                  <PositionIcon className="h-8 w-8 text-primary" />
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
          <div className="flex flex-col md:flex-row gap-4">
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
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positionHierarchy.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Officer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedOfficers.map((officer) => {
          const PositionIcon = getPositionIcon(officer.position);
          return (
            <Card key={officer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={officer.avatar} alt={officer.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {officer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg truncate">{officer.name}</h3>
                      <Badge variant="outline" className={getStatusColor(officer.status)}>
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>{officer.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{officer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{officer.phone}</span>
                      </div>
                      {officer.reportingTo && (
                        <div className="text-sm text-muted-foreground">
                          Reports to: <span className="font-medium">{officer.reportingTo}</span>
                        </div>
                      )}
                      {officer.directReports && officer.directReports > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{officer.directReports} direct reports</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(officer.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
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
      <Dialog open={!!selectedOfficer} onOpenChange={() => setSelectedOfficer(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedOfficer?.avatar} alt={selectedOfficer?.name} />
                <AvatarFallback>
                  {selectedOfficer?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{selectedOfficer?.name}</h3>
                <p className="text-muted-foreground">{selectedOfficer?.position} - {selectedOfficer?.department}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedOfficer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Position</label>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const PositionIcon = getPositionIcon(selectedOfficer.position);
                      return <PositionIcon className="h-4 w-4" />;
                    })()}
                    <span>{selectedOfficer.position}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedOfficer.status)}>
                      {selectedOfficer.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="mt-1">{selectedOfficer.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="mt-1">{selectedOfficer.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                <p className="mt-1">{selectedOfficer.department}</p>
              </div>
              {selectedOfficer.reportingTo && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reports To</label>
                  <p className="mt-1">{selectedOfficer.reportingTo}</p>
                </div>
              )}
              {selectedOfficer.directReports && selectedOfficer.directReports > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Direct Reports</label>
                  <p className="mt-1">{selectedOfficer.directReports} employees</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                <p className="mt-1">{new Date(selectedOfficer.joinDate).toLocaleDateString()}</p>
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
            <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}