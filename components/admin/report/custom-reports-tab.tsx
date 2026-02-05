
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import type { CustomReport, FieldOption } from '@/app/admin/reports/types';

type CustomReportsTabProps = {
  customReports: CustomReport[];
  onCreateNew: () => void;
  onDownloadSaved: (report: CustomReport) => void;
  customReportName: string;
  onCustomReportNameChange: (value: string) => void;
  fieldOptions: FieldOption[];
  selectedFields: string[];
  onToggleField: (field: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterDateRange: string;
  onFilterDateRangeChange: (value: string) => void;
  outputFormat: string;
  onOutputFormatChange: (value: string) => void;
  schedule: string;
  onScheduleChange: (value: string) => void;
  filteredRowsCount: number;
  onGenerateReport: () => void;
};

export default function CustomReportsTab({

  customReportName,
  onCustomReportNameChange,
  fieldOptions,
  selectedFields,
  onToggleField,
  filterCategory,
  onFilterCategoryChange,
  filterStatus,
  onFilterStatusChange,
  filterDateRange,
  onFilterDateRangeChange,
  outputFormat,
  onOutputFormatChange,
  schedule,
  onScheduleChange,
  filteredRowsCount,
  onGenerateReport,
}: CustomReportsTabProps) {
  const handleGenerateClick = () => {
    onGenerateReport();
    toast.success('Report download started');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Build Custom Report</CardTitle>
          <CardDescription>Select fields and filters for your report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Name</label>
              <Input
                placeholder="e.g. VIP Attendee Overview"
                value={customReportName}
                onChange={(event) => onCustomReportNameChange(event.target.value)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-3">
                <h4 className="font-medium">Select Fields</h4>
                <div className="space-y-2">
                  {fieldOptions.map((field) => (
                    <div key={field.label} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={field.label}
                        className="h-4 w-4"
                        checked={selectedFields.includes(field.label)}
                        onChange={() => onToggleField(field.label)}
                      />
                      <label htmlFor={field.label} className="text-sm">
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Apply Filters</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="inv">International Investor</SelectItem>
                        <SelectItem value="loc">Domestic Investor</SelectItem>
                        <SelectItem value="gov">Government Official</SelectItem>
                        <SelectItem value="dip">Diplomat / Development Partner</SelectItem>
                        <SelectItem value="med">Media</SelectItem>
                        <SelectItem value="aca">Academia / Research Institution</SelectItem>
                        <SelectItem value="con">Business Consultant</SelectItem>
                        <SelectItem value="oth">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Check-in Status</label>
                    <Select value={filterStatus} onValueChange={onFilterStatusChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="checked-in">Checked In</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date Range</label>
                    <Select value={filterDateRange} onValueChange={onFilterDateRangeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Output Options</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Format</label>
                    <div className="space-y-2">
                      {['PDF', 'Excel', 'CSV', 'JSON'].map((format) => (
                        <div key={format} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="format"
                            id={format}
                            className="h-4 w-4"
                            checked={outputFormat === format}
                            onChange={() => onOutputFormatChange(format)}
                          />
                          <label htmlFor={format} className="text-sm">
                            {format}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Schedule</label>
                    <Select value={schedule} onValueChange={onScheduleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="No schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Schedule</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Preview: {filteredRowsCount} rows will be exported.
              </div>
              <div className="flex gap-4">
                <Button variant="outline">Preview Report</Button>
                <Button onClick={handleGenerateClick}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
