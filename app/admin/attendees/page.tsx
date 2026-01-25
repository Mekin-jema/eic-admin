// app/admin/attendees/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  UserPlus,
  Download,
  Filter,
  Search,
  Eye,
  MapPin,
  UserCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  QrCode,
  CheckCircle,
  UserX,
  Copy,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEicAdminStore } from '@/store/useEicAdminStore';
import Loading from './loading';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

// Define column structure for sorting
interface Column<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
}

// Local attendee type to ensure strong typing within this page
interface Attendee {
  id: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  organization?: string;
  occupation?: string;
  country?: string;
  registrationType?: string;
  interests?: string[];
  isCheckedIn?: boolean;
}

export default function AttendeesPage() {
  const attendees = useEicAdminStore((s) => s.attendees) as Attendee[];
  const loading = useEicAdminStore((s) => s.loading);
  const fetchAttendees = useEicAdminStore((s) => s.fetchAttendees);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof Attendee | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Alert dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);

  useEffect(() => {
    fetchAttendees();
  }, [fetchAttendees]);

  const registrationTypes = useMemo(() => {
    const set = new Set<string>();
    attendees.forEach((a) => {
      if (a.registrationType) set.add(a.registrationType);
    });
    return Array.from(set);
  }, [attendees]);

  // Define table columns
  const columns: Column<Attendee>[] = [
    { id: 'firstName', label: 'Attendee', sortable: true },
    { id: 'organization', label: 'Organization', sortable: true },
    { id: 'country', label: 'Country', sortable: true },
    { id: 'registrationType', label: 'Type', sortable: true },
    { id: 'interests', label: 'Interests', sortable: false },
    { id: 'isCheckedIn', label: 'Status', sortable: true },
  ];

  // Filter and sort attendees
  // Normalize values to strings for safe comparison in sorting
  const toComparable = (val: unknown): string => {
    if (val == null) return '';
    if (typeof val === 'string') return val.toLowerCase();
    if (typeof val === 'boolean') return val ? '1' : '0';
    if (Array.isArray(val)) return String(val.length);
    return String(val).toLowerCase();
  };

  const processedAttendees = useMemo(() => {
    const filtered = attendees.filter((attendee) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        attendee.firstName?.toLowerCase().includes(term) ||
        attendee.lastName?.toLowerCase().includes(term) ||
        attendee.email?.toLowerCase().includes(term) ||
        (attendee.organization || '').toLowerCase().includes(term);

      const matchesType = filterType === 'all' || attendee.registrationType === filterType;
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'checked-in' && attendee.isCheckedIn) ||
        (filterStatus === 'pending' && !attendee.isCheckedIn);

      return matchesSearch && matchesType && matchesStatus;
    });

    // Apply sorting
    if (sortColumn) {
      const column = sortColumn;
      filtered.sort((a, b) => {
        let aValue: unknown = a[column];
        let bValue: unknown = b[column];

        // Handle nested properties or special cases
        if (column === 'firstName') {
          aValue = `${a.firstName ?? ''} ${a.lastName ?? ''}`;
          bValue = `${b.firstName ?? ''} ${b.lastName ?? ''}`;
        }

        const aComp = toComparable(aValue);
        const bComp = toComparable(bValue);

        if (aComp < bComp) return sortDirection === 'asc' ? -1 : 1;
        if (aComp > bComp) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [attendees, searchTerm, filterType, filterStatus, sortColumn, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(processedAttendees.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAttendees = processedAttendees.slice(startIndex, endIndex);

  const stats = {
    total: attendees.length,
    checkedIn: attendees.filter((a) => a.isCheckedIn).length,
    vip: attendees.filter((a) => a.registrationType === 'VIP').length,
    speakers: attendees.filter((a) => a.registrationType === 'Speaker').length,
  };

  // Handle sort click
  const handleSort = (columnId: keyof Attendee) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);

      items.push(1);
      
      if (leftBound > 2) items.push('ellipsis-left');
      
      for (let i = leftBound; i <= rightBound; i++) {
        items.push(i);
      }
      
      if (rightBound < totalPages - 1) items.push('ellipsis-right');
      
      if (totalPages > 1) items.push(totalPages);
    }
    
    return items;
  };

  // Action handlers
  const handleViewAttendee = (attendee: Attendee) => {
    toast.info(`Viewing ${attendee.firstName} ${attendee.lastName}`);
    // Add your view logic here
  };

  const handleEditAttendee = (attendee: Attendee) => {
    toast.info(`Editing ${attendee.firstName} ${attendee.lastName}`);
    // Add your edit logic here
  };

  const handleSendEmail = (attendee: Attendee) => {
    toast.success(`Email sent to ${attendee.email}`);
    // Add your email logic here
  };

  const handleCheckIn = (attendee: Attendee) => {
    toast.success(`${attendee.firstName} ${attendee.lastName} checked in successfully`);
    // Add your check-in logic here
  };

  const handleGenerateBadge = (attendee: Attendee) => {
    toast.info(`Generating badge for ${attendee.firstName} ${attendee.lastName}`);
    // Add your badge generation logic here
  };

  const handleCopyEmail = (attendee: Attendee) => {
    if (attendee.email) {
      navigator.clipboard.writeText(attendee.email);
      toast.success('Email copied to clipboard');
    }
  };

  const handleDeleteAttendee = (attendee: Attendee) => {
    setSelectedAttendee(attendee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAttendee) {
      toast.success(`Deleted ${selectedAttendee.firstName} ${selectedAttendee.lastName}`);
      // Add your delete logic here
      setDeleteDialogOpen(false);
      setSelectedAttendee(null);
    }
  };

  const handleExportSingle = (attendee: Attendee) => {
    toast.info(`Exported data for ${attendee.firstName} ${attendee.lastName}`);
    // Add your export logic here
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 pl-9 pr-4">
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }} 
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value) => {
                setFilterType(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Registration Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {registrationTypes.map((rt) => (
                    <SelectItem key={rt} value={rt}>{rt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(value) => {
                setFilterStatus(value);
                setCurrentPage(1);
              }}>
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

      
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attendee Directory</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, processedAttendees.length)} of {processedAttendees.length}
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead
                          key={column.id.toString()}
                          className={column.sortable ? 'cursor-pointer hover:bg-accent' : ''}
                          onClick={() => column.sortable && handleSort(column.id)}
                        >
                          <div className="flex items-center gap-1">
                            {column.label}
                            {column.sortable && sortColumn === column.id && (
                              <span className="text-xs">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAttendees.length > 0 ? (
                      paginatedAttendees.map((attendee) => (
                        <TableRow key={attendee.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {attendee.firstName?.[0]}{attendee.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {attendee.firstName} {attendee.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {attendee.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{attendee.organization || '—'}</div>
                              <div className="text-sm text-muted-foreground">
                                {attendee.occupation || '—'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {attendee.country || '—'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                attendee.registrationType === 'VIP'
                                  ? 'default'
                                  : attendee.registrationType === 'Speaker'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {attendee.registrationType || 'Standard'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {attendee.interests?.slice(0, 2).map((interest) => (
                                <Badge
                                  key={interest}
                                  variant="outline"
                                  className="mr-1 mb-1"
                                >
                                  {interest}
                                </Badge>
                              ))}
                              {(attendee.interests?.length ?? 0) > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{(attendee.interests?.length ?? 0) - 2} more
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {attendee.isCheckedIn ? (
                                <UserCheck className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-amber-500" />
                              )}
                              <span
                                className={
                                  attendee.isCheckedIn
                                    ? 'text-green-600'
                                    : 'text-amber-600'
                                }
                              >
                                {attendee.isCheckedIn ? 'Checked In' : 'Pending'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                             
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleViewAttendee(attendee)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditAttendee(attendee)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Attendee
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleSendEmail(attendee)}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleCopyEmail(attendee)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Email Address
                                  </DropdownMenuItem>
                                  {!attendee.isCheckedIn && (
                                    <DropdownMenuItem onClick={() => handleCheckIn(attendee)}>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Check In
                                    </DropdownMenuItem>
                                  )}
                                  {attendee.isCheckedIn && (
                                    <DropdownMenuItem>
                                      <UserX className="h-4 w-4 mr-2" />
                                      Undo Check-in
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => handleGenerateBadge(attendee)}>
                                    <QrCode className="h-4 w-4 mr-2" />
                                    Generate Badge
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleExportSingle(attendee)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Data
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDeleteAttendee(attendee)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Attendee
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Users className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No attendees found</p>
                            {searchTerm && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchTerm('')}
                              >
                                Clear search
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {processedAttendees.length > 0 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(1)}
                          className={
                            currentPage === 1
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </PaginationPrevious>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={
                            currentPage === 1
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </PaginationPrevious>
                      </PaginationItem>

                      {getPaginationItems().map((item, index) => {
                        if (item === 'ellipsis-left' || item === 'ellipsis-right') {
                          return (
                            <PaginationItem key={`ellipsis-${index}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }

                        return (
                          <PaginationItem key={item}>
                            <PaginationLink
                              onClick={() => setCurrentPage(item as number)}
                              isActive={currentPage === item}
                              className="cursor-pointer"
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={
                            currentPage === totalPages
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        >
                          <ChevronRight className="h-4 w-4" />
                        </PaginationNext>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(totalPages)}
                          className={
                            currentPage === totalPages
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
    

      
    

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              <span className="font-semibold">
                {selectedAttendee?.firstName} {selectedAttendee?.lastName}&apos;s
              </span>{' '}
              registration and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAttendee(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Attendee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}