"use client";

import { Layers, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface MapEnhancementsProps {
  onClusteringToggle: (enabled: boolean) => void;
  onHeatmapToggle: (enabled: boolean) => void;
  clusteringEnabled: boolean;
  heatmapEnabled: boolean;
  onPrintMap?: () => void;
  compact?: boolean;
}

export default function MapEnhancements({
  onClusteringToggle,
  onHeatmapToggle,
  clusteringEnabled,
  heatmapEnabled,
  compact = false,
}: MapEnhancementsProps) {
  return (
    <div
      className={`flex flex-col gap-1 ${
        compact ? "" : "absolute top-20 right-4 z-[1000]"
      }`}
    >
      {/* Clustering Toggle */}
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        onClick={() => onClusteringToggle(!clusteringEnabled)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md font-bold text-xs transition-all w-full justify-start min-h-[40px] ${
          clusteringEnabled
            ? "bg-blue-100 text-blue-700"
            : "bg-transparent text-slate-600 hover:bg-slate-50"
        }`}
        title="Toggle marker clustering"
      >
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 ${
            clusteringEnabled
              ? "bg-blue-600 text-white"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          <Layers size={14} />
        </div>
        <span className="leading-none whitespace-nowrap">Clustering</span>
      </motion.button>

      {/* Heatmap Toggle */}
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        onClick={() => onHeatmapToggle(!heatmapEnabled)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md font-bold text-xs transition-all w-full justify-start min-h-[40px] ${
          heatmapEnabled
            ? "bg-red-100 text-red-700"
            : "bg-transparent text-slate-600 hover:bg-slate-50"
        }`}
        title="Toggle heat map"
      >
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 ${
            heatmapEnabled
              ? "bg-red-600 text-white"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          <Flame size={14} />
        </div>
        <span className="leading-none whitespace-nowrap">Heat Map</span>
      </motion.button>
    </div>
  );
}
