import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import type { ScheduledReport } from '@/app/admin/reports/types';

type ScheduledReportsTabProps = {
  scheduledReports: ScheduledReport[];
  onToggleActive: (id: string) => void;
};

export default function ScheduledReportsTab({ scheduledReports, onToggleActive }: ScheduledReportsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Automated report generation schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{report.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {report.active ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium">{report.recipients} recipients</p>
                    <p className="text-xs text-muted-foreground">Next: {report.next}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={report.active ? 'text-red-600' : 'text-emerald-600'}
                      onClick={() => onToggleActive(report.id)}
                    >
                      {report.active ? 'Stop' : 'Resume'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Statistics</CardTitle>
          <CardDescription>Report delivery success rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { report: 'Daily Summary', success: 98, delivered: 30, failed: 1 },
              { report: 'Weekly Analytics', success: 95, delivered: 12, failed: 1 },
              { report: 'VIP Updates', success: 99, delivered: 120, failed: 0 },
              { report: 'Check-in Status', success: 92, delivered: 168, failed: 3 },
            ].map((item) => (
              <div key={item.report} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.report}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Delivered: {item.delivered}</span>
                    <span className="text-sm text-muted-foreground">Failed: {item.failed}</span>
                    <Badge
                      className={
                        item.success >= 95
                          ? 'bg-green-100 text-green-800'
                          : item.success >= 90
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                      }
                    >
                      {item.success}% success
                    </Badge>
                  </div>
                </div>
                <Progress value={item.success} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
