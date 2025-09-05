import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useWasteReports } from '@/hooks/useWasteReports';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';
import ManageUsers from '@/components/admin/ManageUsers';
import ViewReports from '@/components/admin/ViewReports';
import LeaderboardManagement from '@/components/admin/LeaderboardManagement';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminReportManager from '@/components/admin/AdminReportManager';

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  total_reports: number;
  weekly_reports: number;
  monthly_reports: number;
  yearly_reports: number;
  citizen_of_week_count: number;
  citizen_of_month_count: number;
  citizen_of_year_count: number;
}

const AdminDashboard = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { reports, updateReport, uploadImage } = useWasteReports();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('total_reports', { ascending: false })
      .limit(10);
    
    if (data) {
      setLeaderboard(data);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  if (!isAdmin) {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboardContent reports={reports} />;
      case 'users':
        return <ManageUsers leaderboard={leaderboard} />;
      case 'reports':
        return <ViewReports reports={reports} />;
      case 'manage-reports':
        return <AdminReportManager reports={reports} onUpdateReport={updateReport} uploadImage={uploadImage} />;
      case 'leaderboard':
        return <LeaderboardManagement leaderboard={leaderboard} />;
      case 'analytics':
        return <AdminAnalytics reports={reports} />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboardContent reports={reports} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleSignOut}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Admin</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;