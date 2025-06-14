
import React from 'react';
import { ArrowLeft, MapPin, Clock, Camera, Trash2 } from 'lucide-react';
import { WasteReport } from '../pages/Index';

interface ReportCardProps {
  report: WasteReport;
  onBack: () => void;
  onDelete: (reportId: string) => void;
}

const ReportCard = ({ report, onBack, onDelete }: ReportCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dirty': return 'bg-red-100 text-red-700 border-red-200';
      case 'cleaning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cleaned': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'dirty': return 'Needs Cleanup';
      case 'cleaning': return 'Being Cleaned';
      case 'cleaned': return 'Cleaned';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      onDelete(report.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Map</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Report</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Waste Report</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{report.location.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Reported {getDaysAgo(report.reportedAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-full border font-medium ${getStatusColor(report.status)}`}>
                {getStatusLabel(report.status)}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Original Report Image */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Original Report</span>
                </h3>
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={report.image}
                    alt="Waste report"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Before/After Images (if available) */}
              {(report.beforeImage || report.afterImage) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Before & After</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {report.beforeImage && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Before</p>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={report.beforeImage}
                            alt="Before cleanup"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {report.afterImage && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">After</p>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={report.afterImage}
                            alt="After cleanup"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Report ID</h4>
                  <p className="text-gray-600 font-mono text-sm">{report.id}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                    {report.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location Coordinates</h4>
                  <p className="text-gray-600 font-mono text-sm">
                    {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reported</h4>
                  <p className="text-gray-600">
                    {report.reportedAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Last Updated</h4>
                  <p className="text-gray-600">
                    {report.updatedAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reporter Comments</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      {report.remarks || 'No additional remarks provided.'}
                    </p>
                  </div>
                </div>

                {report.authorityComments && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Authority Comments</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-800">
                        {report.authorityComments}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-4">Status Timeline</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Report Submitted</p>
                    <p className="text-sm text-gray-600">
                      {report.reportedAt.toLocaleDateString()} at {report.reportedAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {report.status !== 'dirty' && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Status Updated</p>
                      <p className="text-sm text-gray-600">
                        Status changed to: {getStatusLabel(report.status)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {report.updatedAt.toLocaleDateString()} at {report.updatedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                {(report.status === 'cleaned' || report.status === 'completed') && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Cleanup Completed</p>
                      <p className="text-sm text-gray-600">
                        Area has been successfully cleaned
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
