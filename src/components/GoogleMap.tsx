import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { WasteReport } from '../pages/Index';
import { supabase } from '../integrations/supabase/client';

interface GoogleMapProps {
  reports: WasteReport[];
  onReportSelect: (report: WasteReport) => void;
  center?: { lat: number; lng: number } | null;
}

const GoogleMap = ({ reports, onReportSelect, center }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusColors = {
    dirty: '#ef4444',
    cleaning: '#eab308',
    cleaned: '#10b981',
    'in-progress': '#3b82f6',
    completed: '#059669',
  };

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch API key from edge function
        const { data, error: functionError } = await supabase.functions.invoke('get-google-maps-key');
        
        if (functionError) throw functionError;
        if (!data?.apiKey) throw new Error('No API key received');

        const loader = new Loader({
          apiKey: data.apiKey,
          version: 'weekly',
          libraries: ['maps']
        });

        await loader.load();

        const defaultCenter = center || { lat: 40.7128, lng: -74.0060 };

        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setError(error instanceof Error ? error.message : 'Failed to load map');
        setIsLoading(false);
      }
    };

    initMap();
  }, []);

  // Update map center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.panTo(center);
      mapInstanceRef.current.setZoom(15);
    }
  }, [center]);

  // Update markers when reports change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    reports.forEach((report) => {
      const color = statusColors[report.status as keyof typeof statusColors] || '#6b7280';

      const marker = new google.maps.Marker({
        position: { lat: report.location.lat, lng: report.location.lng },
        map: mapInstanceRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8
        },
        title: report.category
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${report.category}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${report.location.address}</p>
            <p style="margin: 0; font-size: 12px;">
              <span style="display: inline-block; width: 8px; height: 8px; background: ${color}; border-radius: 50%; margin-right: 4px;"></span>
              ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
        onReportSelect(report);
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (reports.length > 0 && mapInstanceRef.current) {
      const bounds = new google.maps.LatLngBounds();
      reports.forEach(report => {
        bounds.extend({ lat: report.location.lat, lng: report.location.lng });
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [reports, onReportSelect]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200 relative">
      <div ref={mapRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg shadow-md">
          <p className="text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;