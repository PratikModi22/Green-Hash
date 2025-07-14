// Free geocoding service using Nominatim (OpenStreetMap)
export class GeocodingService {
  private static readonly BASE_URL = 'https://nominatim.openstreetmap.org';
  
  static async searchLocation(query: string): Promise<{ lat: number; lng: number; address: string } | null> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search location');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.display_name
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error searching location:', error);
      return null;
    }
  }
  
  static async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to reverse geocode');
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }
}