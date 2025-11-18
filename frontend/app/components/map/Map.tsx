// app/components/map/Map.tsx
"use client";

import { useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L, { ZoomPanOptions } from "leaflet";
import { fetchMapData, ComplaintData, ProjectData } from "@/lib/api";
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
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LoadingState from "./LoadingState";

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
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2L20 6V18L12 22L4 18V6L12 2Z" />
       </svg>` 
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
       </svg>`;

  return L.divIcon({
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 3px solid white;
        transform: translateZ(0);
      ">
        ${iconHtml}
      </div>
    `,
    className: "custom-div-icon",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
}

// --- Map Content Component ---

function MapContent({
  items,
  selectedItem,
  setSelectedItem,
  center,
}: {
  items: MarkerItem[];
  selectedItem: MarkerItem | null;
  setSelectedItem: (item: MarkerItem | null) => void;
  center: [number, number];
}) {
  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      className="z-0"
    >
      <ZoomControl position="topright" />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterAndView item={selectedItem} initialCenter={center} />

      {items.map((it) => {
        const lat = (it as any).lat;
        const lng = (it as any).lng;
        if (typeof lat !== "number" || typeof lng !== "number") return null;

        let color = "#3b82f6"; // Default blue (In Progress / Project)
        if (it.kind === "project") {
          color =
            (it as ProjectData).status?.toLowerCase() === "completed"
              ? "#10b981"
              : "#3b82f6";
        } else {
          const s = (it as ComplaintData).status?.toLowerCase();
          if (s === "pending") color = "#f97316";
          else if (s === "resolved") color = "#10b981";
        }

        const icon = createDivIcon(
          color,
          it.kind === "project" ? "project" : "complaint"
        );

        return (
          <Marker
            key={`${it.kind}-${it.id}`}
            position={[lat, lng]}
            icon={icon as any}
            eventHandlers={{
              click: () => {
                setSelectedItem(it);
              },
            }}
          >
            <Popup>
              <strong className="text-sm">
                {it.kind === "complaint" ? "Complaint: " : "Project: "}
                {it.title}
              </strong>
              <p className="text-xs text-gray-500">Click to view details</p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

// Custom hook to handle map centering and selection when an item is selected
function RecenterAndView({ item, initialCenter }: { item: MarkerItem | null, initialCenter: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (item && typeof (item as any).lat === "number" && typeof (item as any).lng === "number") {
      const position: [number, number] = [(item as any).lat, (item as any).lng];
      
      // FIX: Use the pan property directly on the options object (ZoomPanOptions)
      const options: ZoomPanOptions = {
        animate: true,
        duration: 0.5,
      };

      map.setView(position, map.getZoom() > 14 ? map.getZoom() : 14, options);
    } else {
      map.setView(initialCenter, 12, { animate: true });
    }
  }, [item, map, initialCenter]);

  return null;
}


// --- Sidebar Display Components ---

function ItemDetails({ item, clearSelection }: { item: MarkerItem, clearSelection: () => void }) {
  const isComplaint = item.kind === 'complaint';
  const data = item as any;

  const statusClasses = 
    data.status?.toLowerCase() === 'resolved' || data.status?.toLowerCase() === 'completed'
    ? "bg-emerald-100 text-emerald-700" 
    : data.status?.toLowerCase() === 'pending'
    ? "bg-orange-100 text-orange-700"
    : "bg-blue-100 text-blue-700";

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 overflow-y-auto h-full p-6"
    >
      <div className="flex justify-between items-start border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {isComplaint ? "Citizen Complaint" : "Government Project"}
          </h3>
          <h2 className="text-3xl font-extrabold text-slate-900">{data.title}</h2>
        </div>
        <button onClick={clearSelection} className="p-2 text-slate-500 hover:text-red-500 transition rounded-full hover:bg-slate-50" title="Close Details">
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-wrap gap-4 text-sm font-medium">
        <span className={`px-3 py-1 rounded-full ${statusClasses}`}>
          Status: {data.status}
        </span>

        {isComplaint && data.severity && (
          <span className={`px-3 py-1 rounded-full ${data.severity >= 4 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
            Severity: {data.severity}/5
          </span>
        )}
        
        {!isComplaint && data.budget && (
           <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
             <DollarSign size={16} /> Budget: ₹{data.budget.toLocaleString()}
           </span>
        )}
      </div>

      <p className="text-slate-700 leading-relaxed border-b border-slate-100 pb-6">
        {data.description || 'No detailed description provided.'}
      </p>

      {/* Photo Evidence (Complaints Only) */}
      {isComplaint && data.photoUrl && (
        <div className="space-y-3">
          <p className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CheckCircle size={20} className="text-emerald-500" /> Photo Evidence
          </p>
          <img
            src={`http://localhost:8080/uploads/${data.photoUrl}`}
            alt="Complaint evidence"
            className="w-full h-48 object-cover rounded-xl shadow-md border border-slate-200"
            onError={(e) => {(e.target as HTMLImageElement).src = `https://placehold.co/400x200/e2e8f0/64748b?text=Image+Unavailable`; }}
          />
        </div>
      )}

      {/* Action Links */}
      <div className="pt-4 space-y-3">
        <Link 
          href={isComplaint ? `/dashboard/citizen/complaints/${data.id}` : `${PROJECT_DETAILS_PATH}/${data.id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
        >
          View Full Details <ArrowRight size={18} />
        </Link>
        {isComplaint && data.status?.toLowerCase() === 'resolved' && (
          <Link
            href={`/rate/${data.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md"
          >
            <Star size={20} /> Rate the Work
          </Link>
        )}
      </div>

      <div className="text-xs text-slate-400 text-center pt-4">
        Location: ({data.lat?.toFixed(5)}, {data.lng?.toFixed(5)})
      </div>
    </motion.div>
  );
}

// --- Item Listing Component ---

function ItemListing({ items, setSelectedItem }: { items: MarkerItem[], setSelectedItem: (item: MarkerItem) => void }) {
  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        No items match the current filters.
      </div>
    );
  }
  
  return (
    <div className="space-y-3 p-6 pt-0">
      {items.map((item) => {
        const isComplaint = item.kind === 'complaint';
        const data = item as any;

        const statusClasses = 
          data.status?.toLowerCase() === 'resolved' || data.status?.toLowerCase() === 'completed'
          ? "bg-emerald-50 text-emerald-600" 
          : data.status?.toLowerCase() === 'pending'
          ? "bg-orange-50 text-orange-600"
          : "bg-blue-50 text-blue-600";
        
        return (
          <motion.div
            key={`${item.kind}-${item.id}`}
            whileHover={{ scale: 1.01, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}
            className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer shadow-sm transition"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${statusClasses}`}>
                {data.status || (isComplaint ? "Pending" : "In Progress")}
              </span>
              <span className="text-xs text-slate-400">{isComplaint ? "Complaint" : "Project"}</span>
            </div>
            <h4 className="font-bold text-slate-900 line-clamp-1">{data.title}</h4>
            <p className="text-xs text-slate-600 line-clamp-2 mt-1">{data.description || 'No description.'}</p>
            
            {isComplaint && data.severity && (
              <div className="mt-2 text-xs font-medium text-slate-600 flex items-center gap-1">
                <AlertTriangle size={14} className="text-red-500" />
                Severity: {data.severity}/5
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// --- Filter & Main Component Logic ---

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
}: {
  items: MarkerItem[];
  loading: boolean;
  error: string | null;
  selectedItem: MarkerItem | null;
  setSelectedItem: Dispatch<SetStateAction<MarkerItem | null>>;
  setItems: Dispatch<SetStateAction<MarkerItem[]>>; 
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  showComplaints: boolean;
  setShowComplaints: Dispatch<SetStateAction<boolean>>;
  showProjects: boolean;
  setShowProjects: Dispatch<SetStateAction<boolean>>;
  statusFilter: "all" | "pending" | "in_progress" | "resolved";
  setStatusFilter: Dispatch<SetStateAction<"all" | "pending" | "in_progress" | "resolved">>;
  severityMin: number;
  setSeverityMin: Dispatch<SetStateAction<number>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  filtered: MarkerItem[];
}) {

  // New state for local sorting preference
  const [sortBy, setSortBy] = useState<'severity_desc' | 'title_asc'>('severity_desc');
  // New state to toggle full filter panel visibility on mobile
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Custom Filter State (for expanded mobile filters) - initialized with global state for consistency
  const [mobileStatusFilter, setMobileStatusFilter] = useState(statusFilter);
  const [mobileSeverityMin, setMobileSeverityMin] = useState(severityMin);

  // Apply mobile filters
  const applyMobileFilters = () => {
    // Apply the mobile/expanded filter states to the global filter states
    setStatusFilter(mobileStatusFilter);
    setSeverityMin(mobileSeverityMin);
    setShowFilterPanel(false);
    setSelectedItem(null);
  };
  
  const sortedItems = useMemo(() => {
    let sorted = [...filtered];

    if (sortBy === 'severity_desc') {
        // Sort complaints first by severity (desc), then projects
        sorted.sort((a, b) => {
            // Prioritize complaints by severity, then projects by status/title
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

  // Choose map center based on filtered data
  const first = filtered.find(
    (f) =>
      typeof (f as any).lat === "number" && typeof (f as any).lng === "number"
  );
  const center: [number, number] = first
    ? [(first as any).lat, (first as any).lng]
    : DEFAULT_CENTER;
  
  if (loading) return <LoadingState />;

  const handleResetFilters = () => {
    setShowComplaints(true);
    setShowProjects(true);
    setStatusFilter("all");
    setSeverityMin(1);
    setSearch("");
    setSelectedItem(null);
    setSortBy('severity_desc');

    // Reset mobile filter states too
    setMobileStatusFilter("all");
    setMobileSeverityMin(1);
  };
  
  
  // --- Expanded Filter Panel (For Mobile & Desktop Modal if needed) ---
  const ExpandedFilterControls = (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-slate-800">Item Type</h4>
        <label className="flex items-center gap-3 text-sm text-slate-700 font-medium">
          <input
            id="complaints"
            type="checkbox"
            checked={showComplaints}
            // Directly update the global showComplaints state
            onChange={(e) => setShowComplaints(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          Citizen Complaints ({items.filter(i => i.kind === 'complaint').length})
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-700 font-medium">
          <input
            id="projects"
            type="checkbox"
            checked={showProjects}
            // Directly update the global showProjects state
            onChange={(e) => setShowProjects(e.target.checked)}
            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
          />
          Government Projects ({items.filter(i => i.kind === 'project').length})
        </label>
      </div>

      {/* Complaint Status Filter */}
      {showComplaints && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-lg font-semibold text-slate-800">
            Complaint Status
          </label>
          <select
            value={mobileStatusFilter}
            onChange={(e) => setMobileStatusFilter(e.target.value as any)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-70"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      )}

      {/* Minimum Severity Filter */}
      {showComplaints && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-lg font-semibold text-slate-800">
            Min. Severity: <span className="text-red-500">{mobileSeverityMin}</span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={mobileSeverityMin}
            onChange={(e) => setMobileSeverityMin(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-70"
          />
          <div className="text-xs text-slate-500 flex justify-between">
            <span>Low (1)</span><span>High (5)</span>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 space-y-3">
        <button 
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={applyMobileFilters}
        >
            Apply Filters
        </button>
        <button
          className="w-full py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
          onClick={handleResetFilters}
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
  
  
  // --- List & Main Filter Panel (Left Column) ---
  const FiltersAndListPanel = (
    <div className="flex flex-col h-full">
      
      {/* Controls Header */}
      <div className="p-6 space-y-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList size={28} className="text-blue-600" />
          <h3 className="text-2xl font-bold text-slate-900">Item List ({filtered.length})</h3>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="search"
            value={search}
            onChange={(e) => {setSearch(e.target.value); setSelectedItem(null);}}
            placeholder="Search by title, location, or project name..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Sorting & Filter Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-sm">
            <ArrowDownNarrowWide size={16} className="text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 border border-slate-300 rounded-lg text-slate-700 font-medium bg-white"
            >
              <option value="severity_desc">Severity (High to Low)</option>
              <option value="title_asc">Title (A-Z)</option>
            </select>
          </div>
          
          {/* Filter Button (Opens expanded filter modal on mobile) */}
          <button 
            className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
            onClick={() => setShowFilterPanel(true)}
          >
            <Filter size={16} /> Advanced Filters
          </button>
        </div>
        
        {/* Quick Filter Statuses */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button 
            className={`text-xs px-3 py-1 rounded-full border transition ${showComplaints ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            onClick={() => {setShowComplaints(!showComplaints); setSelectedItem(null);}}
          >
            Complaints
          </button>
          <button 
            className={`text-xs px-3 py-1 rounded-full border transition ${showProjects ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            onClick={() => {setShowProjects(!showProjects); setSelectedItem(null);}}
          >
            Projects
          </button>
        </div>
      </div>

      {/* Item List */}
      <div className="flex-1 overflow-y-auto">
        {error && <p className="text-sm text-red-500 p-6">{error}</p>}
        <ItemListing items={sortedItems} setSelectedItem={setSelectedItem} />
      </div>
      
    </div>
  );


  // --- Main Render ---
  return (
    <div className="flex h-full w-full bg-slate-50">
      
      {/* Left Column (Filters OR Details) - Always visible on large screens | lg:order-1 */}
      <div className={`w-full lg:w-1/3 max-w-lg bg-white border-r border-slate-200 shadow-2xl overflow-y-auto lg:order-1 ${selectedItem ? 'hidden lg:block' : 'block'}`}>
        {FiltersAndListPanel}
      </div>
      
      {/* Right Column (Map) | lg:order-2 */}
      <div className={`flex-1 flex flex-col transition-all lg:w-2/3 lg:order-2 ${selectedItem ? 'lg:w-2/3' : 'lg:w-full lg:max-w-[70%]'}`}>
        <div className="flex-1 min-h-[60vh] lg:min-h-full border-l border-slate-200">
          <MapContent 
            items={filtered} 
            selectedItem={selectedItem} 
            setSelectedItem={setSelectedItem} 
            center={center}
          />
        </div>
      </div>

      {/* Item Details Overlay (Mobile + Desktop selected state) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 top-0 bg-white z-40 overflow-y-auto lg:relative lg:block ${selectedItem ? 'w-full lg:w-1/3' : 'hidden'}`}
          >
            <ItemDetails item={selectedItem} clearSelection={() => setSelectedItem(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filter Overlay (Shows the ExpandedFilterControls) */}
      <AnimatePresence> 
        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 bg-white z-50 p-6 lg:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
                <h3 className="text-2xl font-bold text-slate-900">Advanced Filters</h3>
                <button onClick={() => setShowFilterPanel(false)} className="p-2 text-slate-500 hover:text-red-500 transition rounded-full hover:bg-slate-50" title="Close Filters">
                    <X size={24} />
                </button>
            </div>
            {ExpandedFilterControls}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Button to toggle Item List / Filters */}
      <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button 
          onClick={() => {
            if (selectedItem) {
              setSelectedItem(null);
            } else {
              // Toggle between map-only and list/filter view on mobile
              setShowFilterPanel(true); // Show the filter modal/list
            }
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg font-semibold hover:bg-blue-700 transition"
        >
          {selectedItem ? 'Close Details' : 'View Item List'}
        </button>
      </div>

    </div>
  );
}