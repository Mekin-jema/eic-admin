'use client';

import { Button } from '@/components/ui/button';
import { Clock, Send } from 'lucide-react';

interface ComposeActionsProps {
  isSending: boolean;
  audience: string;
  sendMethod: string;
  onSend: () => void;
  onOpenTest: () => void;
}

export default function ComposeActions({
  isSending,
  audience,
  sendMethod,
  onSend,
  onOpenTest,
}: ComposeActionsProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <Button variant="outline" onClick={onOpenTest}>
        Send Test
      </Button>
      <div className="flex items-center gap-2">
        <Button disabled={isSending || audience === 'custom'} onClick={onSend}>
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
  );
}
