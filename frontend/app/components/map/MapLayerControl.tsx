"use client";

import { useState } from "react";
import { Layers, Map as MapIcon, Satellite, Mountain, Moon, Sun, Grid3x3, Users, Droplets, Zap, History, Cloud, Car } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type MapLayer = 
  | "osm" 
  | "satellite" 
  | "terrain" 
  | "dark" 
  | "light"
  | "topo";

export type MapOverlay = 
  | "wards" 
  | "population" 
  | "infrastructure" 
  | "historical" 
  | "weather" 
  | "traffic";

interface MapLayerControlProps {
  currentLayer: MapLayer;
  onLayerChange: (layer: MapLayer) => void;
  activeOverlays: MapOverlay[];
  onOverlayToggle: (overlay: MapOverlay) => void;
}

const baseLayerOptions = [
  { id: "osm" as MapLayer, name: "Street Map", icon: MapIcon, description: "Standard street view" },
  { id: "satellite" as MapLayer, name: "Satellite", icon: Satellite, description: "Aerial imagery" },
  { id: "terrain" as MapLayer, name: "Terrain", icon: Mountain, description: "Topographic view" },
  { id: "dark" as MapLayer, name: "Dark Mode", icon: Moon, description: "Dark theme map" },
  { id: "light" as MapLayer, name: "Light", icon: Sun, description: "Minimal light theme" },
  { id: "topo" as MapLayer, name: "Topographic", icon: Grid3x3, description: "Detailed topo map" },
];

const overlayOptions = [
  { id: "wards" as MapOverlay, name: "Ward Boundaries", icon: Grid3x3, color: "blue", description: "Administrative boundaries" },
  { id: "population" as MapOverlay, name: "Population Density", icon: Users, color: "purple", description: "Population heatmap" },
  { id: "infrastructure" as MapOverlay, name: "Infrastructure", icon: Zap, color: "yellow", description: "Roads, water, power lines" },
  { id: "historical" as MapOverlay, name: "Historical Data", icon: History, color: "gray", description: "Past complaints" },
  { id: "weather" as MapOverlay, name: "Weather", icon: Cloud, color: "cyan", description: "Current weather" },
  { id: "traffic" as MapOverlay, name: "Traffic", icon: Car, color: "red", description: "Live traffic data" },
];

export default function MapLayerControl({
  currentLayer,
  onLayerChange,
  activeOverlays,
  onOverlayToggle,
}: MapLayerControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"layers" | "overlays">("layers");

  return (
    <div className="absolute bottom-24 right-4 z-[1000]">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-lg transition-all ${
          isOpen
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Map Layers & Overlays"
      >
        <Layers size={20} />
        <span className="text-sm">Layers</span>
        {activeOverlays.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
            {activeOverlays.length}
          </span>
        )}
      </motion.button>

      {/* Layer Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("layers")}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
                  activeTab === "layers"
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Base Layers
              </button>
              <button
                onClick={() => setActiveTab("overlays")}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition-all relative ${
                  activeTab === "overlays"
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Overlays
                {activeOverlays.length > 0 && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                    {activeOverlays.length}
                  </span>
                )}
              </button>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {activeTab === "layers" ? (
                <div className="p-3 space-y-2">
                  <p className="text-xs text-gray-500 px-2 mb-2">
                    Choose your map style
                  </p>
                  {baseLayerOptions.map((layer) => {
                    const Icon = layer.icon;
                    const isActive = currentLayer === layer.id;
                    
                    return (
                      <motion.button
                        key={layer.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onLayerChange(layer.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-blue-50 border-2 border-blue-500 shadow-md"
                            : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isActive ? "bg-blue-500 text-white" : "bg-white text-gray-600"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`text-sm font-semibold ${isActive ? "text-blue-700" : "text-gray-800"}`}>
                            {layer.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {layer.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  <p className="text-xs text-gray-500 px-2 mb-2">
                    Toggle data overlays (multiple allowed)
                  </p>
                  {overlayOptions.map((overlay) => {
                    const Icon = overlay.icon;
                    const isActive = activeOverlays.includes(overlay.id);
                    
                    return (
                      <motion.button
                        key={overlay.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onOverlayToggle(overlay.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          isActive
                            ? `bg-${overlay.color}-50 border-2 border-${overlay.color}-500 shadow-md`
                            : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isActive 
                              ? `bg-${overlay.color}-500 text-white` 
                              : "bg-white text-gray-600"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`text-sm font-semibold ${
                            isActive ? `text-${overlay.color}-700` : "text-gray-800"
                          }`}>
                            {overlay.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {overlay.description}
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => {}}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-3 bg-gray-50/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {activeTab === "layers" 
                    ? "1 layer active" 
                    : `${activeOverlays.length} overlay${activeOverlays.length !== 1 ? 's' : ''} active`
                  }
                </span>
                {activeTab === "overlays" && activeOverlays.length > 0 && (
                  <button
                    onClick={() => activeOverlays.forEach(overlay => onOverlayToggle(overlay))}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
