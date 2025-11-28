// app/map/MapClientWrapper.tsx
"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
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
      />
    </Suspense>
  );
}