
import { Loader } from '@googlemaps/js-api-loader';
import { supabase } from '@/integrations/supabase/client';

class GoogleMapsService {
  private static instance: GoogleMapsService;
  private loader: Loader | null = null;
  private isLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  async loadGoogleMaps(): Promise<void> {
    if (this.isLoaded) {
      console.log('✅ Google Maps already loaded');
      return;
    }

    if (this.loadingPromise) {
      console.log('⏳ Google Maps loading in progress, waiting...');
      return this.loadingPromise;
    }

    this.loadingPromise = this.initializeLoader();
    return this.loadingPromise;
  }

  private async initializeLoader(): Promise<void> {
    try {
      console.log('🗺️ Initializing Google Maps Loader...');
      
      // Get API key from edge function
      const { data, error } = await supabase.functions.invoke('get-google-maps-key');
      
      if (error || !data?.apiKey) {
        throw new Error('Failed to get Google Maps API key');
      }

      // Create loader with all required libraries
      this.loader = new Loader({
        apiKey: data.apiKey,
        version: 'weekly',
        libraries: ['places', 'geometry'] // Include all libraries needed across the app
      });

      await this.loader.load();
      this.isLoaded = true;
      console.log('✅ Google Maps API loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading Google Maps:', error);
      this.loadingPromise = null;
      throw error;
    }
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && !!window.google?.maps;
  }
}

export const googleMapsService = GoogleMapsService.getInstance();
