// frontend/app/components/MapComponent.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { fetchMapData, MapData } from '@/lib/api';

const DefaultIcon = L.icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
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
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geoData.projects.map((project) => {
        const formattedBudget = project?.budget !== undefined
          ? project.budget.toLocaleString()
          : 'N/A';
        return (
        <Marker key={`project-${project.id}`} position={[project.lat, project.lng]}>
          <Popup>
            <strong className="text-blue-600">Project: {project.title}</strong>
            <br />Status: {project.status}
            <br />Budget: ₹{formattedBudget}
          </Popup>
        </Marker>
      );
      })}

      {geoData.complaints.map((complaint) => (
        <Marker key={`complaint-${complaint.id}`} position={[complaint.lat, complaint.lng]}>
          <Popup>
            <strong className="text-red-600">Complaint: {complaint.title}</strong>
            <br />Severity: {complaint.severity}
            <br />Status: {complaint.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}