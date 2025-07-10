
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { WasteReport } from '../pages/Index';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapProps {
  reports: WasteReport[];
  onReportSelect: (report: WasteReport) => void;
}

const GoogleMap = ({ reports, onReportSelect }: GoogleMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
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
    initializeMap();
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      updateMarkers();
    }
  }, [reports]);

  const initializeMap = async () => {
    try {
      // Get API key from edge function
      const { data, error } = await supabase.functions.invoke('get-google-maps-key');
      
      if (error || !data?.apiKey) {
        throw new Error('Failed to get Google Maps API key');
      }

      const loader = new Loader({
        apiKey: data.apiKey,
        version: 'weekly',
        libraries: ['places']
      });

      await loader.load();

      if (mapContainer.current) {
        mapRef.current = new google.maps.Map(mapContainer.current, {
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

        updateMarkers();
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing Google Maps:', err);
      setError('Failed to load Google Maps');
      setIsLoading(false);
    }
  };

  const updateMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (!mapRef.current || !google.maps) return;

    const bounds = new google.maps.LatLngBounds();

    reports.forEach(report => {
      const marker = new google.maps.Marker({
        position: { lat: report.location.lat, lng: report.location.lng },
        map: mapRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: statusColors[report.status],
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 6
        },
        title: `${report.category} - ${report.status}`
      });

      marker.addListener('click', () => {
        onReportSelect(report);
      });

      markersRef.current.push(marker);
      bounds.extend(marker.getPosition()!);
    });

    // Fit map to show all markers
    if (reports.length > 0) {
      mapRef.current.fitBounds(bounds);
      
      // Prevent zooming too close for single markers
      google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => {
        if (mapRef.current && mapRef.current.getZoom()! > 15) {
          mapRef.current.setZoom(15);
        }
      });
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
