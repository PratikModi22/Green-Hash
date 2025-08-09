import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WasteReport } from '@/pages/Index';

interface ReportsChartProps {
  reports: WasteReport[];
}

const ReportsChart = ({ reports }: ReportsChartProps) => {
  // Generate weekly data for the last 7 days
  const generateWeeklyData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayReports = reports.filter(report => {
        const reportDate = new Date(report.reportedAt);
        reportDate.setHours(0, 0, 0, 0);
        return reportDate.getTime() === date.getTime();
      });
      
      const completed = dayReports.filter(r => 
        r.status === 'cleaned' || r.status === 'completed'
      ).length;
      
      data.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        reports: dayReports.length,
        completed: completed,
        date: date.toISOString().split('T')[0]
      });
    }
    
    return data;
  };

  const weeklyData = generateWeeklyData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Reports Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `${label}`;
                  }
                  return label;
                }}
                formatter={(value, name) => [
                  value,
                  name === 'reports' ? 'Total Reports' : 'Completed Reports'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="reports" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsChart;