'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AttendeeRegistration } from '@/lib/adminApi';
import {
  CheckCircle,
  Clock,
  Copy,
  Download,
  Eye,
  MapPin,
  MoreVertical,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import { getCategoryLabel, getCountryLabel } from './attendeeUtils';

export interface Column<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
}

interface AttendeesTableProps {
  columns: Column<AttendeeRegistration>[];
  attendees: AttendeeRegistration[];
  sortColumn: keyof AttendeeRegistration | null;
  sortDirection: 'asc' | 'desc';
  onSort: (columnId: keyof AttendeeRegistration) => void;
  onViewAttendee: (attendee: AttendeeRegistration) => void;
  onCopyEmail: (attendee: AttendeeRegistration) => void;
  onCheckIn: (attendee: AttendeeRegistration) => void;
  onExportSingle: (attendee: AttendeeRegistration) => void;
  onDeleteAttendee: (attendee: AttendeeRegistration) => void;
  searchTerm: string;
  onClearSearch: () => void;
}

export default function AttendeesTable({
  columns,
  attendees,
  sortColumn,
  sortDirection,
  onSort,
  onViewAttendee,
  onCopyEmail,
  onCheckIn,
  onExportSingle,
  onDeleteAttendee,
  searchTerm,
  onClearSearch,
}: AttendeesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id.toString()}
                className={column.sortable ? 'cursor-pointer hover:bg-accent' : ''}
                onClick={() => column.sortable && onSort(column.id)}
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
          {attendees.length > 0 ? (
            attendees.map((attendee) => (
              <TableRow key={attendee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {attendee.firstName?.[0]}
                        {attendee.lastName?.[0]}
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
                      {attendee.jobTitle || '—'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {getCountryLabel(attendee.country)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getCategoryLabel(attendee.category, attendee.otherCategory)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {attendee.needsVisa ? (
                      <Badge variant="secondary">Visa</Badge>
                    ) : null}
                    {attendee.siteVisit ? (
                      <Badge variant="secondary">Site Visit</Badge>
                    ) : null}
                    {!attendee.needsVisa && !attendee.siteVisit && (
                      <Badge variant="outline">None</Badge>
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
                        attendee.isCheckedIn ? 'text-green-600' : 'text-amber-600'
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
                        <DropdownMenuItem onClick={() => onViewAttendee(attendee)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => onCopyEmail(attendee)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Email Address
                        </DropdownMenuItem>
                        {!attendee.isCheckedIn && (
                          <DropdownMenuItem onClick={() => onCheckIn(attendee)}>
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
                        <DropdownMenuItem onClick={() => onExportSingle(attendee)}>
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDeleteAttendee(attendee)}
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
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Users className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No attendees found</p>
                  {searchTerm && (
                    <Button variant="ghost" size="sm" onClick={onClearSearch}>
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
  );
}
