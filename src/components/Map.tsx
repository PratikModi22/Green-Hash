
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { WasteReport } from '../pages/Index';

interface MapProps {
  reports: WasteReport[];
  onReportSelect: (report: WasteReport) => void;
  mapboxToken?: string;
}

const Map = ({ reports, onReportSelect, mapboxToken }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const statusColors = {
    dirty: '#ef4444',
    cleaning: '#eab308',
    cleaned: '#10b981',
    'in-progress': '#3b82f6',
    completed: '#059669',
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.006, 40.7128], // Default to NYC
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Cleanup function
    return () => {
      // Remove all markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers when reports change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    reports.forEach(report => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = statusColors[report.status];
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([report.location.lng, report.location.lat])
        .addTo(map.current!);

      // Add click event
      el.addEventListener('click', () => {
        onReportSelect(report);
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (reports.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      reports.forEach(report => {
        bounds.extend([report.location.lng, report.location.lat]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [reports, onReportSelect]);

  if (!mapboxToken) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Map requires Mapbox token</p>
          <p className="text-sm text-gray-500">Get your token from mapbox.com</p>
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

export default Map;
