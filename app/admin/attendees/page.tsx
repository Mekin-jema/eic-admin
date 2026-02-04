// app/admin/attendees/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AttendeeDeleteDialog from '@/components/admin/attendees/AttendeeDeleteDialog';
import AttendeeDetailsDialog from '@/components/admin/attendees/AttendeeDetailsDialog';
import AttendeesPagination from '@/components/admin/attendees/AttendeesPagination';
import AttendeesTable, { type Column } from '@/components/admin/attendees/AttendeesTable';
import AttendeesToolbar from '@/components/admin/attendees/AttendeesToolbar';
import { buildVerificationEmailHtml } from '@/components/admin/attendees/emailTemplates';
import { useEicAdminStore } from '@/store/useEicAdminStore';
import type { AttendeeRegistration } from '@/lib/adminApi';
import {
  API_BASE,
  deleteAttendeeById,
  updateAttendeeById,
  sendAttendeeEmail,
  getAttendeeBadgeUrl,
  getAttendeeExportUrl,
} from '@/lib/adminApi';
import Loading from './loading';
import { toast } from 'sonner';

// Local attendee type to ensure strong typing within this page
type Attendee = AttendeeRegistration;

export default function AttendeesPage() {
  const attendees = useEicAdminStore((s) => s.attendees) as Attendee[];
  const router = useRouter();
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
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);

  useEffect(() => {
    fetchAttendees();
  }, [fetchAttendees]);

  // Individual-only: no registration type grouping

  // Define table columns
  const columns: Column<Attendee>[] = [
    { id: 'firstName', label: 'Attendee', sortable: true },
    { id: 'organization', label: 'Organization', sortable: true },
    { id: 'country', label: 'Country', sortable: true },
    { id: 'category', label: 'Category', sortable: true },
    { id: 'needsVisa', label: 'Requests', sortable: true },
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
        (attendee.organization || '').toLowerCase().includes(term) ||
        (attendee.jobTitle || '').toLowerCase().includes(term) ||
        (attendee.category || '').toLowerCase().includes(term) ||
        (attendee.otherCategory || '').toLowerCase().includes(term) ||
        (attendee.attendance || '').toLowerCase().includes(term) ||
        (attendee.day1Attendance || '').toLowerCase().includes(term) ||
        (attendee.day2Attendance || '').toLowerCase().includes(term) ||
        (attendee.day1Sessions || []).join(' ').toLowerCase().includes(term) ||
        (attendee.day2Sessions || []).join(' ').toLowerCase().includes(term);

      const matchesType = filterType === 'all' || attendee.category === filterType;
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
  const getPaginationItems = (): Array<number | 'ellipsis-left' | 'ellipsis-right'> => {
    const items: Array<number | 'ellipsis-left' | 'ellipsis-right'> = [];
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
    // If a detail page exists, navigate to it; else fallback to dialog
    if (typeof window !== 'undefined') {
      router.push(`/admin/attendees/${attendee.id}`);
    } else {
      setSelectedAttendee(attendee);
      setViewDialogOpen(true);
    }
  };


  const handleEditAttendee = (attendee: Attendee) => {
    // If an edit page exists, navigate to it; else fallback to info toast
    if (typeof window !== 'undefined') {
      router.push(`/admin/attendees/edit/${attendee.id}`);
    } else {
      toast.info(`Editing ${attendee.firstName} ${attendee.lastName}`);
    }
  };


  const handleSendEmail = async (attendee: Attendee) => {
    try {
      const htmlBody = buildVerificationEmailHtml(
        attendee,
        getAttendeeBadgeUrl(attendee.id)
      );

      await sendAttendeeEmail(attendee.id, {
        subject: 'EIC Event Information',
        body: htmlBody,
        includeBadge: true,
      });
      toast.success(`Email sent to ${attendee.email}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send email');
    }
  };


  const handleCheckIn = async (attendee: Attendee) => {
    try {
      await updateAttendeeById(attendee.id, { isCheckedIn: true });
      toast.success(`${attendee.firstName} ${attendee.lastName} checked in successfully`);
      await fetchAttendees();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to check in attendee');
    }
  };


  const handleGenerateBadge = (attendee: Attendee) => {
    const url = getAttendeeBadgeUrl(attendee.id);
    window.open(url, '_blank');
    toast.info(`Generating badge for ${attendee.firstName} ${attendee.lastName}`);
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

  const confirmDelete = async () => {
    if (selectedAttendee) {
      try {
        await deleteAttendeeById(selectedAttendee.id);
        toast.success(`Deleted ${selectedAttendee.firstName} ${selectedAttendee.lastName}`);
        setDeleteDialogOpen(false);
        setSelectedAttendee(null);
        await fetchAttendees();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete attendee');
      }
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) setSelectedAttendee(null);
  };

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open);
    if (!open) setSelectedAttendee(null);
  };


  const handleExportSingle = (attendee: Attendee) => {
    const url = getAttendeeExportUrl(attendee.id);
    window.open(url, '_blank');
    toast.info(`Exported data for ${attendee.firstName} ${attendee.lastName}`);
  };

  const apiOrigin = API_BASE.replace(/\/api$/, '');
  const toFileUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${apiOrigin}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 pl-9 pr-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendee Management</h1>
          <p className="text-muted-foreground">Manage and view all registered attendees</p>
        </div>
  
      </div>


      <Card>
        <CardContent className="pt-6">
          <AttendeesToolbar
            searchTerm={searchTerm}
            onSearchTermChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            filterType={filterType}
            onFilterTypeChange={(value) => {
              setFilterType(value);
              setCurrentPage(1);
            }}
            filterStatus={filterStatus}
            onFilterStatusChange={(value) => {
              setFilterStatus(value);
              setCurrentPage(1);
            }}
          />
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
              <AttendeesTable
                attendees={paginatedAttendees}
                columns={columns}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                onViewAttendee={handleViewAttendee}
                onCopyEmail={handleCopyEmail}
                onCheckIn={handleCheckIn}
                onExportSingle={handleExportSingle}
                onDeleteAttendee={handleDeleteAttendee}
                searchTerm={searchTerm}
                onClearSearch={() => setSearchTerm('')}
              />

              {/* Pagination */}
              {processedAttendees.length > 0 && (
                <AttendeesPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  items={getPaginationItems()}
                  onPageChange={setCurrentPage}
                />
              )}
            </CardContent>
          </Card>
    

      
    

      {/* Delete Confirmation Dialog */}
      <AttendeeDeleteDialog
        open={deleteDialogOpen}
        attendee={selectedAttendee}
        onOpenChange={handleDeleteDialogChange}
        onConfirm={confirmDelete}
        onCancel={() => handleDeleteDialogChange(false)}
      />

      {/* Attendee Details Dialog */}
      <AttendeeDetailsDialog
        open={viewDialogOpen}
        attendee={selectedAttendee}
        onOpenChange={handleViewDialogChange}
        toFileUrl={toFileUrl}
      />
    </div>
  );
}