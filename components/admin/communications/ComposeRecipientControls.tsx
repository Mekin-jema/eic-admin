'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ComposeRecipientControlsProps {
  audience: string;
  onAudienceChange: (value: string) => void;
  sendMethod: string;
  onSendMethodChange: (value: string) => void;
  scheduledFor: string;
  onScheduledForChange: (value: string) => void;
}

export default function ComposeRecipientControls({
  audience,
  onAudienceChange,
  sendMethod,
  onSendMethodChange,
  scheduledFor,
  onScheduledForChange,
}: ComposeRecipientControlsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="text-sm font-medium mb-2 block">Send To</label>
        <Select value={audience} onValueChange={onAudienceChange}>
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
        <Select value={sendMethod} onValueChange={onSendMethodChange}>
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
            onChange={(e) => onScheduledForChange(e.target.value)}
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
  );
}
