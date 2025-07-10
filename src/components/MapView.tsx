
import React, { useState } from 'react';
import { MapPin, Filter, Search } from 'lucide-react';
import { WasteReport } from '../pages/Index';
import GoogleMap from './GoogleMap';

interface MapViewProps {
  reports: WasteReport[];
  onReportSelect: (report: WasteReport) => void;
}

const MapView = ({ reports, onReportSelect }: MapViewProps) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusColors = {
    dirty: 'bg-red-500',
    cleaning: 'bg-yellow-500', 
    cleaned: 'bg-emerald-500',
    'in-progress': 'bg-blue-500',
    completed: 'bg-emerald-600',
  };

  const statusLabels = {
    dirty: 'Dirty',
    cleaning: 'Cleaning',
    cleaned: 'Cleaned', 
    'in-progress': 'In Progress',
    completed: 'Completed',
  };

  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSearch = report.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Waste Reports Map</h2>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="dirty">Dirty</option>
                <option value="cleaning">Cleaning</option>
                <option value="cleaned">Cleaned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Google Map */}
        <div className="mb-8">
          <GoogleMap 
            reports={filteredReports} 
            onReportSelect={onReportSelect}
          />
        </div>

        {/* Status Legend */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Status Legend</h4>
          <div className="flex flex-wrap gap-4">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${color} rounded-full`}></div>
                <span className="text-sm text-gray-700">{statusLabels[status as keyof typeof statusLabels]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => onReportSelect(report)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={report.image}
                  alt="Waste report"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div className={`absolute top-3 right-3 w-3 h-3 ${statusColors[report.status]} rounded-full border-2 border-white shadow-sm`}></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm truncate">{report.location.address}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    report.status === 'dirty' ? 'bg-red-100 text-red-700' :
                    report.status === 'cleaning' ? 'bg-yellow-100 text-yellow-700' :
                    report.status === 'cleaned' ? 'bg-emerald-100 text-emerald-700' :
                    report.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {statusLabels[report.status]}
                  </span>
                  
                  <span className="text-xs text-gray-500 capitalize">
                    {report.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                  {report.remarks || 'No additional remarks'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
