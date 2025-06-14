
import React, { useState } from 'react';
import { Camera, MapPin, Upload, ArrowLeft } from 'lucide-react';
import { WasteReport } from '../pages/Index';

interface UploadScreenProps {
  onAddReport: (report: Omit<WasteReport, 'id' | 'reportedAt'>) => void;
  onNavigate: (screen: 'home' | 'map') => void;
}

const UploadScreen = ({ onAddReport, onNavigate }: UploadScreenProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [category, setCategory] = useState('plastic');
  const [remarks, setRemarks] = useState('');
  const [location, setLocation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleLocationFetch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd reverse geocode this to get the address
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation('Location unavailable');
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !location) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onAddReport({
      image: selectedImage,
      location: {
        lat: 40.7128 + Math.random() * 0.01,
        lng: -74.0060 + Math.random() * 0.01,
        address: location || 'Location not available'
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
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-emerald-400 transition-colors">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg cursor-pointer inline-flex items-center space-x-2 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                  </label>
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
                    ×
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Address or coordinates"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={handleLocationFetch}
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors"
                  title="Get current location"
                >
                  <MapPin className="w-5 h-5 text-gray-600" />
                </button>
              </div>
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
                <option value="plastic">Plastic</option>
                <option value="metal">Metal</option>
                <option value="organic">Organic</option>
                <option value="glass">Glass</option>
                <option value="paper">Paper</option>
                <option value="electronic">Electronic</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Remarks */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Describe the waste or add any additional information..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedImage || !location || isSubmitting}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : selectedImage && location
                  ? 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
