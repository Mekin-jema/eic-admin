// app/admin/communications/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, Send, Users, Filter, Clock, BarChart3, Eye, 
  Download, Printer, Copy, CheckCircle, AlertCircle,
  Phone, MessageSquare, Bell, Calendar, UserCheck,
  Search, Star, TrendingUp, History, Share2, Paperclip,
  Image as ImageIcon, FileText, Smile
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

const emailTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to Invest Ethiopia Forum 2026',
    used: 1247,
    lastUsed: 'Today',
  },
  {
    id: 'checkin-reminder',
    name: 'Check-in Reminder',
    subject: 'Important: Check-in Information',
    used: 892,
    lastUsed: 'Yesterday',
  },
  {
    id: 'vip-invite',
    name: 'VIP Invitation',
    subject: 'Exclusive VIP Event Invitation',
    used: 156,
    lastUsed: '2 days ago',
  },
  {
    id: 'post-event',
    name: 'Post-Event Follow-up',
    subject: 'Thank You & Next Steps',
    used: 0,
    lastUsed: 'Never',
  },
];

const recentMessages = [
  { id: 1, subject: 'Welcome Email', sent: 1247, opened: 845, clicked: 324, date: 'Today' },
  { id: 2, subject: 'Check-in Reminder', sent: 892, opened: 712, clicked: 289, date: 'Yesterday' },
  { id: 3, subject: 'VIP Welcome', sent: 156, opened: 148, clicked: 76, date: '2 days ago' },
  { id: 4, subject: 'Speaker Briefing', sent: 42, opened: 42, clicked: 32, date: '3 days ago' },
];

export default function CommunicationsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');
  const [message, setMessage] = useState(`Dear Attendee,

Welcome to the Invest Ethiopia Forum 2026! We're excited to have you join us for this premier investment event.

Important Details:
• Date: May 12-13, 2026
• Venue: Ethiopian Skylight Hotel, Addis Ababa
• Check-in: Starts at 8:00 AM

Please bring your registration confirmation and ID.

Best regards,
Invest Ethiopia Forum Team`);

  const stats = {
    totalSent: 2337,
    openRate: 68,
    clickRate: 32,
    bounceRate: 2,
    unsubscribes: 12,
  };

  return (
    <div className="space-y-6">
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
          <Button>
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
                  {emailTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      className="justify-start h-auto py-3"
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          Used {template.used} times • {template.lastUsed}
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
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Attendees (1,247)</SelectItem>
                      <SelectItem value="checked-in">Checked In (892)</SelectItem>
                      <SelectItem value="pending">Pending (355)</SelectItem>
                      <SelectItem value="vip">VIP (156)</SelectItem>
                      <SelectItem value="speakers">Speakers (42)</SelectItem>
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
                  defaultValue="Welcome to Invest Ethiopia Forum 2026"
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
                        <span className="text-xs text-muted-foreground">{msg.date}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 border rounded">
                          <div className="text-sm font-bold">{msg.sent}</div>
                          <div className="text-xs text-muted-foreground">Sent</div>
                        </div>
                        <div className="p-2 border rounded">
                          <div className="text-sm font-bold">{msg.opened}</div>
                          <div className="text-xs text-muted-foreground">Opened</div>
                        </div>
                        <div className="p-2 border rounded">
                          <div className="text-sm font-bold">{msg.clicked}</div>
                          <div className="text-xs text-muted-foreground">Clicked</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Open rate: {Math.round((msg.opened / msg.sent) * 100)}%</span>
                        <span>CTR: {Math.round((msg.clicked / msg.opened) * 100)}%</span>
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
                  {[
                    { name: 'Welcome Series', status: 'Active', sent: 1247, openRate: 68 },
                    { name: 'Check-in Series', status: 'Active', sent: 892, openRate: 72 },
                    { name: 'VIP Engagement', status: 'Paused', sent: 156, openRate: 85 },
                    { name: 'Post-Event', status: 'Draft', sent: 0, openRate: 0 },
                  ].map((campaign) => (
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
                        <Badge>1,247 remaining</Badge>
                      </div>
                      <Progress value={65} className="mb-2" />
                      <p className="text-sm text-muted-foreground">Used 35% of total credits</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Delivery Rate</h4>
                        <Badge variant="outline">98.5%</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Delivered</span>
                          <span className="font-medium">1,228</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Failed</span>
                          <span className="font-medium text-red-600">19</span>
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
                          {[
                            { title: 'Welcome Message', sent: '2 hours ago', read: 845 },
                            { title: 'Check-in Reminder', sent: 'Yesterday', read: 712 },
                            { title: 'Session Starting', sent: 'Today', read: 324 },
                          ].map((notif) => (
                            <div key={notif.title} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium text-sm">{notif.title}</p>
                                <p className="text-xs text-muted-foreground">{notif.sent}</p>
                              </div>
                              <Badge variant="outline">{notif.read} read</Badge>
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
                            <Badge>856</Badge>
                          </div>
                          <Progress value={68} className="h-2" />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Android Users</span>
                            <Badge variant="outline">391</Badge>
                          </div>
                          <Progress value={32} className="h-2" />
                          
                          <div className="pt-2 text-sm text-muted-foreground">
                            Total app users: 1,247
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