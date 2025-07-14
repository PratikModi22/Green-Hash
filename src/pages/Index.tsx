
import React, { useState } from 'react';
import HomeScreen from '../components/HomeScreen';
import UploadScreen from '../components/UploadScreen';
import MapView from '../components/MapView';
import ReportCard from '../components/ReportCard';
import AnalyticsScreen from '../components/AnalyticsScreen';
import AuthorityLogin from '../components/AuthorityLogin';
import Navigation from '../components/Navigation';
import { useWasteReports } from '../hooks/useWasteReports';

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
  updatedAt: Date;
  beforeImage?: string;
  afterImage?: string;
  authorityComments?: string;
};

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'upload' | 'map' | 'report' | 'analytics' | 'authority'>('home');
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  
  const { 
    reports, 
    loading, 
    addReport, 
    updateReport, 
    deleteReport, 
    uploadImage 
  } = useWasteReports();

  const handleReportSelect = (report: WasteReport) => {
    setSelectedReport(report);
    setCurrentScreen('report');
  };

  const handleDeleteReport = (reportId: string) => {
    deleteReport(reportId);
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(null);
      setCurrentScreen('map');
    }
  };

  const getStats = () => {
    const total = reports.length;
    const cleaned = reports.filter(r => r.status === 'cleaned' || r.status === 'completed').length;
    const pending = reports.filter(r => r.status === 'dirty').length;
    const inProgress = reports.filter(r => r.status === 'cleaning' || r.status === 'in-progress').length;
    
    return { total, cleaned, pending, inProgress };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading waste reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      
      <div className="pt-16">
        {currentScreen === 'home' && (
          <HomeScreen 
            onNavigate={setCurrentScreen} 
            stats={getStats()}
            recentReports={reports.slice(0, 3)}
          />
        )}
        
        {currentScreen === 'upload' && (
          <UploadScreen 
            onAddReport={addReport}
            onNavigate={setCurrentScreen}
            uploadImage={uploadImage}
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
            onDelete={handleDeleteReport}
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
