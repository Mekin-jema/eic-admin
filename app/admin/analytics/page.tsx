// app/admin/analytics/page.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { Activity, Building, Cpu, Download, Filter, Percent, Target, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Loading from './loading';
import { useEicAdminStore } from '@/store/useEicAdminStore';

export default function AnalyticsPage() {
  const loading = useEicAdminStore((s) => s.loading);
  const fetchAnalytics = useEicAdminStore((s) => s.fetchAnalytics);
  const fetchAttendanceSummary = useEicAdminStore((s) => s.fetchAttendanceSummary);
  const analytics = useEicAdminStore((s) => s.analytics);
  const attendance = useEicAdminStore((s) => s.attendanceSummary);

  useEffect(() => {
    fetchAnalytics();
    fetchAttendanceSummary();
  }, [fetchAnalytics, fetchAttendanceSummary]);

  const registrationTrendData = useMemo(() => {
    if (!analytics) return [] as Array<{ date: string; registrations: number }>;
    return (analytics.dailyAnalytics.attendees || []).map((d) => ({
      date: new Date(d.createdAt).toLocaleDateString(),
      registrations: d._count.id,
    }));
  }, [analytics]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Deep insights and data analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30days">
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
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Predictive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalCounts.total ?? 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Attendees + Exhibitors + Sponsors</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Check-in Rate</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendance?.attendanceRate ? `${Math.round(attendance.attendanceRate)}%` : '—'}</div>
                <Progress value={attendance?.attendanceRate ? Math.round(attendance.attendanceRate) : 0} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exhibitors</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalCounts.exhibitors ?? 0}</div>
                <CardDescription>Applications</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sponsors</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalCounts.sponsors ?? 0}</div>
                <CardDescription>Total sponsors</CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Registration Trends</CardTitle>
                <CardDescription>Daily attendee registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={registrationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="registrations" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(analytics?.recentActivity.attendees || []).slice(0, 5).map((r) => (
                    <div key={r.id} className="flex items-center justify-between border rounded p-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{r.firstName} {r.lastName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <Badge variant="outline">Attendee</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">Predictive insights will be added when backend metrics are available.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

