// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Globe, RefreshCw, Settings, UserCheck, Users, Building, BarChart3, TrendingUp } from 'lucide-react';
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  AttendeeRegistration,
  AttendanceSummaryResponse,
  getAttendees,
  getAttendanceSummary,
} from '@/lib/adminApi';
import Loading from './loading';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AdminDashboard() {
  const [attendees, setAttendees] = useState<AttendeeRegistration[]>([]);
  const [summary, setSummary] = useState<AttendanceSummaryResponse['summary'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [attendeeRes, summaryRes] = await Promise.all([getAttendees(), getAttendanceSummary()]);
      setAttendees(attendeeRes.data || []);
      setSummary(summaryRes.summary);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalAttendees = attendees.length;
  const checkedInAttendees = attendees.filter((a) => a.isCheckedIn).length;
  const attendeesTotalFromSummary = summary?.breakdown?.attendees?.total;
  const attendeesCheckedFromSummary = summary?.breakdown?.attendees?.checkedIn;
  const overallTotal = attendeesTotalFromSummary ?? totalAttendees;
  const overallChecked = attendeesCheckedFromSummary ?? checkedInAttendees;
  const checkInRate = overallTotal > 0 ? Math.round((overallChecked / overallTotal) * 100) : 0;
  const uniqueCountries = useMemo(
    () => new Set(attendees.map((a) => a.country).filter(Boolean)).size,
    [attendees],
  );
  const uniqueOrganizations = useMemo(
    () => new Set(attendees.map((a) => a.organization).filter(Boolean)).size,
    [attendees],
  );

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
    for (let i = days - 1; i >= 0; i--) {
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
    [countryDistribution],
  );

  const topInterests = useMemo(
    () =>
      Object.entries(interestCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([interest, count]) => ({ interest, count })),
    [interestCounts],
  );

  const typeData = useMemo(
    () => Object.entries(typeDistribution).map(([name, value]) => ({ name, value })),
    [typeDistribution],
  );

  const averageDaily = useMemo(() => {
    if (!dailyData.length) return 0;
    const total = dailyData.reduce((acc, d) => acc + d.count, 0);
    return Math.round(total / dailyData.length);
  }, [dailyData]);

  const topType = useMemo(() => {
    return [...typeData].sort((a, b) => b.value - a.value)[0]?.name || '—';
  }, [typeData]);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto py-6 space-y-6 pl-9 pr-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invest Ethiopia Forum 2026</h1>
          <p className="text-muted-foreground">Admin Dashboard & Analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Analytics</DropdownMenuItem>
              <DropdownMenuItem>Reports</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {error && (
        <Card>
          <CardContent className="text-sm text-red-600 py-3">{error}</CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallTotal}</div>
            <p className="text-xs text-muted-foreground">Attendees</p>
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
            <div className="text-2xl font-bold">{uniqueCountries}</div>
            <p className="text-xs text-muted-foreground">International diversity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueOrganizations}</div>
            <p className="text-xs text-muted-foreground">Unique companies</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Overall Registration Results</h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" /> Trend
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" /> Mix
            </span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Daily Registrations</CardTitle>
              <CardDescription>7-day movement and volume</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Average per day</div>
                  <div className="text-lg font-semibold">{averageDaily}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Top registration type</div>
                  <div className="text-lg font-semibold">{topType}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Check-in Status</CardTitle>
              <CardDescription>Real-time attendance rate</CardDescription>
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
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-lg border p-3">
                    <div className="text-xl font-bold text-green-600">{overallChecked}</div>
                    <div className="text-xs text-muted-foreground">Checked In</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xl font-bold text-gray-700">{Math.max(overallTotal - overallChecked, 0)}</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Registration Type Share</CardTitle>
              <CardDescription>Breakdown of attendee mix</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
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
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>Leading sources of registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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

          <Card>
            <CardHeader>
              <CardTitle>Top Interests</CardTitle>
              <CardDescription>What attendees care about most</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topInterests.map((item) => (
                  <div key={item.interest} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.interest}</span>
                      <span className="text-muted-foreground">{item.count}</span>
                    </div>
                    <Progress value={overallTotal ? (item.count / overallTotal) * 100 : 0} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registration Mix</CardTitle>
            <CardDescription>Attendees</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {[
              { label: 'Attendees', value: overallTotal, color: 'bg-primary' },
            ].map((item) => {
              const total = overallTotal || 1;
              return (
                <div key={item.label} className="space-y-2 rounded-lg border p-3">
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
      </div>
    </div>
  );
}
