import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, UserPlus, Shield, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface User {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  total_reports: number;
}

interface Admin {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const ManageAdmins = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch all admins
      const { data: adminsData, error: adminsError } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminsError) throw adminsError;

      setUsers(usersData || []);
      setAdmins(adminsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users and admins"
      });
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (user: User) => {
    try {
      const { error } = await supabase
        .from('admins')
        .insert({
          auth_id: user.auth_id,
          name: user.name,
          email: user.email,
          role: 'admin'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${user.name} has been made an admin`
      });
      
      fetchData(); // Refresh the data
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to make user admin"
      });
    }
  };

  const removeAdmin = async (admin: Admin) => {
    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', admin.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${admin.name} has been removed as admin`
      });
      
      fetchData(); // Refresh the data
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove admin"
      });
    }
  };

  const isUserAdmin = (userId: string) => {
    return admins.some(admin => admin.auth_id === userId);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Management</h2>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users and admins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Admins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Current Admins ({filteredAdmins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredAdmins.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No admins found</p>
              ) : (
                filteredAdmins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-sm text-muted-foreground">{admin.email}</div>
                      <Badge variant="default" className="text-xs mt-1">
                        {admin.role}
                      </Badge>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Admin</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {admin.name} as an admin? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeAdmin(admin)}>
                            Remove Admin
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Users to Promote */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Users ({filteredUsers.filter(u => !isUserAdmin(u.auth_id)).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredUsers.filter(user => !isUserAdmin(user.auth_id)).length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No users to promote</p>
              ) : (
                filteredUsers
                  .filter(user => !isUserAdmin(user.auth_id))
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {user.total_reports} reports
                        </Badge>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="default" size="sm">
                            <UserPlus className="w-4 h-4 mr-1" />
                            Make Admin
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Make Admin</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to make {user.name} an admin? They will have full access to the admin dashboard.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => makeAdmin(user)}>
                              Make Admin
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageAdmins;