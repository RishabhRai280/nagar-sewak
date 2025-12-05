// app/components/map/Map.tsx
"use client";

import { useEffect, useMemo, useState, useRef, Dispatch, SetStateAction } from "react";
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
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LoadingState from "./LoadingState";
import { useTranslations } from 'next-intl';
import "../../map-enhancements.css";

// Define combined type for map markers
type MarkerItem =
  | (ComplaintData & { kind: "complaint" })
  | (ProjectData & { kind: "project" });

const DEFAULT_CENTER: [number, number] = [21.1458, 79.0882]; // Central India
const PROJECT_DETAILS_PATH = "/projects";

// --- Marker Icon Utilities ---

function createDivIcon(color: string, type: "project" | "complaint") {
  const iconHtml =
    type === "project"
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2L20 6V18L12 22L4 18V6L12 2Z" />
       </svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
       </svg>`;

  return L.divIcon({
    html: `
      <div class="marker-icon-stable" style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        border: 3px solid white;
        cursor: pointer;
        will-change: transform;
      ">
        ${iconHtml}
      </div>
    `,
    className: "custom-marker-icon",
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
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
import { sampleWardBoundaries, samplePopulationData, sampleInfrastructureData } from "@/lib/data/sampleWardData";

// --- Map Content Component ---

function MapContent({
  items,
  selectedItem,
  setSelectedItem,
  center,
  locationTarget,
}: {
  items: MarkerItem[];
  selectedItem: MarkerItem | null;
  setSelectedItem: (item: MarkerItem | null) => void;
  center: [number, number];
  locationTarget: { lat: number; lng: number; zoom: number } | null;
}) {
  const [targetLocation, setTargetLocation] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [clusteringEnabled, setClusteringEnabled] = useState(true);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);

  // Layer control states
  const [currentLayer, setCurrentLayer] = useState<MapLayer>("osm");
  const [activeOverlays, setActiveOverlays] = useState<MapOverlay[]>([]);

  // Update target location when locationTarget prop changes
  useEffect(() => {
    if (locationTarget) {
      setTargetLocation(locationTarget);
    }
  }, [locationTarget]);

  const handleLocationSelect = (lat: number, lng: number, zoom: number = 13, geojson?: any) => {
    setTargetLocation({ lat, lng, zoom });
    setBoundaryData(geojson);
    setSelectedItem(null); // Clear item selection when searching for a place
  };

  const handleOverlayToggle = (overlay: MapOverlay) => {
    setActiveOverlays(prev =>
      prev.includes(overlay)
        ? prev.filter(o => o !== overlay)
        : [...prev, overlay]
    );
  };

  const t = useTranslations('map');

  // Memoize markers to prevent unnecessary re-renders
  const markers = useMemo(() => items, [items]);

  return (
    <div className="relative w-full h-full z-0 rounded-none lg:rounded-l-3xl overflow-hidden shadow-2xl border-l border-white/20">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        className="z-0"
      >
        {/* Position zoom controls lower if needed, but usually topright is fine. Can add style if needed. */}
        <ZoomControl position="bottomright" />

        {/* Map Layer Provider - Handles base layers and overlays */}
        <MapLayerProvider
          layer={currentLayer}
          activeOverlays={activeOverlays}
          wardBoundaries={sampleWardBoundaries}
          populationData={samplePopulationData}
          infrastructureData={sampleInfrastructureData}
          complaints={items
            .filter(item => item.kind === 'complaint')
            .map(item => ({
              lat: (item as any).lat,
              lng: (item as any).lng,
              status: (item as any).status,
              createdAt: (item as any).createdAt || new Date().toISOString(),
            }))}
          projects={items
            .filter(item => item.kind === 'project')
            .map(item => ({
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
              fillOpacity: 0.1
            }}
          />
        )}

        <RecenterAndView item={selectedItem} initialCenter={center} />
        <FlyToLocation target={targetLocation} />

        {/* Clustering or Regular Markers */}
        {clusteringEnabled ? (
          <MarkerClusterGroup
            markers={markers.map((it) => {
              const lat = (it as any).lat;
              const lng = (it as any).lng;
              if (typeof lat !== "number" || typeof lng !== "number") return null;

              let color = "#3b82f6";
              if (it.kind === "project") {
                color = (it as ProjectData).status?.toLowerCase() === "completed" ? "#10b981" : "#3b82f6";
              } else {
                const s = (it as ComplaintData).status?.toLowerCase();
                if (s === "pending") color = "#ef4444";
                else if (s === "resolved") color = "#10b981";
                else color = "#f59e0b";
              }

              const icon = createDivIcon(color, it.kind === "project" ? "project" : "complaint");
              const position: [number, number] = [lat, lng];

              return {
                position,
                icon,
                popup: `<div class="p-1"><strong class="text-sm block mb-1 font-bold text-slate-800">${it.kind === "complaint" ? "Complaint" : "Project"}</strong><span class="text-sm text-slate-600">${it.title}</span></div>`,
                onClick: () => {
                  setSelectedItem(it);
                },
              };
            }).filter(Boolean) as any}
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
              it.kind === "project" ? "project" : "complaint"
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
                <Popup className="glass-popup" closeButton={false} autoClose={false}>
                  <div className="p-1">
                    <strong className="text-sm block mb-1 font-bold text-slate-800">
                      {it.kind === "complaint" ? t('complaint') : t('project')}
                    </strong>
                    <span className="text-sm text-slate-600">{it.title}</span>
                  </div>
                </Popup>
              </Marker>
            );
          }))}

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
              .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")}
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

      {/* Map Enhancement Controls */}
      <MapEnhancements
        clusteringEnabled={clusteringEnabled}
        heatmapEnabled={heatmapEnabled}
        onClusteringToggle={setClusteringEnabled}
        onHeatmapToggle={setHeatmapEnabled}
      />

      {/* Map Layer Control */}
      <MapLayerControl
        currentLayer={currentLayer}
        onLayerChange={setCurrentLayer}
        activeOverlays={activeOverlays}
        onOverlayToggle={handleOverlayToggle}
      />

      {/* Location Search is now integrated into the sidebar */}

      {/* Map Legend */}
      <MapLegend activeOverlays={activeOverlays} />

      {/* Map Overlay Gradient for better integration */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_10px_0_30px_rgba(0,0,0,0.1)] z-[400]"></div>
    </div>
  );
}

// Custom hook to handle map centering - FIXED: Don't move map on marker click
function RecenterAndView({ item, initialCenter }: { item: MarkerItem | null, initialCenter: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    // Only center map if item is selected AND map is not already showing that location
    if (item && typeof (item as any).lat === "number" && typeof (item as any).lng === "number") {
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

function FlyToLocation({ target }: { target: { lat: number; lng: number; zoom: number } | null }) {
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

function ItemDetails({ item, clearSelection }: { item: MarkerItem, clearSelection: () => void }) {
  const isComplaint = item.kind === 'complaint';
  const data = item as any;
  const t = useTranslations('map');

  const statusClasses =
    data.status?.toLowerCase() === 'resolved' || data.status?.toLowerCase() === 'completed'
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : data.status?.toLowerCase() === 'pending'
        ? "bg-red-100 text-red-700 border-red-200"
        : "bg-amber-100 text-amber-700 border-amber-200";

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      // UPDATED: Added 'pt-28' to push content below the transparent header
      className="h-full p-6 pt-28 flex flex-col relative"
    >
      {/* Glass Background for Details Panel */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xl z-[-1]" />

      <div className="flex justify-between items-start border-b border-slate-200/60 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${isComplaint ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
              {isComplaint ? t('citizenComplaint') : t('publicProject')}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{data.title}</h2>
        </div>
        <button
          onClick={clearSelection}
          className="p-2 bg-white/50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition rounded-full shadow-sm backdrop-blur-md"
          title="Close Details"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <span className={`px-3 py-1.5 rounded-lg border shadow-sm flex items-center gap-1.5 ${statusClasses}`}>
            {data.status}
          </span>

          {isComplaint && data.severity && (
            <span className={`px-3 py-1.5 rounded-lg border shadow-sm flex items-center gap-1.5 ${data.severity >= 4 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
              <AlertTriangle size={14} /> {t('severity')}: {data.severity}/5
            </span>
          )}

          {!isComplaint && data.budget && (
            <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 shadow-sm flex items-center gap-1.5">
              <DollarSign size={14} /> {t('budget')}: ₹{data.budget.toLocaleString()}
            </span>
          )}
        </div>

        <div className="bg-white/50 p-4 rounded-xl border border-white/60 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">{t('description')}</h4>
          <p className="text-slate-700 leading-relaxed">
            {data.description || t('noDescription')}
          </p>
        </div>

        {/* Photo Evidence (Complaints Only) - Multiple Images */}
        {isComplaint && (data.photoUrls?.length > 0 || data.photoUrl) && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" /> {t('evidenceUploaded')}
              {data.photoUrls?.length > 0 && <span className="text-xs text-slate-500">({data.photoUrls.length} {data.photoUrls.length === 1 ? 'image' : 'images'})</span>}
            </p>

            {data.photoUrls && data.photoUrls.length > 0 ? (
              <div className={`grid gap-2 ${data.photoUrls.length === 1 ? 'grid-cols-1' : data.photoUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                {data.photoUrls.map((url: string, index: number) => (
                  <div key={index} className="relative rounded-xl overflow-hidden shadow-md border border-white/50 group">
                    <img
                      src={url}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-32 object-cover transition transform group-hover:scale-105 duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x200/e2e8f0/64748b?text=Image+${index + 1}`; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {index + 1}/{data.photoUrls.length}
                    </div>
                  </div>
                ))}
              </div>
            ) : data.photoUrl && (
              <div className="relative rounded-xl overflow-hidden shadow-md border border-white/50 group">
                <img
                  src={buildAssetUrl(data.photoUrl) ?? undefined}
                  alt="Complaint evidence"
                  className="w-full h-48 object-cover transition transform group-hover:scale-105 duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x200/e2e8f0/64748b?text=Image+Unavailable`; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
            )}
          </div>
        )}

        {/* Action Links */}
        <div className="pt-2 space-y-3">
          <Link
            href={isComplaint ? `/dashboard/citizen/complaints/${data.id}` : `${PROJECT_DETAILS_PATH}/${data.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-200"
          >
            {t('viewFullDetails')} <ArrowRight size={18} />
          </Link>
          {isComplaint && data.status?.toLowerCase() === 'resolved' && (
            <Link
              href={`/rate/${data.id}`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-white text-emerald-600 border border-emerald-200 rounded-xl font-bold hover:bg-emerald-50 transition shadow-sm"
            >
              <Star size={18} /> {t('rateWorkQuality')}
            </Link>
          )}
        </div>

        <div className="text-xs text-slate-400 text-center pt-2 pb-6 flex items-center justify-center gap-1">
          <MapPin size={12} /> {t('coordinates')}: {data.lat?.toFixed(5)}, {data.lng?.toFixed(5)}
        </div>
      </div>
    </motion.div>
  );
}

// --- Item Listing Component ---

function ItemListing({ items, setSelectedItem }: { items: MarkerItem[], setSelectedItem: (item: MarkerItem) => void }) {
  const t = useTranslations('map');

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Search className="text-slate-400" size={24} />
        </div>
        <p className="text-slate-500 font-medium">{t('noItemsMatch')}</p>
        <p className="text-sm text-slate-400 mt-1">{t('adjustFilters')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-6 pt-2 pb-24 lg:pb-6">
      {items.map((item) => {
        const isComplaint = item.kind === 'complaint';
        const data = item as any;

        const statusColor =
          data.status?.toLowerCase() === 'resolved' || data.status?.toLowerCase() === 'completed'
            ? "text-emerald-600 bg-emerald-50 border-emerald-100"
            : data.status?.toLowerCase() === 'pending'
              ? "text-red-600 bg-red-50 border-red-100"
              : "text-amber-600 bg-amber-50 border-amber-100";

        return (
          <motion.div
            key={`${item.kind}-${item.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white/60 p-4 rounded-xl border border-white/60 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm group"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${statusColor}`}>
                {data.status || (isComplaint ? t('pending') : t('inProgress'))}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{isComplaint ? t('complaint') : t('project')}</span>
            </div>
            <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{data.title}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">{data.description || 'No description available.'}</p>

            {isComplaint && data.severity && (
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                  {t('severity')}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < data.severity ? 'bg-red-400' : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// --- Main Component ---

export default function Map({
  items, loading, error, selectedItem, setSelectedItem, setItems, setLoading, setError,
  showComplaints, setShowComplaints, showProjects, setShowProjects,
  statusFilter, setStatusFilter, severityMin, setSeverityMin,
  search, setSearch, filtered
}: any) {
  const t = useTranslations('map');

  const [sortBy, setSortBy] = useState<'severity_desc' | 'title_asc'>('severity_desc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Mobile specific filter states
  const [mobileStatusFilter, setMobileStatusFilter] = useState(statusFilter);
  const [mobileSeverityMin, setMobileSeverityMin] = useState(severityMin);

  // Unified search states
  const [searchMode, setSearchMode] = useState<'filter' | 'location'>('filter');
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationResults, setShowLocationResults] = useState(false);
  const [locationTarget, setLocationTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
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
      if (searchMode === 'location' && locationQuery.length > 2) {
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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
      setSearchMode('filter');
      setLocationQuery("");
    }, 1000);

    setSelectedItem(null);
  };

  const sortedItems = useMemo(() => {
    let sorted = [...filtered];
    if (sortBy === 'severity_desc') {
      sorted.sort((a, b) => {
        if (a.kind === 'complaint' && b.kind === 'complaint') {
          return (b.severity || 0) - (a.severity || 0);
        }
        if (a.kind === 'complaint' && b.kind === 'project') return -1;
        if (a.kind === 'project' && b.kind === 'complaint') return 1;
        return 0;
      });
    } else if (sortBy === 'title_asc') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [filtered, sortBy]);

  // Calculate center
  const first = filtered.find((f: any) => typeof f.lat === "number" && typeof f.lng === "number");
  const center: [number, number] = first ? [first.lat, first.lng] : DEFAULT_CENTER;

  if (loading) return <LoadingState />;

  const handleResetFilters = () => {
    setShowComplaints(true); setShowProjects(true); setStatusFilter("all");
    setSeverityMin(1); setSearch(""); setSelectedItem(null); setSortBy('severity_desc');
    setMobileStatusFilter("all"); setMobileSeverityMin(1);
  };


  // --- Sidebar Header with Glass Morphism - STICKY ---
  const SidebarHeader = (
    <div className="p-6 pt-28 space-y-4 border-b border-white/40 flex-shrink-0 bg-white/60 backdrop-blur-xl z-20 sticky top-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
            <ClipboardList size={20} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">{t('civicData')}</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.8)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilterPanel(true)}
          className="p-2 bg-white/50 text-slate-600 rounded-lg border border-white/60 shadow-sm transition"
        >
          <Filter size={18} />
        </motion.button>
      </div>

      {/* Search Mode Toggle */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => {
            setSearchMode('filter');
            setLocationQuery("");
            setShowLocationResults(false);
          }}
          className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${searchMode === 'filter'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <Search size={14} /> Filter Items
        </button>
        <button
          onClick={() => {
            setSearchMode('location');
            setSearch("");
          }}
          className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${searchMode === 'location'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <MapPin size={14} /> Location
        </button>
      </div>

      {/* Unified Search Input */}
      <div ref={searchRef} className="relative group">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {searchMode === 'location' && locationLoading ? (
            <Loader2 className="animate-spin text-blue-500" size={18} />
          ) : (
            <Search className="text-slate-400 group-focus-within:text-blue-500 transition duration-300" size={18} />
          )}
        </div>
        <input
          type="search"
          value={searchMode === 'filter' ? search : locationQuery}
          onChange={(e) => {
            if (searchMode === 'filter') {
              setSearch(e.target.value);
              setSelectedItem(null);
            } else {
              setLocationQuery(e.target.value);
              if (e.target.value.length > 0) setShowLocationResults(true);
            }
          }}
          onFocus={() => {
            if (searchMode === 'location' && locationResults.length > 0) {
              setShowLocationResults(true);
            }
          }}
          placeholder={searchMode === 'filter' ? t('filterPlaceholder') : 'Search area, city, or state...'}
          className="w-full pl-10 pr-10 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm placeholder-slate-400 focus:bg-white"
        />
        {((searchMode === 'filter' && search) || (searchMode === 'location' && locationQuery)) && (
          <button
            onClick={() => {
              if (searchMode === 'filter') {
                setSearch("");
              } else {
                setLocationQuery("");
                setLocationResults([]);
                setShowLocationResults(false);
              }
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}

        {/* Location Search Results Dropdown */}
        <AnimatePresence>
          {searchMode === 'location' && showLocationResults && locationResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar z-50"
            >
              <ul className="py-1">
                {locationResults.map((result) => (
                  <li key={result.place_id}>
                    <button
                      onClick={() => handleLocationSelect(result)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-start gap-3 group"
                    >
                      <MapPin className="mt-0.5 text-slate-400 group-hover:text-blue-500 flex-shrink-0" size={16} />
                      <div>
                        <span className="block text-sm font-medium text-slate-800 group-hover:text-blue-700">
                          {result.display_name.split(",")[0]}
                        </span>
                        <span className="block text-xs text-slate-500 truncate max-w-[250px]">
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

      {/* Filter Mode Controls */}
      {searchMode === 'filter' && (
        <div className="flex justify-between items-center pt-1">
          <div className="flex items-center gap-2 text-xs">
            <ArrowDownNarrowWide size={14} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-slate-600 focus:outline-none cursor-pointer hover:text-blue-600 transition duration-300"
            >
              <option value="severity_desc">{t('sortBySeverity')}</option>
              <option value="title_asc">{t('sortByName')}</option>
            </select>
          </div>

          <div className="flex gap-1.5">
            <button
              className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold border transition-all duration-300 ${showComplaints ? 'bg-red-500 text-white border-red-600 shadow-md shadow-red-500/30 scale-105' : 'bg-white/50 text-slate-500 border-transparent hover:bg-white hover:scale-105'}`}
              onClick={() => { setShowComplaints(!showComplaints); setSelectedItem(null); }}
            >
              {t('complaints')}
            </button>
            <button
              className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold border transition-all duration-300 ${showProjects ? 'bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-500/30 scale-105' : 'bg-white/50 text-slate-500 border-transparent hover:bg-white hover:scale-105'}`}
              onClick={() => { setShowProjects(!showProjects); setSelectedItem(null); }}
            >
              {t('projects')}
            </button>
          </div>
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

      {/* Left Column (Sidebar) - Ultra Glass with Subtle Shadow */}
      <div className={`relative z-10 w-full lg:w-[26rem] xl:w-[28rem] bg-white/60 backdrop-blur-xl border-r-2 border-white/50 flex-shrink-0 transition-all duration-300 flex flex-col shadow-[4px_0_24px_-4px_rgba(0,0,0,0.12)]`}>
        <AnimatePresence mode="wait">
          {selectedItem ? (
            <motion.div
              key="details"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 120, damping: 20 }}
              className="h-full"
            >
              <ItemDetails item={selectedItem} clearSelection={() => setSelectedItem(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {SidebarHeader}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {/* Content Gradient Fade */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/40 to-transparent z-10 pointer-events-none" />
                {error && <p className="text-sm text-red-500 p-6 bg-red-50/50 m-4 rounded-xl border border-red-100">{error}</p>}
                <ItemListing items={sortedItems} setSelectedItem={setSelectedItem} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Column (Map) */}
      <div className="flex-1 min-h-full relative z-10">
        <MapContent
          items={filtered}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          center={center}
          locationTarget={locationTarget}
        />
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
              className="w-80 h-full bg-white/90 backdrop-blur-2xl p-6 shadow-2xl border-r border-white/50 overflow-y-auto pt-24" // Added pt-24 here for mobile too
            >
              <div className="flex justify-between items-center pb-6 mb-2">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Filter size={24} className="text-blue-600" /> {t('filters')}
                </h3>
                <button onClick={() => setShowFilterPanel(false)} className="p-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-full transition">
                  <X size={20} />
                </button>
              </div>

              {/* Filter Controls */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('dataLayers')}</h4>
                  <label className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/60 cursor-pointer hover:bg-white transition">
                    <input type="checkbox" checked={showComplaints} onChange={(e) => setShowComplaints(e.target.checked)} className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-slate-300" />
                    <span className="font-bold text-slate-700">{t('complaints')}</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/60 cursor-pointer hover:bg-white transition">
                    <input type="checkbox" checked={showProjects} onChange={(e) => setShowProjects(e.target.checked)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300" />
                    <span className="font-bold text-slate-700">{t('projects')}</span>
                  </label>
                </div>

                {showComplaints && (
                  <div className="space-y-3 pt-4 border-t border-slate-200/60">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('refineComplaints')}</h4>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">{t('status')}</label>
                      <select value={mobileStatusFilter} onChange={(e) => setMobileStatusFilter(e.target.value as any)} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/50 outline-none">
                        <option value="all">{t('allStatuses')}</option>
                        <option value="pending">{t('pending')}</option>
                        <option value="in_progress">{t('inProgress')}</option>
                        <option value="resolved">{t('resolved')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block flex justify-between">
                        <span>{t('minSeverity')}</span>
                        <span className="text-red-500">{mobileSeverityMin}</span>
                      </label>
                      <input type="range" min={1} max={5} value={mobileSeverityMin} onChange={(e) => setMobileSeverityMin(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    </div>
                  </div>
                )}

                <div className="pt-6 mt-auto">
                  <button onClick={applyMobileFilters} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition">
                    {t('applyChanges')}
                  </button>
                  <button onClick={handleResetFilters} className="w-full py-3 mt-3 text-slate-500 font-bold hover:text-slate-800 transition">
                    {t('resetDefaults')}
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