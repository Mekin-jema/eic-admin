import { useCallback, type Dispatch, type RefObject, type SetStateAction } from 'react';
import { toast } from 'sonner';
import type { AttendeeRegistration, CommunicationTemplate } from '@/lib/adminApi';
import {
  createCommTemplate,
  deleteCommTemplate,
  sendSelectedRecipientEmails,
  sendTestCommunicationEmail,
  updateCommTemplate,
} from '@/lib/adminApi';

interface ComposePayload {
  templateKey: string;
  audience: string;
  subject: string;
  body: string;
}

interface UseCommunicationsHandlersParams {
  message: string;
  setMessage: (value: string) => void;
  messageRef: RefObject<HTMLTextAreaElement | null>;
  setAttachments: Dispatch<SetStateAction<File[]>>;
  setTemplateDialogMode: Dispatch<SetStateAction<'create' | 'edit'>>;
  setTemplateForm: Dispatch<
    SetStateAction<{ key: string; name: string; subject: string; body: string }>
  >;
  setTemplateDialogOpen: Dispatch<SetStateAction<boolean>>;
  setTemplateSaving: Dispatch<SetStateAction<boolean>>;
  templateDialogMode: 'create' | 'edit';
  templateForm: { key: string; name: string; subject: string; body: string };
  selectedTemplateData?: CommunicationTemplate;
  fetchCommunications: () => Promise<void> | void;
  testEmail: string;
  subject: string;
  setTestDialogOpen: Dispatch<SetStateAction<boolean>>;
  setTestEmail: Dispatch<SetStateAction<string>>;
  audience: string;
  sendMethod: string;
  scheduledFor: string;
  selectedTemplate: string;
  scheduleEmail: (payload: ComposePayload & { scheduledFor: string }) => Promise<void> | void;
  sendEmail: (payload: ComposePayload) => Promise<void> | void;
  selectedRecipientIds: string[];
  recipientSubject: string;
  recipientMessage: string;
  recipientTemplate: string;
  setSendingRecipients: Dispatch<SetStateAction<boolean>>;
  setRecipientMessage: Dispatch<SetStateAction<string>>;
  filteredAttendees: AttendeeRegistration[];
  setSelectedRecipientIds: Dispatch<SetStateAction<string[]>>;
  getTemplateDefaults: (key: string) => { subject: string; body: string };
}

export default function useCommunicationsHandlers({
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
}: UseCommunicationsHandlersParams) {
  const insertAtCursor = useCallback(
    (value: string) => {
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
    },
    [message, messageRef, setMessage]
  );

  const wrapSelection = useCallback(
    (prefix: string, suffix?: string) => {
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
    },
    [message, messageRef, setMessage]
  );

  const applyLinePrefix = useCallback(
    (prefix: string) => {
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
    },
    [message, messageRef, setMessage]
  );

  const handleAddAttachments = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      setAttachments((prev) => [...prev, ...Array.from(files)]);
    },
    [setAttachments]
  );

  const openCreateTemplate = useCallback(() => {
    setTemplateDialogMode('create');
    setTemplateForm({ key: '', name: '', subject: '', body: '' });
    setTemplateDialogOpen(true);
  }, [setTemplateDialogMode, setTemplateDialogOpen, setTemplateForm]);

  const openEditTemplate = useCallback(() => {
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
  }, [getTemplateDefaults, selectedTemplateData, setTemplateDialogMode, setTemplateDialogOpen, setTemplateForm]);

  const handleSaveTemplate = useCallback(async () => {
    if (
      !templateForm.name ||
      !templateForm.subject ||
      (!templateForm.key && templateDialogMode === 'create')
    ) {
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
  }, [
    fetchCommunications,
    selectedTemplateData,
    setTemplateDialogOpen,
    setTemplateSaving,
    templateDialogMode,
    templateForm,
  ]);

  const handleDeleteTemplate = useCallback(async () => {
    if (!selectedTemplateData) return;
    try {
      await deleteCommTemplate(selectedTemplateData.id);
      toast.success('Template deleted');
      await fetchCommunications();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete template');
    }
  }, [fetchCommunications, selectedTemplateData]);

  const handleSendTestEmail = useCallback(async () => {
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
  }, [message, setTestDialogOpen, setTestEmail, subject, testEmail]);

  const handleSendCompose = useCallback(async () => {
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
  }, [
    audience,
    message,
    scheduleEmail,
    scheduledFor,
    sendEmail,
    sendMethod,
    selectedTemplate,
    subject,
  ]);

  const handleSendRecipients = useCallback(async () => {
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
  }, [recipientMessage, recipientSubject, recipientTemplate, selectedRecipientIds, setRecipientMessage, setSendingRecipients]);

  const setRecipientSelected = useCallback(
    (id: string, checked: boolean) => {
      setSelectedRecipientIds((prev) => {
        if (checked) return prev.includes(id) ? prev : [...prev, id];
        return prev.filter((item) => item !== id);
      });
    },
    [setSelectedRecipientIds]
  );

  const setSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedRecipientIds((prev) => {
        if (!checked) return prev.filter((id) => !filteredAttendees.some((a) => a.id === id));
        const next = new Set(prev);
        filteredAttendees.forEach((attendee) => next.add(attendee.id));
        return Array.from(next);
      });
    },
    [filteredAttendees, setSelectedRecipientIds]
  );

  return {
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
  };
}
