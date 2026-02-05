import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Eye, FileBarChart, FileJson, FilePieChart, FileSpreadsheet } from 'lucide-react';
import type { ReportTemplate } from '@/app/admin/reports/types';

type ReportTemplatesTabProps = {
  templates: ReportTemplate[];
  onDownload: (id: string) => void;
};

export default function ReportTemplatesTab({ templates, onDownload }: ReportTemplatesTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {report.rows} rows
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Formats:</span>
                      <div className="flex gap-1">
                        {report.format.map((fmt) => (
                          <Badge key={fmt} variant="secondary" className="text-xs">
                            {fmt}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last generated:</span>
                      <span className="font-medium">{report.lastGenerated}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{report.size}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => onDownload(report.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Export Options</CardTitle>
          <CardDescription>Export specific data sets quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => onDownload('attendees')}
            >
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
              <span>Excel Export</span>
              <span className="text-xs text-muted-foreground">Full dataset</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => onDownload('interests')}
            >
              <FilePieChart className="h-6 w-6 text-blue-600" />
              <span>Analytics Data</span>
              <span className="text-xs text-muted-foreground">Charts & stats</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => onDownload('daily')}
            >
              <FileBarChart className="h-6 w-6 text-purple-600" />
              <span>Summary Report</span>
              <span className="text-xs text-muted-foreground">Executive view</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => onDownload('attendees')}
            >
              <FileJson className="h-6 w-6 text-amber-600" />
              <span>JSON Data</span>
              <span className="text-xs text-muted-foreground">API integration</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
