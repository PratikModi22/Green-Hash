
import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, ArrowLeft, X } from 'lucide-react';
import { WasteReport } from '../pages/Index';

interface UploadScreenProps {
  onAddReport: (report: Omit<WasteReport, 'id' | 'reportedAt' | 'updatedAt'>) => void;
  onNavigate: (screen: 'home' | 'map') => void;
}

const UploadScreen = ({ onAddReport, onNavigate }: UploadScreenProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [category, setCategory] = useState('plastic');
  const [remarks, setRemarks] = useState('');
  const [location, setLocation] = useState<{address: string, lat: number, lng: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using a free geocoding service (OpenStreetMap Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleLocationFetch = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location obtained:', latitude, longitude);
        
        try {
          const address = await reverseGeocode(latitude, longitude);
          setLocation({
            address,
            lat: latitude,
            lng: longitude
          });
        } catch (error) {
          console.error('Error getting address:', error);
          setLocation({
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            lat: latitude,
            lng: longitude
          });
        }
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Location unavailable';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timeout';
            break;
        }
        
        // Set a default location for demo purposes
        setLocation({
          address: errorMessage,
          lat: 40.7128 + Math.random() * 0.01,
          lng: -74.0060 + Math.random() * 0.01
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async () => {
    if (!selectedImage || !location) return;
    
    setIsSubmitting(true);
    console.log('Submitting new waste report...');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onAddReport({
      image: selectedImage,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: location.address
      },
      status: 'dirty',
      category,
      remarks,
    });
    
    setIsSubmitting(false);
    onNavigate('map');
  };

  React.useEffect(() => {
    handleLocationFetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Report Waste</h2>
            
            {/* Image Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Image
              </label>
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Take a photo or upload from gallery</p>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleCameraCapture}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </button>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Waste report"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Location
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={location?.address || ''}
                    readOnly
                    placeholder={isGettingLocation ? "Getting location..." : "Location will appear here"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <button
                  onClick={handleLocationFetch}
                  disabled={isGettingLocation}
                  className={`p-3 rounded-lg transition-colors ${
                    isGettingLocation 
                      ? 'bg-gray-200 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title="Refresh location"
                >
                  <MapPin className={`w-5 h-5 text-gray-600 ${isGettingLocation ? 'animate-pulse' : ''}`} />
                </button>
              </div>
              {location && (
                <p className="text-xs text-gray-500 mt-2">
                  Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Waste Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="plastic">Plastic Waste</option>
                <option value="metal">Metal Waste</option>
                <option value="organic">Organic Waste</option>
                <option value="glass">Glass Waste</option>
                <option value="paper">Paper Waste</option>
                <option value="electronic">Electronic Waste</option>
                <option value="construction">Construction Debris</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Remarks */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Details (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Describe the waste, approximate amount, any safety concerns..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedImage || !location || isSubmitting || isGettingLocation}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : selectedImage && location && !isGettingLocation
                  ? 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting Report...' : 'Submit Waste Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
