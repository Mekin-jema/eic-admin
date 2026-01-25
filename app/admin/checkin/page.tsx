// app/admin/checkin/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  QrCode, Search, CheckCircle, XCircle, Clock, UserCheck, 
  Users, Filter, Download, RefreshCw, Printer, Camera,
  AlertCircle, BarChart3, Activity, Calendar, TrendingUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AttendeeRegistration } from '@/lib/adminApi';
import { useEicAdminStore } from '@/store/useEicAdminStore';
import Loading from './loading';

export default function CheckinPage() {
  const summary = useEicAdminStore((s) => s.attendanceSummary);
  const attendees = useEicAdminStore((s) => s.attendees);
  const loading = useEicAdminStore((s) => s.loading);
  const refreshDashboard = useEicAdminStore((s) => s.refreshDashboard);
  const [scanMode, setScanMode] = useState(false);
  const [manualId, setManualId] = useState('');

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const stats = {
    total: summary?.totalUsers ?? 0,
    checkedIn: summary?.checkedInUsers ?? 0,
    pending: summary ? summary.totalUsers - summary.checkedInUsers : 0,
    checkInRate: summary ? Math.round(summary.attendanceRate) : 0,
    todayCheckins: summary?.recentCheckIns ?? 0,
    avgCheckinTime: '—',
  };

  const pendingAttendees = useMemo(() => attendees.filter((a) => !a.isCheckedIn), [attendees]);

  const checkinDataByType = useMemo(() => {
    if (!summary) return [] as Array<{ type: string; checkedIn: number; total: number }>;
    return [
      { type: 'Attendees', checkedIn: summary.breakdown.attendees.checkedIn, total: summary.breakdown.attendees.total },
      { type: 'Exhibitors', checkedIn: summary.breakdown.exhibitors.checkedIn, total: summary.breakdown.exhibitors.total },
      { type: 'Sponsors', checkedIn: summary.breakdown.sponsors.checkedIn, total: summary.breakdown.sponsors.total },
    ];
  }, [summary]);

  const handleManualCheckin = () => {
    if (manualId.trim()) {
      alert(`Checking in attendee: ${manualId}`);
      setManualId('');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Check-in Management</h1>
          <p className="text-muted-foreground">Real-time attendee check-in and tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={scanMode ? "default" : "outline"} onClick={() => setScanMode(!scanMode)}>
            <Camera className="h-4 w-4 mr-2" />
            {scanMode ? 'Stop Scanning' : 'Start Scanning'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Check-ins</p>
                <p className="text-2xl font-bold">{stats.checkedIn}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={stats.checkInRate} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Check-ins</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Awaiting arrival</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Check-ins</p>
                <p className="text-2xl font-bold">{stats.todayCheckins}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">As of now</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Time</p>
                <p className="text-2xl font-bold">{stats.avgCheckinTime}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Per attendee</p>
          </CardContent>
        </Card>
      </div>

      {/* Scanner Section */}
      {scanMode && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="h-64 w-64 border-4 border-blue-500 rounded-lg flex items-center justify-center">
                    <QrCode className="h-32 w-32 text-blue-500" />
                  </div>
                  <div className="absolute inset-0 border-2 border-dashed border-blue-300 rounded-lg animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-blue-700">Position QR code within the frame to scan</p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setScanMode(false)}>
                  Cancel
                </Button>
                <Button>
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Manual Check-in */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Manual Check-in</CardTitle>
            <CardDescription>Check in attendees manually using ID or name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter attendee ID, email, or name"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualCheckin()}
                />
                <Button onClick={handleManualCheckin}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Check In
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Quick Search Tips</h4>
                    <p className="text-sm text-muted-foreground">Try searching by: ID, email, phone, or name</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    ATT-1001
                  </Button>
                  <Button variant="outline" className="justify-start">
                    ATT-1002
                  </Button>
                  <Button variant="outline" className="justify-start">
                    ATT-1003
                  </Button>
                  <Button variant="outline" className="justify-start">
                    ATT-1004
                  </Button>
                </div>
              </div>

              {/* Recent Check-ins */}
              <div>
                <h4 className="font-medium mb-2">Recent Check-ins</h4>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-muted-foreground">ATT-{1005 + i}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 mins ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-in Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Check-in Analytics</CardTitle>
            <CardDescription>Hourly check-in distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={checkinDataByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="checkedIn" name="Checked In" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" name="Total" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Peak Hour</span>
                </div>
                <span className="font-medium">14:00 (156 check-ins)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Current Rate</span>
                </div>
                <span className="font-medium">~12/min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Expected Completion</span>
                </div>
                <span className="font-medium">~2 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Check-ins Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Check-ins</CardTitle>
              <CardDescription>Attendees yet to check in ({pendingAttendees.length})</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="vip">VIP Only</SelectItem>
                  <SelectItem value="speaker">Speakers</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attendee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Registration Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAttendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell className="font-medium">{attendee.firstName} {attendee.lastName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{attendee.registrationType}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(attendee.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-amber-600">Awaiting</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Check In
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}