// app/admin/communications/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { 
  Mail, Send, Users, Clock, BarChart3, Eye, 
  Copy, AlertCircle, History, Paperclip,
  Image as ImageIcon, FileText, Smile
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useEffect, useMemo, useRef, useState } from 'react';
import Loading from './loading';
import { useEicAdminStore } from '@/store/useEicAdminStore';
import {
  createCommTemplate,
  deleteCommTemplate,
  sendSelectedRecipientEmails,
  sendTestCommunicationEmail,
  updateCommTemplate,
  type AttendeeRegistration,
  type CommunicationTemplate,
} from '@/lib/adminApi';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

// Backend-driven templates and messages
const toDisplayDate = (iso?: string | null) => iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—';

const templateDefaults: Record<string, { subject: string; body: string }> = {
  welcome: {
    subject: 'Welcome to Invest Ethiopia Forum 2026',
    body: `Dear Attendee,

Welcome to the Invest Ethiopia Forum 2026! We're excited to have you join us for this premier investment event.

Important Details:
• Date: May 12-13, 2026
• Venue: Ethiopian Skylight Hotel, Addis Ababa
• Check-in: Starts at 8:00 AM

Please bring your registration confirmation and ID.

Best regards,
Invest Ethiopia Forum Team`,
  },
  'checkin-reminder': {
    subject: 'Important: Check-in Information',
    body: `Dear Attendee,

This is a friendly reminder about check-in for Invest Ethiopia Forum 2026.

Check-in Details:
• Date: May 12-13, 2026
• Time: 8:00 AM – 10:30 AM
• Venue: Ethiopian Skylight Hotel, Addis Ababa

Please bring your registration confirmation and a valid ID for quick entry.

We look forward to welcoming you.

Best regards,
Invest Ethiopia Forum Team`,
  },
  'vip-invite': {
    subject: 'Exclusive VIP Event Invitation',
    body: `Dear Esteemed Guest,

You are cordially invited to the Invest Ethiopia Forum 2026 VIP experience.

VIP Access Includes:
• Priority check-in and seating
• Private networking lounge
• Exclusive meetings with key stakeholders

Please confirm your attendance so we can reserve your VIP access.

Warm regards,
Invest Ethiopia Forum Team`,
  },
  'post-event': {
    subject: 'Thank You & Next Steps',
    body: `Dear Attendee,

Thank you for attending Invest Ethiopia Forum 2026. We appreciate your participation and engagement.

Next Steps:
• You will receive a summary of key sessions and materials shortly.
• For follow-ups, please reply with any questions or partnership interests.

We look forward to staying connected.

Best regards,
Invest Ethiopia Forum Team`,
  },
};

const getTemplateDefaults = (key: string) => templateDefaults[key] || templateDefaults.welcome;

const mergeTags = [
  { label: 'First Name', value: '{{firstName}}' },
  { label: 'Last Name', value: '{{lastName}}' },
  { label: 'Full Name', value: '{{fullName}}' },
  { label: 'Organization', value: '{{organization}}' },
  { label: 'Email', value: '{{email}}' },
  { label: 'Event Name', value: '{{eventName}}' },
];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderPreviewHtml = (content: string) => {
  const safe = escapeHtml(content).replace(/\n/g, '<br />');
  return `
<div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <div style="background:#0f172a;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
    <div style="font-size:18px;font-weight:700;">Ethiopian Investment Commission</div>
    <div style="font-size:12px;opacity:.8;margin-top:4px;">Invest Ethiopia Forum</div>
  </div>
  <div style="background:#ffffff;border:1px solid #e2e8f0;border-top:0;padding:24px;line-height:1.7;">
    ${safe}
  </div>
  <div style="background:#f1f5f9;padding:16px 24px;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;font-size:12px;color:#475569;text-align:center;">
    © 2026 Ethiopian Investment Commission. All rights reserved.<br />
    <a href="https://eic-frontend.vercel.app/privacy" style="color:#0f172a;text-decoration:none;">Privacy Policy</a> | 
    <a href="https://eic-frontend.vercel.app/terms" style="color:#0f172a;text-decoration:none;">Terms of Service</a>
  </div>
</div>`;
};

export default function CommunicationsPage() {
  const loading = useEicAdminStore((s) => s.loading);
  const fetchCommunications = useEicAdminStore((s) => s.fetchCommunications);
  const fetchAttendees = useEicAdminStore((s) => s.fetchAttendees);
  const sendEmail = useEicAdminStore((s) => s.sendEmail);
  const scheduleEmail = useEicAdminStore((s) => s.scheduleEmail);
  const templates = useEicAdminStore((s) => s.commTemplates);
  const stats = useEicAdminStore((s) => s.commStats) || { totalSent: 0, openRate: 0, clickRate: 0, bounceRate: 0, unsubscribes: 0 };
  const attendees = useEicAdminStore((s) => s.attendees) as AttendeeRegistration[];

  const [selectedTemplate, setSelectedTemplate] = useState<string>('welcome');
  const [audience, setAudience] = useState<string>('all');
  const [subject, setSubject] = useState<string>(getTemplateDefaults('welcome').subject);
  const [message, setMessage] = useState<string>(getTemplateDefaults('welcome').body);
  const [sendMethod, setSendMethod] = useState<string>('immediate');
  const [scheduledFor, setScheduledFor] = useState<string>('');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [sendingRecipients, setSendingRecipients] = useState(false);
  const [recipientTemplate, setRecipientTemplate] = useState<string>('welcome');
  const [recipientSubject, setRecipientSubject] = useState<string>('');
  const [recipientMessage, setRecipientMessage] = useState('');
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateDialogMode, setTemplateDialogMode] = useState<'create' | 'edit'>('create');
  const [templateForm, setTemplateForm] = useState({ key: '', name: '', subject: '', body: '' });
  const [templateSaving, setTemplateSaving] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const template = templates.find((item) => item.key === recipientTemplate);
    if (template && !recipientSubject) {
      setRecipientSubject(template.subject);
    }
    if (!recipientMessage) {
      const defaultBody = template?.body || getTemplateDefaults(recipientTemplate).body;
      setRecipientMessage(defaultBody);
    }
  }, [recipientTemplate, recipientSubject, recipientMessage, templates]);
  useEffect(() => {
    fetchCommunications();
    fetchAttendees();
  }, [fetchCommunications, fetchAttendees]);

  const filteredAttendees = useMemo(() => {
    const query = recipientSearch.trim().toLowerCase();
    if (!query) return attendees;
    return attendees.filter((attendee) => {
      const name = `${attendee.firstName} ${attendee.lastName}`.toLowerCase();
      return (
        name.includes(query) ||
        attendee.email.toLowerCase().includes(query) ||
        attendee.organization?.toLowerCase().includes(query)
      );
    });
  }, [attendees, recipientSearch]);

  const visibleAttendees = showAllRecipients
    ? filteredAttendees
    : filteredAttendees.slice(0, 5);

  const isAllFilteredSelected =
    filteredAttendees.length > 0 &&
    filteredAttendees.every((attendee) => selectedRecipientIds.includes(attendee.id));

  const setRecipientSelected = (id: string, checked: boolean) => {
    setSelectedRecipientIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((item) => item !== id);
    });
  };

  const setSelectAll = (checked: boolean) => {
    setSelectedRecipientIds((prev) => {
      if (!checked) return prev.filter((id) => !filteredAttendees.some((a) => a.id === id));
      const next = new Set(prev);
      filteredAttendees.forEach((attendee) => next.add(attendee.id));
      return Array.from(next);
    });
  };

  const selectedTemplateData = useMemo<CommunicationTemplate | undefined>(
    () => templates.find((item) => item.key === selectedTemplate),
    [templates, selectedTemplate]
  );

  const insertAtCursor = (value: string) => {
    if (!messageRef.current) return;
    const el = messageRef.current;
    const start = el.selectionStart ?? message.length;
    const end = el.selectionEnd ?? message.length;
    const next = `${message.slice(0, start)}${value}${message.slice(end)}`;
    setMessage(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + value.length;
      el.setSelectionRange(cursor, cursor);
    });
  };

  const wrapSelection = (prefix: string, suffix?: string) => {
    if (!messageRef.current) return;
    const el = messageRef.current;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = message.slice(start, end) || 'text';
    const wrapEnd = suffix ?? prefix;
    const next = `${message.slice(0, start)}${prefix}${selected}${wrapEnd}${message.slice(end)}`;
    setMessage(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  };

  const applyLinePrefix = (prefix: string) => {
    if (!messageRef.current) return;
    const el = messageRef.current;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = message.slice(start, end) || '';
    const target = selected || message;
    const lines = target.split('\n').map((line) => (line.trim() ? `${prefix}${line}` : line));
    const nextBlock = lines.join('\n');
    const next = selected
      ? `${message.slice(0, start)}${nextBlock}${message.slice(end)}`
      : nextBlock;
    setMessage(next);
  };

  const handleAddAttachments = (files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => [...prev, ...Array.from(files)]);
  };

  const openCreateTemplate = () => {
    setTemplateDialogMode('create');
    setTemplateForm({ key: '', name: '', subject: '', body: '' });
    setTemplateDialogOpen(true);
  };

  const openEditTemplate = () => {
    if (!selectedTemplateData) {
      toast.error('Select a template to edit');
      return;
    }
    setTemplateDialogMode('edit');
    setTemplateForm({
      key: selectedTemplateData.key,
      name: selectedTemplateData.name,
      subject: selectedTemplateData.subject,
      body: selectedTemplateData.body || getTemplateDefaults(selectedTemplateData.key).body,
    });
    setTemplateDialogOpen(true);
  };

  const handleSaveTemplate = async () => {
    if (!templateForm.name || !templateForm.subject || (!templateForm.key && templateDialogMode === 'create')) {
      toast.error('Key, name and subject are required');
      return;
    }
    setTemplateSaving(true);
    try {
      if (templateDialogMode === 'create') {
        await createCommTemplate({
          key: templateForm.key.trim(),
          name: templateForm.name.trim(),
          subject: templateForm.subject.trim(),
          body: templateForm.body,
        });
        toast.success('Template created');
      } else if (selectedTemplateData) {
        await updateCommTemplate(selectedTemplateData.id, {
          name: templateForm.name.trim(),
          subject: templateForm.subject.trim(),
          body: templateForm.body,
        });
        toast.success('Template updated');
      }
      await fetchCommunications();
      setTemplateDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save template');
    } finally {
      setTemplateSaving(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplateData) return;
    try {
      await deleteCommTemplate(selectedTemplateData.id);
      toast.success('Template deleted');
      await fetchCommunications();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete template');
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Enter a test email address');
      return;
    }
    try {
      await sendTestCommunicationEmail({ email: testEmail, subject, body: message });
      toast.success('Test email sent');
      setTestDialogOpen(false);
      setTestEmail('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send test email');
    }
  };

  const handleSendCompose = async () => {
    if (audience === 'custom') {
      toast.info('Use the Recipients panel to send to selected attendees.');
      return;
    }

    if (sendMethod === 'scheduled') {
      if (!scheduledFor) {
        toast.error('Select a schedule date and time.');
        return;
      }
      await scheduleEmail({
        templateKey: selectedTemplate,
        audience,
        subject,
        body: message,
        scheduledFor,
      });
      return;
    }

    await sendEmail({ templateKey: selectedTemplate, audience, subject, body: message });
  };

  const handleSendRecipients = async () => {
    if (selectedRecipientIds.length === 0) {
      toast.info('Select at least one attendee to send an email.');
      return;
    }

    const subjectLine = recipientSubject.trim();
    const body = recipientMessage.trim();
    if (!subjectLine || !body) {
      toast.error('Subject and message are required for selected recipients.');
      return;
    }

    setSendingRecipients(true);
    try {
      const res = await sendSelectedRecipientEmails({
        templateKey: recipientTemplate,
        recipientIds: selectedRecipientIds,
        subject: subjectLine,
        body,
      });
      const sentCount = res.data.sent;
      const failedCount = res.data.attempted - res.data.sent;
      if (sentCount > 0) {
        toast.success(`Sent ${sentCount} email${sentCount === 1 ? '' : 's'} successfully`);
      }
      if (failedCount > 0) {
        toast.error(`${failedCount} email${failedCount === 1 ? '' : 's'} failed to send`);
      }
      setRecipientMessage('');
    } catch (err) {
      toast.error('Failed to send selected emails');
    } finally {
      setSendingRecipients(false);
    }
  };

  const isSending = loading;

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
          <Button
            disabled={
              isSending ||
              audience === 'custom' ||
              (sendMethod === 'scheduled' && !scheduledFor)
            }
            onClick={handleSendCompose}
          >
            <Send className="h-4 w-4 mr-2" />
            {sendMethod === 'scheduled' ? 'Schedule Message' : 'Send Message'}
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium mb-2 block">Select Template</label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={openCreateTemplate}>
                      New Template
                    </Button>
                    <Button variant="outline" size="sm" onClick={openEditTemplate}>
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete template?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteTemplate}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((template) => (
                    <Button
                      key={template.key}
                      variant={selectedTemplate === template.key ? "default" : "outline"}
                      className="justify-start h-auto py-3"
                      onClick={() => {
                        setSelectedTemplate(template.key);
                        setSubject(template.subject);
                        const nextBody = template.body || getTemplateDefaults(template.key).body;
                        setMessage(nextBody);
                      }}
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
                  <Select defaultValue={sendMethod} onValueChange={(v) => setSendMethod(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Send Immediately</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {sendMethod === 'scheduled' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Schedule Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                    />
                  </div>
                )}

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
                    <Button variant="ghost" size="sm" onClick={() => wrapSelection('**')}>
                      <span className="text-xs font-bold">B</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => wrapSelection('*')}>
                      <span className="text-xs italic">I</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => wrapSelection('__')}>
                      <span className="text-xs underline">U</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => applyLinePrefix('- ')}>
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => applyLinePrefix('1. ')}>
                      <span className="text-xs">1.</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertAtCursor('🙂')}>
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {mergeTags.map((tag) => (
                          <DropdownMenuItem key={tag.value} onClick={() => insertAtCursor(tag.value)}>
                            {tag.label}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => insertAtCursor('{{eventDate}}')}>
                          Event Date
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(message);
                        toast.success('Message copied');
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(true)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea 
                    className="min-h-[200px] border-0 focus-visible:ring-0"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    ref={messageRef}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => handleAddAttachments(e.target.files)}
                  />
                </div>
                {attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <Badge key={`${file.name}-${index}`} variant="secondary" className="gap-1">
                        {file.name}
                        <button
                          className="ml-1 text-xs"
                          onClick={() =>
                            setAttachments((prev) => prev.filter((_, i) => i !== index))
                          }
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setTestDialogOpen(true)}>
                  Send Test
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    disabled={isSending || audience === 'custom'}
                    onClick={handleSendCompose}
                  >
                    {sendMethod === 'scheduled' ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipients */}
        <Card>
          <CardHeader>
            <CardTitle>Recipients</CardTitle>
            <CardDescription>Select users to send individual emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search attendees"
              value={recipientSearch}
              onChange={(e) => setRecipientSearch(e.target.value)}
            />

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Template</label>
                <Select
                  defaultValue={recipientTemplate}
                  onValueChange={(value) => {
                    setRecipientTemplate(value);
                    const template = templates.find((item) => item.key === value);
                    if (template) setRecipientSubject(template.subject);
                    setRecipientMessage(template?.body || getTemplateDefaults(value).body);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.key} value={template.key}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input
                  placeholder="Enter email subject"
                  value={recipientSubject}
                  onChange={(e) => setRecipientSubject(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message for selected</label>
              <Textarea
                className="min-h-[140px]"
                placeholder="Write a message to the selected recipients..."
                value={recipientMessage}
                onChange={(e) => setRecipientMessage(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={isAllFilteredSelected}
                  onCheckedChange={(checked) => setSelectAll(checked === true)}
                />
                Select all
              </label>
              <Badge variant="outline">{selectedRecipientIds.length} selected</Badge>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing {Math.min(visibleAttendees.length, filteredAttendees.length)} of{' '}
                {filteredAttendees.length}
              </span>
              {filteredAttendees.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-2 py-1"
                  onClick={() => setShowAllRecipients((prev) => !prev)}
                >
                  {showAllRecipients ? 'Show top 5' : 'Show all'}
                </Button>
              )}
            </div>

            <ScrollArea className="h-[320px] pr-2">
              <div className="space-y-2">
                {visibleAttendees.map((attendee) => {
                  const name = `${attendee.firstName} ${attendee.lastName}`.trim();
                  const selected = selectedRecipientIds.includes(attendee.id);
                  return (
                    <div
                      key={attendee.id}
                      className={`flex items-start gap-3 rounded-lg border p-3 text-sm transition ${
                        selected ? 'border-primary bg-muted' : 'hover:bg-accent'
                      }`}
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) => setRecipientSelected(attendee.id, checked === true)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{name || 'Unnamed Attendee'}</div>
                          {attendee.isCheckedIn && (
                            <Badge variant="secondary" className="text-[10px]">Checked In</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{attendee.email}</div>
                        {attendee.organization && (
                          <div className="text-xs text-muted-foreground">{attendee.organization}</div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredAttendees.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-6">
                    No attendees match your search.
                  </div>
                )}
              </div>
            </ScrollArea>

            <Button
              className="w-full"
              disabled={sendingRecipients || selectedRecipientIds.length === 0}
              onClick={handleSendRecipients}
            >
              <Send className="h-4 w-4 mr-2" />
              Send to Selected
            </Button>
          </CardContent>
        </Card>

      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>Review the message before sending.</DialogDescription>
          </DialogHeader>
          <div
            className="rounded-lg border bg-background p-4"
            dangerouslySetInnerHTML={{ __html: renderPreviewHtml(message) }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
            <DialogDescription>Send a test email to verify the content.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Test Email Address</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendTestEmail}>Send Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {templateDialogMode === 'create' ? 'Create Template' : 'Edit Template'}
            </DialogTitle>
            <DialogDescription>Manage template details and default body.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Key</label>
                <Input
                  placeholder="welcome"
                  value={templateForm.key}
                  disabled={templateDialogMode === 'edit'}
                  onChange={(e) => setTemplateForm((prev) => ({ ...prev, key: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input
                  placeholder="Welcome Email"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                placeholder="Subject line"
                value={templateForm.subject}
                onChange={(e) => setTemplateForm((prev) => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Body</label>
              <Textarea
                className="min-h-[200px]"
                value={templateForm.body}
                onChange={(e) => setTemplateForm((prev) => ({ ...prev, body: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={templateSaving}>
              {templateSaving ? 'Saving...' : 'Save Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}