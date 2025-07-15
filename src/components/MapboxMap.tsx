import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { WasteReport } from '../pages/Index';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  reports: WasteReport[];
  onReportSelect: (report: WasteReport) => void;
  center?: { lat: number; lng: number } | null;
}

const MapboxMap = ({ reports, onReportSelect, center }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set a public token - user will need to replace this
    mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdCIsImEiOiJjbGZ0ZXN0In0.test';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center ? [center.lng, center.lat] : [-74.0060, 40.7128],
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update map center when center prop changes
  useEffect(() => {
    if (map.current && center) {
      map.current.flyTo({
        center: [center.lng, center.lat],
        zoom: 15,
        duration: 1000
      });
    }
  }, [center]);

  // Update markers when reports change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    reports.forEach((report) => {
      const statusColors = {
        dirty: '#ef4444',
        cleaning: '#eab308',
        cleaned: '#10b981',
        'in-progress': '#3b82f6',
        completed: '#059669',
      };

      const color = statusColors[report.status as keyof typeof statusColors] || '#6b7280';

      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = color;
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; max-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${report.category}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${report.location.address}</p>
          <p style="margin: 0; font-size: 12px;">
            <span style="display: inline-block; width: 8px; height: 8px; background: ${color}; border-radius: 50%; margin-right: 4px;"></span>
            ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </p>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([report.location.lng, report.location.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler
      el.addEventListener('click', () => {
        onReportSelect(report);
      });

      markersRef.current.push(marker);
    });
  }, [reports, onReportSelect]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
        <p className="text-xs text-gray-600">
          Replace Mapbox token in MapboxMap.tsx
        </p>
      </div>
    </div>
  );
};

export default MapboxMap;