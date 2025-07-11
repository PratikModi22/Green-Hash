
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
  const [apiLoaded, setApiLoaded] = useState(false);

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
    if (mapRef.current && apiLoaded) {
      updateMarkers();
    }
  }, [reports, apiLoaded]);

  useEffect(() => {
    if (mapRef.current && center && apiLoaded) {
      console.log('🎯 Centering map to:', center);
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(12);
    }
  }, [center, apiLoaded]);

  const initializeMap = async () => {
    try {
      console.log('🗺️ Initializing Google Maps...');
      
      // Get API key from edge function
      const { data, error } = await supabase.functions.invoke('get-google-maps-key');
      
      console.log('🔑 API Key response:', { data, error });
      
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
      setApiLoaded(true);

      // Wait for the next tick to ensure DOM is ready
      setTimeout(() => {
        if (mapContainer.current && window.google?.maps) {
          console.log('🎯 Creating map instance...');
          console.log('Map container available:', !!mapContainer.current);
          console.log('Google Maps API available:', !!window.google?.maps);
          
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

          console.log('🗺️ Map created successfully:', !!mapRef.current);
          updateMarkers();
          setIsLoading(false);
        } else {
          console.error('❌ Map container or Google Maps API still not available');
          console.log('Container:', mapContainer.current);
          console.log('Google Maps:', window.google?.maps);
          throw new Error('Map container or Google Maps API not available after delay');
        }
      }, 100);
      
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

    if (!mapRef.current || !window.google?.maps || !apiLoaded) {
      console.log('⚠️ Map, Google Maps API, or API not ready');
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
          scale: 6
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

    // Fit map to show all markers
    if (reports.length > 0) {
      console.log('🎯 Fitting map bounds to show all markers');
      mapRef.current.fitBounds(bounds);
      
      // Prevent zooming too close for single markers
      window.google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => {
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
          <button 
            onClick={initializeMap}
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
