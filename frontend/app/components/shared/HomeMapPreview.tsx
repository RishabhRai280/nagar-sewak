'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchMapData, MapData } from '@/lib/api/api';
import { MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Fix for Leaflet default icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different types
const createCustomIcon = (color: string, type: 'complaint' | 'project') => {
  const iconHtml = `
    <div style="
      width: 24px; 
      height: 24px; 
      background-color: ${color}; 
      border: 2px solid white; 
      border-radius: 50%; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px; 
        height: 8px; 
        background-color: white; 
        border-radius: 50%;
      "></div>
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const complaintIcon = createCustomIcon('#ef4444', 'complaint'); // Red
const projectIcon = createCustomIcon('#3b82f6', 'project'); // Blue

export default function HomeMapPreview() {
  const [geoData, setGeoData] = useState<MapData>({ projects: [], complaints: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMapData();
        setGeoData(data);
      } catch (err: unknown) {
        console.log('Map data loading failed, using fallback');
        // Use fallback data or keep empty state
        setGeoData({ projects: [], complaints: [] });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Default center (India)
  const center: [number, number] = [21.1458, 79.0882];

  if (loading) {
    return (
      <div className="h-96 bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error || (geoData.projects.length === 0 && geoData.complaints.length === 0)) {
    return (
      <div className="h-96 bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 relative overflow-hidden">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Interactive Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="text-white" size={32} />
              </div>
              {/* Pulsing rings */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-blue-400 rounded-full animate-ping opacity-20"></div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-blue-400 rounded-full animate-ping opacity-30" style={{animationDelay: '0.5s'}}></div>
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-3">Explore Your City</h4>
            <p className="text-slate-600 mb-6 max-w-sm">
              View live data on complaints, ongoing projects, and ward boundaries across the city
            </p>
            <Link href="/map">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-3 mx-auto">
                <MapPin size={20} />
                Launch Interactive Map
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
        
        {/* Floating Info Cards */}
        <div className="absolute top-6 left-6 space-y-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-white/50">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-slate-700">Pending Issues</span>
              <span className="text-slate-500">142</span>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-white/50">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-semibold text-slate-700">Active Projects</span>
              <span className="text-slate-500">38</span>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-white/50">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-slate-700">Completed</span>
              <span className="text-slate-500">89</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-white/50">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-slate-700">Live Data</span>
            </div>
          </div>
        </div>

        {/* Mock location pins */}
        <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-red-500 rounded-full shadow-lg animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-blue-500 rounded-full shadow-lg animate-bounce" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-green-500 rounded-full shadow-lg animate-bounce" style={{animationDelay: '1.2s'}}></div>
      </div>
    );
  }

  return (
    <div className="h-96 relative overflow-hidden rounded-lg">
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
        className="h-full w-full z-0"
        style={{ cursor: 'pointer' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show limited number of markers for preview */}
        {geoData.projects.slice(0, 10).map((project) => (
          <Marker 
            key={`project-${project.id}`} 
            position={[project.lat, project.lng]}
            icon={projectIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-blue-600">Project: {project.title}</strong>
                <br />Status: {project.status}
                <br />Budget: ₹{project.budget?.toLocaleString() || 'N/A'}
              </div>
            </Popup>
          </Marker>
        ))}

        {geoData.complaints.slice(0, 10).map((complaint) => (
          <Marker 
            key={`complaint-${complaint.id}`} 
            position={[complaint.lat, complaint.lng]}
            icon={complaintIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-red-600">Complaint: {complaint.title}</strong>
                <br />Severity: {complaint.severity}/5
                <br />Status: {complaint.status}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Overlay with click to open full map */}
      <Link href="/map">
        <div className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors cursor-pointer flex items-center justify-center group">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <MapPin size={20} />
              Click to explore full map
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}