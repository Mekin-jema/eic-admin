// app/admin/analytics/page.tsx
'use client';

import { useEffect, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Download,
  Edit,
  Eye,
  Filter,
  Globe,
  MapPin,
  MoreVertical,
  PieChart as PieChartIcon,
  Settings,
  Table,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Loading from './loading';
import { useEicAdminStore } from '@/store/useEicAdminStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AnalyticsPage() {
  const loading = useEicAdminStore((s) => s.loading);
  const fetchAnalytics = useEicAdminStore((s) => s.fetchAnalytics);
  const fetchAttendanceSummary = useEicAdminStore((s) => s.fetchAttendanceSummary);
  const fetchAttendees = useEicAdminStore((s) => s.fetchAttendees);

  const analytics = useEicAdminStore((s) => s.analytics);
  const attendance = useEicAdminStore((s) => s.attendanceSummary);
  const attendees = useEicAdminStore((s) => s.attendees);

  useEffect(() => {
    fetchAnalytics();
    fetchAttendanceSummary();
    fetchAttendees();
  }, [fetchAnalytics, fetchAttendanceSummary, fetchAttendees]);

  const totalAttendees = attendees.length;
  const checkedInAttendees = useMemo(() => attendees.filter((a) => a.isCheckedIn).length, [attendees]);
  const overallTotal = attendance?.totalUsers ?? totalAttendees;
  const overallChecked = attendance?.checkedInUsers ?? checkedInAttendees;
  const checkInRate = overallTotal > 0 ? Math.round((overallChecked / overallTotal) * 100) : 0;

  const countryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    attendees.forEach((a) => {
      if (!a.country) return;
      counts[a.country] = (counts[a.country] || 0) + 1;
    });
    return counts;
  }, [attendees]);

  const typeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    attendees.forEach((a) => {
      if (!a.registrationType) return;
      counts[a.registrationType] = (counts[a.registrationType] || 0) + 1;
    });
    return counts;
  }, [attendees]);

  const interestCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    attendees.forEach((a) => {
      (a.interests || []).forEach((interest) => {
        counts[interest] = (counts[interest] || 0) + 1;
      });
    });
    return counts;
  }, [attendees]);

  const dailyData = useMemo(() => {
    const days = 7;
    const buckets: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      buckets[key] = 0;
    }
    attendees.forEach((a) => {
      const key = a.createdAt?.split('T')[0];
      if (key && buckets[key] !== undefined) {
        buckets[key] += 1;
      }
    });
    return Object.entries(buckets).map(([iso, count]) => ({
      date: new Date(iso).toLocaleDateString('en-US', { weekday: 'short' }),
      count,
    }));
  }, [attendees]);

  const topCountries = useMemo(
    () =>
      Object.entries(countryDistribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([country, count]) => ({ country, count })),
    [countryDistribution]
  );

  const topInterests = useMemo(
    () =>
      Object.entries(interestCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([interest, count]) => ({ interest, count })),
    [interestCounts]
  );

  const typeData = useMemo(
    () => Object.entries(typeDistribution).map(([name, value]) => ({ name, value })),
    [typeDistribution]
  );

  const attendeeList = useMemo(() => attendees.slice(0, 20), [attendees]);

  const attendanceBreakdown = attendance?.breakdown;

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Registration intelligence, attendance health, and exportable reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" disabled={loading}>
            <Filter className="h-4 w-4" />
          </Button>
          <Button disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="attendees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Attendees
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalCounts.total ?? overallTotal}</div>
                <p className="text-xs text-muted-foreground">Attendees + Exhibitors + Sponsors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallChecked}</div>
                <p className="text-xs text-muted-foreground">{checkInRate}% check-in rate</p>
                <Progress value={checkInRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Countries</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(countryDistribution).length}</div>
                <p className="text-xs text-muted-foreground">International diversity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registration Types</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{typeData.length}</div>
                <p className="text-xs text-muted-foreground">Active categories</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Daily Registrations Trend</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCountries.map((item, index) => (
                    <div key={item.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.country}</p>
                          <p className="text-xs text-muted-foreground">{item.count} attendees</p>
                        </div>
                      </div>
                      <Badge variant="outline">{overallTotal ? Math.round((item.count / overallTotal) * 100) : 0}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Registration Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topInterests.map((item) => (
                    <div key={item.interest} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.interest}</span>
                        <span className="text-sm text-muted-foreground">{item.count}</span>
                      </div>
                      <Progress value={overallTotal ? (item.count / overallTotal) * 100 : 0} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Check-in Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative h-40 w-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{checkInRate}%</div>
                          <div className="text-sm text-muted-foreground">Check-in Rate</div>
                        </div>
                      </div>
                      <div className="h-full w-full">
                        <div
                          className="h-full w-full rounded-full border-8 border-green-500"
                          style={{ clipPath: `inset(0 ${100 - checkInRate}% 0 0)`, transform: 'rotate(-90deg)' }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="rounded-lg border p-3">
                      <div className="text-2xl font-bold text-green-600">{overallChecked}</div>
                      <div className="text-sm text-muted-foreground">Checked In</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-2xl font-bold text-gray-600">{Math.max(overallTotal - overallChecked, 0)}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Registration Mix</CardTitle>
                <CardDescription>Attendees vs Exhibitors vs Sponsors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Attendees', value: analytics?.totalCounts.attendees ?? 0, color: 'bg-primary' },
                  { label: 'Exhibitors', value: analytics?.totalCounts.exhibitors ?? 0, color: 'bg-amber-500' },
                  { label: 'Sponsors', value: analytics?.totalCounts.sponsors ?? 0, color: 'bg-emerald-500' },
                ].map((item) => {
                  const total = (analytics?.totalCounts.total ?? overallTotal) || 1;
                  return (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-muted-foreground">{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${Math.min((item.value / total) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Breakdown</CardTitle>
                <CardDescription>Check-ins by audience</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['attendees', 'exhibitors', 'sponsors'] as const).map((key) => {
                  const bucket = attendanceBreakdown?.[key];
                  const total = bucket?.total ?? 0;
                  const checked = bucket?.checkedIn ?? 0;
                  const rate = total > 0 ? Math.round((checked / total) * 100) : 0;
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <div key={key} className="rounded-lg border p-3 space-y-2">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-2xl font-bold">{checked}</div>
                      <div className="text-xs text-muted-foreground">{rate}% of {total}</div>
                      <Progress value={rate} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendees" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendee Management</CardTitle>
                  <CardDescription>View and manage all registered attendees</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search attendees..." className="w-[250px]" disabled={loading} />
                  <Select defaultValue="all" disabled={loading}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Attendees</SelectItem>
                      <SelectItem value="checked-in">Checked In</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="speaker">Speakers</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" disabled={loading}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attendee</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Interests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendeeList.map((attendee) => (
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
                              <div className="text-sm text-muted-foreground">{attendee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{attendee.organization || '—'}</div>
                          <div className="text-sm text-muted-foreground">{attendee.occupation}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {attendee.country}
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
                            {attendee.registrationType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(attendee.interests || []).map((interest) => (
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
                                <XCircle className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-500">Pending</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
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
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </UITable>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Country Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={topCountries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Detailed Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2 rounded-lg border p-4 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Average Group Size</div>
                    <div className="text-2xl font-bold">
                      {attendees.length
                        ? (attendees.reduce((acc, a) => acc + (a.groupSize || 1), 0) / attendees.length).toFixed(1)
                        : '—'}
                    </div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-4 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Top Registration Type</div>
                    <div className="text-2xl font-bold">
                      {typeData.sort((a, b) => b.value - a.value)[0]?.name || '—'}
                    </div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-4 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Recent Check-ins (24h)</div>
                    <div className="text-2xl font-bold">{attendance?.recentCheckIns ?? 0}</div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-4 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Attendance Rate</div>
                    <div className="text-2xl font-bold">{checkInRate}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
                <CardDescription>Latest five attendees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(analytics?.recentActivity.attendees || []).slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{r.firstName} {r.lastName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</p>
                    </div>
                    <Badge variant="secondary">Attendee</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Export & Reports</CardTitle>
              <CardDescription>Generate and download detailed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: 'Attendee List', desc: 'Complete list with contact info', icon: Users },
                  { title: 'Check-in Report', desc: 'Detailed check-in analytics', icon: UserCheck },
                  { title: 'Country Report', desc: 'Demographic analysis by country', icon: Globe },
                  { title: 'Interest Report', desc: 'Sector interest distribution', icon: TrendingUp },
                  { title: 'Daily Summary', desc: 'Day-wise registration stats', icon: Calendar },
                  { title: 'Custom Report', desc: 'Create your own report', icon: Settings },
                ].map((report) => (
                  <Card key={report.title} className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <report.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{report.title}</h3>
                          <p className="text-sm text-muted-foreground">{report.desc}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
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



