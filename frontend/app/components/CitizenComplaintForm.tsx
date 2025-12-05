"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { submitComplaint, Token } from "@/lib/api";
import { validateComplaint, sanitizeInput } from "@/lib/validation";
import { MapPin, Upload, AlertCircle, Loader, CheckCircle, FileText, ShieldAlert, X, ChevronRight } from 'lucide-react';

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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [locationStatus, setLocationStatus] = useState<"idle" | "fetching" | "success" | "error">("idle");

  useEffect(() => {
    if (!Token.get()) router.push("/login");
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
        setError(null);
      },
      (err) => {
        setError(`Location access denied: ${err.message}`);
        setLocationStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors([]);

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedDescription = sanitizeInput(description);

    // Validate all inputs
    const validation = validateComplaint({
      title: sanitizedTitle,
      description: sanitizedDescription,
      severity,
      lat: latitude,
      lng: longitude,
      file: selectedFile,
    });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      setError("Please fix the validation errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      await submitComplaint(
        {
          title: sanitizedTitle,
          description: sanitizedDescription,
          severity,
          lat: latitude!,
          lng: longitude!
        },
        [selectedFile!] // <--- FIXED: Wrapped in array brackets
      );
      router.push("/dashboard/citizen?submission=success");
    } catch (err: any) {
      setError(err?.message ?? "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header Text */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-blue-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <ShieldAlert size={14} /> Civic Reporting
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
          Report an Issue
        </h2>
        <p className="text-slate-600 text-lg font-medium">
          Submit a geo-tagged report to your local administration.
        </p>
      </div>

      {/* ULTRA-GLASS CARD CONTAINER */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 backdrop-blur-2xl shadow-2xl">

        {/* Decor: Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80" />

        <form onSubmit={handleSubmit} className="p-8 md:p-12 relative z-10">

          {/* Error Banner */}
          {(error || validationErrors.length > 0) && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-8 overflow-hidden">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-md">
                <div className="flex gap-3 items-start">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                  <div className="flex-1">
                    <p className="text-red-800 font-bold text-sm mb-1">Submission Error</p>
                    {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                    {validationErrors.length > 0 && (
                      <ul className="text-red-600 text-sm space-y-1">
                        {validationErrors.map((err, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{err}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* LEFT SIDE: INPUTS */}
            <div className="space-y-8">

              {/* Title */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Issue Title</label>
                <div className="relative transition-all duration-300 group-focus-within:scale-[1.01]">
                  <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="e.g. Large Pothole on Main St."
                    className="w-full pl-14 pr-6 py-5 bg-white/50 hover:bg-white/70 border border-white/60 focus:border-blue-400 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm font-medium text-lg"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  disabled={loading}
                  placeholder="Provide details about the issue..."
                  className="w-full px-6 py-5 bg-white/50 hover:bg-white/70 border border-white/60 focus:border-blue-400 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm font-medium resize-none text-base"
                />
              </div>

              {/* Custom Severity Slider */}
              <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urgency Level</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg transition-colors duration-300 ${severity <= 2 ? "bg-emerald-500 shadow-emerald-500/30" : severity <= 3 ? "bg-orange-500 shadow-orange-500/30" : "bg-red-500 shadow-red-500/30"}`}>
                    {severity === 1 ? "Low" : severity === 5 ? "Critical" : `Level ${severity}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value))}
                  disabled={loading}
                  className="w-full h-3 bg-slate-200/50 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                />
                <div className="flex justify-between mt-2 px-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className={`w-1 h-1 rounded-full ${n <= severity ? 'bg-blue-600 scale-125' : 'bg-slate-300'} transition-all duration-300`} />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: MEDIA & LOCATION */}
            <div className="space-y-8 flex flex-col h-full">

              {/* Upload Box */}
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Evidence</label>
                <div className="relative h-full min-h-[160px]">
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
                    className={`absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 overflow-hidden ${selectedFile
                      ? 'border-emerald-500/50 bg-emerald-50/40'
                      : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 bg-white/30'
                      }`}
                  >
                    {selectedFile ? (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-6">
                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-600 shadow-sm">
                          <CheckCircle size={28} />
                        </div>
                        <p className="font-bold text-emerald-800 truncate max-w-[200px]">{selectedFile.name}</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-1">Click to replace</p>
                      </motion.div>
                    ) : (
                      <div className="text-center p-6 group">
                        <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform text-slate-400 group-hover:text-blue-500">
                          <Upload size={24} />
                        </div>
                        <p className="font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Upload Photo</p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">JPG, PNG (Max 10MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Location Box */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Location</label>
                <div className="p-2 bg-white/40 border border-white/50 rounded-3xl backdrop-blur-sm shadow-sm">
                  <div className="rounded-2xl overflow-hidden border border-white/30 h-32 relative bg-slate-100/50">
                    {latitude && longitude ? (
                      <MiniMap lat={latitude} lng={longitude} />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <MapPin size={24} className="mb-2 opacity-30" />
                        <span className="text-xs font-bold opacity-60">Map Preview</span>
                      </div>
                    )}
                  </div>
                  <motion.button
                    type="button"
                    onClick={getLocation}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full mt-2 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${locationStatus === "success"
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-white text-blue-600 shadow-md hover:shadow-lg border border-transparent"
                      }`}
                  >
                    {locationStatus === "fetching" ? <Loader className="animate-spin" size={16} /> : locationStatus === "success" ? <CheckCircle size={16} /> : <MapPin size={16} />}
                    {locationStatus === "fetching" ? "Locating..." : locationStatus === "success" ? "Location Tagged" : "Tag Current Location"}
                  </motion.button>
                </div>
              </div>

            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-8 mt-4 border-t border-white/30">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {loading ? (
                <> <Loader className="animate-spin" size={24} /> Processing... </>
              ) : (
                <> Submit Report <ChevronRight size={24} /> </>
              )}
            </motion.button>
          </div>

        </form>
      </div>
    </motion.div>
  );
}