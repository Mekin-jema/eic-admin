'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  html: string;
}

export default function PreviewDialog({ open, onOpenChange, html }: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Email Preview</DialogTitle>
          <DialogDescription>Review the message before sending.</DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-background p-4" dangerouslySetInnerHTML={{ __html: html }} />
      </DialogContent>
    </Dialog>
  );
}
