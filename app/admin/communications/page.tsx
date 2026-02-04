// app/admin/communications/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useRef, useState } from 'react';
import Loading from './loading';
import { useEicAdminStore } from '@/store/useEicAdminStore';
import type { AttendeeRegistration, CommunicationTemplate } from '@/lib/adminApi';
import { toast } from 'sonner';
import CommunicationsHeader from '@/components/admin/communications/CommunicationsHeader';
import CommunicationsStats from '@/components/admin/communications/CommunicationsStats';
import TemplateSelector from '@/components/admin/communications/TemplateSelector';
import ComposeRecipientControls from '@/components/admin/communications/ComposeRecipientControls';
import MessageEditor from '@/components/admin/communications/MessageEditor';
import ComposeActions from '@/components/admin/communications/ComposeActions';
import RecipientsCard from '@/components/admin/communications/RecipientsCard';
import PreviewDialog from '@/components/admin/communications/PreviewDialog';
import TestEmailDialog from '@/components/admin/communications/TestEmailDialog';
import TemplateDialog from '@/components/admin/communications/TemplateDialog';
import { getTemplateDefaults, renderPreviewHtml } from '@/components/admin/communications/communicationsUtils';
import useCommunicationsHandlers from '@/components/admin/communications/hooks/useCommunicationsHandlers';

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

  const selectedTemplateData = useMemo<CommunicationTemplate | undefined>(
    () => templates.find((item) => item.key === selectedTemplate),
    [templates, selectedTemplate]
  );
  const {
    insertAtCursor,
    wrapSelection,
    applyLinePrefix,
    handleAddAttachments,
    openCreateTemplate,
    openEditTemplate,
    handleSaveTemplate,
    handleDeleteTemplate,
    handleSendTestEmail,
    handleSendCompose,
    handleSendRecipients,
    setRecipientSelected,
    setSelectAll,
  } = useCommunicationsHandlers({
    message,
    setMessage,
    messageRef,
    setAttachments,
    setTemplateDialogMode,
    setTemplateForm,
    setTemplateDialogOpen,
    setTemplateSaving,
    templateDialogMode,
    templateForm,
    selectedTemplateData,
    fetchCommunications,
    testEmail,
    subject,
    setTestDialogOpen,
    setTestEmail,
    audience,
    sendMethod,
    scheduledFor,
    selectedTemplate,
    scheduleEmail,
    sendEmail,
    selectedRecipientIds,
    recipientSubject,
    recipientMessage,
    recipientTemplate,
    setSendingRecipients,
    setRecipientMessage,
    filteredAttendees,
    setSelectedRecipientIds,
    getTemplateDefaults,
  });

  const isSending = loading;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 pl-9 pr-4">
      {/* Header */}
      <CommunicationsHeader
        isSending={isSending}
        audience={audience}
        sendMethod={sendMethod}
        scheduledFor={scheduledFor}
        onSend={handleSendCompose}
      />

      {/* Stats */}
      <CommunicationsStats stats={stats} />

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
              <TemplateSelector
                templates={templates}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={(template) => {
                  setSelectedTemplate(template.key);
                  setSubject(template.subject);
                  const nextBody = template.body || getTemplateDefaults(template.key).body;
                  setMessage(nextBody);
                }}
                onCreate={openCreateTemplate}
                onEdit={openEditTemplate}
                onDelete={handleDeleteTemplate}
              />

              {/* Recipient Selection */}
              <ComposeRecipientControls
                audience={audience}
                onAudienceChange={setAudience}
                sendMethod={sendMethod}
                onSendMethodChange={setSendMethod}
                scheduledFor={scheduledFor}
                onScheduledForChange={setScheduledFor}
              />

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
              <MessageEditor
                message={message}
                onMessageChange={setMessage}
                onWrapSelection={wrapSelection}
                onApplyLinePrefix={applyLinePrefix}
                onInsertAtCursor={insertAtCursor}
                onCopyMessage={() => {
                  navigator.clipboard.writeText(message);
                  toast.success('Message copied');
                }}
                onOpenPreview={() => setPreviewOpen(true)}
                onAddAttachments={handleAddAttachments}
                attachments={attachments}
                onRemoveAttachment={(index) =>
                  setAttachments((prev) => prev.filter((_, i) => i !== index))
                }
                fileInputRef={fileInputRef}
                messageRef={messageRef}
              />

              {/* Actions */}
              <ComposeActions
                isSending={isSending}
                audience={audience}
                sendMethod={sendMethod}
                onSend={handleSendCompose}
                onOpenTest={() => setTestDialogOpen(true)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recipients */}
        <RecipientsCard
          recipientSearch={recipientSearch}
          onRecipientSearchChange={setRecipientSearch}
          templates={templates}
          recipientTemplate={recipientTemplate}
          onRecipientTemplateChange={(value) => {
            setRecipientTemplate(value);
            const template = templates.find((item) => item.key === value);
            if (template) setRecipientSubject(template.subject);
            setRecipientMessage(template?.body || getTemplateDefaults(value).body);
          }}
          recipientSubject={recipientSubject}
          onRecipientSubjectChange={setRecipientSubject}
          recipientMessage={recipientMessage}
          onRecipientMessageChange={setRecipientMessage}
          isAllFilteredSelected={isAllFilteredSelected}
          selectedRecipientIds={selectedRecipientIds}
          selectedCount={selectedRecipientIds.length}
          onSelectAll={setSelectAll}
          filteredAttendeesCount={filteredAttendees.length}
          visibleAttendees={visibleAttendees}
          showAllRecipients={showAllRecipients}
          onToggleShowAll={() => setShowAllRecipients((prev) => !prev)}
          onRecipientSelect={setRecipientSelected}
          sendingRecipients={sendingRecipients}
          onSendRecipients={handleSendRecipients}
        />

      </div>

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        html={renderPreviewHtml(message)}
      />

      <TestEmailDialog
        open={testDialogOpen}
        onOpenChange={setTestDialogOpen}
        testEmail={testEmail}
        onTestEmailChange={setTestEmail}
        onSendTest={handleSendTestEmail}
      />

      <TemplateDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        mode={templateDialogMode}
        form={templateForm}
        onFormChange={(next) => setTemplateForm((prev) => ({ ...prev, ...next }))}
        onSave={handleSaveTemplate}
        saving={templateSaving}
      />
    </div>
  );
}