"use client";

import { useState } from "react";
import { Layers, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface MapEnhancementsProps {
  onClusteringToggle: (enabled: boolean) => void;
  onHeatmapToggle: (enabled: boolean) => void;
  clusteringEnabled: boolean;
  heatmapEnabled: boolean;
}

export default function MapEnhancements({
  onClusteringToggle,
  onHeatmapToggle,
  clusteringEnabled,
  heatmapEnabled,
}: MapEnhancementsProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Clustering Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClusteringToggle(!clusteringEnabled)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg transition-all ${
          clusteringEnabled
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Toggle marker clustering"
      >
        <Layers size={18} />
        <span className="text-sm">Clustering</span>
      </motion.button>

      {/* Heatmap Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onHeatmapToggle(!heatmapEnabled)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg transition-all ${
          heatmapEnabled
            ? "bg-red-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Toggle heat map"
      >
        <Flame size={18} />
        <span className="text-sm">Heat Map</span>
      </motion.button>
    </div>
  );
}
