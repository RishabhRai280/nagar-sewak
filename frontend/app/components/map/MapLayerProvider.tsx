"use client";

import { TileLayer, GeoJSON, Circle, Polyline, useMap } from "react-leaflet";
import { MapLayer, MapOverlay } from "./MapLayerControl";
import { useEffect, useState } from "react";
import L from "leaflet";

interface MapLayerProviderProps {
  layer: MapLayer;
  activeOverlays: MapOverlay[];
  wardBoundaries?: any;
  populationData?: any;
  infrastructureData?: any;
  complaints?: Array<{ lat: number; lng: number; status: string; createdAt: string }>;
  projects?: Array<{ lat: number; lng: number; status: string }>;
}

// Map tile configurations
const tileConfigs = {
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 19,
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
    maxZoom: 17,
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  topo: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
    maxZoom: 17,
  },
};

// Historical Data Component - Shows past complaints with time decay
function HistoricalOverlay({ complaints }: { complaints: Array<{ lat: number; lng: number; createdAt: string; status: string }> }) {
  const map = useMap();
  
  useEffect(() => {
    if (!complaints || complaints.length === 0) return;

    const now = new Date().getTime();
    const circles: L.Circle[] = [];

    complaints.forEach((complaint) => {
      const createdTime = new Date(complaint.createdAt).getTime();
      const ageInDays = (now - createdTime) / (1000 * 60 * 60 * 24);
      
      // Older complaints are more transparent
      const opacity = Math.max(0.1, 1 - (ageInDays / 365));
      const radius = 50 + (ageInDays * 2); // Older = larger radius
      
      const color = complaint.status === 'resolved' ? '#10b981' : '#ef4444';
      
      const circle = L.circle([complaint.lat, complaint.lng], {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: opacity * 0.3,
        opacity: opacity,
        weight: 2,
      }).addTo(map);

      circle.bindPopup(`
        <div class="p-2">
          <strong class="text-xs font-bold">Historical Complaint</strong>
          <p class="text-xs text-gray-600 mt-1">Age: ${Math.floor(ageInDays)} days ago</p>
          <p class="text-xs text-gray-600">Status: ${complaint.status}</p>
        </div>
      `);

      circles.push(circle);
    });

    return () => {
      circles.forEach(circle => map.removeLayer(circle));
    };
  }, [map, complaints]);

  return null;
}

// Traffic Simulation Overlay - Shows simulated traffic on roads
function TrafficOverlay({ infrastructureData }: { infrastructureData: any }) {
  const map = useMap();
  
  useEffect(() => {
    if (!infrastructureData) return;

    const roads = infrastructureData.features.filter((f: any) => f.properties.type === 'road');
    const polylines: L.Polyline[] = [];

    roads.forEach((road: any) => {
      // Simulate traffic levels (in real app, this would come from API)
      const trafficLevel = Math.random();
      const color = trafficLevel > 0.7 ? '#ef4444' : // Heavy traffic - red
                    trafficLevel > 0.4 ? '#f59e0b' : // Medium traffic - orange
                                        '#10b981';   // Light traffic - green
      
      const polyline = L.polyline(
        road.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]),
        {
          color: color,
          weight: 6,
          opacity: 0.7,
        }
      ).addTo(map);

      polyline.bindPopup(`
        <div class="p-2">
          <strong class="text-xs font-bold">Traffic Status</strong>
          <p class="text-xs text-gray-600 mt-1">${road.properties.name || 'Road'}</p>
          <p class="text-xs text-gray-600">Level: ${trafficLevel > 0.7 ? 'Heavy' : trafficLevel > 0.4 ? 'Medium' : 'Light'}</p>
        </div>
      `);

      polylines.push(polyline);
    });

    return () => {
      polylines.forEach(polyline => map.removeLayer(polyline));
    };
  }, [map, infrastructureData]);

  return null;
}

// Weather Overlay Component - Shows weather conditions
function WeatherOverlay() {
  const map = useMap();
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    // Simulate weather data (in real app, fetch from weather API)
    const simulatedWeather = {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
    };
    setWeatherData(simulatedWeather);

    // Add weather info control
    const WeatherControl = L.Control.extend({
      onAdd: function() {
        const div = L.DomUtil.create('div', 'weather-info');
        div.innerHTML = `
          <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
            <div style="font-weight: bold; font-size: 14px; color: #1f2937; margin-bottom: 4px;">Weather</div>
            <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${simulatedWeather.temperature}°C</div>
            <div style="font-size: 12px; color: #6b7280;">${simulatedWeather.condition}</div>
            <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">
              💧 ${simulatedWeather.humidity}% | 💨 ${simulatedWeather.windSpeed} km/h
            </div>
          </div>
        `;
        return div;
      }
    });

    const weatherControl = new WeatherControl({ position: 'topright' });
    weatherControl.addTo(map);

    return () => {
      map.removeControl(weatherControl);
    };
  }, [map]);

  return null;
}

export default function MapLayerProvider({
  layer,
  activeOverlays,
  wardBoundaries,
  populationData,
  infrastructureData,
  complaints = [],
  projects = [],
}: MapLayerProviderProps) {
  const config = tileConfigs[layer];

  return (
    <>
      {/* Base Layer */}
      <TileLayer
        key={layer}
        url={config.url}
        attribution={config.attribution}
        maxZoom={config.maxZoom}
      />

      {/* Ward Boundaries Overlay */}
      {activeOverlays.includes("wards") && wardBoundaries && (
        <GeoJSON
          key="wards"
          data={wardBoundaries}
          style={{
            color: "#3b82f6",
            weight: 3,
            opacity: 0.9,
            fillColor: "#3b82f6",
            fillOpacity: 0.15,
            dashArray: "8, 4",
          }}
          onEachFeature={(feature, layer) => {
            if (feature.properties && feature.properties.name) {
              layer.bindPopup(`
                <div class="p-3">
                  <strong class="text-base font-bold text-blue-700">${feature.properties.name}</strong>
                  ${feature.properties.population ? `
                    <div class="mt-2 space-y-1">
                      <p class="text-xs text-gray-600">👥 Population: <strong>${feature.properties.population.toLocaleString()}</strong></p>
                      <p class="text-xs text-gray-600">📏 Area: <strong>${feature.properties.area} km²</strong></p>
                      <p class="text-xs text-gray-600">📊 Density: <strong>${feature.properties.density.toLocaleString()}/km²</strong></p>
                    </div>
                  ` : ''}
                </div>
              `);
              
              // Add hover effect
              layer.on('mouseover', function(this: any) {
                this.setStyle({
                  fillOpacity: 0.3,
                  weight: 4,
                });
              });
              
              layer.on('mouseout', function(this: any) {
                this.setStyle({
                  fillOpacity: 0.15,
                  weight: 3,
                });
              });
            }
          }}
        />
      )}

      {/* Population Density Overlay */}
      {activeOverlays.includes("population") && populationData && (
        <GeoJSON
          key="population"
          data={populationData}
          style={(feature) => {
            const density = feature?.properties?.density || 0;
            const getColor = (d: number) => {
              return d > 10000 ? '#7f1d1d' :
                     d > 5000  ? '#991b1b' :
                     d > 2000  ? '#dc2626' :
                     d > 1000  ? '#f97316' :
                     d > 500   ? '#fbbf24' :
                                 '#86efac';
            };
            
            return {
              fillColor: getColor(density),
              weight: 2,
              opacity: 0.8,
              color: '#ffffff',
              fillOpacity: 0.6,
            };
          }}
          onEachFeature={(feature, layer) => {
            if (feature.properties) {
              const density = feature.properties.density || 0;
              const level = density > 10000 ? 'Very High' :
                           density > 5000 ? 'High' :
                           density > 2000 ? 'Medium' :
                           density > 1000 ? 'Low' : 'Very Low';
              
              layer.bindPopup(`
                <div class="p-3">
                  <strong class="text-base font-bold text-purple-700">Population Density</strong>
                  <div class="mt-2 space-y-1">
                    <p class="text-xs text-gray-600">Level: <strong class="text-purple-600">${level}</strong></p>
                    <p class="text-xs text-gray-600">Density: <strong>${feature.properties.density?.toLocaleString() || 'N/A'}</strong> per km²</p>
                    <p class="text-xs text-gray-600">Total: <strong>${feature.properties.total?.toLocaleString() || 'N/A'}</strong> people</p>
                    <p class="text-xs text-gray-600">Area: <strong>${feature.properties.area?.toFixed(2) || 'N/A'}</strong> km²</p>
                  </div>
                </div>
              `);

              layer.on('mouseover', function(this: any) {
                this.setStyle({ fillOpacity: 0.8, weight: 3 });
              });
              
              layer.on('mouseout', function(this: any) {
                this.setStyle({ fillOpacity: 0.6, weight: 2 });
              });
            }
          }}
        />
      )}

      {/* Infrastructure Overlay */}
      {activeOverlays.includes("infrastructure") && infrastructureData && (
        <GeoJSON
          key="infrastructure"
          data={infrastructureData}
          style={(feature) => {
            const type = feature?.properties?.type;
            const getColor = (t: string) => {
              switch(t) {
                case 'road': return '#64748b';
                case 'water': return '#0ea5e9';
                case 'power': return '#eab308';
                case 'sewer': return '#84cc16';
                default: return '#6b7280';
              }
            };
            
            return {
              color: getColor(type),
              weight: 4,
              opacity: 0.8,
            };
          }}
          onEachFeature={(feature, layer) => {
            if (feature.properties) {
              const icons: any = {
                road: '🛣️',
                water: '💧',
                power: '⚡',
                sewer: '🚰',
              };
              
              layer.bindPopup(`
                <div class="p-3">
                  <strong class="text-base font-bold text-yellow-700">
                    ${icons[feature.properties.type] || '🔧'} Infrastructure
                  </strong>
                  <div class="mt-2 space-y-1">
                    <p class="text-xs text-gray-600">Type: <strong>${feature.properties.type || 'N/A'}</strong></p>
                    <p class="text-xs text-gray-600">Name: <strong>${feature.properties.name || 'Unnamed'}</strong></p>
                    <p class="text-xs text-gray-600">Status: <strong class="${feature.properties.status === 'Operational' ? 'text-green-600' : 'text-orange-600'}">${feature.properties.status || 'N/A'}</strong></p>
                  </div>
                </div>
              `);

              layer.on('mouseover', function(this: any) {
                this.setStyle({ weight: 6, opacity: 1 });
              });
              
              layer.on('mouseout', function(this: any) {
                this.setStyle({ weight: 4, opacity: 0.8 });
              });
            }
          }}
        />
      )}

      {/* Historical Data Overlay */}
      {activeOverlays.includes("historical") && complaints.length > 0 && (
        <HistoricalOverlay complaints={complaints} />
      )}

      {/* Weather Overlay */}
      {activeOverlays.includes("weather") && (
        <WeatherOverlay />
      )}

      {/* Traffic Overlay */}
      {activeOverlays.includes("traffic") && infrastructureData && (
        <TrafficOverlay infrastructureData={infrastructureData} />
      )}
    </>
  );
}
