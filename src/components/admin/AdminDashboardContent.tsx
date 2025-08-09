import React from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Clock, 
  Users, 
  TrendingUp, 
  Target,
  CheckCircle 
} from 'lucide-react';
import StatCard from './StatCard';
import ReportsChart from './ReportsChart';
import RecentReportsTable from './RecentReportsTable';
import { WasteReport } from '@/pages/Index';

interface AdminDashboardContentProps {
  reports: WasteReport[];
}

const AdminDashboardContent = ({ reports }: AdminDashboardContentProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayReports = reports.filter(r => {
    const reportDate = new Date(r.reportedAt);
    reportDate.setHours(0, 0, 0, 0);
    return reportDate.getTime() === today.getTime();
  }).length;

  const activeReports = reports.filter(r => 
    r.status === 'dirty' || r.status === 'cleaning' || r.status === 'in-progress'
  ).length;

  const completedReports = reports.filter(r => 
    r.status === 'cleaned' || r.status === 'completed'
  ).length;

  // Calculate average response time (mock data for now)
  const avgResponseTime = '2.5 hours';

  // Get unique users count (mock data)
  const goodCitizensCount = 157;

  const recentReports = reports.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports Today"
          value={todayReports}
          icon={FileText}
          change="+12% from yesterday"
          changeType="positive"
          color="blue"
        />
        <StatCard
          title="Active Reports"
          value={activeReports}
          icon={AlertTriangle}
          change={`${reports.length - activeReports} completed`}
          changeType="neutral"
          color="yellow"
        />
        <StatCard
          title="Average Response Time"
          value={avgResponseTime}
          icon={Clock}
          change="-15% this week"
          changeType="positive"
          color="green"
        />
        <StatCard
          title="Good Citizens Count"
          value={goodCitizensCount}
          icon={Users}
          change="+23 this month"
          changeType="positive"
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsChart reports={reports} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Completion Rate"
            value={`${Math.round((completedReports / reports.length) * 100)}%`}
            icon={CheckCircle}
            change="+5% this month"
            changeType="positive"
            color="green"
          />
          <StatCard
            title="Monthly Target"
            value="85%"
            icon={Target}
            change="On track"
            changeType="positive"
            color="blue"
          />
          <StatCard
            title="Efficiency Score"
            value="92"
            icon={TrendingUp}
            change="+3 points"
            changeType="positive"
            color="purple"
          />
          <StatCard
            title="Response Rate"
            value="96%"
            icon={Clock}
            change="Excellent"
            changeType="positive"
            color="green"
          />
        </div>
      </div>

      {/* Recent Reports Table */}
      <RecentReportsTable reports={recentReports} />
    </div>
  );
};

export default AdminDashboardContent;