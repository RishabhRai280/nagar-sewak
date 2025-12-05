"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { submitComplaint, Token } from "@/lib/api/api";
import { validateComplaint, sanitizeInput } from "@/lib/utils/validation";
import { MapPin, Upload, AlertCircle, Loader, CheckCircle, FileText, ShieldAlert, X, ChevronRight, Map as MapIcon, Navigation } from 'lucide-react';

const MiniMap = dynamic(() => import("../shared/MiniMap"), { ssr: false });
const LocationPicker = dynamic(() => import("../shared/LocationPicker"), { ssr: false });

export default function CitizenComplaintForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState(3);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showMapPicker, setShowMapPicker] = useState(false);

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

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocationStatus("success");
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 6) {
      setError("Maximum 6 media files allowed");
      return;
    }
    setSelectedFiles([...selectedFiles, ...files]);
    setError(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
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
      file: selectedFiles.length > 0 ? selectedFiles[0] : null,
    });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      setError("Please fix the validation errors before submitting.");
      return;
    }

    if (selectedFiles.length === 0) {
      setError("Please upload at least one media file");
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
        selectedFiles
      );
      
      router.push("/dashboard/citizen?submission=success");
    } catch (err: any) {
      const errorMessage = err?.message || err?.toString() || "Failed to submit complaint. Please try again.";
      setError(errorMessage);
      setValidationErrors([errorMessage]);
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

              {/* Upload Box - Photos / Video / 360 */}
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                  Evidence ({selectedFiles.length}/6 items)
                </label>
                <div className="relative h-full min-h-[200px]">
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/webm"
                    onChange={handleFileChange}
                    multiple
                    disabled={loading || selectedFiles.length >= 6}
                    className="hidden"
                    id="image-input"
                  />
                  
                  {selectedFiles.length === 0 ? (
                    <label
                      htmlFor="image-input"
                      className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 bg-white/30"
                    >
                      <div className="text-center p-6 group">
                        <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform text-slate-400 group-hover:text-blue-500">
                          <Upload size={24} />
                        </div>
                        <p className="font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Upload Photos / Video</p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Up to 6 items (JPG, PNG, MP4, WEBM)</p>
                      </div>
                    </label>
                  ) : (
                    <div className="absolute inset-0 p-3 bg-white/30 rounded-3xl border-2 border-emerald-500/50 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {selectedFiles.map((file, index) => {
                          const isVideo = file.type.startsWith("video/");
                          const previewUrl = URL.createObjectURL(file);
                          return (
                          <motion.div
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative group"
                          >
                            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                              {isVideo ? (
                                <video
                                  src={previewUrl}
                                  controls
                                  className="w-full h-full object-cover bg-black"
                                />
                              ) : (
                                <img
                                  src={previewUrl}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </motion.div>
                          );
                        })}
                      </div>
                      {selectedFiles.length < 6 && (
                        <label
                          htmlFor="image-input"
                          className="block w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-center text-sm font-bold cursor-pointer transition-colors"
                        >
                          + Add More
                        </label>
                      )}
                    </div>
                  )}
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
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <motion.button
                      type="button"
                      onClick={getLocation}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${locationStatus === "success"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-white text-blue-600 shadow-md hover:shadow-lg"
                        }`}
                    >
                      {locationStatus === "fetching" ? <Loader className="animate-spin" size={14} /> : <Navigation size={14} />}
                      {locationStatus === "fetching" ? "Locating..." : "GPS"}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setShowMapPicker(!showMapPicker)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 bg-white text-indigo-600 shadow-md hover:shadow-lg"
                    >
                      <MapIcon size={14} />
                      Pick on Map
                    </motion.button>
                  </div>
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

      {/* Map Picker Modal */}
      <AnimatePresence>
        {showMapPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMapPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Pick Location on Map</h3>
                  <p className="text-sm text-slate-600 mt-1">Click anywhere on the map to set the location</p>
                </div>
                <button
                  onClick={() => setShowMapPicker(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="h-[500px] relative">
                <LocationPicker
                  lat={latitude}
                  lng={longitude}
                  onLocationSelect={handleMapLocationSelect}
                />
              </div>
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                {latitude && longitude ? (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-600">Selected: </span>
                      <span className="font-mono font-bold text-slate-900">
                        {latitude.toFixed(6)}, {longitude.toFixed(6)}
                      </span>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setShowMapPicker(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      Confirm Location
                    </motion.button>
                  </div>
                ) : (
                  <p className="text-center text-slate-500 text-sm">Click on the map to select a location</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}