
import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, Filter, AlertTriangle } from 'lucide-react';
import { WasteReport } from '../pages/Index';

interface AnalyticsScreenProps {
  reports: WasteReport[];
}

const AnalyticsScreen = ({ reports }: AnalyticsScreenProps) => {
  const [selectedFilter, setSelectedFilter] = useState('7days');

  const filteredReports = useMemo(() => {
    const now = new Date();
    let cutoffDate: Date;

    switch (selectedFilter) {
      case '7days':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        return reports;
    }

    return reports.filter(report => report.reportedAt >= cutoffDate);
  }, [reports, selectedFilter]);

  const analytics = useMemo(() => {
    const total = filteredReports.length;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const statusCounts = filteredReports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryCounts = filteredReports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const uncleanedReports = reports.filter(report => 
      report.status === 'dirty' && report.reportedAt < sevenDaysAgo
    );

    const cleanedThisWeek = reports.filter(report => {
      const isRecentlyCleaned = (report.status === 'cleaned' || report.status === 'completed');
      const wasUpdatedThisWeek = report.updatedAt >= sevenDaysAgo;
      return isRecentlyCleaned && wasUpdatedThisWeek;
    }).length;

    // Calculate average response time for resolved reports
    const resolvedReports = reports.filter(r => r.status === 'cleaned' || r.status === 'completed');
    const averageResponseTime = resolvedReports.length > 0 
      ? resolvedReports.reduce((sum, report) => {
          const diffMs = report.updatedAt.getTime() - report.reportedAt.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          return sum + diffDays;
        }, 0) / resolvedReports.length
      : 0;

    return {
      total,
      statusCounts,
      categoryCounts,
      uncleanedReports,
      cleanedThisWeek,
      averageResponseTime: averageResponseTime.toFixed(1)
    };
  }, [filteredReports, reports]);

  const stats = [
    {
      label: 'Total Reports',
      value: analytics.total,
      change: reports.length > 0 ? '+' + Math.round((analytics.total / reports.length) * 100) + '%' : '0%',
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      label: 'Cleaned This Week',
      value: analytics.cleanedThisWeek,
      change: analytics.cleanedThisWeek > 0 ? '+' + analytics.cleanedThisWeek : '0',
      trend: analytics.cleanedThisWeek > 0 ? 'up' : 'neutral',
      color: 'text-emerald-600'
    },
    {
      label: 'Pending {'>'}7 Days',
      value: analytics.uncleanedReports.length,
      change: analytics.uncleanedReports.length > 0 ? 'High Priority' : 'Good',
      trend: analytics.uncleanedReports.length > 0 ? 'up' : 'down',
      color: 'text-red-600'
    },
    {
      label: 'Avg Response Time',
      value: analytics.averageResponseTime + ' days',
      change: Number(analytics.averageResponseTime) > 5 ? 'Slow' : 'Good',
      trend: Number(analytics.averageResponseTime) > 5 ? 'up' : 'down',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="text-gray-600 mt-1">Track cleanup progress and identify areas needing attention</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Status Distribution</span>
            </h3>
            
            {Object.keys(analytics.statusCounts).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analytics.statusCounts).map(([status, count]) => {
                  const percentage = analytics.total > 0 ? (count / analytics.total) * 100 : 0;
                  const colors = {
                    dirty: 'bg-red-500',
                    cleaning: 'bg-yellow-500',
                    cleaned: 'bg-emerald-500',
                    'in-progress': 'bg-blue-500',
                    completed: 'bg-emerald-600'
                  };
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${colors[status as keyof typeof colors]} rounded-full`}></div>
                        <span className="text-gray-700 capitalize">{status}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 ${colors[status as keyof typeof colors]} rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reports in selected time period</p>
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Waste Categories</span>
            </h3>
            
            {Object.keys(analytics.categoryCounts).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analytics.categoryCounts).map(([category, count]) => {
                  const percentage = analytics.total > 0 ? (count / analytics.total) * 100 : 0;
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">{category}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reports in selected time period</p>
              </div>
            )}
          </div>
        </div>

        {/* Uncleaned Reports Alert */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Uncleaned Reports (Pending {'>'}7 Days)</span>
          </h3>
          
          {analytics.uncleanedReports.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-red-800">
                    {analytics.uncleanedReports.length} report{analytics.uncleanedReports.length > 1 ? 's' : ''} require immediate attention
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.uncleanedReports.map(report => {
                  const daysOld = Math.floor((Date.now() - report.reportedAt.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={report.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-start space-x-3">
                        <img
                          src={report.image}
                          alt="Uncleaned waste"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {report.location.address.substring(0, 50)}...
                          </p>
                          <p className="text-xs text-red-600 mt-1 font-semibold">
                            {daysOld} days overdue
                          </p>
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded capitalize">
                            {report.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Excellent work!</h4>
              <p className="text-gray-600">No reports have been pending for more than 7 days</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsScreen;
