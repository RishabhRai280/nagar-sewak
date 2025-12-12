'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, MapPin, FileText, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    
    try {
      // Try to fetch the home page
      const response = await fetch('/', { cache: 'no-cache' });
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.log('Still offline');
    } finally {
      setTimeout(() => setRetrying(false), 1000);
    }
  };

  if (isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            You&apos;re Back Online!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Great! Your internet connection has been restored. You can now access all features of Nagar Sewak.
          </p>
          
          <Link
            href="/"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
          >
            Continue to App
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Offline Icon */}
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-slate-600" />
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          You&apos;re Offline
        </h1>
        
        {/* Description */}
        <p className="text-gray-600 mb-8">
          No internet connection detected. Some features may be limited, but you can still browse cached content.
        </p>
        
        {/* Retry Button */}
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mb-6"
        >
          <RefreshCw className={`w-5 h-5 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Checking...' : 'Try Again'}
        </button>
        
        {/* Available Actions */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Available Offline
          </h3>
          
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <Home className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Home (Cached)</span>
            </Link>
            
            <Link
              href="/map"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Map (Cached)</span>
            </Link>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">Report Issue (Requires Internet)</span>
            </div>
          </div>
        </div>
        
        {/* Offline Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 Offline Tips
          </h4>
          <ul className="text-xs text-blue-800 space-y-1 text-left">
            <li>• Check your WiFi or mobile data connection</li>
            <li>• Move to an area with better signal</li>
            <li>• Cached pages will still work</li>
            <li>• Your data will sync when you&apos;re back online</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
