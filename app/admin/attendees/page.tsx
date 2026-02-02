// app/admin/attendees/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useEicAdminStore } from '@/store/useEicAdminStore';
import type { AttendeeRegistration } from '@/lib/adminApi';
import { API_BASE, deleteAttendeeById, updateAttendeeById, sendAttendeeEmail, getAttendeeBadgeUrl, getAttendeeExportUrl } from '@/lib/adminApi';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Define column structure for sorting
interface Column<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
}

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
    { id: 'attendance', label: 'Attendance', sortable: true },
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
        (attendee.attendance || '').toLowerCase().includes(term);

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
const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Verified | Ethiopian Investment Commission</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: linear-gradient(135deg, #071910 0%, #0d261a 100%);
      color: #ffffff;
    }
    
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 16px !important;
      }
      .hero-section {
        padding: 32px 24px !important;
      }
      .badge-card {
        padding: 20px !important;
      }
      .info-grid {
        grid-template-columns: 1fr !important;
      }
      .header-logo {
        width: 180px !important;
      }
      .button-container {
        flex-direction: column !important;
      }
      .button {
        width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #071910 0%, #0d261a 100%); padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" class="container" style="background: #0d261a; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); margin: 0 auto; border: 1px solid #1e462f;">
          
          <!-- Gold Top Banner -->
          <tr>
            <td style="background: linear-gradient(90deg, #d7b15a 0%, #c19a4a 100%); height: 8px;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="https://eic-frontend.vercel.app/_next/image?url=%2FEIC.png&w=256&q=75" alt="Ethiopian Investment Commission" class="header-logo" style="height: 48px; width: auto; filter: brightness(0) invert(1);">
                  </td>
                  <td align="right" style="color: #a7f3d0; font-size: 14px; font-weight: 500;">
                    Official Verification
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td class="hero-section" style="padding: 40px 40px 32px; text-align: center; background: linear-gradient(135deg, rgba(215, 177, 90, 0.1) 0%, rgba(215, 177, 90, 0.05) 100%);">
              <div style="display: inline-block; background: linear-gradient(135deg, #d7b15a 0%, #c19a4a 100%); padding: 20px; border-radius: 50%; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(215, 177, 90, 0.3);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                  <circle cx="12" cy="12" r="12" fill="white"/>
                  <path d="M7 12L10 15L17 8" stroke="#d7b15a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1 style="margin: 0 0 12px; font-size: 36px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                Registration Successfully Verified
              </h1>
              <p style="margin: 0; font-size: 18px; color: #a7f3d0; line-height: 1.5; font-weight: 400;">
                Your credentials have been approved for Ethiopia Investment Conference
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0 0 24px; font-size: 16px; color: #a7f3d0; line-height: 1.6;">
                Dear <strong style="color: #ffffff;">${attendee.firstName} ${attendee.lastName}</strong>,
                <br><br>
                Congratulations! Your registration for the <strong>Ethiopia Investment Conference 2024</strong> has been thoroughly reviewed and validated. We are pleased to inform you that all submitted documents meet our requirements.
              </p>

              <!-- Status Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(215, 177, 90, 0.1); border: 2px solid #d7b15a; border-radius: 16px; padding: 24px; margin: 32px 0;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="60" style="padding-right: 20px;">
                          <div style="background: linear-gradient(135deg, #d7b15a 0%, #c19a4a 100%); border-radius: 12px; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </div>
                        </td>
                        <td>
                          <h3 style="margin: 0 0 8px; font-size: 20px; color: #ffffff; font-weight: 600;">
                            STATUS: <span style="color: #d7b15a; font-weight: 700;">APPROVED ✓</span>
                          </h3>
                          <p style="margin: 0; font-size: 15px; color: #a7f3d0;">
                            All documents verified and validated for event participation
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Verified Information Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #113a27; border-radius: 16px; padding: 32px; margin: 32px 0; border: 1px solid #1e462f;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 28px; font-size: 22px; font-weight: 600; color: #d7b15a; text-align: center;">
                      VERIFIED ATTENDEE INFORMATION
                    </h2>
                    
                    <!-- Information Grid -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0 16px;">
                      <tr>
                        <td width="50%" style="padding: 0 8px 0 0;">
                          <div style="background: #0d261a; border-radius: 12px; padding: 20px; border: 1px solid #1e462f;">
                            <div style="color: #a7f3d0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                              Full Name
                            </div>
                            <div style="color: #ffffff; font-size: 18px; font-weight: 600;">
                              ${attendee.firstName} ${attendee.lastName}
                            </div>
                          </div>
                        </td>
                        <td width="50%" style="padding: 0 0 0 8px;">
                          <div style="background: #0d261a; border-radius: 12px; padding: 20px; border: 1px solid #1e462f;">
                            <div style="color: #a7f3d0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                              Attendee ID
                            </div>
                            <div style="color: #d7b15a; font-size: 18px; font-weight: 700; letter-spacing: 0.5px;">
                              ${attendee.id}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding: 0 8px 0 0;">
                          <div style="background: #0d261a; border-radius: 12px; padding: 20px; border: 1px solid #1e462f;">
                            <div style="color: #a7f3d0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                              Email Address
                            </div>
                            <div style="color: #ffffff; font-size: 16px; font-weight: 500;">
                              ${attendee.email}
                            </div>
                          </div>
                        </td>
                        <td width="50%" style="padding: 0 0 0 8px;">
                          <div style="background: #0d261a; border-radius: 12px; padding: 20px; border: 1px solid #1e462f;">
                            <div style="color: #a7f3d0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                              Organization
                            </div>
                            <div style="color: #ffffff; font-size: 16px; font-weight: 500;">
                              ${attendee.organization || '—'}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <div style="background: rgba(215, 177, 90, 0.1); border-radius: 12px; padding: 20px; border: 1px solid #d7b15a;">
                            <div style="color: #a7f3d0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                              Verification Summary
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                              <div style="background: #10b981; width: 10px; height: 10px; border-radius: 50%;"></div>
                              <span style="color: #10b981; font-size: 16px; font-weight: 600;">
                                ✓ Identity Documents: Verified
                              </span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
                              <div style="background: #10b981; width: 10px; height: 10px; border-radius: 50%;"></div>
                              <span style="color: #10b981; font-size: 16px; font-weight: 600;">
                                ✓ Registration Details: Approved
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Call to Action -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 20px; font-size: 18px; color: #d7b15a; font-weight: 600;">
                      Your digital access badge is ready for download
                    </p>
                    <table class="button-container" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td>
                          <a href="${getAttendeeBadgeUrl(attendee.id)}" style="display: inline-block; background: linear-gradient(90deg, #d7b15a 0%, #c19a4a 100%); color: #0d261a; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 8px 24px rgba(215, 177, 90, 0.4); transition: all 0.3s ease; margin: 0 8px 8px 0;">
                            Download Digital Badge
                          </a>
                          <a href="https://eic-frontend.vercel.app/dashboard" style="display: inline-block; background: transparent; color: #d7b15a; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: 700; font-size: 16px; border: 2px solid #d7b15a; transition: all 0.3s ease; margin: 0 0 8px 8px;">
                            Access Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Important Instructions -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 28px; margin: 32px 0; border: 1px solid #1e462f;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 20px; font-size: 18px; color: #d7b15a; font-weight: 600; text-align: center;">
                      📋 Event Participation Instructions
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <div style="background: #d7b15a; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: #0d261a; font-weight: 700; font-size: 14px;">1</div>
                        </td>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0; font-size: 15px; color: #ffffff; line-height: 1.6;">
                            <strong>Download and print</strong> your digital badge before arrival
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <div style="background: #d7b15a; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: #0d261a; font-weight: 700; font-size: 14px;">2</div>
                        </td>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0; font-size: 15px; color: #ffffff; line-height: 1.6;">
                            <strong>Arrive 45 minutes early</strong> for security and check-in procedures
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <div style="background: #d7b15a; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: #0d261a; font-weight: 700; font-size: 14px;">3</div>
                        </td>
                        <td>
                          <p style="margin: 0; font-size: 15px; color: #ffffff; line-height: 1.6;">
                            <strong>Bring valid ID</strong> matching your registration details
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Contact Information -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(215, 177, 90, 0.1); border-radius: 12px; padding: 24px; margin: 32px 0;">
                <tr>
                  <td>
                    <h4 style="margin: 0 0 16px; font-size: 16px; color: #d7b15a; font-weight: 600; text-align: center;">
                      Need Assistance?
                    </h4>
                    <p style="margin: 0; font-size: 14px; color: #a7f3d0; line-height: 1.6; text-align: center;">
                      Contact our support team at 
                      <a href="mailto:support@eic.gov.et" style="color: #d7b15a; text-decoration: none; font-weight: 600;">support@eic.gov.et</a>
                      <br>
                      or call <a href="tel:+251115510033" style="color: #d7b15a; text-decoration: none; font-weight: 600;">(+251) 11 551 0033</a>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; color: #86efac; line-height: 1.6; text-align: center;">
                We look forward to welcoming you to Ethiopia Investment Conference 2024!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #071910; color: #a7f3d0; padding: 32px 40px; border-top: 1px solid #1e462f;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://eic-frontend.vercel.app/_next/image?url=%2FEIC.png&w=256&q=75" alt="EIC Logo" style="height: 32px; width: auto; opacity: 0.9; margin-bottom: 20px; filter: brightness(0) invert(1);">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #86efac;">
                      Ethiopian Investment Commission
                    </p>
                    <p style="margin: 0 0 20px; font-size: 12px; color: #a7f3d0; line-height: 1.5;">
                      በኢትዮጵያ ኢንቨስትመንት ኮሚሽን<br>
                      Driving economic growth through sustainable investment
                    </p>
                    
                    <!-- Social Links -->
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto 20px;">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="https://www.linkedin.com/company/iie-hlbf2025/" style="color: #a7f3d0; text-decoration: none; font-size: 12px;">LinkedIn</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://x.com/iie_hlbf2025?s=11" style="color: #a7f3d0; text-decoration: none; font-size: 12px;">Twitter</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://web.facebook.com/people/Invest-in-Ethiopiahlbf-2025/61574823326798/" style="color: #a7f3d0; text-decoration: none; font-size: 12px;">Facebook</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://www.instagram.com/investinethiopia_hlbf/" style="color: #a7f3d0; text-decoration: none; font-size: 12px;">Instagram</a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 24px 0 0; font-size: 11px; color: #4ade80; border-top: 1px solid #1e462f; padding-top: 16px; line-height: 1.6;">
                      This is an automated verification message. Please do not reply directly to this email.<br>
                      © 2024 Ethiopian Investment Commission. All rights reserved.<br>
                      <a href="https://eic-frontend.vercel.app/privacy" style="color: #86efac; text-decoration: none;">Privacy Policy</a> | 
                      <a href="https://eic-frontend.vercel.app/terms" style="color: #86efac; text-decoration: none;">Terms of Service</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

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


  const handleExportSingle = (attendee: Attendee) => {
    const url = getAttendeeExportUrl(attendee.id);
    window.open(url, '_blank');
    toast.info(`Exported data for ${attendee.firstName} ${attendee.lastName}`);
  };

  const categoryLabels: Record<string, string> = {
    inv: 'International Investor',
    loc: 'Domestic Investor',
    gov: 'Government Official',
    dip: 'Diplomat / Development Partner',
    med: 'Media',
    aca: 'Academia / Research Institution',
    con: 'Business Consultant',
    oth: 'Other',
  };

  const sectorLabels: Record<string, string> = {
    agri: 'Agriculture and Agribusiness',
    manu: 'Manufacturing and Industry',
    tech: 'Technology and Innovation',
    energy: 'Energy and Renewable Resources',
    infra: 'Infrastructure and Construction',
    tour: 'Tourism and Hospitality',
    health: 'Healthcare and Pharmaceuticals',
    fin: 'Finance and Banking',
    mine: 'Mining and Natural Resources',
    prop: 'Real Estate and Property Development',
    logi: 'Transportation and Logistics',
    tele: 'Telecommunications',
  };

  const attendanceLabels: Record<string, string> = {
    day1: 'Day 1',
    day2: 'Day 2',
    both: 'Both Days',
  };

  const getCategoryLabel = (value?: string | null) => (value ? categoryLabels[value] ?? value : '—');
  const getAttendanceLabel = (value?: string | null) => (value ? attendanceLabels[value] ?? value : '—');
  const getSectorLabel = (value?: string | null) => (value ? sectorLabels[value] ?? value : '—');
  const getCountryLabel = (value?: string | null) => {
    if (!value) return '—';
    if (value.length === 2) {
      try {
        const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
        return displayNames.of(value.toUpperCase()) ?? value;
      } catch {
        return value;
      }
    }
    return value;
  };

  const apiOrigin = API_BASE.replace(/\/api$/, '');
  const toFileUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${apiOrigin}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const yesNo = (value?: boolean | null) => (value ? 'Yes' : 'No');

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
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="inv">International Investor</SelectItem>
                  <SelectItem value="loc">Domestic Investor</SelectItem>
                  <SelectItem value="gov">Government Official</SelectItem>
                  <SelectItem value="dip">Diplomat / Development Partner</SelectItem>
                  <SelectItem value="med">Media</SelectItem>
                  <SelectItem value="aca">Academia / Research Institution</SelectItem>
                  <SelectItem value="con">Business Consultant</SelectItem>
                  <SelectItem value="oth">Other</SelectItem>
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
                              {getCategoryLabel(attendee.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {getAttendanceLabel(attendee.attendance)}
                            </span>
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
                        <TableCell colSpan={8} className="h-24 text-center">
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

      {/* Attendee Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Attendee Details</DialogTitle>
          </DialogHeader>
          {selectedAttendee ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Full Name</div>
                  <div className="font-medium">
                    {selectedAttendee.firstName} {selectedAttendee.lastName}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Email</div>
                  <div className="font-medium">{selectedAttendee.email}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Phone</div>
                  <div className="font-medium">{selectedAttendee.phoneNumber}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Country</div>
                  <div className="font-medium">{getCountryLabel(selectedAttendee.country)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Organization</div>
                  <div className="font-medium">{selectedAttendee.organization || '—'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Job Title</div>
                  <div className="font-medium">{selectedAttendee.jobTitle || '—'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Category</div>
                  <div className="font-medium">{getCategoryLabel(selectedAttendee.category)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Sector Interest</div>
                  <div className="font-medium">{getSectorLabel(selectedAttendee.sectorInterest)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Attendance</div>
                  <div className="font-medium">{getAttendanceLabel(selectedAttendee.attendance)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Communication Preference</div>
                  <div className="font-medium">{selectedAttendee.communicationPreference || '—'}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Has Existing Company</div>
                  <div className="font-medium">{yesNo(selectedAttendee.hasExistingCompany)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Company Name</div>
                  <div className="font-medium">{selectedAttendee.companyName || '—'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Company Sector</div>
                  <div className="font-medium">{selectedAttendee.companySector || '—'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Business License</div>
                  {toFileUrl(selectedAttendee.businessLicenseUrl) ? (
                    <a
                      href={toFileUrl(selectedAttendee.businessLicenseUrl) ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline"
                    >
                      View File
                    </a>
                  ) : (
                    <div className="font-medium">—</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Needs Visa</div>
                  <div className="font-medium">{yesNo(selectedAttendee.needsVisa)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Site Visit</div>
                  <div className="font-medium">{yesNo(selectedAttendee.siteVisit)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Special Requirements</div>
                  <div className="font-medium">{selectedAttendee.specialRequirements || '—'}</div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}