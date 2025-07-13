
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { WasteReport } from '../pages/Index';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapProps {
  reports: WasteReport[];
  onReportSelect: (report: WasteReport) => void;
  center?: { lat: number; lng: number } | null;
}

const GoogleMap = ({ reports, onReportSelect, center }: GoogleMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const statusColors = {
    dirty: '#ef4444',
    cleaning: '#eab308',
    cleaned: '#10b981',
    'in-progress': '#3b82f6',
    completed: '#059669',
  };

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (mapRef.current && mapReady) {
      updateMarkers();
    }
  }, [reports, mapReady]);

  useEffect(() => {
    if (mapRef.current && center && mapReady) {
      console.log('🎯 Centering map to:', center);
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(15);
    }
  }, [center, mapReady]);

  const initializeMap = async () => {
    try {
      console.log('🗺️ Initializing Google Maps...');
      
      // Get API key from edge function
      const { data, error } = await supabase.functions.invoke('get-google-maps-key');
      
      if (error || !data?.apiKey) {
        throw new Error('Failed to get Google Maps API key');
      }

      console.log('📦 Loading Google Maps API...');
      const loader = new Loader({
        apiKey: data.apiKey,
        version: 'weekly',
        libraries: ['places']
      });

      await loader.load();
      console.log('✅ Google Maps API loaded successfully');

      // Wait for DOM to be ready and create map
      const createMap = () => {
        if (mapContainer.current && window.google?.maps) {
          console.log('🎯 Creating map instance...');
          
          mapRef.current = new window.google.maps.Map(mapContainer.current, {
            center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
            zoom: 12,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          console.log('🗺️ Map created successfully');
          setMapReady(true);
          setIsLoading(false);
          updateMarkers();
        } else {
          // Retry after a short delay
          setTimeout(createMap, 50);
        }
      };

      createMap();
      
    } catch (err) {
      console.error('❌ Error initializing Google Maps:', err);
      setError(err instanceof Error ? err.message : 'Failed to load Google Maps');
      setIsLoading(false);
    }
  };

  const updateMarkers = () => {
    console.log('🔄 Updating markers, reports count:', reports.length);
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (!mapRef.current || !window.google?.maps || !mapReady) {
      console.log('⚠️ Map not ready for markers');
      return;
    }

    if (reports.length === 0) {
      console.log('📍 No reports to display');
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();

    reports.forEach(report => {
      console.log('📍 Adding marker for report:', report.id, report.location);
      
      const marker = new window.google.maps.Marker({
        position: { lat: report.location.lat, lng: report.location.lng },
        map: mapRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: statusColors[report.status],
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8
        },
        title: `${report.category} - ${report.status}`
      });

      marker.addListener('click', () => {
        console.log('🖱️ Marker clicked:', report.id);
        onReportSelect(report);
      });

      markersRef.current.push(marker);
      bounds.extend(marker.getPosition()!);
    });

    // Fit map to show all markers if we have multiple reports
    if (reports.length > 1) {
      console.log('🎯 Fitting map bounds to show all markers');
      mapRef.current.fitBounds(bounds);
    } else if (reports.length === 1) {
      // Center on single marker
      mapRef.current.setCenter({ lat: reports[0].location.lat, lng: reports[0].location.lng });
      mapRef.current.setZoom(15);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500">Please check your Google Maps API key configuration</p>
          <button 
            onClick={() => {
              setError(null);
              setIsLoading(true);
              setMapReady(false);
              initializeMap();
            }}
            className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default GoogleMap;
