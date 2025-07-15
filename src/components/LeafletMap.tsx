import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { WasteReport } from '../pages/Index';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  reports: WasteReport[];
  onReportSelect: (report: WasteReport) => void;
  center?: { lat: number; lng: number } | null;
}

// Custom component to handle map center changes
const MapCenter = ({ center }: { center: { lat: number; lng: number } | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 15);
    }
  }, [center, map]);
  
  return null;
};

// Custom marker icons for different statuses
const createCustomIcon = (status: string) => {
  const statusColors = {
    dirty: '#ef4444',
    cleaning: '#eab308',
    cleaned: '#10b981',
    'in-progress': '#3b82f6',
    completed: '#059669',
  };

  const color = statusColors[status as keyof typeof statusColors] || '#6b7280';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color}; 
        width: 20px; 
        height: 20px; 
        border-radius: 50%; 
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const LeafletMap = ({ reports, onReportSelect, center }: LeafletMapProps) => {
  const defaultCenter: [number, number] = [40.7128, -74.0060]; // Default to NYC
  const [mapZoom] = useState(12);

  console.log('LeafletMap: reports count:', reports.length);
  console.log('LeafletMap: center:', center);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={defaultCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container"
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapCenter center={center} />
        
        {reports.map((report) => {
          console.log('Rendering marker for report:', report.id, report.location);
          const statusColors = {
            dirty: '#ef4444',
            cleaning: '#eab308',
            cleaned: '#10b981',
            'in-progress': '#3b82f6',
            completed: '#059669',
          };
          const color = statusColors[report.status as keyof typeof statusColors] || '#6b7280';
          
          return (
            <Marker
              key={report.id}
              position={[report.location.lat, report.location.lng] as [number, number]}
              icon={createCustomIcon(report.status)}
              eventHandlers={{
                click: () => onReportSelect(report),
              }}
            >
              <Popup>
                <div style={{ padding: '8px', maxWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                    {report.category}
                  </h3>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
                    {report.location.address}
                  </p>
                  <p style={{ margin: '0', fontSize: '12px' }}>
                    <span style={{ 
                      display: 'inline-block', 
                      width: '8px', 
                      height: '8px', 
                      background: color,
                      borderRadius: '50%', 
                      marginRight: '4px' 
                    }}></span>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;