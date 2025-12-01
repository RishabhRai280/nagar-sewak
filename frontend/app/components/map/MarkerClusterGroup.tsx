"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

interface MarkerClusterGroupProps {
  markers: Array<{
    position: [number, number];
    icon: L.DivIcon;
    popup?: string;
    onClick?: () => void;
  }>;
}

export default function MarkerClusterGroup({ markers }: MarkerClusterGroupProps) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create cluster group with custom options
    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 80,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let size = "small";
        let colorClass = "bg-blue-500";

        if (count > 10) {
          size = "large";
          colorClass = "bg-red-500";
        } else if (count > 5) {
          size = "medium";
          colorClass = "bg-orange-500";
        }

        return L.divIcon({
          html: `
            <div class="cluster-marker ${size}" style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${size === "large" ? "60px" : size === "medium" ? "50px" : "40px"};
              height: ${size === "large" ? "60px" : size === "medium" ? "50px" : "40px"};
              border-radius: 50%;
              background: ${colorClass === "bg-red-500" ? "#ef4444" : colorClass === "bg-orange-500" ? "#f97316" : "#3b82f6"};
              color: white;
              font-weight: bold;
              font-size: ${size === "large" ? "18px" : size === "medium" ? "16px" : "14px"};
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              border: 3px solid white;
              cursor: pointer;
              transition: transform 0.2s;
            ">
              ${count}
            </div>
          `,
          className: "marker-cluster-custom",
          iconSize: L.point(
            size === "large" ? 60 : size === "medium" ? 50 : 40,
            size === "large" ? 60 : size === "medium" ? 50 : 40
          ),
        });
      },
    });

    clusterGroupRef.current = clusterGroup;
    map.addLayer(clusterGroup);

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
      }
    };
  }, [map]);

  useEffect(() => {
    if (!clusterGroupRef.current) return;

    // Clear existing markers
    clusterGroupRef.current.clearLayers();

    // Add new markers
    markers.forEach((markerData) => {
      const marker = L.marker(markerData.position, {
        icon: markerData.icon,
      });

      if (markerData.popup) {
        marker.bindPopup(markerData.popup);
      }

      if (markerData.onClick) {
        marker.on("click", markerData.onClick);
      }

      clusterGroupRef.current?.addLayer(marker);
    });
  }, [markers]);

  return null;
}
