import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentReportsTable from './RecentReportsTable';
import { WasteReport } from '@/pages/Index';

interface ViewReportsProps {
  reports: WasteReport[];
}

const ViewReports = ({ reports }: ViewReportsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">All Reports</h2>
        <p className="text-muted-foreground">View and manage all waste reports</p>
      </div>

      <RecentReportsTable reports={reports} />
    </div>
  );
};

export default ViewReports;