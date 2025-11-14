"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { submitComplaint, Token } from "@/lib/api";

const MiniMap = dynamic(() => import("./MiniMap"), { ssr: false });

export default function CitizenComplaintForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState(3);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "fetching" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (!Token.get()) {
      alert("You must be logged in to report an issue.");
      router.push("/login");
    }
  }, [router]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLocationStatus("error");
      return;
    }

    setLocationStatus("fetching");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationStatus("success");
      },
      (err) => {
        setError(`Location access denied or failed: ${err.message}`);
        setLocationStatus("error");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!latitude || !longitude) {
      setError("Please tag your GPS location before submitting.");
      return;
    }

    if (!selectedFile) {
      setError("An image is required as proof.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        severity,
        lat: latitude,
        lng: longitude,
      };
      await submitComplaint(payload, selectedFile);

      alert("Complaint submitted successfully.");
      router.push("/dashboard/citizen");
    } catch (err: any) {
      setError(err?.message ?? "Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-blue-900 to-cyan-700 text-white px-8 py-6 rounded-xl shadow-xl mb-6">
        <h2 className="text-4xl font-bold text-center tracking-wide">
          Report a Civic Issue
        </h2>
        <p className="text-center text-sm opacity-80 mt-2">
          Help authorities identify and resolve public problems faster.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/75 backdrop-blur-md p-8 rounded-xl shadow-2xl space-y-6 border border-gray-200"
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Issue Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Broken street light"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            disabled={loading}
            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the issue in detail"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Severity (1–5)
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={severity}
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            disabled={loading}
            className="w-full"
          />
          <p className="text-center text-sm text-gray-600 mt-1">
            Selected: {severity}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            required
            disabled={loading}
            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300"
          />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={getLocation}
            disabled={loading || locationStatus === "fetching"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all font-semibold shadow-md"
          >
            {locationStatus === "fetching"
              ? "Fetching Location..."
              : "Get Current GPS Location"}
          </button>

          {latitude && longitude && (
            <div className="h-60 overflow-hidden rounded-lg border border-gray-300 shadow-md">
              <MiniMap lat={latitude} lng={longitude} />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !latitude || !longitude}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white py-3 rounded-lg shadow-lg text-lg transition-all font-bold"
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}
