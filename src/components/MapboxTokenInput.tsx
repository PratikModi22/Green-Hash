
import React, { useState, useEffect } from 'react';
import { Key, ExternalLink } from 'lucide-react';

interface MapboxTokenInputProps {
  onTokenChange: (token: string) => void;
}

const MapboxTokenInput = ({ onTokenChange }: MapboxTokenInputProps) => {
  const [token, setToken] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('mapboxToken');
    if (savedToken) {
      setToken(savedToken);
      onTokenChange(savedToken);
      setIsVisible(false);
    }
  }, [onTokenChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      localStorage.setItem('mapboxToken', token.trim());
      onTokenChange(token.trim());
      setIsVisible(false);
    }
  };

  const handleClear = () => {
    setToken('');
    localStorage.removeItem('mapboxToken');
    onTokenChange('');
    setIsVisible(true);
  };

  if (!isVisible) {
    return (
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Key className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700">Mapbox token configured</span>
        </div>
        <button
          onClick={handleClear}
          className="text-sm text-green-600 hover:text-green-700 underline"
        >
          Change token
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-3">
        <Key className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium text-blue-900">Enter Mapbox Token</h3>
      </div>
      
      <p className="text-sm text-blue-700 mb-3">
        To display the interactive map, please enter your Mapbox public token.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwia..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <div className="flex items-center justify-between">
          <a
            href="https://mapbox.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <span>Get token from Mapbox</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          
          <button
            type="submit"
            disabled={!token.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Token
          </button>
        </div>
      </form>
    </div>
  );
};

export default MapboxTokenInput;
