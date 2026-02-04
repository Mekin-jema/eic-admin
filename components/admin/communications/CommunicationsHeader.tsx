'use client';

import { Button } from '@/components/ui/button';
import { History, Send } from 'lucide-react';

interface CommunicationsHeaderProps {
  isSending: boolean;
  audience: string;
  sendMethod: string;
  scheduledFor: string;
  onSend: () => void;
}

export default function CommunicationsHeader({
  isSending,
  audience,
  sendMethod,
  scheduledFor,
  onSend,
}: CommunicationsHeaderProps) {
  const disableSend =
    isSending || audience === 'custom' || (sendMethod === 'scheduled' && !scheduledFor);

  return (
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
        <Button disabled={disableSend} onClick={onSend}>
          <Send className="h-4 w-4 mr-2" />
          {sendMethod === 'scheduled' ? 'Schedule Message' : 'Send Message'}
        </Button>
      </div>
    </div>
  );
}
