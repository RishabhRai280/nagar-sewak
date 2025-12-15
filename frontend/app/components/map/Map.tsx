// app/components/map/Map.tsx
"use client";

import {
  useEffect,
  useMemo,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
  GeoJSON,
} from "react-leaflet";
import L, { ZoomPanOptions } from "leaflet";
import { ComplaintData, ProjectData, buildAssetUrl } from "@/lib/api/api";
import {
  AlertTriangle,
  CheckCircle,
  X,
  Star,
  DollarSign,
  Search,
  ArrowDownNarrowWide,
  ClipboardList,
  ArrowRight,
  Filter,
  MapPin,
  Maximize2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LoadingState from "./LoadingState";
import ShareBar from "../shared/ShareBar";
import { useTranslations } from "next-intl";
import "../../map-enhancements.css";

// Define combined type for map markers
type MarkerItem =
  | (ComplaintData & { kind: "complaint" })
  | (ProjectData & { kind: "project" });

const DEFAULT_CENTER: [number, number] = [21.1458, 79.0882]; // Central India
const PROJECT_DETAILS_PATH = "/projects";

// --- Marker Icon Utilities ---

function createDivIcon(color: string, type: "project" | "complaint", status: string) {
  const isProject = type === "project";
  const isResolved = status?.toLowerCase() === "resolved" || status?.toLowerCase() === "completed";
  const isPending = status?.toLowerCase() === "pending";

  // Official Government Colors
  let borderColor = "#cbd5e1"; // Slate 300
  let ringColor = "#f8fafc"; // White ring
  let iconColor = "#475569"; // Slate 600
  let bgColor = "white";

  if (isProject) {
     borderColor = "#2563eb"; // Blue border
     iconColor = "#2563eb";
     if (isResolved) { borderColor = "#059669"; iconColor = "#059669"; } // Green if completed
  } else {
     // Complaint
     borderColor = "#dc2626"; // Red border
     iconColor = "#dc2626";
     if (isResolved) { borderColor = "#059669"; iconColor = "#059669"; } // Green if resolved
     if (!isResolved && !isPending) { borderColor = "#d97706"; iconColor = "#d97706"; } // Amber if in progress
  }

  // Icons based on state
  const iconSvg = isProject
    ? isResolved 
       ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"></polyline></svg>`
       : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>`
    : isResolved
       ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"></polyline></svg>`
       : isPending
          ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line><circle cx="12" cy="12" r="10"></circle></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;

  const markerHtml = `
    <div class="relative group cursor-pointer" style="width: 40px; height: 40px;">
        <!-- Pulsing Effect for Pending items -->
        ${isPending ? `<div class="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>` : ''}
        
        <!-- Main Circle Seal -->
        <div class="absolute inset-0 rounded-full bg-white shadow-md flex items-center justify-center border-[3px]" style="border-color: ${borderColor};">
            <!-- Inner Dot/Icon -->
             ${iconSvg}
        </div>
        
        <!-- Tiny Bottom Triangle to make it a 'pin' feel but subtle -->
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]" style="border-t-color: ${borderColor};"></div>
    </div>
  `;

  return L.divIcon({
    html: markerHtml,
    className: "custom-marker-wrapper",
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
  });
}

// --- Map Content Component ---

// LocationSearch is now integrated into the sidebar
import MarkerClusterGroup from "./MarkerClusterGroup";
import HeatMapLayer from "./HeatMapLayer";
import MapEnhancements from "./MapEnhancements";
import MapLayerControl, { MapLayer, MapOverlay } from "./MapLayerControl";
import MapLayerProvider from "./MapLayerProvider";
import MapLegend from "./MapLegend";
import {
  sampleWardBoundaries,
  samplePopulationData,
  sampleInfrastructureData,
} from "@/lib/data/sampleWardData";

// --- Map Content Component ---

function MapContent({
  items,
  selectedItem,
  setSelectedItem,
  center,
  locationTarget,
  currentLayer,
  setCurrentLayer,
  activeOverlays,
  setActiveOverlays,
}: {
  items: MarkerItem[];
  selectedItem: MarkerItem | null;
  setSelectedItem: (item: MarkerItem | null) => void;
  center: [number, number];
  locationTarget: { lat: number; lng: number; zoom: number } | null;
  currentLayer: MapLayer;
  setCurrentLayer: (layer: MapLayer) => void;
  activeOverlays: MapOverlay[];
  setActiveOverlays: (overlays: MapOverlay[] | ((prev: MapOverlay[]) => MapOverlay[])) => void;
}) {
  const [targetLocation, setTargetLocation] = useState<{
    lat: number;
    lng: number;
    zoom: number;
  } | null>(null);
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [clusteringEnabled, setClusteringEnabled] = useState(true);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);

  // Update target location when locationTarget prop changes
  useEffect(() => {
    if (locationTarget) {
      setTargetLocation(locationTarget);
    }
  }, [locationTarget]);

  const handleLocationSelect = (
    lat: number,
    lng: number,
    zoom: number = 13,
    geojson?: any
  ) => {
    setTargetLocation({ lat, lng, zoom });
    setBoundaryData(geojson);
    setSelectedItem(null); // Clear item selection when searching for a place
  };

  const handleOverlayToggle = (overlay: MapOverlay) => {
    setActiveOverlays((prev) =>
      prev.includes(overlay)
        ? prev.filter((o) => o !== overlay)
        : [...prev, overlay]
    );
  };

  const t = useTranslations("map");

  // Memoize markers to prevent unnecessary re-renders
  const markers = useMemo(() => items, [items]);

  return (
    <div className="relative w-full h-full z-0 rounded-none lg:rounded-l-3xl overflow-hidden shadow-2xl border-l border-slate-200 bg-white">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        className="z-0"
      >
        {/* Floating Map Tools (Layers & Enhancements) */}
        {/* Map Enhancement Controls - Top Left (Right of Sidebar) */}
        <div className="absolute top-4 left-4 z-[900]">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-1.5 flex flex-col gap-1">
            <MapEnhancements
              clusteringEnabled={clusteringEnabled}
              heatmapEnabled={heatmapEnabled}
              onClusteringToggle={setClusteringEnabled}
              onHeatmapToggle={setHeatmapEnabled}
              compact={true}
            />
          </div>
        </div>

        {/* Map Layer Control - Bottom Left (Right of Sidebar) */}
        <div className="absolute bottom-6 left-4 z-[900]">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-visible">
            <MapLayerControl
              currentLayer={currentLayer}
              onLayerChange={setCurrentLayer}
              activeOverlays={activeOverlays}
              onOverlayToggle={handleOverlayToggle}
            />
          </div>
        </div>

        {/* Map Layer Provider - Handles base layers and overlays */}
        <MapLayerProvider
          layer={currentLayer}
          activeOverlays={activeOverlays}
          wardBoundaries={sampleWardBoundaries}
          populationData={samplePopulationData}
          infrastructureData={sampleInfrastructureData}
          complaints={items
            .filter((item) => item.kind === "complaint")
            .map((item) => ({
              lat: (item as any).lat,
              lng: (item as any).lng,
              status: (item as any).status,
              createdAt: (item as any).createdAt || new Date().toISOString(),
            }))}
          projects={items
            .filter((item) => item.kind === "project")
            .map((item) => ({
              lat: (item as any).lat,
              lng: (item as any).lng,
              status: (item as any).status,
            }))}
        />

        {/* Render Boundary if available */}
        {boundaryData && (
          <GeoJSON
            key={JSON.stringify(boundaryData)}
            data={boundaryData}
            style={{
              color: "#3b82f6",
              weight: 2,
              opacity: 0.6,
              fillColor: "#3b82f6",
              fillOpacity: 0.1,
            }}
          />
        )}

        <RecenterAndView item={selectedItem} initialCenter={center} />
        <FlyToLocation target={targetLocation} />

        {/* Clustering or Regular Markers */}
        {clusteringEnabled ? (
          <MarkerClusterGroup
            markers={
              markers
                .map((it) => {
                  const lat = (it as any).lat;
                  const lng = (it as any).lng;
                  if (typeof lat !== "number" || typeof lng !== "number")
                    return null;

                  let color = "#3b82f6";
                  if (it.kind === "project") {
                    color =
                      (it as ProjectData).status?.toLowerCase() === "completed"
                        ? "#10b981"
                        : "#3b82f6";
                  } else {
                    const s = (it as ComplaintData).status?.toLowerCase();
                    if (s === "pending") color = "#ef4444";
                    else if (s === "resolved") color = "#10b981";
                    else color = "#f59e0b";
                  }

                  const icon = createDivIcon(
                    color,
                    it.kind === "project" ? "project" : "complaint",
                    (it as any).status
                  );
                  const position: [number, number] = [lat, lng];

                  return {
                    position,
                    icon,
                    popup: `<div class="p-1"><strong class="text-sm block mb-1 font-bold text-slate-800">${it.kind === "complaint" ? "Complaint" : "Project"
                      }</strong><span class="text-sm text-slate-600">${it.title
                      }</span></div>`,
                    onClick: () => {
                      setSelectedItem(it);
                    },
                  };
                })
                .filter(Boolean) as any
            }
          />
        ) : (
          markers.map((it) => {
            const lat = (it as any).lat;
            const lng = (it as any).lng;
            if (typeof lat !== "number" || typeof lng !== "number") return null;

            let color = "#3b82f6"; // Default blue
            if (it.kind === "project") {
              color =
                (it as ProjectData).status?.toLowerCase() === "completed"
                  ? "#10b981" // Emerald
                  : "#3b82f6"; // Blue
            } else {
              const s = (it as ComplaintData).status?.toLowerCase();
              if (s === "pending") color = "#ef4444"; // Red
              else if (s === "resolved") color = "#10b981"; // Emerald
              else color = "#f59e0b"; // Amber/Orange
            }

            const icon = createDivIcon(
              color,
              it.kind === "project" ? "project" : "complaint",
              (it as any).status
            );

            // Create stable position array to prevent re-renders
            const position: [number, number] = [lat, lng];

            return (
              <Marker
                key={`${it.kind}-${it.id}`}
                position={position}
                icon={icon as any}
                draggable={false}
                autoPan={false}
                bubblingMouseEvents={false}
                eventHandlers={{
                  click: (e) => {
                    // Prevent default behavior and stop propagation
                    if (e.originalEvent) {
                      L.DomEvent.stopPropagation(e.originalEvent);
                      L.DomEvent.preventDefault(e.originalEvent);
                    }
                    setSelectedItem(it);
                  },
                }}
              >
                <Popup
                  className="solid-popup"
                  closeButton={false}
                  autoClose={false}
                >
                  <div className="p-1">
                    <strong className="text-sm block mb-1 font-bold text-slate-800">
                      {it.kind === "complaint" ? t("complaint") : t("project")}
                    </strong>
                    <span className="text-sm text-slate-600">{it.title}</span>
                  </div>
                </Popup>
              </Marker>
            );
          })
        )}

        {/* Heat Map Layer */}
        {heatmapEnabled && (
          <HeatMapLayer
            points={markers
              .filter((it) => it.kind === "complaint")
              .map((it) => ({
                lat: (it as any).lat,
                lng: (it as any).lng,
                intensity: (it as ComplaintData).severity / 5,
              }))
              .filter(
                (p) => typeof p.lat === "number" && typeof p.lng === "number"
              )}
            options={{
              radius: 30,
              blur: 20,
              maxZoom: 15,
              gradient: {
                0.0: "blue",
                0.3: "cyan",
                0.5: "lime",
                0.7: "yellow",
                1.0: "red",
              },
            }}
          />
        )}
      </MapContainer>

      {/* Map Enhancement Controls - Moved to Floating Dock (see above) */}

      {/* Map Legend */}
      <MapLegend activeOverlays={activeOverlays} />

      {/* Map Overlay Gradient for better integration */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_10px_0_30px_rgba(0,0,0,0.1)] z-[400]"></div>
    </div>
  );
}

// Custom hook to handle map centering - FIXED: Don't move map on marker click
function RecenterAndView({
  item,
  initialCenter,
}: {
  item: MarkerItem | null;
  initialCenter: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    // Only center map if item is selected AND map is not already showing that location
    if (
      item &&
      typeof (item as any).lat === "number" &&
      typeof (item as any).lng === "number"
    ) {
      const position: [number, number] = [(item as any).lat, (item as any).lng];
      const currentCenter = map.getCenter();
      const distance = map.distance(currentCenter, position);

      // Only move map if marker is far from current view (more than 500 meters)
      if (distance > 500) {
        const options: ZoomPanOptions = {
          animate: true,
          duration: 0.8,
        };
        map.flyTo(position, map.getZoom() > 13 ? map.getZoom() : 13, options);
      }
    }
  }, [item, map]);

  return null;
}

function FlyToLocation({
  target,
}: {
  target: { lat: number; lng: number; zoom: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], target.zoom, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [target, map]);

  return null;
}

// --- Sidebar Display Components ---

// --- Floating Bottom Right Panel ---

function FloatingDetailsPanel({
  item,
  clearSelection,
}: {
  item: MarkerItem;
  clearSelection: () => void;
}) {
  const isComplaint = item.kind === "complaint";
  const data = item as any;
  const t = useTranslations("map");
  const mediaItems = (data.photoUrls && data.photoUrls.length ? data.photoUrls : data.photoUrl ? [data.photoUrl] : []) as string[];
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  // Determine date to show
  const displayDate = data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  // Official Status Colors
  const getStatusColor = (s: string) => {
    const status = s?.toLowerCase();
    if (status === 'resolved' || status === 'completed') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (status === 'pending') return 'text-red-700 bg-red-50 border-red-200';
    if (status === 'in_progress') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute top-4 right-4 w-[26rem] bottom-6 flex flex-col bg-white rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-300 z-[1000] overflow-hidden font-sans"
    >
      {/* --- Official Case Header --- */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-start">
         <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {isComplaint ? "Case File #CMP-" : "Project File #PRJ-"}{data.id}
               </span>
               <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border rounded-full ${getStatusColor(data.status)}`}>
                  {data.status?.replace('_', ' ')}
               </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">{data.title}</h2>
         </div>
         <button onClick={clearSelection} className="text-slate-400 hover:text-slate-700 transition">
            <X size={20} />
         </button>
      </div>

      {/* --- Body --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-white">
      
         {/* Media Viewer - If exists */}
         {mediaItems.length > 0 && (
          <div className="border-b border-slate-200">
            {/* Main Media Display */}
            <div className="w-full h-56 bg-slate-100 flex items-center justify-center relative group">
               {isVideo(mediaItems[selectedMediaIndex]) ? (
                   <video src={buildAssetUrl(mediaItems[selectedMediaIndex]) ?? mediaItems[selectedMediaIndex]} className="w-full h-full object-contain" controls />
               ) : (
                   <img 
                     src={buildAssetUrl(mediaItems[selectedMediaIndex]) ?? mediaItems[selectedMediaIndex]} 
                     className="w-full h-full object-cover" 
                     alt="Evidence" 
                   />
               )}
               <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-medium">
                  Evidence Record {mediaItems.length > 1 ? `(${selectedMediaIndex + 1}/${mediaItems.length})` : ''}
               </div>
            </div>
            
            {/* Thumbnail Strip - Show if multiple media */}
            {mediaItems.length > 1 && (
              <div className="p-3 bg-slate-50">
                <div className="flex gap-2 overflow-x-auto">
                  {mediaItems.slice(0, 6).map((media, index) => {
                    const isVideoThumb = isVideo(media);
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedMediaIndex(index)}
                        className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden bg-white transition-colors ${
                          selectedMediaIndex === index 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        {isVideoThumb ? (
                          <video src={buildAssetUrl(media) ?? media} className="w-full h-full object-cover" />
                        ) : (
                          <img 
                            src={buildAssetUrl(media) ?? media} 
                            className="w-full h-full object-cover" 
                            alt={`Evidence ${index + 1}`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://placehold.co/100/e2e8f0/64748b?text=${index + 1}`;
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                  {mediaItems.length > 6 && (
                    <div className="flex-shrink-0 w-12 h-12 rounded border-2 border-slate-200 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      +{mediaItems.length - 6}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {mediaItems.length} evidence file{mediaItems.length > 1 ? 's' : ''} • Click thumbnails to view
                </p>
              </div>
            )}
          </div>
         )}
      
         <div className="p-5 space-y-6">
            
            {/* Details Table */}
            <div>
               <h3 className="text-xs font-bold text-slate-900 uppercase border-b-2 border-slate-100 pb-2 mb-3">Case Particulars</h3>
               <div className="space-y-0 text-sm">
                  <div className="grid grid-cols-3 py-2 border-b border-slate-50">
                     <span className="text-slate-500 font-medium">Date Filed</span>
                     <span className="col-span-2 text-slate-900 font-semibold">{displayDate}</span>
                  </div>
                  {isComplaint && (
                    <div className="grid grid-cols-3 py-2 border-b border-slate-50">
                       <span className="text-slate-500 font-medium">Severity</span>
                       <span className="col-span-2 text-slate-900 font-semibold flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${data.severity >= 4 ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                          {data.severity}/5 (Official Assessment)
                       </span>
                    </div>
                  )}
                  {!isComplaint && data.budget && (
                    <div className="grid grid-cols-3 py-2 border-b border-slate-50">
                       <span className="text-slate-500 font-medium">Allocated Budget</span>
                       <span className="col-span-2 text-slate-900 font-semibold">₹{(data.budget).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 py-2 border-b border-slate-50">
                     <span className="text-slate-500 font-medium">Location</span>
                     <span className="col-span-2 text-slate-900 font-mono text-xs pt-0.5">
                        {data.lat?.toFixed(6)}, {data.lng?.toFixed(6)}
                     </span>
                  </div>
               </div>
            </div>

            {/* Description as 'Report' */}
            <div>
               <h3 className="text-xs font-bold text-slate-900 uppercase border-b-2 border-slate-100 pb-2 mb-3">Field Report</h3>
               <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100 italic">
                  "{data.description || t("noDescription")}"
               </p>
            </div>
         </div>
      </div>

      {/* --- Footer / Actions --- */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
         <Link
            href={isComplaint ? `/complaints/${data.id}` : `${PROJECT_DETAILS_PATH}/${data.id}`}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded shadow-sm text-center transition"
         >
            Access Full Record
         </Link>
         <button className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-bold rounded shadow-sm transition">
            Print / Export
         </button>
      </div>

    </motion.div>
  );
}

// --- Item Listing Component ---

function ItemListing({
  items,
  setSelectedItem,
}: {
  items: MarkerItem[];
  setSelectedItem: (item: MarkerItem) => void;
}) {
  const t = useTranslations("map");

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Search className="text-slate-400" size={24} />
        </div>
        <p className="text-slate-500 font-medium">{t("noItemsMatch")}</p>
        <p className="text-sm text-slate-400 mt-1">{t("adjustFilters")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-5 pt-2 pb-24 lg:pb-6">
      {items.map((item) => {
        const isComplaint = item.kind === "complaint";
        const data = item as any;

        const statusColor =
          data.status?.toLowerCase() === "resolved" ||
            data.status?.toLowerCase() === "completed"
            ? "text-[#166534] bg-emerald-50 border-emerald-100"
            : data.status?.toLowerCase() === "pending"
              ? "text-red-600 bg-red-50 border-red-100"
              : "text-amber-700 bg-amber-50 border-amber-100";

        const borderColor = isComplaint ? "border-l-red-500" : "border-l-blue-500";

        return (
          <motion.div
            key={`${item.kind}-${item.id}`}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className={`bg-white p-4 rounded-xl border border-slate-200 border-l-4 ${borderColor} cursor-pointer shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 group`}
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${statusColor}`}
              >
                {data.status || (isComplaint ? t("pending") : t("inProgress"))}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                {isComplaint ? <AlertTriangle size={10} /> : <ClipboardList size={10} />}
                {isComplaint ? "Complaint" : "Project"}
              </span>
            </div>
            <h4 className="font-bold text-slate-800 text-base leading-tight group-hover:text-blue-700 transition-colors">
              {data.title}
            </h4>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <MapPin size={12} className="text-slate-400" />
              <span className="truncate">{data.description ? data.description.substring(0, 30) + (data.description.length > 30 ? "..." : "") : "Location details available"}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// --- Main Component ---

interface MapProps {
  items: MarkerItem[];
  loading: boolean;
  error: string | null;
  selectedItem: MarkerItem | null;
  setSelectedItem: (item: MarkerItem | null) => void;
  setItems: (items: MarkerItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  showComplaints: boolean;
  setShowComplaints: (show: boolean) => void;
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
  statusFilter: "all" | "pending" | "in_progress" | "resolved";
  setStatusFilter: (filter: "all" | "pending" | "in_progress" | "resolved") => void;
  severityMin: number;
  setSeverityMin: (min: number) => void;
  search: string;
  setSearch: (search: string) => void;
  filtered: MarkerItem[];
  autoSelectProcessed: boolean;
}

export default function Map({
  items,
  loading,
  error,
  selectedItem,
  setSelectedItem,
  setItems,
  setLoading,
  setError,
  showComplaints,
  setShowComplaints,
  showProjects,
  setShowProjects,
  statusFilter,
  setStatusFilter,
  severityMin,
  setSeverityMin,
  search,
  setSearch,
  filtered,
  autoSelectProcessed,
}: MapProps) {
  const [currentLayer, setCurrentLayer] = useState<MapLayer>("osm");
  const [activeOverlays, setActiveOverlays] = useState<MapOverlay[]>([]);

  // Persist layer & overlays so remounts don't reset selection
  useEffect(() => {
    const savedLayer = typeof window !== "undefined" ? localStorage.getItem("ns:map:layer") : null;
    const savedOverlays = typeof window !== "undefined" ? localStorage.getItem("ns:map:overlays") : null;
    if (savedLayer && (["osm", "satellite", "terrain", "dark", "light", "topo"] as MapLayer[]).includes(savedLayer as MapLayer)) {
      setCurrentLayer(savedLayer as MapLayer);
    }
    if (savedOverlays) {
      try {
        const parsed = JSON.parse(savedOverlays);
        if (Array.isArray(parsed)) setActiveOverlays(parsed);
      } catch { }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("ns:map:layer", currentLayer);
    localStorage.setItem("ns:map:overlays", JSON.stringify(activeOverlays));
  }, [currentLayer, activeOverlays]);

  const t = useTranslations("map");

  const [sortBy, setSortBy] = useState<"severity_desc" | "title_asc">(
    "severity_desc"
  );
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Mobile specific filter states
  const [mobileStatusFilter, setMobileStatusFilter] = useState(statusFilter);
  const [mobileSeverityMin, setMobileSeverityMin] = useState(severityMin);

  // Unified search states
  const [searchMode, setSearchMode] = useState<"filter" | "location">("filter");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationResults, setShowLocationResults] = useState(false);
  const [locationTarget, setLocationTarget] = useState<{
    lat: number;
    lng: number;
    zoom: number;
  } | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const applyMobileFilters = () => {
    setStatusFilter(mobileStatusFilter);
    setSeverityMin(mobileSeverityMin);
    setShowFilterPanel(false);
    setSelectedItem(null);
  };

  // Location search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchMode === "location" && locationQuery.length > 2) {
        searchLocation(locationQuery);
      } else {
        setLocationResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locationQuery, searchMode]);

  // Close location results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowLocationResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocation = async (q: string) => {
    setLocationLoading(true);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setLocationResults(data);
      setShowLocationResults(true);
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);

  useEffect(() => {
    const firstWithCoords = filtered.find(
      (f: any) => typeof f.lat === "number" && typeof f.lng === "number"
    );
    if (firstWithCoords) {
      setMapCenter([firstWithCoords.lat, firstWithCoords.lng]);
    }
    // If filtered becomes empty, keep last known center to avoid jump to default
  }, [filtered]);

  // Auto-center on selected item when coming from URL parameters
  useEffect(() => {
    if (autoSelectProcessed && selectedItem && selectedItem.lat && selectedItem.lng) {
      // Set location target to center on the selected item
      setLocationTarget({
        lat: selectedItem.lat,
        lng: selectedItem.lng,
        zoom: 16
      });
    }
  }, [selectedItem, autoSelectProcessed]);

  const handleLocationSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    // Determine zoom level based on type
    let zoom = 13;
    if (result.type === "city" || result.type === "administrative") zoom = 12;
    if (result.type === "state") zoom = 7;
    if (result.type === "country") zoom = 5;

    // Set location target to fly map to the selected location
    setLocationTarget({ lat, lng, zoom });

    setLocationQuery(result.display_name.split(",")[0]);
    setShowLocationResults(false);
    setLocationResults([]);

    // Switch back to filter mode after a short delay
    setTimeout(() => {
      setSearchMode("filter");
      setLocationQuery("");
    }, 1000);

    setSelectedItem(null);
  };

  const sortedItems = useMemo(() => {
    let sorted = [...filtered];
    if (sortBy === "severity_desc") {
      sorted.sort((a, b) => {
        if (a.kind === "complaint" && b.kind === "complaint") {
          return (b.severity || 0) - (a.severity || 0);
        }
        if (a.kind === "complaint" && b.kind === "project") return -1;
        if (a.kind === "project" && b.kind === "complaint") return 1;
        return 0;
      });
    } else if (sortBy === "title_asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [filtered, sortBy]);

  const center: [number, number] = mapCenter;

  const handleResetFilters = () => {
    setShowComplaints(true);
    setShowProjects(true);
    setStatusFilter("all");
    setSeverityMin(1);
    setSearch("");
    setSelectedItem(null);
    setSortBy("severity_desc");
    setMobileStatusFilter("all");
    setMobileSeverityMin(1);
  };

  // --- Sidebar Header - Solid STICKY & Enhanced ---
  const SidebarHeader = (
    <div className="p-5 space-y-5 border-b border-slate-200 flex-shrink-0 bg-white z-20 sticky top-0 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {t("civicData")}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {filtered.length} active items in current view
          </p>
        </div>

        {/* Sort Dropdown - Minimalist */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-slate-100 transition"
          >
            <option value="severity_desc">{t("sortBySeverity")}</option>
            <option value="title_asc">{t("sortByName")}</option>
          </select>
          <ArrowDownNarrowWide size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Segmented Control for Search Mode */}
      <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1">
        <button
          onClick={() => {
            setSearchMode("filter");
            setLocationQuery("");
            setShowLocationResults(false);
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${searchMode === "filter"
            ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
        >
          <Filter size={14} /> Filter Items
        </button>
        <button
          onClick={() => {
            setSearchMode("location");
            setSearch("");
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${searchMode === "location"
            ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
        >
          <MapPin size={14} /> Find Location
        </button>
      </div>

      {/* Unified Search Input */}
      <div ref={searchRef} className="relative group">
        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
          {searchMode === "location" && locationLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Search size={18} />
          )}
        </div>
        <input
          type="search"
          value={searchMode === "filter" ? search : locationQuery}
          onChange={(e) => {
            if (searchMode === "filter") {
              setSearch(e.target.value);
              setSelectedItem(null);
            } else {
              setLocationQuery(e.target.value);
              if (e.target.value.length > 0) setShowLocationResults(true);
            }
          }}
          onFocus={() => {
            if (searchMode === "location" && locationResults.length > 0) {
              setShowLocationResults(true);
            }
          }}
          placeholder={
            searchMode === "filter"
              ? "Search complaints & projects..."
              : "Search area, city, or state..."
          }
          className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 
             rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 
             focus:border-blue-500 transition-all duration-200 
             placeholder-slate-400 focus:bg-white text-slate-900"
        />
        {((searchMode === "filter" && search) ||
          (searchMode === "location" && locationQuery)) && (
            <button
              onClick={() => {
                if (searchMode === "filter") {
                  setSearch("");
                } else {
                  setLocationQuery("");
                  setLocationResults([]);
                  setShowLocationResults(false);
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-500 p-1 transition-colors"
            >
              <X size={16} />
            </button>
          )}

        {/* Location Search Results Dropdown */}
        <AnimatePresence>
          {searchMode === "location" &&
            showLocationResults &&
            locationResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full mt-3 w-full bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden max-h-72 overflow-y-auto custom-scrollbar z-50 ring-1 ring-black/5"
              >
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Suggestions
                </div>
                <ul className="py-1">
                  {locationResults.map((result) => (
                    <li key={result.place_id}>
                      <button
                        onClick={() => handleLocationSelect(result)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-start gap-3 group border-b border-slate-50 last:border-0"
                      >
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <MapPin size={14} />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-slate-800 group-hover:text-blue-700">
                            {result.display_name.split(",")[0]}
                          </span>
                          <span className="block text-xs text-slate-500 truncate max-w-[220px]">
                            {result.display_name}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Filter Toggles - Segmented Style */}
      {searchMode === "filter" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 group ${showComplaints
              ? "bg-red-50 border-red-200 text-red-700 shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
            onClick={() => {
              setShowComplaints(!showComplaints);
              setSelectedItem(null);
            }}
          >
            <div className={`w-2 h-2 rounded-full ${showComplaints ? "bg-red-500" : "bg-slate-300"}`} />
            <span className="text-xs font-bold uppercase tracking-wide">Complaints</span>
          </button>

          <button
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 group ${showProjects
              ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
            onClick={() => {
              setShowProjects(!showProjects);
              setSelectedItem(null);
            }}
          >
            <div className={`w-2 h-2 rounded-full ${showProjects ? "bg-blue-500" : "bg-slate-300"}`} />
            <span className="text-xs font-bold uppercase tracking-wide">Projects</span>
          </button>
        </div>
      )}
    </div>
  );

  // --- Main Render ---
  return (
    <div className="relative flex h-full w-full bg-slate-50 overflow-hidden rounded-none lg:rounded-3xl">
      {/* --- GLOBAL ANIMATED BACKGROUND (Visible through glass sidebar) --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[100px] opacity-50"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-indigo-200 rounded-full blur-[100px] opacity-40"
        />
      </div>

      {/* Left Column (Sidebar) - Solid White with Shadow */}
      <div
        className={`relative z-10 w-full lg:w-[26rem] xl:w-[28rem] bg-white border-r border-slate-200 flex-shrink-0 transition-all duration-300 flex flex-col shadow-[4px_0_24px_-4px_rgba(0,0,0,0.12)]`}
      >
        <div className="h-full flex flex-col">
          {SidebarHeader}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            {/* Content Gradient Fade */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/40 to-transparent z-10 pointer-events-none" />
            {error && (
              <p className="text-sm text-red-500 p-6 bg-red-50/50 m-4 rounded-xl border border-red-100">
                {error}
              </p>
            )}
            <ItemListing
              items={sortedItems}
              setSelectedItem={setSelectedItem}
            />
          </div>
        </div>
      </div>

      {/* Right Column (Map) */}
      <div className="flex-1 min-h-full relative z-10">
        <MapContent
          items={filtered}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          center={center}
          locationTarget={locationTarget}
          currentLayer={currentLayer}
          setCurrentLayer={setCurrentLayer}
          activeOverlays={activeOverlays}
          setActiveOverlays={setActiveOverlays}
        />

        {/* Floating Details Panel - Popup from Bottom Right */}
        <AnimatePresence>
          {selectedItem && (
            <FloatingDetailsPanel
              item={selectedItem}
              clearSelection={() => setSelectedItem(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Filter Overlay (Glass) */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-slate-900/20 z-[100] flex justify-end lg:justify-start"
            onClick={() => setShowFilterPanel(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-80 h-full bg-white p-6 shadow-2xl border-r border-slate-200 overflow-y-auto pt-24"
            >
              <div className="flex justify-between items-center pb-6 mb-2">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Filter size={24} className="text-blue-600" /> {t("filters")}
                </h3>
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="p-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filter Controls */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {t("dataLayers")}
                  </h4>
                  <label className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/60 cursor-pointer hover:bg-white transition">
                    <input
                      type="checkbox"
                      checked={showComplaints}
                      onChange={(e) => setShowComplaints(e.target.checked)}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-slate-300"
                    />
                    <span className="font-bold text-slate-700">
                      {t("complaints")}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/60 cursor-pointer hover:bg-white transition">
                    <input
                      type="checkbox"
                      checked={showProjects}
                      onChange={(e) => setShowProjects(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                    />
                    <span className="font-bold text-slate-700">
                      {t("projects")}
                    </span>
                  </label>
                </div>

                {showComplaints && (
                  <div className="space-y-3 pt-4 border-t border-slate-200/60">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      {t("refineComplaints")}
                    </h4>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                        {t("status")}
                      </label>
                      <select
                        value={mobileStatusFilter}
                        onChange={(e) =>
                          setMobileStatusFilter(e.target.value as any)
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-900"
                      >
                        <option value="all">{t("allStatuses")}</option>
                        <option value="pending">{t("pending")}</option>
                        <option value="in_progress">{t("inProgress")}</option>
                        <option value="resolved">{t("resolved")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block flex justify-between">
                        <span>{t("minSeverity")}</span>
                        <span className="text-red-500">
                          {mobileSeverityMin}
                        </span>
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={mobileSeverityMin}
                        onChange={(e) =>
                          setMobileSeverityMin(Number(e.target.value))
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-6 mt-auto">
                  <button
                    onClick={applyMobileFilters}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition"
                  >
                    {t("applyChanges")}
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="w-full py-3 mt-3 text-slate-500 font-bold hover:text-slate-800 transition"
                  >
                    {t("resetDefaults")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}