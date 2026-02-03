// app/admin/reports/page.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Printer, FileText, Users, CheckCircle, Globe, 
  Target, Calendar, Filter,
  Search, Eye, Share2, Clock,
  FileSpreadsheet, FilePieChart, FileBarChart, FileJson
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import Loading from './loading';
import { getAnalytics, getAttendanceSummary, getAttendees, type AttendeeRegistration } from '@/lib/adminApi';

type ReportTemplate = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  format: string[];
  lastGenerated: string;
  size: string;
  rows: number;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const categoryLabels: Record<string, string> = {
  inv: 'Investor',
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
  edu: 'Education and Training',
  fin: 'Finance and Banking',
  mine: 'Mining and Natural Resources',
  prop: 'Real Estate and Property Development',
  logi: 'Transportation and Logistics',
  tele: 'Telecommunications',
};

const getCategoryLabel = (value?: string | null, otherValue?: string | null) => {
  if (!value) return '—';
  if (value === 'oth' && otherValue) return otherValue;
  return categoryLabels[value] ?? value;
};
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

const downloadCSV = (filename: string, rows: Array<Record<string, string | number | null | undefined>>) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return '';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };
  const csv = [headers.join(','), ...rows.map((row) => headers.map((h) => escape(row[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function ReportsPage() {
  const [attendees, setAttendees] = useState<AttendeeRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<{ checkedInUsers: number; totalUsers: number } | null>(null);
  const [dailyAnalytics, setDailyAnalytics] = useState<Array<{ date: string; count: number }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [attendeeRes, summaryRes, analyticsRes] = await Promise.all([
          getAttendees(),
          getAttendanceSummary(),
          getAnalytics(),
        ]);
        setAttendees(attendeeRes.data || []);
        setAttendanceSummary({
          checkedInUsers: summaryRes.summary.checkedInUsers,
          totalUsers: summaryRes.summary.totalUsers,
        });
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
      },
    ];
  }, [attendees, countryCounts, sectorCounts, dailyAnalytics]);

  const downloadReport = (id: string) => {
    if (id === 'attendees') {
      downloadCSV(
        'attendee-directory.csv',
        attendees.map((attendee) => ({
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
        }))
      );
      return;
    }

    if (id === 'checkin') {
      downloadCSV(
        'checkin-report.csv',
        attendees
          .filter((attendee) => attendee.isCheckedIn)
          .map((attendee) => ({
            id: attendee.id,
            name: `${attendee.firstName} ${attendee.lastName}`,
            email: attendee.email,
            checkInTime: attendee.checkInTime ?? '',
            checkOutTime: attendee.checkOutTime ?? '',
          }))
      );
      return;
    }

    if (id === 'country') {
      downloadCSV(
        'country-analysis.csv',
        Object.entries(countryCounts).map(([country, count]) => ({ country, count }))
      );
      return;
    }

    if (id === 'interests') {
      downloadCSV(
        'sector-interests.csv',
        Object.entries(sectorCounts).map(([sectorInterest, count]) => ({ sectorInterest, count }))
      );
      return;
    }

    if (id === 'daily') {
      downloadCSV(
        'daily-summary.csv',
        dailyAnalytics.map((entry) => ({ date: entry.date, count: entry.count }))
      );
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="space-y-6 pl-9 pr-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-destructive">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pl-9 pr-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Exports</h1>
          <p className="text-muted-foreground">Generate and download detailed reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Bulk Export
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search reports..." className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="pdf">PDF Only</SelectItem>
                  <SelectItem value="excel">Excel Only</SelectItem>
                  <SelectItem value="csv">CSV Only</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
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
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>

        {/* Report Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((report) => {
              const Icon = report.icon;
              return (
                <Card key={report.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {report.rows} rows
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Formats:</span>
                          <div className="flex gap-1">
                            {report.format.map((fmt) => (
                              <Badge key={fmt} variant="secondary" className="text-xs">
                                {fmt}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Last generated:</span>
                          <span className="font-medium">{report.lastGenerated}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Size:</span>
                          <span className="font-medium">{report.size}</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => downloadReport(report.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Export Options</CardTitle>
              <CardDescription>Export specific data sets quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => downloadReport('attendees')}
                >
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                  <span>Excel Export</span>
                  <span className="text-xs text-muted-foreground">Full dataset</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => downloadReport('interests')}
                >
                  <FilePieChart className="h-6 w-6 text-blue-600" />
                  <span>Analytics Data</span>
                  <span className="text-xs text-muted-foreground">Charts & stats</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => downloadReport('daily')}
                >
                  <FileBarChart className="h-6 w-6 text-purple-600" />
                  <span>Summary Report</span>
                  <span className="text-xs text-muted-foreground">Executive view</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => downloadReport('attendees')}
                >
                  <FileJson className="h-6 w-6 text-amber-600" />
                  <span>JSON Data</span>
                  <span className="text-xs text-muted-foreground">API integration</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Reports */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Custom Reports</CardTitle>
                  <CardDescription>Create and manage your own report templates</CardDescription>
                </div>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                    <FileText className="h-8 w-8" />
                    <p className="text-sm">No custom reports saved yet.</p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Report Builder */}
          <Card>
            <CardHeader>
              <CardTitle>Build Custom Report</CardTitle>
              <CardDescription>Select fields and filters for your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-3">
                    <h4 className="font-medium">Select Fields</h4>
                    <div className="space-y-2">
                      {[
                        'Name',
                        'Email',
                        'Phone',
                        'Country',
                        'Organization',
                        'Job Title',
                        'Category',
                        'Sector Interest',
                        'Attendance',
                        'Visa Assistance',
                        'Site Visit',
                        'Communication Preference',
                      ].map((field) => (
                        <div key={field} className="flex items-center gap-3">
                          <input type="checkbox" id={field} className="h-4 w-4" />
                          <label htmlFor={field} className="text-sm">{field}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Apply Filters</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
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
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Check-in Status</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="checked-in">Checked In</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Date Range</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">Last 30 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Output Options</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Format</label>
                        <div className="space-y-2">
                          {['PDF', 'Excel', 'CSV', 'JSON'].map((format) => (
                            <div key={format} className="flex items-center gap-3">
                              <input type="radio" name="format" id={format} className="h-4 w-4" />
                              <label htmlFor={format} className="text-sm">{format}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Schedule</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="No schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Schedule</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button variant="outline">Preview Report</Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Reports */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automated report generation schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Daily Summary', schedule: 'Daily 8:00 AM', recipients: 3, next: 'Tomorrow 8:00 AM' },
                  { name: 'Weekly Analytics', schedule: 'Every Monday 9:00 AM', recipients: 5, next: 'Next Monday 9:00 AM' },
                  { name: 'VIP Updates', schedule: 'Every 6 hours', recipients: 2, next: 'Today 6:00 PM' },
                  { name: 'Check-in Status', schedule: 'Every hour', recipients: 4, next: 'Today 4:00 PM' },
                ].map((report) => (
                  <div key={report.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">{report.recipients} recipients</p>
                        <p className="text-xs text-muted-foreground">Next: {report.next}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          Stop
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Statistics</CardTitle>
              <CardDescription>Report delivery success rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { report: 'Daily Summary', success: 98, delivered: 30, failed: 1 },
                  { report: 'Weekly Analytics', success: 95, delivered: 12, failed: 1 },
                  { report: 'VIP Updates', success: 99, delivered: 120, failed: 0 },
                  { report: 'Check-in Status', success: 92, delivered: 168, failed: 3 },
                ].map((item) => (
                  <div key={item.report} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.report}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Delivered: {item.delivered}</span>
                        <span className="text-sm text-muted-foreground">Failed: {item.failed}</span>
                        <Badge className={
                          item.success >= 95 ? 'bg-green-100 text-green-800' :
                          item.success >= 90 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }>
                          {item.success}% success
                        </Badge>
                      </div>
                    </div>
                    <Progress value={item.success} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>Recently generated reports and exports</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          i % 3 === 0 ? 'bg-blue-100' :
                          i % 3 === 1 ? 'bg-green-100' : 'bg-purple-100'
                        }`}>
                          <Download className={`h-5 w-5 ${
                            i % 3 === 0 ? 'text-blue-600' :
                            i % 3 === 1 ? 'text-green-600' : 'text-purple-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium">Attendee Report #{1247 - i}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">PDF</Badge>
                            <span className="text-xs text-muted-foreground">2.4 MB</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{1247 - i} rows</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {i === 0 ? '2 hours ago' : 
                           i === 1 ? '3 hours ago' :
                           i === 2 ? 'Yesterday' : `${i + 1} days ago`}
                        </p>
                        <p className="text-xs text-muted-foreground">By: Admin User</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}