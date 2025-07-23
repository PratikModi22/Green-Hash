import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { WasteReport } from '../pages/Index';

interface GoogleMapProps {
  reports: WasteReport[];
  onReportSelect: (report: WasteReport) => void;
  center?: { lat: number; lng: number } | null;
}

const GoogleMap = ({ reports, onReportSelect, center }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

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

      // You'll need to set your Google Maps API key in Supabase secrets
      const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // This will be replaced with actual secret
      
      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
        return;
      }

      try {
        const loader = new Loader({
          apiKey,
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

      } catch (error) {
        console.error('Error loading Google Maps:', error);
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
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
        <p className="text-xs text-gray-600">
          Add Google Maps API key to enable maps
        </p>
      </div>
    </div>
  );
};

export default GoogleMap;