import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Eye } from 'lucide-react';
import type { ExportHistoryEntry } from '@/app/admin/reports/types';

type ExportHistoryTabProps = {
  exportHistory: ExportHistoryEntry[];
};

export default function ExportHistoryTab({ exportHistory }: ExportHistoryTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export History</CardTitle>
        <CardDescription>Recently generated reports and exports</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {exportHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                <Download className="h-8 w-8" />
                <p className="text-sm">No exports yet. Generate a report to see history.</p>
              </div>
            ) : (
              exportHistory.map((entry, i) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        i % 3 === 0 ? 'bg-blue-100' : i % 3 === 1 ? 'bg-green-100' : 'bg-purple-100'
                      }`}
                    >
                      <Download
                        className={`h-5 w-5 ${
                          i % 3 === 0 ? 'text-blue-600' : i % 3 === 1 ? 'text-green-600' : 'text-purple-600'
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{entry.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {entry.format}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{entry.size}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{entry.rows} rows</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{new Date(entry.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">By: {entry.generatedBy}</p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
