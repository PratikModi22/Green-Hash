
import React, { useState } from 'react';
import { Shield, Upload, CheckCircle, Camera } from 'lucide-react';
import { WasteReport } from '../pages/Index';

interface AuthorityLoginProps {
  reports: WasteReport[];
  onUpdateReport: (reportId: string, updates: Partial<WasteReport>) => void;
}

const AuthorityLogin = ({ reports, onUpdateReport }: AuthorityLoginProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [beforeImage, setBeforeImage] = useState<string>('');
  const [afterImage, setAfterImage] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login - in real app would authenticate with backend
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleStatusUpdate = () => {
    if (!selectedReport || !newStatus) return;
    
    const updates: Partial<WasteReport> = {
      status: newStatus as WasteReport['status']
    };
    
    if (beforeImage) updates.beforeImage = beforeImage;
    if (afterImage) updates.afterImage = afterImage;
    
    onUpdateReport(selectedReport.id, updates);
    setSelectedReport(null);
    setNewStatus('');
    setBeforeImage('');
    setAfterImage('');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'before') {
          setBeforeImage(result);
        } else {
          setAfterImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Authority Login</h2>
              <p className="text-gray-600 mt-2">Sign in to manage waste reports</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong> Use any email and password to login
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Authority Dashboard</h2>
            <p className="text-gray-600 mt-1">Manage and update waste report statuses</p>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Reports List */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {reports.map(report => (
            <div
              key={report.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={report.image}
                    alt="Waste report"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Report #{report.id}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{report.location.address}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{report.category}</span>
                      <span>•</span>
                      <span>
                        {Math.floor((Date.now() - report.reportedAt.getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    report.status === 'dirty' ? 'bg-red-100 text-red-700' :
                    report.status === 'cleaning' ? 'bg-yellow-100 text-yellow-700' :
                    report.status === 'cleaned' ? 'bg-emerald-100 text-emerald-700' :
                    report.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                  
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Update Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Update Report #{selectedReport.id}
                </h3>
                
                <div className="space-y-6">
                  {/* Status Update */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select status...</option>
                      <option value="dirty">Dirty</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="cleaned">Cleaned</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Before Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Before Cleanup Photo (Optional)
                    </label>
                    {!beforeImage ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-3">Upload before photo</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'before')}
                          className="hidden"
                          id="before-upload"
                        />
                        <label
                          htmlFor="before-upload"
                          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer inline-flex items-center space-x-2 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Choose File</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={beforeImage}
                          alt="Before cleanup"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setBeforeImage('')}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  {/* After Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      After Cleanup Photo (Optional)
                    </label>
                    {!afterImage ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-3">Upload after photo</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'after')}
                          className="hidden"
                          id="after-upload"
                        />
                        <label
                          htmlFor="after-upload"
                          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer inline-flex items-center space-x-2 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Choose File</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={afterImage}
                          alt="After cleanup"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setAfterImage('')}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={!newStatus}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      newStatus
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Update Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityLogin;
