// frontend/app/map/MapClientWrapper.tsx

'use client'; // This is now a Client Component

import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false here, where it is allowed.
const DynamicMapComponent = dynamic(
  () => import('../components/MapComponent'),
  { 
    ssr: false,
    loading: () => <p className="text-center p-20 text-lg text-gray-600">Loading Interactive Map...</p>
  }
);

export default function MapClientWrapper() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <DynamicMapComponent />
    </div>
  );
}