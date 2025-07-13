
import React, { useState } from 'react';
import { Camera, MapPin, Upload, AlertCircle } from 'lucide-react';
import { WasteReport } from '../pages/Index';

interface UploadScreenProps {
  onAddReport: (report: Omit<WasteReport, 'id' | 'reportedAt' | 'updatedAt'>) => Promise<WasteReport | null>;
  onNavigate: (screen: 'home' | 'map') => void;
  uploadImage: (file: File) => Promise<string | null>;
}

const UploadScreen = ({ onAddReport, onNavigate, uploadImage }: UploadScreenProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [category, setCategory] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Plastic Waste',
    'Food Waste',
    'Paper Waste',
    'Glass Waste',
    'Metal Waste',
    'Electronic Waste',
    'Hazardous Waste',
    'Other'
  ];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    console.log('🗺️ Getting current location...');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    setError('');

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('📍 Got coordinates:', { latitude, longitude });
        
        // Use coordinates immediately as fallback
        const coordinateAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setLocation({ 
          lat: latitude, 
          lng: longitude, 
          address: coordinateAddress 
        });

        // Try to get human-readable address
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error('❌ Error getting location:', error);
        let errorMessage = 'Unable to get current location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'Please try again.';
            break;
        }
        
        setError(errorMessage);
        setIsGettingLocation(false);
      },
      options
    );
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      // Wait for Google Maps API to be available
      let attempts = 0;
      const maxAttempts = 30;
      
      while (!window.google?.maps?.Geocoder && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      if (!window.google?.maps?.Geocoder) {
        console.log('⚠️ Google Maps Geocoder not available, keeping coordinates');
        setIsGettingLocation(false);
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat: latitude, lng: longitude };
      
      geocoder.geocode({ location: latlng }, (results, status) => {
        setIsGettingLocation(false);
        
        if (status === 'OK' && results && results[0]) {
          console.log('✅ Geocoding successful:', results[0].formatted_address);
          setLocation(prev => prev ? { 
            ...prev,
            address: results[0].formatted_address 
          } : null);
        } else {
          console.log('⚠️ Geocoding failed, keeping coordinates');
        }
      });
    } catch (error) {
      console.error('❌ Error in reverse geocoding:', error);
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage || !location || !category) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Upload image to Supabase Storage
      const imageUrl = await uploadImage(selectedImage);
      
      if (!imageUrl) {
        setError('Failed to upload image. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Create report
      const newReport = await onAddReport({
        image: imageUrl,
        location,
        status: 'dirty',
        category,
        remarks,
      });

      if (newReport) {
        console.log('Report submitted successfully:', newReport);
        // Reset form
        setSelectedImage(null);
        setImagePreview('');
        setLocation(null);
        setCategory('');
        setRemarks('');
        
        // Navigate to map to show the new report
        onNavigate('map');
      } else {
        setError('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Report Waste</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto max-h-48 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview('');
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center space-x-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose Image</span>
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Upload a photo of the waste area
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                {location ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-start space-x-2 text-emerald-700">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-sm font-medium block">{location.address}</span>
                        <span className="text-xs text-emerald-600">
                          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLocation(null)}
                      className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 underline"
                    >
                      Change Location
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-emerald-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isGettingLocation ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
                        <span className="text-gray-600">Getting location...</span>
                      </div>
                    ) : (
                      <>
                        <MapPin className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                        <span className="text-gray-600">Get Current Location</span>
                        <p className="text-xs text-gray-500 mt-1">
                          Click to use your device's GPS
                        </p>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Any additional details about the waste..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedImage || !location || !category}
                  className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Report</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
