'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import type { AttendeeRegistration, CommunicationTemplate } from '@/lib/adminApi';
import { Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RecipientsCardProps {
  recipientSearch: string;
  onRecipientSearchChange: (value: string) => void;
  templates: CommunicationTemplate[];
  recipientTemplate: string;
  onRecipientTemplateChange: (value: string) => void;
  recipientSubject: string;
  onRecipientSubjectChange: (value: string) => void;
  recipientMessage: string;
  onRecipientMessageChange: (value: string) => void;
  isAllFilteredSelected: boolean;
  selectedRecipientIds: string[];
  selectedCount: number;
  onSelectAll: (checked: boolean) => void;
  filteredAttendeesCount: number;
  visibleAttendees: AttendeeRegistration[];
  showAllRecipients: boolean;
  onToggleShowAll: () => void;
  onRecipientSelect: (id: string, checked: boolean) => void;
  sendingRecipients: boolean;
  onSendRecipients: () => void;
}

export default function RecipientsCard({
  recipientSearch,
  onRecipientSearchChange,
  templates,
  recipientTemplate,
  onRecipientTemplateChange,
  recipientSubject,
  onRecipientSubjectChange,
  recipientMessage,
  onRecipientMessageChange,
  isAllFilteredSelected,
  selectedRecipientIds,
  selectedCount,
  onSelectAll,
  filteredAttendeesCount,
  visibleAttendees,
  showAllRecipients,
  onToggleShowAll,
  onRecipientSelect,
  sendingRecipients,
  onSendRecipients,
}: RecipientsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipients</CardTitle>
        <CardDescription>Select users to send individual emails</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search attendees"
          value={recipientSearch}
          onChange={(e) => onRecipientSearchChange(e.target.value)}
        />

        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Template</label>
            <Select value={recipientTemplate} onValueChange={onRecipientTemplateChange}>
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
              onChange={(e) => onRecipientSubjectChange(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Message for selected</label>
          <Textarea
            className="min-h-[140px]"
            placeholder="Write a message to the selected recipients..."
            value={recipientMessage}
            onChange={(e) => onRecipientMessageChange(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={isAllFilteredSelected} onCheckedChange={(checked) => onSelectAll(checked === true)} />
            Select all
          </label>
          <Badge variant="outline">{selectedCount} selected</Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {Math.min(visibleAttendees.length, filteredAttendeesCount)} of {filteredAttendeesCount}
          </span>
          {filteredAttendeesCount > 5 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1"
              onClick={onToggleShowAll}
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
                    onCheckedChange={(checked) => onRecipientSelect(attendee.id, checked === true)}
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

            {filteredAttendeesCount === 0 && (
              <div className="text-sm text-muted-foreground text-center py-6">
                No attendees match your search.
              </div>
            )}
          </div>
        </ScrollArea>

        <Button className="w-full" disabled={sendingRecipients || selectedCount === 0} onClick={onSendRecipients}>
          <Send className="h-4 w-4 mr-2" />
          Send to Selected
        </Button>
      </CardContent>
    </Card>
  );
}
