'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface TestEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testEmail: string;
  onTestEmailChange: (value: string) => void;
  onSendTest: () => void;
}

export default function TestEmailDialog({
  open,
  onOpenChange,
  testEmail,
  onTestEmailChange,
  onSendTest,
}: TestEmailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => onTestEmailChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSendTest}>Send Test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
