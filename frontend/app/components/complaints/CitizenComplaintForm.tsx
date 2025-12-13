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
            <div className="flex flex-col items-start gap-4 mb-10">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 p-2 shadow-lg">
                {/* Ashoka Emblem */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Satyamev Jayate"
                  className="w-full h-full object-contain drop-shadow-md invert brightness-0"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-2xl tracking-tight leading-none">NAGAR<br />SEWAK</h3>
                <p className="text-[10px] font-medium tracking-widest opacity-70 mt-1 uppercase">Official Citizen Portal</p>
              </div>
            </div>

            {/* --- Process Visualization --- */}
            <div className="flex-1 flex flex-col justify-center py-8">
              <div className="space-y-8 relative">
                {/* Connecting Line */}
                <div className="absolute left-[19px] top-2 bottom-8 w-0.5 bg-blue-400/30"></div>

                {/* Step 1 */}
                <div className="relative flex gap-4 group">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-blue-600 border-4 border-[#1e3a8a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText size={18} className="text-blue-200" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">Report Filed</h4>
                    <p className="text-blue-200/80 text-xs leading-relaxed max-w-[200px]">
                      Instant ID generation & AI-based categorization routed to the correct department.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex gap-4 group">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-blue-600 border-4 border-[#1e3a8a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 delay-100">
                    <Navigation size={18} className="text-blue-200" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">Officer On-Site</h4>
                    <p className="text-blue-200/80 text-xs leading-relaxed max-w-[200px]">
                      Field officer dispatched to the geotagged location for verification.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex gap-4 group">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-emerald-500 border-4 border-[#1e3a8a] flex items-center justify-center shadow-lg shadow-emerald-900/50 group-hover:scale-110 transition-transform duration-300 delay-200">
                    <CheckCircle size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">Resolution</h4>
                    <p className="text-blue-200/80 text-xs leading-relaxed max-w-[200px]">
                      Issue resolved with photo evidence & updated status on your dashboard.
                    </p>
                  </div>
                </div>
              </div>
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

          <form onSubmit={handleSubmit} className="p-6 md:p-8 h-full overflow-y-auto custom-scrollbar">

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">New Grievance Report</h1>
              <p className="text-slate-500 text-sm">Fill in the details below to file an official complaint.</p>
            </div>

            {/* Error Notification */}
            {(error || validationErrors.length > 0) && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-md flex items-start gap-3 animate-pulse">
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

            <div className="space-y-6">
              {/* INPUTS */}
              <div className="space-y-6">
                <div className="relative group">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wide">Subject <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400 font-bold text-sm shadow-sm"
                      placeholder="e.g. Water Leakage in Sector 4"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wide">Description <span className="text-red-500">*</span></label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm text-slate-900 resize-none placeholder:text-slate-400 shadow-sm leading-relaxed"
                    placeholder="Provide detailed information about the issue..."
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-3 block tracking-wide">Urgency Level</label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSeverity(lvl)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all transform active:scale-95 ${severity === lvl
                          ? lvl <= 2 ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200 shadow-lg'
                            : lvl <= 3 ? 'bg-amber-500 border-amber-500 text-white shadow-amber-200 shadow-lg'
                              : 'bg-red-600 border-red-600 text-white shadow-red-200 shadow-lg'
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase px-1">
                    <span>Routine Check</span>
                    <span>Immediate Action</span>
                  </div>
                </div>
              </div>

              {/* LOCATION & EVIDENCE - VERTICAL STACK */}
              <div className="space-y-6 pt-6 mt-2 border-t border-slate-100">

                {/* Location - Full Width */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-slate-500 uppercase block tracking-wide">Location Details</label>
                    {latitude && <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1"><CheckCircle size={10} /> GPS Locked</span>}
                  </div>

                  <div className="relative h-40 bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-100 group cursor-pointer shadow-inner" onClick={() => setShowMapPicker(true)}>
                    {latitude && longitude ? (
                      <MiniMap lat={latitude} lng={longitude} />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <MapPin size={32} className="mb-2 opacity-50" />
                        <span className="text-sm font-bold text-slate-500">Tap map to set location</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={getLocation} className="py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-sm uppercase tracking-wider">
                      <Navigation size={14} /> Detect My Location
                    </button>
                    <button type="button" onClick={() => setShowMapPicker(true)} className="py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-sm uppercase tracking-wider">
                      <MapPin size={14} /> Pin on Map
                    </button>
                  </div>
                </div>

                {/* File Upload - Adaptive sizing */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase block tracking-wide">Evidence Upload ({selectedFiles.length}/6)</label>

                  <div className={selectedFiles.length > 0 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "block"}>
                    {/* Dropzone - Resizes based on state */}
                    <label className={`
                          flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-blue-500 transition group bg-slate-50/50 relative overflow-hidden
                          ${selectedFiles.length === 0 ? "h-64 border-spacing-4" : "h-40"}
                      `}>
                      <div className={`
                            rounded-full bg-slate-200 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors
                            ${selectedFiles.length === 0 ? "w-20 h-20" : "w-12 h-12"}
                        `}>
                        <Upload className="text-slate-400 group-hover:text-blue-600" size={selectedFiles.length === 0 ? 32 : 20} />
                      </div>
                      <span className={`font-bold text-slate-500 group-hover:text-blue-700 uppercase ${selectedFiles.length === 0 ? "text-lg" : "text-xs"}`}>
                        {selectedFiles.length === 0 ? "Click to Upload Evidence" : "Add More"}
                      </span>
                      {selectedFiles.length === 0 && (
                        <p className="text-slate-400 text-xs mt-2">Supports JPG, PNG, MP4</p>
                      )}
                      <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                    </label>

                    {/* Side Previews */}
                    {selectedFiles.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 h-40 overflow-y-auto custom-scrollbar content-start">
                        {selectedFiles.map((file, i) => (
                          <div key={i} className="relative aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm group h-full">
                            {file.type.startsWith('image') ? (
                              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                                <FileText size={20} className="text-slate-400 mb-1" />
                                <span className="text-[8px] text-slate-500 truncate w-full">{file.name}</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); removeFile(i); }}
                                className="bg-red-600 text-white rounded-full p-1.5 hover:scale-110 transition"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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