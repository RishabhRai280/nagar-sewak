"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { submitComplaint, Token } from "@/lib/api/api";
import { validateComplaint, sanitizeInput } from "@/lib/utils/validation";
import {
  MapPin, Upload, AlertCircle, Loader, CheckCircle,
  FileText, Shield, X, ChevronRight, Image as ImageIcon,
  Navigation, AlertTriangle, Building
} from 'lucide-react';

const MiniMap = dynamic(() => import("../shared/MiniMap"), { ssr: false });
const LocationPicker = dynamic(() => import("../shared/LocationPicker"), { ssr: false });

export default function CitizenComplaintForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState(1);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [locationStatus, setLocationStatus] = useState<"idle" | "fetching" | "success" | "error">("idle");

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = Token.get();
    if (!token) {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLocationStatus("error");
      return;
    }
    setLocationStatus("fetching");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationStatus("success");
        setError(null);
      },
      (err) => {
        let errorMessage = "Unable to get your location. ";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += "Please allow location access.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += "Location unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage += "Request timed out.";
            break;
          default:
            errorMessage += "Unknown error.";
        }
        setError(errorMessage);
        setLocationStatus("error");
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 300000
      }
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

    const sanitizedTitle = sanitizeInput(title);
    const sanitizedDescription = sanitizeInput(description);

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
      setError("Please fill in all required fields marked with *");
      return;
    }

    if (selectedFiles.length === 0) {
      setError("At least one evidence photo/video is required for verification.");
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
      const errorMessage = err?.message || err?.toString() || "Failed to submit. Please try again.";
      setError(errorMessage);
      setValidationErrors([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

        {/* --- LEFT SIDE BANNER --- */}
        <div className="lg:w-1/3 bg-[#1e3a8a] text-white p-8 md:p-12 flex flex-col relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -ml-16 -mb-16"></div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Shield size={24} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-wide">NAGAR SEWAK</span>
            </div>

            <div className="mt-auto mb-12">
              <h2 className="text-3xl font-black leading-tight mb-4">
                Your Voice,<br />
                Our Action.
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed opacity-90">
                Together, we build a cleaner, safer, and smarter city. Report issues directly to the administration and track real-time progress.
              </p>
            </div>

            <div className="space-y-4 text-xs font-medium text-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-700/50 flex items-center justify-center"><CheckCircle size={12} /></div>
                <span>Geo-Tagged Reports</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-700/50 flex items-center justify-center"><CheckCircle size={12} /></div>
                <span>Direct Escalation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-700/50 flex items-center justify-center"><CheckCircle size={12} /></div>
                <span>Transparent Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE FORM --- */}
        <div className="flex-1 bg-white relative">
          {/* Tricolor Top Bar (Mobile Only) */}
          <div className="lg:hidden absolute top-0 left-0 right-0 h-1.5 flex">
            <div className="w-1/3 bg-[#f97316]"></div>
            <div className="w-1/3 bg-white"></div>
            <div className="w-1/3 bg-[#166534]"></div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 h-full overflow-y-auto custom-scrollbar">

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">New Grievance Report</h1>
              <p className="text-slate-500 text-sm">Fill in the details below to file an official complaint.</p>
            </div>

            {/* Error Notification */}
            {(error || validationErrors.length > 0) && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-md flex items-start gap-3 animate-pulse">
                <AlertCircle className="text-red-600 mt-0.5" size={20} />
                <div>
                  <h4 className="text-red-800 font-bold text-sm">Submission Failed</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                  {validationErrors.length > 0 && (
                    <ul className="list-disc list-inside text-red-700 text-xs mt-2 pl-1">
                      {validationErrors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* INPUTS */}
              <div className="space-y-5">
                <div className="relative group">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Subject <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400 font-medium"
                      placeholder="e.g. Water Leakage in Sector 4"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Description <span className="text-red-500">*</span></label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm text-slate-900 resize-none placeholder:text-slate-400"
                    placeholder="Provide detailed information about the issue..."
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Urgency Level</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSeverity(lvl)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${severity === lvl
                          ? lvl <= 2 ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-200'
                            : lvl <= 3 ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200'
                              : 'bg-red-600 border-red-600 text-white shadow-md shadow-red-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 font-bold uppercase px-1">
                    <span>Routine</span>
                    <span>Immediate Action</span>
                  </div>
                </div>
              </div>

              {/* LOCATION & EVIDENCE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                {/* Map Preview */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Location</label>
                  <div className="relative h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group cursor-pointer" onClick={() => setShowMapPicker(true)}>
                    {latitude && longitude ? (
                      <MiniMap lat={latitude} lng={longitude} />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <MapPin size={20} className="mb-1" />
                        <span className="text-[10px] font-bold">Tap to Pick</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={getLocation} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded flex items-center justify-center gap-1 transition">
                      <Navigation size={12} /> Detect
                    </button>
                    <button type="button" onClick={() => setShowMapPicker(true)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded flex items-center justify-center gap-1 transition">
                      <MapPin size={12} /> Pin
                    </button>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Evidence ({selectedFiles.length}/6)</label>
                  <label className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition group">
                    <Upload className="text-slate-400 group-hover:text-blue-500 mb-1" size={20} />
                    <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600">Upload Files</span>
                    <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                  </label>

                  {selectedFiles.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide">
                      {selectedFiles.map((file, i) => (
                        <div key={i} className="flex-shrink-0 w-10 h-10 rounded bg-slate-100 relative group overflow-hidden border border-slate-200">
                          {file.type.startsWith('image') ? (
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><FileText size={14} className="text-slate-400" /></div>
                          )}
                          <button type="button" onClick={(e) => { e.preventDefault(); removeFile(i); }} className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale"
              >
                {loading ? <Loader className="animate-spin" size={18} /> : <>Submit Report <ChevronRight size={18} /></>}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map Picker Modal */}
      <AnimatePresence>
        {showMapPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMapPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200"
            >
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Pinpoint Location</h3>
                <button
                  onClick={() => setShowMapPicker(false)}
                  className="w-8 h-8 rounded hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500"
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
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowMapPicker(false)}
                  className="px-6 py-2 bg-slate-800 text-white text-xs font-bold uppercase rounded hover:bg-slate-900 transition"
                >
                  Confirm Coordinates
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}