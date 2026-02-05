import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';

type ReportsFiltersProps = {
  reportSearch: string;
  onReportSearchChange: (value: string) => void;
  reportFormatFilter: string;
  onReportFormatFilterChange: (value: string) => void;
  reportCategoryFilter: string;
  onReportCategoryFilterChange: (value: string) => void;
};

export default function ReportsFilters({
  reportSearch,
  onReportSearchChange,
  reportFormatFilter,
  onReportFormatFilterChange,
  reportCategoryFilter,
  onReportCategoryFilterChange,
}: ReportsFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-10"
                value={reportSearch}
                onChange={(event) => onReportSearchChange(event.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={reportFormatFilter} onValueChange={onReportFormatFilterChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="pdf">PDF Only</SelectItem>
                <SelectItem value="excel">Excel Only</SelectItem>
                <SelectItem value="csv">CSV Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reportCategoryFilter} onValueChange={onReportCategoryFilterChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
