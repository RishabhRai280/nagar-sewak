"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatMapLayerProps {
  points: Array<{
    lat: number;
    lng: number;
    intensity?: number;
  }>;
  options?: {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    max?: number;
    gradient?: { [key: number]: string };
  };
}

export default function HeatMapLayer({ points, options = {} }: HeatMapLayerProps) {
  const map = useMap();
  const heatLayerRef = useRef<L.HeatLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    // Convert points to heatmap format [lat, lng, intensity]
    const heatPoints: [number, number, number][] = points.map((p) => [
      p.lat,
      p.lng,
      p.intensity || 1,
    ]);

    // Create heatmap layer with custom options
    const heatLayer = (L as any).heatLayer(heatPoints, {
      radius: options.radius || 25,
      blur: options.blur || 15,
      maxZoom: options.maxZoom || 17,
      max: options.max || 1.0,
      gradient: options.gradient || {
        0.0: "blue",
        0.3: "cyan",
        0.5: "lime",
        0.7: "yellow",
        1.0: "red",
      },
    });

    heatLayerRef.current = heatLayer;
    heatLayer.addTo(map);

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, points, options]);

  return null;
}
