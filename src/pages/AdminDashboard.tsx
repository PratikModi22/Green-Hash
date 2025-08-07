import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWasteReports } from '@/hooks/useWasteReports';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

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
  const { reports } = useWasteReports();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

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

  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'dirty').length;
  const cleanedReports = reports.filter(r => r.status === 'cleaned' || r.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalReports}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{pendingReports}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cleaned Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{cleanedReports}</div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">{user.total_reports}</p>
                      <p className="text-sm text-muted-foreground">Total Reports</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {user.citizen_of_week_count > 0 && (
                        <Badge variant="secondary">
                          🏆 Citizen of Week x{user.citizen_of_week_count}
                        </Badge>
                      )}
                      {user.citizen_of_month_count > 0 && (
                        <Badge variant="secondary">
                          🥇 Citizen of Month x{user.citizen_of_month_count}
                        </Badge>
                      )}
                      {user.citizen_of_year_count > 0 && (
                        <Badge variant="secondary">
                          👑 Citizen of Year x{user.citizen_of_year_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;