// app/admin/communications/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import { 
  Mail, Send, Users, Clock, BarChart3, Eye, 
  Download, Copy, CheckCircle, AlertCircle,
  Phone, MessageSquare, Bell, Calendar, UserCheck,
  Star, TrendingUp, History, Paperclip,
  Image as ImageIcon, FileText, Smile
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import Loading from './loading';
import { useEicAdminStore } from '@/store/useEicAdminStore';
import { NotificationLogItem as NotifLogItem } from '@/lib/adminApi';
import { Textarea } from '@/components/ui/textarea';

// Backend-driven templates and messages
const toDisplayDate = (iso?: string | null) => iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—';

export default function CommunicationsPage() {
  const loading = useEicAdminStore((s) => s.loading);
  const fetchCommunications = useEicAdminStore((s) => s.fetchCommunications);
  const sendEmail = useEicAdminStore((s) => s.sendEmail);
  const templates = useEicAdminStore((s) => s.commTemplates);
  const stats = useEicAdminStore((s) => s.commStats) || { totalSent: 0, openRate: 0, clickRate: 0, bounceRate: 0, unsubscribes: 0 };
  const recentMessages = useEicAdminStore((s) => s.commRecent);
  const campaigns = useEicAdminStore((s) => s.emailCampaigns);
  const smsStats = useEicAdminStore((s) => s.smsStats) || { creditsRemaining: 0, usedPercent: 0, deliveryRate: 0, delivered: 0, failed: 0 };
  const notifRecent = useEicAdminStore((s) => s.notifRecent as NotifLogItem[]);
  const platform = useEicAdminStore((s) => s.platformStats) || { iosUsers: 0, androidUsers: 0, totalAppUsers: 0 };

  const [selectedTemplate, setSelectedTemplate] = useState<string>('welcome');
  const [audience, setAudience] = useState<string>('all');
  const [subject, setSubject] = useState<string>('Welcome to Invest Ethiopia Forum 2026');
  const [message, setMessage] = useState(`Dear Attendee,

Welcome to the Invest Ethiopia Forum 2026! We're excited to have you join us for this premier investment event.

Important Details:
• Date: May 12-13, 2026
• Venue: Ethiopian Skylight Hotel, Addis Ababa
• Check-in: Starts at 8:00 AM

Please bring your registration confirmation and ID.

Best regards,
Invest Ethiopia Forum Team`);
  useEffect(() => {
    fetchCommunications();
  }, [fetchCommunications]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 pl-9 pr-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communications Center</h1>
          <p className="text-muted-foreground">Manage emails, notifications, and messaging</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button disabled={loading} onClick={() => sendEmail({ templateKey: selectedTemplate, audience, subject, body: message })}>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">{stats.openRate}%</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
                <p className="text-2xl font-bold">{stats.clickRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold">{stats.bounceRate}%</p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unsubscribes</p>
                <p className="text-2xl font-bold">{stats.unsubscribes}</p>
              </div>
              <Users className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Email Composer */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
            <CardDescription>Create and send emails to attendees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Template Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((template) => (
                    <Button
                      key={template.key}
                      variant={selectedTemplate === template.key ? "default" : "outline"}
                      className="justify-start h-auto py-3"
                      onClick={() => { setSelectedTemplate(template.key); setSubject(template.subject); }}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          Used {template.usedCount} times • {toDisplayDate(template.lastUsedAt)}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Recipient Selection */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Send To</label>
                  <Select defaultValue={audience} onValueChange={(v) => setAudience(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Attendees</SelectItem>
                      <SelectItem value="checked-in">Checked In</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="speakers">Speakers</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Send Method</label>
                  <Select defaultValue="immediate">
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Send Immediately</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input 
                  placeholder="Enter email subject" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Message Editor */}
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <div className="border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea 
                    className="min-h-[200px] border-0 focus-visible:ring-0"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Templates */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common communication tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Check-in Reminder
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Welcome Checked-in Attendees
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  VIP Exclusive Update
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Daily Schedule Reminder
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Post-Event Survey
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest communication activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {recentMessages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{msg.subject}</h4>
                        <span className="text-xs text-muted-foreground">{toDisplayDate(msg.createdAt)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 border rounded">
                          <div className="text-sm font-bold">{msg.sentCount}</div>
                          <div className="text-xs text-muted-foreground">Sent</div>
                        </div>
                        <div className="p-2 border rounded">
                          <div className="text-sm font-bold">{msg.openedCount ?? 0}</div>
                          <div className="text-xs text-muted-foreground">Opened</div>
                        </div>
                        <div className="p-2 border rounded">
                          <div className="text-sm font-bold">{msg.clickedCount ?? 0}</div>
                          <div className="text-xs text-muted-foreground">Clicked</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Open rate: {msg.sentCount ? Math.round(((msg.openedCount ?? 0) / msg.sentCount) * 100) : 0}%</span>
                        <span>CTR: {msg.openedCount ? Math.round(((msg.clickedCount ?? 0) / msg.openedCount) * 100) : 0}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for Other Channels */}
      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Announcements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>Manage email marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Campaign List */}
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          campaign.status === 'Active' ? 'bg-green-100' :
                          campaign.status === 'Paused' ? 'bg-amber-100' : 'bg-gray-100'
                        }`}>
                          <Mail className={`h-5 w-5 ${
                            campaign.status === 'Active' ? 'text-green-600' :
                            campaign.status === 'Paused' ? 'text-amber-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={
                              campaign.status === 'Active' ? 'default' :
                              campaign.status === 'Paused' ? 'outline' : 'secondary'
                            }>
                              {campaign.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {campaign.sent.toLocaleString()} sent
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-medium">{campaign.openRate}% open rate</p>
                          <Progress value={campaign.openRate} className="w-32 mt-1" />
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analytics */}
                <div className="grid gap-4 md:grid-cols-3 pt-6 border-t">
                  <div className="space-y-2">
                    <h4 className="font-medium">Delivery Rate</h4>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold">98%</div>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">Excellent deliverability</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Avg. Open Time</h4>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold">2.4h</div>
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">After sending</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">List Health</h4>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold">94%</div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">Clean email list</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>SMS Messaging</CardTitle>
              <CardDescription>Send text messages to attendees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">SMS Quick Send</h4>
                  </div>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Enter your SMS message (160 characters max)"
                      className="min-h-[100px]"
                      maxLength={160}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">0/160 characters</span>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        Send SMS
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">SMS Credits</h4>
                        <Badge>{smsStats.creditsRemaining.toLocaleString()} remaining</Badge>
                      </div>
                      <Progress value={smsStats.usedPercent} className="mb-2" />
                      <p className="text-sm text-muted-foreground">Used {smsStats.usedPercent}% of total credits</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Delivery Rate</h4>
                        <Badge variant="outline">{smsStats.deliveryRate}%</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Delivered</span>
                          <span className="font-medium">{smsStats.delivered.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Failed</span>
                          <span className="font-medium text-red-600">{smsStats.failed.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Send app notifications to attendees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg bg-purple-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">Quick Notification</h4>
                  </div>
                  <div className="space-y-4">
                    <Input placeholder="Notification title" />
                    <Textarea 
                      placeholder="Enter notification message"
                      className="min-h-[100px]"
                    />
                    <div className="flex items-center gap-4">
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Send to" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="ios">iOS Users Only</SelectItem>
                          <SelectItem value="android">Android Users Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        Send Notification
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Recent Notifications</h4>
                        <div className="space-y-3">
                          {notifRecent.map((notif) => (
                            <div key={notif.id} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium text-sm">{notif.title}</p>
                                <p className="text-xs text-muted-foreground">{toDisplayDate(notif.createdAt)}</p>
                              </div>
                              <Badge variant="outline">{notif.sentCount} sent</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Platform Distribution</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">iOS Users</span>
                            <Badge>{platform.iosUsers.toLocaleString()}</Badge>
                          </div>
                          <Progress value={platform.totalAppUsers ? Math.round((platform.iosUsers / platform.totalAppUsers) * 100) : 0} className="h-2" />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Android Users</span>
                            <Badge variant="outline">{platform.androidUsers.toLocaleString()}</Badge>
                          </div>
                          <Progress value={platform.totalAppUsers ? Math.round((platform.androidUsers / platform.totalAppUsers) * 100) : 0} className="h-2" />
                          
                          <div className="pt-2 text-sm text-muted-foreground">
                            Total app users: {platform.totalAppUsers.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}