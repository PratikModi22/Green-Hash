import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Trophy, 
  BarChart3, 
  Settings,
  Shield,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const AdminSidebar = ({ activeSection, onSectionChange, onLogout }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'reports', label: 'View Reports', icon: FileText },
    { id: 'manage-reports', label: 'Manage Reports', icon: FileText },
    { id: 'manage-admins', label: 'Manage Admins', icon: Shield },
    { id: 'leaderboard', label: 'Leaderboard Management', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-primary">Green Hash Admin</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 text-left',
                isActive && 'bg-primary text-primary-foreground'
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;