
import React from 'react';
import { Camera, Map, BarChart3, CheckCircle } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: 'upload' | 'map' | 'analytics') => void;
}

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const stats = [
    { label: 'Reports Filed', value: '1,234', icon: Camera, color: 'text-blue-600' },
    { label: 'Areas Cleaned', value: '856', icon: CheckCircle, color: 'text-emerald-600' },
    { label: 'Pending Reports', value: '378', color: 'text-amber-600' },
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
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Waste report cleaned up</p>
                <p className="text-gray-600 text-sm">789 Broadway • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">New waste report filed</p>
                <p className="text-gray-600 text-sm">456 Park Ave • 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Cleanup in progress</p>
                <p className="text-gray-600 text-sm">123 Main St • 6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
