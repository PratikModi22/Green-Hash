
import React, { useState } from 'react';
import HomeScreen from '../components/HomeScreen';
import UploadScreen from '../components/UploadScreen';
import MapView from '../components/MapView';
import ReportCard from '../components/ReportCard';
import AnalyticsScreen from '../components/AnalyticsScreen';
import AuthorityLogin from '../components/AuthorityLogin';
import Navigation from '../components/Navigation';

export type WasteReport = {
  id: string;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'dirty' | 'cleaning' | 'cleaned' | 'in-progress' | 'completed';
  category: string;
  remarks: string;
  reportedAt: Date;
  beforeImage?: string;
  afterImage?: string;
};

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'upload' | 'map' | 'report' | 'analytics' | 'authority'>('home');
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [reports, setReports] = useState<WasteReport[]>([
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      location: { lat: 40.7128, lng: -74.0060, address: '123 Main St, New York, NY' },
      status: 'dirty',
      category: 'plastic',
      remarks: 'Large pile of plastic bottles near the park entrance',
      reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500',
      location: { lat: 40.7589, lng: -73.9851, address: '456 Park Ave, New York, NY' },
      status: 'cleaning',
      category: 'metal',
      remarks: 'Old metal cans scattered around',
      reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
      location: { lat: 40.7505, lng: -73.9934, address: '789 Broadway, New York, NY' },
      status: 'cleaned',
      category: 'organic',
      remarks: 'Food waste from market',
      reportedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      beforeImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
      afterImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
    },
  ]);

  const addReport = (report: Omit<WasteReport, 'id' | 'reportedAt'>) => {
    const newReport: WasteReport = {
      ...report,
      id: Date.now().toString(),
      reportedAt: new Date(),
    };
    setReports(prev => [...prev, newReport]);
  };

  const updateReport = (reportId: string, updates: Partial<WasteReport>) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, ...updates } : report
    ));
  };

  const handleReportSelect = (report: WasteReport) => {
    setSelectedReport(report);
    setCurrentScreen('report');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      
      <div className="pt-16">
        {currentScreen === 'home' && (
          <HomeScreen onNavigate={setCurrentScreen} />
        )}
        
        {currentScreen === 'upload' && (
          <UploadScreen 
            onAddReport={addReport}
            onNavigate={setCurrentScreen}
          />
        )}
        
        {currentScreen === 'map' && (
          <MapView 
            reports={reports}
            onReportSelect={handleReportSelect}
          />
        )}
        
        {currentScreen === 'report' && selectedReport && (
          <ReportCard 
            report={selectedReport}
            onBack={() => setCurrentScreen('map')}
          />
        )}
        
        {currentScreen === 'analytics' && (
          <AnalyticsScreen reports={reports} />
        )}
        
        {currentScreen === 'authority' && (
          <AuthorityLogin 
            reports={reports}
            onUpdateReport={updateReport}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
