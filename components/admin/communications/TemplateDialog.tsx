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
import { Textarea } from '@/components/ui/textarea';

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  form: {
    key: string;
    name: string;
    subject: string;
    body: string;
  };
  onFormChange: (next: { key?: string; name?: string; subject?: string; body?: string }) => void;
  onSave: () => void;
  saving: boolean;
}

export default function TemplateDialog({
  open,
  onOpenChange,
  mode,
  form,
  onFormChange,
  onSave,
  saving,
}: TemplateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Template' : 'Edit Template'}</DialogTitle>
          <DialogDescription>Manage template details and default body.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Key</label>
              <Input
                placeholder="welcome"
                value={form.key}
                disabled={mode === 'edit'}
                onChange={(e) => onFormChange({ key: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                placeholder="Welcome Email"
                value={form.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Subject</label>
            <Input
              placeholder="Subject line"
              value={form.subject}
              onChange={(e) => onFormChange({ subject: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Body</label>
            <Textarea
              className="min-h-[200px]"
              value={form.body}
              onChange={(e) => onFormChange({ body: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
