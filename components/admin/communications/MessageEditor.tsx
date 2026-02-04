'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Eye, FileText, Image as ImageIcon, Paperclip, Smile } from 'lucide-react';
import { mergeTags } from './communicationsUtils';

interface MessageEditorProps {
  message: string;
  onMessageChange: (value: string) => void;
  onWrapSelection: (value: string) => void;
  onApplyLinePrefix: (value: string) => void;
  onInsertAtCursor: (value: string) => void;
  onCopyMessage: () => void;
  onOpenPreview: () => void;
  onAddAttachments: (files: FileList | null) => void;
  attachments: File[];
  onRemoveAttachment: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  messageRef: React.RefObject<HTMLTextAreaElement | null>;
}

export default function MessageEditor({
  message,
  onMessageChange,
  onWrapSelection,
  onApplyLinePrefix,
  onInsertAtCursor,
  onCopyMessage,
  onOpenPreview,
  onAddAttachments,
  attachments,
  onRemoveAttachment,
  fileInputRef,
  messageRef,
}: MessageEditorProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Message</label>
      <div className="border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted">
          <Button variant="ghost" size="sm" onClick={() => onWrapSelection('**')}>
            <span className="text-xs font-bold">B</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onWrapSelection('*')}>
            <span className="text-xs italic">I</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onWrapSelection('__')}>
            <span className="text-xs underline">U</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onApplyLinePrefix('- ')}>
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onApplyLinePrefix('1. ')}>
            <span className="text-xs">1.</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onInsertAtCursor('🙂')}>
            <Smile className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {mergeTags.map((tag) => (
                <DropdownMenuItem key={tag.value} onClick={() => onInsertAtCursor(tag.value)}>
                  {tag.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onInsertAtCursor('{{eventDate}}')}>
                Event Date
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" onClick={onCopyMessage}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onOpenPreview}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        <Textarea
          className="min-h-[200px] border-0 focus-visible:ring-0"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          ref={messageRef}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(e) => onAddAttachments(e.target.files)}
        />
      </div>
      {attachments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <Badge key={`${file.name}-${index}`} variant="secondary" className="gap-1">
              {file.name}
              <button className="ml-1 text-xs" onClick={() => onRemoveAttachment(index)}>
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
