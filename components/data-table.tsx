// app/admin/attendees/page.tsx
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Users, UserPlus, Download, Filter, Search, Eye, Edit, 
  Mail, Trash2, MoreVertical, CheckCircle, XCircle, 
  MapPin, Building, Phone, UserCheck,
  QrCode, Star, MessageSquare
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const generateAttendees = (count: number) => {
  const countries = ['Ethiopia', 'USA', 'UK', 'China', 'India', 'Kenya'];
  const occupations = ['Investor', 'CEO', 'Director', 'Manager', 'Analyst'];
  const organizations = ['Microsoft', 'Google', 'World Bank', 'Safaricom', 'Dangote'];
  const interests = ['Technology', 'Agriculture', 'Energy', 'Finance', 'Infrastructure'];
  const types = ['VIP', 'Standard', 'Speaker', 'Media'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `ATT-${1000 + i}`,
    firstName: ['John', 'Jane', 'Michael', 'Sarah', 'David'][i % 5],
    lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 5],
    email: `user${i}@example.com`,
    phone: `+251-9${Math.floor(Math.random() * 9000000 + 1000000)}`,
    occupation: occupations[Math.floor(Math.random() * occupations.length)],
    organization: organizations[Math.floor(Math.random() * organizations.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    interests: interests.slice(0, Math.floor(Math.random() * 3) + 1),
    type: types[Math.floor(Math.random() * types.length)],
    isCheckedIn: Math.random() > 0.3,
    checkInTime: Math.random() > 0.3 ? new Date().toISOString() : null,
    groupSize: Math.floor(Math.random() * 5) + 1,
    registeredDate: new Date(Date.now() - Math.random() * 604800000).toISOString(),
  }));
};

const attendees = generateAttendees(50);

export default function AttendeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = 
      attendee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || attendee.type === filterType;
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'checked-in' && attendee.isCheckedIn) ||
      (filterStatus === 'pending' && !attendee.isCheckedIn);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: attendees.length,
    checkedIn: attendees.filter(a => a.isCheckedIn).length,
    vip: attendees.filter(a => a.type === 'VIP').length,
    speakers: attendees.filter(a => a.type === 'Speaker').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendee Management</h1>
          <p className="text-muted-foreground">Manage and view all registered attendees</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Attendee
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Attendees</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Checked In</p>
                <p className="text-2xl font-bold">{stats.checkedIn}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">VIP Attendees</p>
                <p className="text-2xl font-bold">{stats.vip}</p>
              </div>
              <Star className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Speakers</p>
                <p className="text-2xl font-bold">{stats.speakers}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or organization..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Speaker">Speaker</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attendee</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Interests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendees.map((attendee) => (
                      <TableRow key={attendee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {attendee.firstName[0]}{attendee.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {attendee.firstName} {attendee.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">{attendee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{attendee.organization}</div>
                            <div className="text-sm text-muted-foreground">{attendee.occupation}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {attendee.country}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            attendee.type === 'VIP' ? 'default' : 
                            attendee.type === 'Speaker' ? 'secondary' : 'outline'
                          }>
                            {attendee.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {attendee.interests.map((interest) => (
                              <Badge key={interest} variant="secondary" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {attendee.isCheckedIn ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-green-600">Checked In</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-amber-500" />
                                <span className="text-amber-600">Pending</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <QrCode className="h-4 w-4 mr-2" />
                                Print Badge
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAttendees.slice(0, 9).map((attendee) => (
                  <Card key={attendee.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {attendee.firstName[0]}{attendee.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Badge variant={
                          attendee.type === 'VIP' ? 'default' : 
                          attendee.type === 'Speaker' ? 'secondary' : 'outline'
                        }>
                          {attendee.type}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">
                          {attendee.firstName} {attendee.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{attendee.email}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-3 w-3" />
                          {attendee.organization}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3" />
                          {attendee.country}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {attendee.phone}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {attendee.isCheckedIn ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-amber-500" />
                            )}
                            <span className="text-sm">
                              {attendee.isCheckedIn ? 'Checked In' : 'Pending'}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}