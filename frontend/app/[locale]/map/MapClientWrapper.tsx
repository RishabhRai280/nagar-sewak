// app/map/MapClientWrapper.tsx
"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import "leaflet/dist/leaflet.css";
import LoadingState from "@/app/components/map/LoadingState";
import { fetchMapData, ComplaintData, ProjectData } from "@/lib/api";

// Define combined type for map markers
type MarkerItem =
  | (ComplaintData & { kind: "complaint" })
  | (ProjectData & { kind: "project" });

// Dynamically load Map component (client-side only)
const Map = dynamic(() => import("@/app/components/map/Map"), { ssr: false });

export default function MapClientWrapper() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<MarkerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [showComplaints, setShowComplaints] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "in_progress" | "resolved"
  >("all");
  const [severityMin, setSeverityMin] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  // Selection State
  const [selectedItem, setSelectedItem] = useState<MarkerItem | null>(null);
  const [autoSelectProcessed, setAutoSelectProcessed] = useState(false);

  // --- Data Fetching Effect ---
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchMapData();

        // Normalize items: complaints with kind 'complaint', projects with kind 'project'
        const complaints = (data.complaints ?? []).map((c) => ({
          ...c,
          kind: "complaint" as const,
        }));
        const projects = (data.projects ?? []).map((p) => ({
          ...p,
          kind: "project" as const,
        }));

        if (mounted) {
          setItems([...complaints, ...projects]);
          setError(null);
        }
      } catch (e) {
        console.error("Failed to load map data", e);
        if (mounted) setError("Failed to load map data. Please try again.");
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

  // --- Filtering Logic ---
  const filtered = useMemo(() => {
    return items.filter((it) => {
      // 1. Search filter (applies to both)
      if (
        search &&
        !`${it.title} ${it.description}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false;
      }

      if (it.kind === "complaint") {
        if (!showComplaints) return false;

        // 2. Status filter
        if (statusFilter !== "all" && it.status?.toLowerCase() !== statusFilter)
          return false;

        // 3. Severity filter
        if ((it.severity ?? 1) < severityMin) return false;

        return true;
      } else {
        if (!showProjects) return false;
        return true;
      }
    });
  }, [items, showComplaints, showProjects, statusFilter, severityMin, search]);

  // Handle selected item becoming filtered out
  useEffect(() => {
    if (selectedItem && !filtered.find(item => item.id === selectedItem.id && item.kind === selectedItem.kind)) {
      setSelectedItem(null);
    }
  }, [filtered, selectedItem]);

  // Handle URL parameters for auto-selection
  useEffect(() => {
    if (!autoSelectProcessed && items.length > 0) {
      const complaintId = searchParams.get('complaintId');
      const projectId = searchParams.get('projectId');
      const lat = searchParams.get('lat');
      const lng = searchParams.get('lng');

      if (complaintId) {
        const complaint = items.find(item =>
          item.kind === 'complaint' && item.id === parseInt(complaintId)
        );
        if (complaint) {
          setSelectedItem(complaint);
          setShowComplaints(true);
          setAutoSelectProcessed(true);
        }
      } else if (projectId) {
        const project = items.find(item =>
          item.kind === 'project' && item.id === parseInt(projectId)
        );
        if (project) {
          setSelectedItem(project);
          setShowProjects(true);
          setAutoSelectProcessed(true);
        }
      } else if (lat && lng) {
        // Find closest item to the coordinates
        const targetLat = parseFloat(lat);
        const targetLng = parseFloat(lng);

        // Even if no item found, we might want to center here (handled by Map component if passed)
        // Ideally MapClientWrapper shouldn't just "find closest". 
        // But for now, let's keep existing logic.

        let closestItem: MarkerItem | null = null;
        // ... (rest of logic)
        let minDistance = Infinity;

        items.forEach(item => {
          if (item.lat && item.lng) {
            const distance = Math.sqrt(
              Math.pow(item.lat - targetLat, 2) + Math.pow(item.lng - targetLng, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              closestItem = item;
            }
          }
        });

        if (closestItem && minDistance < 0.01) { // Within reasonable distance
          const validItem = closestItem as MarkerItem;
          setSelectedItem(validItem);
          if (validItem.kind === 'complaint') setShowComplaints(true);
          if (validItem.kind === 'project') setShowProjects(true);
          setAutoSelectProcessed(true);
        }
      } else if (lat && lng) {
        // ... existing closest item logic ...
        const targetLat = parseFloat(lat);
        const targetLng = parseFloat(lng);
        // ... (keep finding closest item logic if you want auto-select)

        // ADDED: Set view target even if no item selected yet
        // This state needs to be passed to Map component
      }
    }
  }, [items, searchParams, autoSelectProcessed]);

  // NEW: target for map view
  const locationTarget = useMemo(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const zoom = searchParams.get('zoom');
    if (lat && lng) {
      return { lat: parseFloat(lat), lng: parseFloat(lng), zoom: zoom ? parseInt(zoom) : 16 };
    }
    return null;
  }, [searchParams]);


  return (
    <Suspense fallback={<LoadingState />}>
      <Map
        items={items}
        setItems={setItems}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        showComplaints={showComplaints}
        setShowComplaints={setShowComplaints}
        showProjects={showProjects}
        setShowProjects={setShowProjects}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        severityMin={severityMin}
        setSeverityMin={setSeverityMin}
        search={search}
        setSearch={setSearch}
        filtered={filtered}
        autoSelectProcessed={autoSelectProcessed}
        initialLocationTarget={locationTarget} // Pass as initialLocationTarget
      />
    </Suspense>
  );
}