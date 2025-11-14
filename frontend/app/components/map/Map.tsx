// app/components/map/Map.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { MdLocationOn, MdWork } from "react-icons/md";
import { fetchMapData, ComplaintData, ProjectData } from "@/lib/api";
import LoadingState from "./LoadingState";

type MarkerItem =
  | (ComplaintData & { kind: "complaint" })
  | (ProjectData & { kind: "project" });

const DEFAULT_CENTER: [number, number] = [21.1458, 79.0882]; // neutral center if no data

function getMarkerHtml(iconSvg: string, color: string) {
  // small circular badge with embedded SVG icon (no emojis)
  return `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      width:36px;height:36px;
      border-radius:50%;
      background:${color};
      box-shadow:0 1px 4px rgba(0,0,0,0.3);
    ">
      ${iconSvg}
    </div>
  `;
}

function createDivIcon(color: string, type: "project" | "complaint") {
  const svg =
    type === "project"
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2L20 6V18L12 22L4 18V6L12 2Z" />
       </svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
       </svg>`;

  return L.divIcon({
    html: getMarkerHtml(svg, color),
    className: "custom-div-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

export default function Map() {
  const [items, setItems] = useState<MarkerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [showComplaints, setShowComplaints] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "in_progress" | "resolved"
  >("all");
  const [severityMin, setSeverityMin] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchMapData();
        // normalize items: complaints with kind 'complaint', projects with kind 'project'
        const complaints = (data.complaints ?? []).map((c) => ({
          ...c,
          kind: "complaint" as const,
        }));
        const projects = (data.projects ?? []).map((p) => ({
          ...p,
          kind: "project" as const,
        }));
        if (!mounted) return;
        setItems([...complaints, ...projects]);
      } catch (e) {
        console.error("Failed to load map data", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, 30000); // auto-refresh every 30s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (it.kind === "complaint") {
        if (!showComplaints) return false;
        if (statusFilter !== "all" && it.status?.toLowerCase() !== statusFilter)
          return false;
        if ((it.severity ?? 1) < severityMin) return false;
        if (
          search &&
          !`${it.title} ${it.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
          return false;
        return true;
      } else {
        if (!showProjects) return false;
        if (
          search &&
          !`${it.title} ${it.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
          return false;
        return true;
      }
    });
  }, [items, showComplaints, showProjects, statusFilter, severityMin, search]);

  // choose center
  const first = filtered.find(
    (f) =>
      typeof (f as any).lat === "number" && typeof (f as any).lng === "number"
  );
  const center: [number, number] = first
    ? [(first as any).lat, (first as any).lng]
    : DEFAULT_CENTER;

  if (loading) return <LoadingState />;

  return (
    <div className="h-full flex flex-col md:flex-row gap-4">
      {/* Left: controls */}
      <aside className="w-full md:w-80 bg-white p-4 rounded-md shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or description"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="complaints"
            type="checkbox"
            checked={showComplaints}
            onChange={(e) => setShowComplaints(e.target.checked)}
          />
          <label htmlFor="complaints" className="text-sm">
            Show Complaints
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="projects"
            type="checkbox"
            checked={showProjects}
            onChange={(e) => setShowProjects(e.target.checked)}
          />
          <label htmlFor="projects" className="text-sm">
            Show Projects
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum severity
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={severityMin}
            onChange={(e) => setSeverityMin(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-gray-500">
            Showing severity ≥ {severityMin}
          </div>
        </div>

        <div className="pt-2">
          <div className="text-xs text-gray-500">
            Items shown:{" "}
            <span className="font-semibold text-gray-700">
              {filtered.length}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            onClick={() => {
              setShowComplaints(true);
              setShowProjects(true);
              setStatusFilter("all");
              setSeverityMin(1);
              setSearch("");
            }}
          >
            Reset filters
          </button>
        </div>
      </aside>

      {/* Right: map */}
      <div className="flex-1 rounded-md overflow-hidden relative">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", minHeight: 480 }}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map((it) => {
            const lat = (it as any).lat;
            const lng = (it as any).lng;
            if (typeof lat !== "number" || typeof lng !== "number") return null;

            // choose color by kind + status
            let color = "#2563eb"; // default blue
            if (it.kind === "project") {
              color =
                (it as ProjectData).status?.toLowerCase() === "completed"
                  ? "#16a34a"
                  : "#2563eb";
            } else {
              const s = (it as ComplaintData).status?.toLowerCase();
              if (s === "pending") color = "#f59e0b"; // amber
              else if (s === "in_progress") color = "#2563eb"; // blue
              else if (s === "resolved") color = "#16a34a"; // green
            }

            const icon = createDivIcon(
              color,
              it.kind === "project" ? "project" : "complaint"
            );

            const title = it.title ?? (it as any).name ?? "Untitled";
            const description = (it as any).description ?? "";

            return (
              <Marker
                key={`${it.kind}-${it.id}`}
                position={[lat, lng]}
                icon={icon as any}
              >
                <Popup minWidth={220}>
                  <div className="max-w-xs">
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <p className="text-xs text-gray-600 mb-2">{description}</p>

                    {(it as any).photoUrl && (
                      // show image - use full URL if backend returns relative path
                      <img
                        src={
                          (it as any).photoUrl.startsWith("/uploads")
                            ? `${window.location.protocol}//${
                                window.location.hostname
                              }:8080${(it as any).photoUrl}`
                            : `http://localhost:8080/uploads/${
                                (it as any).photoUrl
                              }`
                        }
                        alt="photo"
                        className="w-full h-36 object-cover rounded mb-2"
                      />
                    )}

                    <div className="flex gap-2">
                      <a
                        className="text-sm text-blue-600 font-semibold"
                        href={
                          it.kind === "complaint"
                            ? `/dashboard/citizen/complaints/${it.id}`
                            : `/projects/${it.id}`
                        }
                      >
                        View details
                      </a>
                      <span className="text-xs text-gray-500">• {it.kind}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        {/* Legend */}
        <div className="absolute right-6 bottom-6 bg-white border rounded-md p-4 shadow-lg text-sm z-[9999] space-y-2">
          <div className="font-semibold">Legend</div>

          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: "#f59e0b" }}
            />
            Complaint – Pending
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: "#2563eb" }}
            />
            In Progress / Project
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: "#16a34a" }}
            />
            Resolved / Completed
          </div>
        </div>
      </div>
    </div>
  );
}
