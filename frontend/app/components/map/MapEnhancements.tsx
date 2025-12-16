"use client";

import { useState } from "react";
import { Layers, Flame, Printer } from "lucide-react";
import { motion } from "framer-motion";

interface MapEnhancementsProps {
  onClusteringToggle: (enabled: boolean) => void;
  onHeatmapToggle: (enabled: boolean) => void;
  clusteringEnabled: boolean;
  heatmapEnabled: boolean;
  onPrintMap?: () => void;
}

export default function MapEnhancements({
  onClusteringToggle,
  onHeatmapToggle,
  clusteringEnabled,
  heatmapEnabled,
  onPrintMap,
  compact = false,
}: MapEnhancementsProps & { compact?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 ${compact ? "" : "absolute top-20 right-4 z-[1000]"}`}>
      {/* Clustering Toggle */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClusteringToggle(!clusteringEnabled)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md font-bold text-xs transition-all w-full justify-start ${clusteringEnabled
          ? "bg-blue-100 text-blue-700"
          : "bg-transparent text-slate-600 hover:bg-slate-50"
          }`}
        title="Toggle marker clustering"
      >
        <div className={`p-1 rounded-full ${clusteringEnabled ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}>
          <Layers size={14} />
        </div>
        <span>Clustering</span>
      </motion.button>

      {/* Heatmap Toggle */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onHeatmapToggle(!heatmapEnabled)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md font-bold text-xs transition-all w-full justify-start ${heatmapEnabled
          ? "bg-red-100 text-red-700"
          : "bg-transparent text-slate-600 hover:bg-slate-50"
          }`}
        title="Toggle heat map"
      >
        <div className={`p-1 rounded-full ${heatmapEnabled ? "bg-red-600 text-white" : "bg-slate-200 text-slate-500"}`}>
          <Flame size={14} />
        </div>
        <span>Heat Map</span>
      </motion.button>
    </div>
  );
}
