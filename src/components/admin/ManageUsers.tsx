import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, UserPlus, MoreVertical, Crown, Trophy, Medal } from 'lucide-react';

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

interface ManageUsersProps {
  leaderboard: LeaderboardUser[];
}

const ManageUsers = ({ leaderboard }: ManageUsersProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = leaderboard.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-muted-foreground">Manage registered users and their activities</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registered Users</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Reports</TableHead>
                  <TableHead>Achievements</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.total_reports}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.weekly_reports} this week
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.citizen_of_year_count > 0 && (
                          <Badge variant="secondary" className="text-yellow-600">
                            <Crown className="h-3 w-3 mr-1" />
                            {user.citizen_of_year_count}
                          </Badge>
                        )}
                        {user.citizen_of_month_count > 0 && (
                          <Badge variant="secondary" className="text-orange-600">
                            <Trophy className="h-3 w-3 mr-1" />
                            {user.citizen_of_month_count}
                          </Badge>
                        )}
                        {user.citizen_of_week_count > 0 && (
                          <Badge variant="secondary" className="text-blue-600">
                            <Medal className="h-3 w-3 mr-1" />
                            {user.citizen_of_week_count}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-600">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;