"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

// FIX: Fix for Leaflet default icon issues in modern setups
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Define a custom marker icon using a div/SVG that matches the blue accent
const CustomIcon = L.divIcon({
  html: `
    <div style="
      background-color: #3b82f6; /* Blue-500 */
      width: 28px; /* Slightly larger pin */
      height: 28px;
      border-radius: 50% 50% 50% 0; /* Creates a teardrop shape */
      transform: rotate(-45deg);
      box-shadow: 0 4px 6px rgba(0,0,0,0.4);
      border: 3px solid white;
    ">
      <svg width="100%" height="100%" viewBox="0 0 100 100" style="transform: rotate(45deg);">
        <circle cx="50" cy="50" r="12" fill="white" />
      </svg>
    </div>
  `,
  className: "custom-mini-map-icon", // Unique classname
  iconSize: [34, 40], // Overall size for positioning
  iconAnchor: [17, 40], // Anchor at the very bottom tip
  popupAnchor: [0, -35]
});


export default function MiniMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      // Disable interaction for a static display in a form
      dragging={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      className="h-full w-full"
    >
    </MapContainer>
  );
}