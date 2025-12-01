"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MapOverlay } from "./MapLayerControl";

interface MapLegendProps {
  activeOverlays: MapOverlay[];
}

export default function MapLegend({ activeOverlays }: MapLegendProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (activeOverlays.length === 0) return null;

  const legends: Record<MapOverlay, { title: string; items: Array<{ color: string; label: string }> }> = {
    wards: {
      title: "Ward Boundaries",
      items: [
        { color: "#3b82f6", label: "Ward boundary lines" },
        { color: "#3b82f620", label: "Ward area fill" },
      ],
    },
    population: {
      title: "Population Density",
      items: [
        { color: "#7f1d1d", label: "Very High (>10k/km²)" },
        { color: "#dc2626", label: "High (5k-10k/km²)" },
        { color: "#f97316", label: "Medium (2k-5k/km²)" },
        { color: "#fbbf24", label: "Low (1k-2k/km²)" },
        { color: "#86efac", label: "Very Low (<1k/km²)" },
      ],
    },
    infrastructure: {
      title: "Infrastructure",
      items: [
        { color: "#64748b", label: "🛣️ Roads" },
        { color: "#0ea5e9", label: "💧 Water lines" },
        { color: "#eab308", label: "⚡ Power lines" },
        { color: "#84cc16", label: "🚰 Sewer lines" },
      ],
    },
    historical: {
      title: "Historical Complaints",
      items: [
        { color: "#ef4444", label: "Unresolved (fading with age)" },
        { color: "#10b981", label: "Resolved (fading with age)" },
        { color: "transparent", label: "Larger = Older complaint" },
      ],
    },
    weather: {
      title: "Weather Info",
      items: [
        { color: "#3b82f6", label: "Current temperature" },
        { color: "#6b7280", label: "Weather conditions" },
        { color: "#9ca3af", label: "Humidity & wind speed" },
      ],
    },
    traffic: {
      title: "Traffic Status",
      items: [
        { color: "#ef4444", label: "Heavy traffic" },
        { color: "#f59e0b", label: "Medium traffic" },
        { color: "#10b981", label: "Light traffic" },
      ],
    },
  };

  return (
    <div className="absolute bottom-4 left-4 z-[1000]">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow-lg transition-all ${
          isOpen
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Map Legend"
      >
        <Info size={18} />
        <span className="text-sm">Legend</span>
      </motion.button>

      {/* Legend Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden max-h-96 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 p-4 flex justify-between items-center z-10">
              <h3 className="font-bold text-gray-900">Map Legend</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Legend Items */}
            <div className="p-4 space-y-4">
              {activeOverlays.map((overlay) => {
                const legend = legends[overlay];
                if (!legend) return null;

                return (
                  <div key={overlay} className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-700">{legend.title}</h4>
                    <div className="space-y-1.5">
                      {legend.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-6 h-3 rounded border border-gray-300"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs text-gray-600">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-3 bg-gray-50/50">
              <p className="text-xs text-gray-500 text-center">
                {activeOverlays.length} overlay{activeOverlays.length !== 1 ? 's' : ''} active
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
