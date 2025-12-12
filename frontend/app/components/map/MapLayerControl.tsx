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
    <div className="relative">
      {/* Toggle Button - trigger for dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 transition-colors ${isOpen ? "bg-slate-50" : "hover:bg-slate-50"
          }`}
        title="Map Layers & Overlays"
      >
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">Layers</span>
        </div>
        {activeOverlays.length > 0 && (
          <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[10px] rounded-full font-bold">
            {activeOverlays.length}
          </span>
        )}
      </button>

      {/* Layer Control Panel - Dropdown from side/bottom */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-3 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-[1000]"
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("layers")}
                className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "layers"
                  ? "bg-slate-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:bg-slate-50"
                  }`}
              >
                Base Map
              </button>
              <button
                onClick={() => setActiveTab("overlays")}
                className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === "overlays"
                  ? "bg-slate-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:bg-slate-50"
                  }`}
              >
                Data Layers
                {activeOverlays.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
              {activeTab === "layers" ? (
                <div className="p-2 space-y-1">
                  {baseLayerOptions.map((layer) => {
                    const Icon = layer.icon;
                    const isActive = currentLayer === layer.id;

                    return (
                      <button
                        key={layer.id}
                        onClick={() => {
                          onLayerChange(layer.id);
                          // Keep open to allow easier switching
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all border ${isActive
                          ? "bg-white border-blue-500 shadow-sm"
                          : "bg-transparent border-transparent hover:bg-white hover:shadow-sm"
                          }`}
                      >
                        <div
                          className={`p-1.5 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"
                            }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`text-sm font-bold ${isActive ? "text-blue-700" : "text-slate-700"}`}>
                            {layer.name}
                          </div>
                          <div className="text-[10px] text-slate-500 leading-tight">
                            {layer.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {overlayOptions.map((overlay) => {
                    const Icon = overlay.icon;
                    const isActive = activeOverlays.includes(overlay.id);

                    return (
                      <button
                        key={overlay.id}
                        onClick={() => onOverlayToggle(overlay.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all border ${isActive
                          ? "bg-white border-blue-500 shadow-sm"
                          : "bg-transparent border-transparent hover:bg-white hover:shadow-sm"
                          }`}
                      >
                        <div
                          className={`p-1.5 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"
                            }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`text-sm font-bold ${isActive ? "text-blue-700" : "text-slate-700"}`}>
                            {overlay.name}
                          </div>
                          <div className="text-[10px] text-slate-500 leading-tight">
                            {overlay.description}
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-blue-500 border-blue-600' : 'bg-white border-slate-300'}`}>
                          {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
