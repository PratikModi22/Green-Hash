
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import HomeScreen from '../components/HomeScreen';
import UploadScreen from '../components/UploadScreen';
import MapView from '../components/MapView';
import ReportCard from '../components/ReportCard';
import AnalyticsScreen from '../components/AnalyticsScreen';
import AuthorityLogin from '../components/AuthorityLogin';
import Navigation from '../components/Navigation';
import Leaderboard from '../components/Leaderboard';
import GalleryView from '../components/GalleryView';
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
  const { user, signOut } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'home' | 'upload' | 'map' | 'report' | 'analytics' | 'authority' | 'leaderboard' | 'gallery'>('home');
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-primary">EcoTrack</h1>
              <Navigation currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Hello, {user.email}</span>
                  <Button onClick={signOut} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Sign In / Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-6">
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

        {currentScreen === 'leaderboard' && (
          <div className="container mx-auto px-4 py-8">
            <Leaderboard />
          </div>
        )}

        {currentScreen === 'gallery' && (
          <div className="container mx-auto px-4 py-8">
            <GalleryView reports={reports} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
