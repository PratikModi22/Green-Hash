
import React, { useState, useEffect } from 'react';
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
  updatedAt: Date;
  beforeImage?: string;
  afterImage?: string;
  authorityComments?: string;
};

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'upload' | 'map' | 'report' | 'analytics' | 'authority'>('home');
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [reports, setReports] = useState<WasteReport[]>([]);

  // Load reports from localStorage on component mount
  useEffect(() => {
    const savedReports = localStorage.getItem('wasteReports');
    if (savedReports) {
      const parsedReports = JSON.parse(savedReports).map((report: any) => ({
        ...report,
        reportedAt: new Date(report.reportedAt),
        updatedAt: new Date(report.updatedAt)
      }));
      setReports(parsedReports);
    }
  }, []);

  // Save reports to localStorage whenever reports change
  useEffect(() => {
    localStorage.setItem('wasteReports', JSON.stringify(reports));
  }, [reports]);

  const addReport = (report: Omit<WasteReport, 'id' | 'reportedAt' | 'updatedAt'>) => {
    const newReport: WasteReport = {
      ...report,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reportedAt: new Date(),
      updatedAt: new Date(),
    };
    setReports(prev => [newReport, ...prev]);
    console.log('New report added:', newReport);
  };

  const updateReport = (reportId: string, updates: Partial<WasteReport>) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, ...updates, updatedAt: new Date() } 
        : report
    ));
    
    // Update selected report if it's the one being updated
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
    
    console.log('Report updated:', reportId, updates);
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(null);
      setCurrentScreen('map');
    }
    console.log('Report deleted:', reportId);
  };

  const handleReportSelect = (report: WasteReport) => {
    setSelectedReport(report);
    setCurrentScreen('report');
  };

  const getStats = () => {
    const total = reports.length;
    const cleaned = reports.filter(r => r.status === 'cleaned' || r.status === 'completed').length;
    const pending = reports.filter(r => r.status === 'dirty').length;
    const inProgress = reports.filter(r => r.status === 'cleaning' || r.status === 'in-progress').length;
    
    return { total, cleaned, pending, inProgress };
  };

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
            onDelete={deleteReport}
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
