import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, MapPin } from 'lucide-react';
import { WasteReport } from '@/pages/Index';
import StatCard from './StatCard';

interface AdminAnalyticsProps {
  reports: WasteReport[];
}

const AdminAnalytics = ({ reports }: AdminAnalyticsProps) => {
  // Generate monthly data
  const generateMonthlyData = () => {
    const monthlyData = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthReports = reports.filter(report => {
        const reportDate = new Date(report.reportedAt);
        return reportDate.getMonth() === date.getMonth() && 
               reportDate.getFullYear() === date.getFullYear();
      });
      
      const completed = monthReports.filter(r => 
        r.status === 'cleaned' || r.status === 'completed'
      ).length;
      
      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        reports: monthReports.length,
        completed: completed,
        efficiency: monthReports.length > 0 ? Math.round((completed / monthReports.length) * 100) : 0
      });
    }
    
    return monthlyData;
  };

  // Generate category data
  const generateCategoryData = () => {
    const categories = ['Plastic Waste', 'Food Waste', 'Paper', 'Glass', 'Metal', 'Other'];
    const categoryData = categories.map(category => {
      const count = reports.filter(r => r.category === category).length;
      return { name: category, value: count };
    });
    
    return categoryData.filter(item => item.value > 0);
  };

  const monthlyData = generateMonthlyData();
  const categoryData = generateCategoryData();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Calculate area-wise scores (mock data)
  const areaScores = [
    { area: 'Central District', score: 92, reports: 45 },
    { area: 'North Zone', score: 87, reports: 32 },
    { area: 'South Zone', score: 94, reports: 28 },
    { area: 'East District', score: 89, reports: 38 },
    { area: 'West District', score: 91, reports: 41 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Efficiency"
          value="89%"
          icon={TrendingUp}
          change="+5% from last month"
          changeType="positive"
          color="green"
        />
        <StatCard
          title="Target Achievement"
          value="94%"
          icon={Target}
          change="Above target"
          changeType="positive"
          color="blue"
        />
        <StatCard
          title="Avg. Response Time"
          value="2.1 hrs"
          icon={Clock}
          change="-0.4 hrs improvement"
          changeType="positive"
          color="purple"
        />
        <StatCard
          title="Areas Covered"
          value="12"
          icon={MapPin}
          change="2 new areas"
          changeType="positive"
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Cleanup Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Cleanup Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}${name === 'efficiency' ? '%' : ''}`,
                      name === 'reports' ? 'Total Reports' : 
                      name === 'completed' ? 'Completed' : 'Efficiency'
                    ]}
                  />
                  <Bar dataKey="efficiency" fill="hsl(var(--primary))" name="efficiency" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Waste Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Waste Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area-wise Cleanliness Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Area-wise Cleanliness Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {areaScores.map((area) => (
              <div key={area.area} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                <div>
                  <h3 className="font-semibold">{area.area}</h3>
                  <p className="text-sm text-muted-foreground">{area.reports} reports</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${area.score}%` }}
                    />
                  </div>
                  <span className="font-bold text-lg">{area.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;