"use client";

import { useEffect, useState } from "react";
import { fetchComplaintById, ComplaintDetail } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

export default function CitizenComplaintDetails() {
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/");
    const parsed = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(parsed)) setId(parsed);
  }, []);

  const [data, setData] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id == null) return;
    setLoading(true);
    fetchComplaintById(id)
      .then((d) => setData(d))
      .catch((e) => setError(e.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  // Setup Leaflet map after data loads
  useEffect(() => {
    if (!data?.lat || !data?.lng) return;

    // Load Leaflet CSS
    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(leafletCSS);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = (window as any).L;
      const map = L.map("complaint-map").setView([data.lat, data.lng], 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.marker([data.lat, data.lng])
        .addTo(map)
        .bindPopup(data.title)
        .openPopup();
    };
    document.body.appendChild(script);
  }, [data]);

  if (loading)
    return <div className="p-10 text-center">Loading complaint...</div>;
  if (error)
    return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!data) return <div className="p-10 text-center">No data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <button
        onClick={() => history.back()}
        className="flex items-center gap-2 text-gray-700 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-white shadow-md rounded-lg border">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-semibold text-gray-900">{data.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Reported by {data.userFullName ?? "Citizen"} •{" "}
            {data.createdAt ? new Date(data.createdAt).toLocaleString() : ""}
          </p>
        </div>

        {data.photoUrl && (
          <div className="p-6 space-y-2">
            <img
              src={`http://localhost:8080/uploads/${data.photoUrl}`}
              alt="Complaint image"
              className="rounded-md shadow-md w-full max-h-[370px] object-cover"
            />
            <a
              href={`http://localhost:8080/uploads/${data.photoUrl}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              View full size image
            </a>
          </div>
        )}

        <div className="p-6 border-t space-y-6">
          <p className="text-gray-700 leading-relaxed text-[15.5px]">
            {data.description}
          </p>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="space-x-1">
              <span className="text-gray-500">Severity:</span>
              <span
                className={`px-2 py-0.5 rounded text-white ${
                  data.severity >= 4
                    ? "bg-red-600"
                    : data.severity === 3
                    ? "bg-yellow-600"
                    : "bg-green-600"
                }`}
              >
                {data.severity}/5
              </span>
            </div>

            <div className="space-x-1">
              <span className="text-gray-500">Status:</span>
              <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-800 font-medium">
                {data.status}
              </span>
            </div>

            <div className="space-x-1">
              <span className="text-gray-500">Location:</span>
              <strong>
                {data.lat?.toFixed(4)}, {data.lng?.toFixed(4)}
              </strong>
            </div>
          </div>

          {/* LEAFLET MAP */}
          {data.lat && data.lng && (
            <div className="mt-4">
              <p className="text-gray-600 mb-2 font-medium">Location Map</p>
              <div
                id="complaint-map"
                style={{ height: "350px", width: "100%", borderRadius: "8px" }}
                className="shadow-md"
              ></div>
              <a
                href={`https://www.google.com/maps?q=${data.lat},${data.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 underline hover:text-blue-800 block mt-2"
              >
                Open in Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
