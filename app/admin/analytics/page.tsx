// app/admin/analytics/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Calendar,
  Download,
  Globe,
  RefreshCw,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Loading from './loading';
import { useEicAdminStore } from '@/store/useEicAdminStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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

const getCategoryLabel = (value?: string | null) => (value ? categoryLabels[value] ?? value : '—');
const getSectorLabel = (value?: string | null) => (value ? sectorLabels[value] ?? value : '—');

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
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
  const overallTotal = attendance?.breakdown?.attendees?.total ?? totalAttendees;
  const overallChecked = attendance?.breakdown?.attendees?.checkedIn ?? checkedInAttendees;
  const checkInRate = overallTotal > 0 ? Math.round((overallChecked / overallTotal) * 100) : 0;
  const pendingCheckIns = Math.max(overallTotal - overallChecked, 0);

  const periodDays = period === '7days' ? 7 : period === '30days' ? 30 : period === '90days' ? 90 : null;

  const countryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    attendees.forEach((a) => {
      if (!a.country) return;
      const label = getCountryLabel(a.country);
      counts[label] = (counts[label] || 0) + 1;
    });
    return counts;
  }, [attendees]);

  const categoryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    attendees.forEach((a) => {
      if (!a.category) return;
      const label = getCategoryLabel(a.category);
      counts[label] = (counts[label] || 0) + 1;
    });
    return counts;
  }, [attendees]);

  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    attendees.forEach((a) => {
      if (!a.sectorInterest) return;
      const label = getSectorLabel(a.sectorInterest);
      counts[label] = (counts[label] || 0) + 1;
    });
    return counts;
  }, [attendees]);

  const dailySorted = useMemo(() => {
    const items = analytics?.dailyAnalytics.attendees || [];
    return [...items].sort((a, b) => a.date.localeCompare(b.date));
  }, [analytics?.dailyAnalytics]);

  const dailySeries = useMemo(() => {
    const trimmed = periodDays ? dailySorted.slice(-periodDays) : dailySorted;
    return trimmed.map((entry) => ({
      date: entry.date,
      attendees: entry.count,
      label: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [dailySorted, periodDays]);

  const topCountries = useMemo(
    () =>
      Object.entries(countryDistribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([country, count]) => ({ country, count })),
    [countryDistribution]
  );

  const topSectors = useMemo(
    () =>
      Object.entries(sectorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([sector, count]) => ({ sector, count })),
    [sectorCounts]
  );

  const categoryData = useMemo(
    () => Object.entries(categoryDistribution).map(([name, value]) => ({ name, value })),
    [categoryDistribution]
  );

  const totalCounts = analytics?.totalCounts;
  const checkInMix = useMemo(
    () => [
      { name: 'Checked In', value: overallChecked },
      { name: 'Pending', value: pendingCheckIns },
    ],
    [overallChecked, pendingCheckIns]
  );

  const periodInsights = useMemo(() => {
    const totalDays = dailySorted.length || 1;
    const periodWindow = periodDays ? dailySorted.slice(-periodDays) : dailySorted;
    const periodTotal = periodWindow.reduce((acc, entry) => acc + entry.count, 0);
    const averageDaily = Math.round(periodTotal / (periodWindow.length || 1));

    const peakEntry = periodWindow.reduce<{ date: string; count: number } | null>((max, entry) => {
      if (!max || entry.count > max.count) return entry;
      return max;
    }, null);

    const previousWindow = periodDays && totalDays > periodDays
      ? dailySorted.slice(Math.max(0, totalDays - periodDays * 2), totalDays - periodDays)
      : [];
    const previousTotal = previousWindow.reduce((acc, entry) => acc + entry.count, 0);
    const growthPercent = previousTotal > 0
      ? Math.round(((periodTotal - previousTotal) / previousTotal) * 100)
      : null;

    return {
      periodTotal,
      averageDaily,
      peakLabel: peakEntry
        ? new Date(peakEntry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '—',
      peakCount: peakEntry?.count ?? 0,
      growthPercent,
    };
  }, [dailySorted, periodDays]);

  const topOrganizations = useMemo(() => {
    const counts: Record<string, number> = {};
    attendees.forEach((a) => {
      if (!a.organization) return;
      counts[a.organization] = (counts[a.organization] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([organization, count]) => ({ organization, count }));
  }, [attendees]);

  const recentAttendees = analytics?.recentActivity.attendees ?? [];

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 pl-9 pr-4">
      <div className="flex flex-col gap-4 rounded-2xl border bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Operational Intelligence</p>
            <h1 className="text-3xl font-bold">Analytics Command Center</h1>
            <p className="text-sm text-emerald-100/80">Live coverage across registrations, attendance, and engagement performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={(value) => setPeriod(value as typeof period)}>
              <SelectTrigger className="w-[160px] bg-white/10 text-white border-white/20">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-white/30 text-white" onClick={() => {
              fetchAnalytics();
              fetchAttendanceSummary();
              fetchAttendees();
            }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button className="bg-white text-slate-900" disabled={loading}>
              <Download className="mr-2 h-4 w-4" />
              Export Snapshot
            </Button>
          </div>
        </div>
      </div>

 

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Registration Velocity</CardTitle>
            <CardDescription>Attendee registrations tracked per day.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={dailySeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="attendees" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Check-in Split</CardTitle>
            <CardDescription>Checked in vs pending arrivals.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={checkInMix} dataKey="value" nameKey="name" innerRadius={60} outerRadius={110} paddingAngle={3}>
                  {checkInMix.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Highest concentration of attendees.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topCountries} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" width={110} />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sector Interest</CardTitle>
            <CardDescription>Preferred investment focus areas.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topSectors} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="sector" type="category" width={140} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Mix of attendee categories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {categoryData.length === 0 ? (
              <div className="text-sm text-muted-foreground">No category data yet.</div>
            ) : (
              categoryData
                .sort((a, b) => b.value - a.value)
                .slice(0, 6)
                .map((item, index) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">{item.value}</span>
                    </div>
                    <Progress value={overallTotal ? (item.value / overallTotal) * 100 : 0} className="h-2" />
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">Rank {index + 1}</Badge>
                      <span>{overallTotal ? Math.round((item.value / overallTotal) * 100) : 0}% share</span>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Engagement Funnel</CardTitle>
            <CardDescription>Progress from registration to check-in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Total registrations</span>
              <span className="font-medium">{overallTotal}</span>
            </div>
            <Progress value={100} />
            <div className="flex items-center justify-between text-sm">
              <span>Checked in</span>
              <span className="font-medium">{overallChecked}</span>
            </div>
            <Progress value={checkInRate} className="bg-muted" />
            <div className="flex items-center justify-between text-sm">
              <span>Pending arrivals</span>
              <span className="font-medium">{pendingCheckIns}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Highlights</CardTitle>
            <CardDescription>Quick glance insights.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3">
              <div className="text-xs uppercase text-muted-foreground">Top Category</div>
              <div className="text-lg font-semibold">
                {categoryData.sort((a, b) => b.value - a.value)[0]?.name || '—'}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs uppercase text-muted-foreground">Most Active Sector</div>
              <div className="text-lg font-semibold">
                {topSectors[0]?.sector || '—'}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs uppercase text-muted-foreground">Top Country</div>
              <div className="text-lg font-semibold">{topCountries[0]?.country || '—'}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendees</CardTitle>
            <CardDescription>Latest five attendee registrations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAttendees.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{item.firstName} {item.lastName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <Badge variant="secondary">Attendee</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Operational Insights</CardTitle>
            <CardDescription>High-signal metrics for the selected window.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Period registrations</div>
                  <div className="text-lg font-semibold">{periodInsights.periodTotal}</div>
                </div>
                <Badge variant="outline">{period}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Average per day</div>
                  <div className="text-lg font-semibold">{periodInsights.averageDaily}</div>
                </div>
                <Badge variant="secondary">Avg</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Peak day</div>
                  <div className="text-lg font-semibold">{periodInsights.peakLabel}</div>
                  <div className="text-xs text-muted-foreground">{periodInsights.peakCount} registrations</div>
                </div>
                <Badge variant="outline">Peak</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Period growth</div>
                  <div className="text-lg font-semibold">
                    {periodInsights.growthPercent === null ? '—' : `${periodInsights.growthPercent}%`}
                  </div>
                </div>
                <Badge variant="secondary">Trend</Badge>
              </div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground mb-2">Top organizations</div>
              {topOrganizations.length === 0 ? (
                <div className="text-sm text-muted-foreground">No organization data yet.</div>
              ) : (
                <div className="space-y-2">
                  {topOrganizations.map((item) => (
                    <div key={item.organization} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.organization}</span>
                      <span className="text-muted-foreground">{item.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



