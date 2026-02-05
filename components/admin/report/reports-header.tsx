import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

type ReportsHeaderProps = {
  onBulkExport: () => void;
};

export default function ReportsHeader({ onBulkExport }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Exports</h1>
        <p className="text-muted-foreground">Generate and download detailed reports</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onBulkExport}>
          <Download className="h-4 w-4 mr-2" />
          Bulk Export
        </Button>
        {/* <Button variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print All
        </Button> */}
      </div>
    </div>
  );
}
