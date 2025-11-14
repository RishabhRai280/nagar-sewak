// frontend/app/map/page.tsx (Updated)

import MapClientWrapper from './MapClientWrapper'; // Import the new Client Component

// This file remains a Server Component (no 'use client')

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Nagar Sewak Live Map
      </h1>
      <p className="text-gray-600 mb-8">
        View real-time status of government projects and citizen-reported issues across the city.
      </p>
      
      {/* Renders the client component containing the dynamic map import */}
      <MapClientWrapper /> 
    </div>
  );
}