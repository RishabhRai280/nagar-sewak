// frontend/app/components/MapComponent.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchMapData, MapData } from '@/lib/api/api';

// Fix for Leaflet default icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapComponent() {
  const [geoData, setGeoData] = useState<MapData>({ projects: [], complaints: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMapData();
        setGeoData(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load map data.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const center = useMemo<[number, number]>(() => {
    if (geoData.projects.length > 0) {
      const firstProject = geoData.projects[0];
      return [firstProject.lat, firstProject.lng];
    }
    return [20.5937, 78.9629];
  }, [geoData.projects]);

  if (loading) {
    return <p className="text-center p-20 text-lg text-gray-600">Loading Interactive Map...</p>;
  }

  if (error) {
    return <p className="text-center p-20 text-lg text-red-600">{error}</p>;
  }

  return (
    <MapContainer
      center={center}
      zoom={5}
      scrollWheelZoom
      className="h-[80vh] w-full z-0 rounded-lg shadow-xl"
      style={{ zIndex: 1 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geoData.projects.map((project) => {
        const formattedBudget = project?.budget !== undefined
          ? typeof project.budget === 'number' 
            ? project.budget.toLocaleString()
            : String(project.budget)
          : 'N/A';
        return (
        <Marker 
          key={`project-${project.id}`} 
          position={[project.lat, project.lng]}
          icon={DefaultIcon}
        >
          <Popup>
            <strong className="text-blue-600">Project: {project.title}</strong>
            <br />Status: {project.status}
            <br />Budget: ₹{formattedBudget}
          </Popup>
        </Marker>
      );
      })}

      {geoData.complaints.map((complaint) => {
        const mediaItems = complaint.photoUrls && complaint.photoUrls.length > 0 
          ? complaint.photoUrls 
          : complaint.photoUrl ? [complaint.photoUrl] : [];
        
        return (
          <Marker 
            key={`complaint-${complaint.id}`} 
            position={[complaint.lat, complaint.lng]}
            icon={DefaultIcon}
          >
            <Popup maxWidth={300} className="complaint-popup">
              <div className="p-2">
                <strong className="text-red-600 text-sm font-bold block mb-2">
                  Complaint: {complaint.title}
                </strong>
                
                {/* Media Gallery */}
                {mediaItems.length > 0 && (
                  <div className="mb-3">
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      {mediaItems.slice(0, 4).map((media, index) => {
                        const isVideo = /\.(mp4|webm|ogg)$/i.test(media);
                        return (
                          <div key={index} className="relative aspect-square rounded overflow-hidden bg-slate-100">
                            {isVideo ? (
                              <video 
                                src={media} 
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => window.open(media, '_blank')}
                              />
                            ) : (
                              <img 
                                src={media} 
                                alt={`Evidence ${index + 1}`}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(media, '_blank')}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://placehold.co/150/e2e8f0/64748b?text=${index + 1}`;
                                }}
                              />
                            )}
                            {mediaItems.length > 4 && index === 3 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                                +{mediaItems.length - 4} more
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {mediaItems.length > 1 && (
                      <p className="text-xs text-slate-500 mb-2">
                        {mediaItems.length} evidence file{mediaItems.length > 1 ? 's' : ''} • Click to view
                      </p>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Severity: <span className={`font-semibold ${
                    complaint.severity >= 4 ? 'text-red-600' : 
                    complaint.severity >= 3 ? 'text-orange-600' : 'text-yellow-600'
                  }`}>{complaint.severity}/5</span></div>
                  <div>Status: <span className="font-semibold">{complaint.status}</span></div>
                  {complaint.createdAt && (
                    <div>Reported: {new Date(complaint.createdAt).toLocaleDateString()}</div>
                  )}
                </div>
                
                <button 
                  onClick={() => window.open(`/complaints/${complaint.id}`, '_blank')}
                  className="mt-3 w-full px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
                >
                  View Full Details
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}