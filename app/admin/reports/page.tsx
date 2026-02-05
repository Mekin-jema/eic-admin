// app/admin/reports/page.tsx
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Loading from './loading';

import ReportsHeader from '@/components/admin/report/reports-header';
// import ReportsFilters from '@/components/admin/report/reports-filters';
import ReportTemplatesTab from '@/components/admin/report/report-templates-tab';
import CustomReportsTab from '@/components/admin/report/custom-reports-tab';
import ScheduledReportsTab from '@/components/admin/report/scheduled-reports-tab';
import ExportHistoryTab from '@/components/admin/report/export-history-tab';
import { useReportsState } from '../../../components/admin/report/hooks/useReportsState';
export default function ReportsPage() {
  const {
    loading,
    error,
    reportTemplates,
    filteredTemplates,
    // reportSearch,
    // setReportSearch,
    // reportFormatFilter,
    // setReportFormatFilter,
    // reportCategoryFilter,
    // setReportCategoryFilter,
    customReportName,
    setCustomReportName,
    selectedFields,
    toggleField,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    filterDateRange,
    setFilterDateRange,
    outputFormat,
    setOutputFormat,
    schedule,
    setSchedule,
    customReports,
    scheduledReports,
    exportHistory,
    fieldOptions,
    filteredAttendeesCount,
    handleGenerateCustomReport,
    handleDownloadSavedReport,
    handleCreateNewCustom,
    downloadReport,
    toggleScheduledReport,
  } = useReportsState();

  if (loading) return <Loading />;

  if (error) return <div className="space-y-6 pl-9 pr-4">{error}</div>;

  return (
    <div className="space-y-6 pl-9 pr-4">
      <ReportsHeader onBulkExport={() => reportTemplates.forEach((report) => downloadReport(report.id))} />

      {/* <ReportsFilters
        reportSearch={reportSearch}
        onReportSearchChange={setReportSearch}
        reportFormatFilter={reportFormatFilter}
        onReportFormatFilterChange={setReportFormatFilter}
        reportCategoryFilter={reportCategoryFilter}
        onReportCategoryFilterChange={setReportCategoryFilter}
      /> */}

      {/* Tabs */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>

        {/* Report Templates */}
        <TabsContent value="templates">
          <ReportTemplatesTab templates={filteredTemplates} onDownload={downloadReport} />
        </TabsContent>

        {/* Custom Reports */}
        <TabsContent value="custom">
          <CustomReportsTab
            customReports={customReports}
            onCreateNew={handleCreateNewCustom}
            onDownloadSaved={handleDownloadSavedReport}
            customReportName={customReportName}
            onCustomReportNameChange={setCustomReportName}
            fieldOptions={fieldOptions}
            selectedFields={selectedFields}
            onToggleField={toggleField}
            filterCategory={filterCategory}
            onFilterCategoryChange={setFilterCategory}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            filterDateRange={filterDateRange}
            onFilterDateRangeChange={setFilterDateRange}
            outputFormat={outputFormat}
            onOutputFormatChange={setOutputFormat}
            schedule={schedule}
            onScheduleChange={setSchedule}
            filteredRowsCount={filteredAttendeesCount}
            onGenerateReport={handleGenerateCustomReport}
          />
        </TabsContent>

        {/* Scheduled Reports */}
        <TabsContent value="scheduled">
          <ScheduledReportsTab scheduledReports={scheduledReports} onToggleActive={toggleScheduledReport} />
        </TabsContent>

        {/* Export History */}
        <TabsContent value="history">
          <ExportHistoryTab exportHistory={exportHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}