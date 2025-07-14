
import React from 'react';
import { Camera, Map, BarChart3, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { WasteReport } from '../pages/Index';

interface HomeScreenProps {
  onNavigate: (screen: 'upload' | 'map' | 'analytics') => void;
  stats: {
    total: number;
    cleaned: number;
    pending: number;
    inProgress: number;
  };
  recentReports: WasteReport[];
}

const HomeScreen = ({ onNavigate, stats, recentReports }: HomeScreenProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cleaned':
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-emerald-500" />;
      case 'cleaning':
      case 'in-progress':
        return <Clock className="w-3 h-3 text-blue-500" />;
      default:
        return <AlertTriangle className="w-3 h-3 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'cleaned': return 'Cleaned up';
      case 'completed': return 'Completed';
      case 'cleaning': return 'Being cleaned';
      case 'in-progress': return 'In progress';
      default: return 'Needs cleanup';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const displayStats = [
    { 
      label: 'Total Reports', 
      value: stats.total.toString(), 
      icon: Camera, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Areas Cleaned', 
      value: stats.cleaned.toString(), 
      icon: CheckCircle, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      label: 'Pending Reports', 
      value: stats.pending.toString(), 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Keep Your City Clean
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Report waste, track cleanup progress, and help build a cleaner community together.
          </p>
          
          <button
            onClick={() => onNavigate('upload')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center space-x-3"
          >
            <Camera className="w-6 h-6" />
            <span>📸 Report Waste</span>
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {displayStats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
                {stat.icon && (
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div 
            onClick={() => onNavigate('map')}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Map className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">View Map</h3>
                <p className="text-gray-600">See all waste reports in your area</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('analytics')}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Analytics</h3>
                <p className="text-gray-600">View cleanup statistics and trends</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          
          {recentReports.length > 0 ? (
            <div className="space-y-4">
              {recentReports.map(report => (
                <div key={report.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  {getStatusIcon(report.status)}
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{getStatusText(report.status)}</p>
                    <p className="text-gray-600 text-sm">
                      {report.location.address} • {formatTimeAgo(report.reportedAt)}
                    </p>
                  </div>
                  <span className="inline-block px-2 py-1 bg-gray-200 text-xs text-gray-700 rounded capitalize">
                    {report.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reports yet. Start by reporting some waste!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
