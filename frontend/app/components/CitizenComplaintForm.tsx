"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { submitComplaint, Token } from "@/lib/api";
import { MapPin, Upload, AlertCircle, Loader, CheckCircle } from 'lucide-react';

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
      // NOTE: Replacing alert() with push redirect
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
        setError(`Location access denied: ${err.message}`);
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

      // NOTE: Replacing alert() with redirect and message appended to URL (if needed)
      router.push("/dashboard/citizen?submission=success");
    } catch (err: any) {
      setError(err?.message ?? "Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-center tracking-wide text-slate-900">
          Report a Civic Issue
        </h2>
        <p className="text-center text-slate-600 mt-2">
          Help authorities identify and resolve public problems faster.
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3"
            >
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Issue Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
              placeholder="e.g., Broken street light, Pothole in road"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Detailed Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              disabled={loading}
              placeholder="Describe the issue in detail. Include what needs to be fixed and any relevant context..."
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 resize-none"
            />
          </div>

          {/* Severity Slider */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Severity Level: <span className="text-blue-600">{severity}/5</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                disabled={loading}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-8 rounded ${
                      level <= severity
                        ? level <= 2
                          ? "bg-emerald-500"
                          : level <= 3
                          ? "bg-yellow-500"
                          : "bg-red-500"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Current level: {severity <= 2 ? "Low Priority" : severity <= 3 ? "Medium Priority" : "High Priority"}
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Upload Photo Evidence
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                required
                disabled={loading}
                className="hidden"
                id="image-input"
              />
              <label
                htmlFor="image-input"
                className="flex items-center justify-center gap-3 w-full px-4 py-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer group"
              >
                <Upload className="text-slate-400 group-hover:text-blue-600" size={24} />
                <div className="text-center">
                  <p className="font-medium text-slate-900">
                    {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                </div>
              </label>
            </div>
            {selectedFile && (
              <div className="mt-3 flex items-center gap-2 text-emerald-600 text-sm font-medium">
                <CheckCircle size={16} />
                Image selected: {selectedFile.name}
              </div>
            )}
          </div>

          {/* GPS Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              GPS Location
            </label>
            <motion.button
              type="button"
              onClick={getLocation}
              disabled={loading || locationStatus === "fetching"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                locationStatus === "success"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  : "bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 disabled:opacity-50"
              }`}
            >
              {locationStatus === "fetching" ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Fetching Location...
                </>
              ) : locationStatus === "success" ? (
                <>
                  <CheckCircle size={20} />
                  Location Tagged ({latitude?.toFixed(4)}, {longitude?.toFixed(4)})
                </>
              ) : (
                <>
                  <MapPin size={20} />
                  Get Current GPS Location
                </>
              )}
            </motion.button>
          </div>

          {/* Mini Map */}
          {latitude && longitude && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-lg overflow-hidden border-2 border-slate-200 shadow-md"
            >
              <div className="h-64">
                <MiniMap lat={latitude} lng={longitude} />
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || !latitude || !longitude || !selectedFile}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Submitting...
              </>
            ) : (
              <>
                <AlertCircle size={20} />
                Submit Complaint
              </>
            )}
          </motion.button>

          <p className="text-xs text-slate-500 text-center">
            Your complaint will be reviewed and tracked in real-time. You'll receive updates via email and in your dashboard.
          </p>
        </form>
      </div>
    </motion.div>
  );
}