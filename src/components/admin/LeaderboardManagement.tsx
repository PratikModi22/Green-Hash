import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Trophy, Medal, Users, TrendingUp } from 'lucide-react';

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

interface LeaderboardManagementProps {
  leaderboard: LeaderboardUser[];
}

const LeaderboardManagement = ({ leaderboard }: LeaderboardManagementProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Leaderboard Management</h2>
          <p className="text-muted-foreground">Manage awards and recognition system</p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Award Badges
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citizens of the Year</CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboard.reduce((sum, user) => sum + user.citizen_of_year_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total awards given
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citizens of the Month</CardTitle>
            <Trophy className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboard.reduce((sum, user) => sum + user.citizen_of_month_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total awards given
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citizens of the Week</CardTitle>
            <Medal className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboard.reduce((sum, user) => sum + user.citizen_of_week_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total awards given
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.slice(0, 10).map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-primary text-primary-foreground'
                  }`}>
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
                      <Badge variant="secondary" className="text-blue-600">
                        <Medal className="h-3 w-3 mr-1" />
                        Week x{user.citizen_of_week_count}
                      </Badge>
                    )}
                    {user.citizen_of_month_count > 0 && (
                      <Badge variant="secondary" className="text-orange-600">
                        <Trophy className="h-3 w-3 mr-1" />
                        Month x{user.citizen_of_month_count}
                      </Badge>
                    )}
                    {user.citizen_of_year_count > 0 && (
                      <Badge variant="secondary" className="text-yellow-600">
                        <Crown className="h-3 w-3 mr-1" />
                        Year x{user.citizen_of_year_count}
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
  );
};

export default LeaderboardManagement;