'use client';

import { Button } from '@/components/ui/button';
import type { CommunicationTemplate } from '@/lib/adminApi';
import { toDisplayDate } from './communicationsUtils';
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

interface TemplateSelectorProps {
  templates: CommunicationTemplate[];
  selectedTemplate: string;
  onSelectTemplate: (template: CommunicationTemplate) => void;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TemplateSelector({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onCreate,
  onEdit,
  onDelete,
}: TemplateSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium mb-2 block">Select Template</label>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCreate}>
            New Template
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
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
                  onClick={onDelete}
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
            variant={selectedTemplate === template.key ? 'default' : 'outline'}
            className="justify-start h-auto py-3"
            onClick={() => onSelectTemplate(template)}
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
  );
}
