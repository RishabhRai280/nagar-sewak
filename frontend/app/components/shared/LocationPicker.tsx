"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

// Component to handle map resizing issues in modals
function MapInvalidator() {
  const map = useMapEvents({});
  useEffect(() => {
    // Wait for modal animation to finish
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 500);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function LocationPicker({ lat, lng, onLocationSelect }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // India center
  const center: [number, number] = lat && lng ? [lat, lng] : defaultCenter;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={lat && lng ? 15 : 5}
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {lat && lng && <Marker position={[lat, lng]} />}
      <LocationMarker onLocationSelect={onLocationSelect} />
      <MapInvalidator />
    </MapContainer>
  );
}
