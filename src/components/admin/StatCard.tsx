import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  color = 'blue' 
}: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-200',
    green: 'bg-green-500/10 text-green-600 border-green-200',
    yellow: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    red: 'bg-red-500/10 text-red-600 border-red-200',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-200',
  };

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn('p-2 rounded-full', colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn('text-xs mt-1', changeColors[changeType])}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;