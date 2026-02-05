'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAnalytics, getAttendees, type AttendeeRegistration } from '@/lib/adminApi';
import type {
  CustomReport,
  ExportHistoryEntry,
  FieldOption,
  ReportFilters,
  ReportTemplate,
  ScheduledReport,
} from '@/app/admin/reports/types';
import {
  createId,
  downloadCSV,
  formatBytes,
  getCategoryLabel,
  getCountryLabel,
  getNextRunLabel,
  getSectorLabel,
  toTitle,
} from '@/app/admin/reports/utils';
import { Calendar, CheckCircle, Globe, Target, Users } from 'lucide-react';

export const useReportsState = () => {
  const [attendees, setAttendees] = useState<AttendeeRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyAnalytics, setDailyAnalytics] = useState<Array<{ date: string; count: number }>>([]);
  const [reportSearch, setReportSearch] = useState('');
  const [reportFormatFilter, setReportFormatFilter] = useState('all');
  const [reportCategoryFilter, setReportCategoryFilter] = useState('all');
  const [customReportName, setCustomReportName] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>(['Name', 'Email', 'Organization']);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [outputFormat, setOutputFormat] = useState('CSV');
  const [schedule, setSchedule] = useState('none');
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: createId(),
      name: 'Daily Summary',
      schedule: 'Daily 8:00 AM',
      recipients: 3,
      next: 'Tomorrow 8:00 AM',
      active: true,
    },
    {
      id: createId(),
      name: 'Weekly Analytics',
      schedule: 'Every Monday 9:00 AM',
      recipients: 5,
      next: 'Next Monday 9:00 AM',
      active: true,
    },
    {
      id: createId(),
      name: 'VIP Updates',
      schedule: 'Every 6 hours',
      recipients: 2,
      next: 'Today 6:00 PM',
      active: true,
    },
    {
      id: createId(),
      name: 'Check-in Status',
      schedule: 'Every hour',
      recipients: 4,
      next: 'Today 4:00 PM',
      active: true,
    },
  ]);
  const [exportHistory, setExportHistory] = useState<ExportHistoryEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [attendeeRes, analyticsRes] = await Promise.all([getAttendees(), getAnalytics()]);
        setAttendees(attendeeRes.data || []);
        setDailyAnalytics(analyticsRes.data.dailyAnalytics.attendees || []);
        setError(null);
      } catch (err: any) {
        setError(err?.message || 'Failed to load reports data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const countryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    attendees.forEach((attendee) => {
      if (!attendee.country) return;
      const label = getCountryLabel(attendee.country);
      counts[label] = (counts[label] || 0) + 1;
    });
    return counts;
  }, [attendees]);

  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    attendees.forEach((attendee) => {
      if (!attendee.sectorInterest) return;
      const label = getSectorLabel(attendee.sectorInterest);
      counts[label] = (counts[label] || 0) + 1;
    });
    return counts;
  }, [attendees]);

  const reportTemplates: ReportTemplate[] = useMemo(() => {
    const attendeeRows = attendees.length;
    const checkInRows = attendees.filter((attendee) => attendee.isCheckedIn).length;
    const countryRows = Object.keys(countryCounts).length;
    const sectorRows = Object.keys(sectorCounts).length;
    const dailyRows = dailyAnalytics.length;

    const attendeeSize = formatBytes(new Blob([JSON.stringify(attendees)]).size);
    const checkInSize = formatBytes(new Blob([JSON.stringify(attendees.filter((a) => a.isCheckedIn))]).size);
    const countrySize = formatBytes(new Blob([JSON.stringify(countryCounts)]).size);
    const sectorSize = formatBytes(new Blob([JSON.stringify(sectorCounts)]).size);
    const dailySize = formatBytes(new Blob([JSON.stringify(dailyAnalytics)]).size);

    return [
      {
        id: 'attendees',
        title: 'Attendee Directory',
        description: 'Complete list with contact details',
        icon: Users,
        format: ['CSV'],
        lastGenerated: 'Live data',
        size: attendeeSize,
        rows: attendeeRows,
        category: 'attendance',
      },
      {
        id: 'checkin',
        title: 'Check-in Report',
        description: 'Detailed check-in analytics',
        icon: CheckCircle,
        format: ['CSV'],
        lastGenerated: 'Live data',
        size: checkInSize,
        rows: checkInRows,
        category: 'attendance',
      },
      {
        id: 'country',
        title: 'Country Analysis',
        description: 'Demographics by country',
        icon: Globe,
        format: ['CSV'],
        lastGenerated: 'Live data',
        size: countrySize,
        rows: countryRows,
        category: 'analytics',
      },
      {
        id: 'interests',
        title: 'Sector Interests',
        description: 'Investment sector distribution',
        icon: Target,
        format: ['CSV'],
        lastGenerated: 'Live data',
        size: sectorSize,
        rows: sectorRows,
        category: 'analytics',
      },
      {
        id: 'daily',
        title: 'Daily Summary',
        description: 'Day-wise activity report',
        icon: Calendar,
        format: ['CSV'],
        lastGenerated: 'Live data',
        size: dailySize,
        rows: dailyRows,
        category: 'analytics',
      },
    ];
  }, [attendees, countryCounts, sectorCounts, dailyAnalytics]);

  const filteredTemplates = useMemo(() => {
    const term = reportSearch.trim().toLowerCase();
    return reportTemplates.filter((report) => {
      const matchesSearch =
        !term || report.title.toLowerCase().includes(term) || report.description.toLowerCase().includes(term);
      const matchesFormat =
        reportFormatFilter === 'all' || report.format.some((fmt) => fmt.toLowerCase() === reportFormatFilter);
      const matchesCategory = reportCategoryFilter === 'all' || report.category === reportCategoryFilter;
      return matchesSearch && matchesFormat && matchesCategory;
    });
  }, [reportTemplates, reportSearch, reportFormatFilter, reportCategoryFilter]);

  const filterAttendeesBy = (filters: ReportFilters) => {
    return attendees.filter((attendee) => {
      if (filters.category !== 'all' && attendee.category !== filters.category) return false;
      if (filters.status === 'checked-in' && !attendee.isCheckedIn) return false;
      if (filters.status === 'pending' && attendee.isCheckedIn) return false;
      if (filters.dateRange !== 'all') {
        const created = attendee.createdAt ? new Date(attendee.createdAt) : null;
        if (!created) return false;
        const now = new Date();
        if (filters.dateRange === 'today') {
          const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (created < start) return false;
        }
        if (filters.dateRange === 'week') {
          const start = new Date(now);
          start.setDate(now.getDate() - 7);
          if (created < start) return false;
        }
        if (filters.dateRange === 'month') {
          const start = new Date(now);
          start.setDate(now.getDate() - 30);
          if (created < start) return false;
        }
      }
      return true;
    });
  };

  const filteredAttendees = useMemo(() => {
    return filterAttendeesBy({ category: filterCategory, status: filterStatus, dateRange: filterDateRange });
  }, [attendees, filterCategory, filterStatus, filterDateRange]);

  const fieldOptions: FieldOption[] = useMemo(
    () => [
      { label: 'Name', get: (a) => `${a.firstName} ${a.lastName}`.trim() },
      { label: 'Email', get: (a) => a.email },
      { label: 'Phone', get: (a) => a.phoneNumber },
      { label: 'Country', get: (a) => getCountryLabel(a.country) },
      { label: 'Organization', get: (a) => a.organization ?? '' },
      { label: 'Job Title', get: (a) => a.jobTitle ?? '' },
      { label: 'Category', get: (a) => getCategoryLabel(a.category, a.otherCategory) },
      { label: 'Sector Interest', get: (a) => getSectorLabel(a.sectorInterest) },
      { label: 'Attendance', get: (a) => a.attendance ?? '' },
      { label: 'Visa Assistance', get: (a) => (a.needsVisa ? 'Yes' : 'No') },
      { label: 'Site Visit', get: (a) => (a.siteVisit ? 'Yes' : 'No') },
      { label: 'Communication Preference', get: (a) => a.communicationPreference ?? '' },
    ],
    []
  );

  const toggleField = (field: string) => {
    setSelectedFields((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]));
  };

  const addExportHistory = (entry: ExportHistoryEntry) => {
    setExportHistory((prev) => [entry, ...prev]);
  };

  const handleGenerateCustomReport = () => {
    const chosenFields = selectedFields.length ? selectedFields : ['Name'];
    const fieldDefs = fieldOptions.filter((f) => chosenFields.includes(f.label));
    const rows = filteredAttendees.map((attendee) => {
      return fieldDefs.reduce<Record<string, string>>((acc, field) => {
        acc[field.label] = String(field.get(attendee) ?? '');
        return acc;
      }, {});
    });

    if (!rows.length) return;

    const name = customReportName.trim() || `Custom Report ${customReports.length + 1}`;
    const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.${
      outputFormat.toLowerCase() === 'excel' ? 'csv' : outputFormat.toLowerCase()
    }`;
    if (outputFormat.toLowerCase() === 'csv' || outputFormat.toLowerCase() === 'excel') {
      downloadCSV(filename, rows);
    } else {
      downloadCSV(`${name.toLowerCase().replace(/\s+/g, '-')}.csv`, rows);
    }

    const blobSize = new Blob([JSON.stringify(rows)]).size;
    const reportEntry: CustomReport = {
      id: createId(),
      name,
      fields: chosenFields,
      filters: {
        category: filterCategory,
        status: filterStatus,
        dateRange: filterDateRange,
      },
      format: outputFormat,
      rows: rows.length,
      size: formatBytes(blobSize),
      createdAt: new Date().toISOString(),
    };
    setCustomReports((prev) => [reportEntry, ...prev]);

    addExportHistory({
      id: createId(),
      name,
      format: outputFormat,
      size: formatBytes(blobSize),
      rows: rows.length,
      createdAt: new Date().toISOString(),
      generatedBy: 'Admin User',
    });

    if (schedule !== 'none') {
      setScheduledReports((prev) => [
        {
          id: createId(),
          name,
          schedule: `${toTitle(schedule)} schedule`,
          recipients: 1,
          next: getNextRunLabel(schedule),
          active: true,
        },
        ...prev,
      ]);
    }
  };

  const handleDownloadSavedReport = (report: CustomReport) => {
    const attendeesForReport = filterAttendeesBy(report.filters);
    const fieldDefs = fieldOptions.filter((f) => report.fields.includes(f.label));
    const rows = attendeesForReport.map((attendee) => {
      return fieldDefs.reduce<Record<string, string>>((acc, field) => {
        acc[field.label] = String(field.get(attendee) ?? '');
        return acc;
      }, {});
    });
    if (!rows.length) return;
    downloadCSV(`${report.name.toLowerCase().replace(/\s+/g, '-')}.csv`, rows);
    addExportHistory({
      id: createId(),
      name: report.name,
      format: report.format,
      size: formatBytes(new Blob([JSON.stringify(rows)]).size),
      rows: rows.length,
      createdAt: new Date().toISOString(),
      generatedBy: 'Admin User',
    });
  };

  const handleCreateNewCustom = () => {
    setCustomReportName('');
    setSelectedFields(['Name', 'Email', 'Organization']);
    setFilterCategory('all');
    setFilterStatus('all');
    setFilterDateRange('all');
    setOutputFormat('CSV');
    setSchedule('none');
  };

  const downloadReport = (id: string) => {
    if (id === 'attendees') {
      const rows = attendees.map((attendee) => ({
        id: attendee.id,
        firstName: attendee.firstName,
        lastName: attendee.lastName,
        email: attendee.email,
        phoneNumber: attendee.phoneNumber,
        organization: attendee.organization,
        jobTitle: attendee.jobTitle,
        country: getCountryLabel(attendee.country),
        category: getCategoryLabel(attendee.category, attendee.otherCategory),
        otherCategory: attendee.otherCategory ?? '',
        sectorInterest: getSectorLabel(attendee.sectorInterest),
        attendance: attendee.attendance ?? '',
        needsVisa: attendee.needsVisa ? 'Yes' : 'No',
        siteVisit: attendee.siteVisit ? 'Yes' : 'No',
        specialRequirements: attendee.specialRequirements ?? '',
        communicationPreference: attendee.communicationPreference,
        isCheckedIn: attendee.isCheckedIn ? 'Yes' : 'No',
        checkInTime: attendee.checkInTime ?? '',
        checkOutTime: attendee.checkOutTime ?? '',
      }));
      downloadCSV('attendee-directory.csv', rows);
      addExportHistory({
        id: createId(),
        name: 'Attendee Directory',
        format: 'CSV',
        size: formatBytes(new Blob([JSON.stringify(rows)]).size),
        rows: rows.length,
        createdAt: new Date().toISOString(),
        generatedBy: 'Admin User',
      });
      return;
    }

    if (id === 'checkin') {
      const rows = attendees
        .filter((attendee) => attendee.isCheckedIn)
        .map((attendee) => ({
          id: attendee.id,
          name: `${attendee.firstName} ${attendee.lastName}`,
          email: attendee.email,
          checkInTime: attendee.checkInTime ?? '',
          checkOutTime: attendee.checkOutTime ?? '',
        }));
      downloadCSV('checkin-report.csv', rows);
      addExportHistory({
        id: createId(),
        name: 'Check-in Report',
        format: 'CSV',
        size: formatBytes(new Blob([JSON.stringify(rows)]).size),
        rows: rows.length,
        createdAt: new Date().toISOString(),
        generatedBy: 'Admin User',
      });
      return;
    }

    if (id === 'country') {
      const rows = Object.entries(countryCounts).map(([country, count]) => ({ country, count }));
      downloadCSV('country-analysis.csv', rows);
      addExportHistory({
        id: createId(),
        name: 'Country Analysis',
        format: 'CSV',
        size: formatBytes(new Blob([JSON.stringify(rows)]).size),
        rows: rows.length,
        createdAt: new Date().toISOString(),
        generatedBy: 'Admin User',
      });
      return;
    }

    if (id === 'interests') {
      const rows = Object.entries(sectorCounts).map(([sectorInterest, count]) => ({ sectorInterest, count }));
      downloadCSV('sector-interests.csv', rows);
      addExportHistory({
        id: createId(),
        name: 'Sector Interests',
        format: 'CSV',
        size: formatBytes(new Blob([JSON.stringify(rows)]).size),
        rows: rows.length,
        createdAt: new Date().toISOString(),
        generatedBy: 'Admin User',
      });
      return;
    }

    if (id === 'daily') {
      const rows = dailyAnalytics.map((entry) => ({ date: entry.date, count: entry.count }));
      downloadCSV('daily-summary.csv', rows);
      addExportHistory({
        id: createId(),
        name: 'Daily Summary',
        format: 'CSV',
        size: formatBytes(new Blob([JSON.stringify(rows)]).size),
        rows: rows.length,
        createdAt: new Date().toISOString(),
        generatedBy: 'Admin User',
      });
    }
  };

  const toggleScheduledReport = (id: string) => {
    setScheduledReports((prev) => prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
  };

  return {
    loading,
    error,
    reportTemplates,
    filteredTemplates,
    reportSearch,
    setReportSearch,
    reportFormatFilter,
    setReportFormatFilter,
    reportCategoryFilter,
    setReportCategoryFilter,
    customReportName,
    setCustomReportName,
    selectedFields,
    toggleField,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    filterDateRange,
    setFilterDateRange,
    outputFormat,
    setOutputFormat,
    schedule,
    setSchedule,
    customReports,
    scheduledReports,
    exportHistory,
    fieldOptions,
    filteredAttendeesCount: filteredAttendees.length,
    handleGenerateCustomReport,
    handleDownloadSavedReport,
    handleCreateNewCustom,
    downloadReport,
    toggleScheduledReport,
  };
};
