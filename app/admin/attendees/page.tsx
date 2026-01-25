// app/admin/attendees/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Download, Filter, Search, Eye, MapPin, UserCheck, Clock, Star, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendeeRegistration } from '@/lib/adminApi';
import { useEicAdminStore } from '@/store/useEicAdminStore';
import Loading from './loading';

export default function AttendeesPage() {
  const attendees = useEicAdminStore((s) => s.attendees);
  const loading = useEicAdminStore((s) => s.loading);
  const fetchAttendees = useEicAdminStore((s) => s.fetchAttendees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAttendees();
  }, [fetchAttendees]);

  const registrationTypes = useMemo(() => {
    const set = new Set(attendees.map((a) => a.registrationType).filter(Boolean));
    return Array.from(set);
  }, [attendees]);

  const filteredAttendees = attendees.filter((attendee) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      attendee.firstName.toLowerCase().includes(term) ||
      attendee.lastName.toLowerCase().includes(term) ||
      attendee.email.toLowerCase().includes(term) ||
      (attendee.organization || '').toLowerCase().includes(term);

    const matchesType = filterType === 'all' || attendee.registrationType === filterType;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'checked-in' && attendee.isCheckedIn) ||
      (filterStatus === 'pending' && !attendee.isCheckedIn);

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: attendees.length,
    checkedIn: attendees.filter((a) => a.isCheckedIn).length,
    vip: attendees.filter((a) => a.registrationType === 'VIP').length,
    speakers: attendees.filter((a) => a.registrationType === 'Speaker').length,
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total Attendees</p><p className="text-2xl font-bold">{stats.total}</p></div><Users className="h-8 w-8 text-blue-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Checked In</p><p className="text-2xl font-bold">{stats.checkedIn}</p></div><UserCheck className="h-8 w-8 text-green-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">VIP Attendees</p><p className="text-2xl font-bold">{stats.vip}</p></div><Star className="h-8 w-8 text-amber-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Speakers</p><p className="text-2xl font-bold">{stats.speakers}</p></div><MessageSquare className="h-8 w-8 text-purple-500" /></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, email, or organization..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Registration Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {registrationTypes.map((rt) => (<SelectItem key={rt} value={rt}>{rt}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Attendee List</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendee Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attendee</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Interests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendees.map((attendee) => (
                      <TableRow key={attendee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar><AvatarFallback>{attendee.firstName[0]}{attendee.lastName[0]}</AvatarFallback></Avatar>
                            <div>
                              <div className="font-medium">{attendee.firstName} {attendee.lastName}</div>
                              <div className="text-sm text-muted-foreground">{attendee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{attendee.organization}</div>
                            <div className="text-sm text-muted-foreground">{attendee.occupation}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{attendee.country}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={attendee.registrationType === 'VIP' ? 'default' : attendee.registrationType === 'Speaker' ? 'secondary' : 'outline'}>
                            {attendee.registrationType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {attendee.interests.slice(0, 2).map((interest) => (<Badge key={interest} variant="outline" className="mr-1">{interest}</Badge>))}
                            {attendee.interests.length > 2 && (<span className="text-xs text-muted-foreground">+{attendee.interests.length - 2} more</span>)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {attendee.isCheckedIn ? (<UserCheck className="h-4 w-4 text-green-600" />) : (<Clock className="h-4 w-4 text-amber-500" />)}
                            <span className={attendee.isCheckedIn ? 'text-green-600' : 'text-amber-600'}>{attendee.isCheckedIn ? 'Checked In' : 'Pending'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-2" />View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendee Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Most common country</span>
                <span className="font-medium">{attendees[0]?.country || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Top interest</span>
                <span className="font-medium">{attendees[0]?.interests?.[0] || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Checked-in ratio</span>
                <span className="font-medium">{stats.total ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}