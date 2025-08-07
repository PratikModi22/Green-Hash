import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

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

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('total_reports', { ascending: false });
    
    if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const renderLeaderboard = (sortBy: 'weekly_reports' | 'monthly_reports' | 'yearly_reports') => {
    const sortedUsers = [...users].sort((a, b) => b[sortBy] - a[sortBy]).slice(0, 10);
    
    return (
      <div className="space-y-4">
        {sortedUsers.map((user, index) => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-yellow-500 text-white' :
                index === 1 ? 'bg-gray-400 text-white' :
                index === 2 ? 'bg-amber-600 text-white' :
                'bg-primary text-primary-foreground'
              }`}>
                {index + 1}
              </div>
              <div>
                <p className="font-semibold">{user.name}</p>
                <div className="flex gap-2 mt-1">
                  {user.citizen_of_week_count > 0 && (
                    <Badge variant="outline" className="text-xs">
                      🏆 {user.citizen_of_week_count}
                    </Badge>
                  )}
                  {user.citizen_of_month_count > 0 && (
                    <Badge variant="outline" className="text-xs">
                      🥇 {user.citizen_of_month_count}
                    </Badge>
                  )}
                  {user.citizen_of_year_count > 0 && (
                    <Badge variant="outline" className="text-xs">
                      👑 {user.citizen_of_year_count}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{user[sortBy]}</p>
              <p className="text-sm text-muted-foreground">Reports</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🏆 Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏆 Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="yearly">This Year</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly" className="mt-6">
            <div className="mb-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Resets every Sunday 11:59 PM
              </h3>
            </div>
            {renderLeaderboard('weekly_reports')}
          </TabsContent>
          
          <TabsContent value="monthly" className="mt-6">
            <div className="mb-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Resets on the 1st of every month
              </h3>
            </div>
            {renderLeaderboard('monthly_reports')}
          </TabsContent>
          
          <TabsContent value="yearly" className="mt-6">
            <div className="mb-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Resets every 1st January
              </h3>
            </div>
            {renderLeaderboard('yearly_reports')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;