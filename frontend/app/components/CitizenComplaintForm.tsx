"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { submitComplaint, Token } from "@/lib/api";
import { validateComplaint, sanitizeInput } from "@/lib/validation";
import { 
  MapPin, Upload, AlertCircle, Loader2, CheckCircle2, 
  FileText, Shield, X, ChevronRight, Camera, 
  AlertTriangle, Info, Crosshair
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Dynamic import for Map to avoid SSR issues
const MiniMap = dynamic(() => import("./MiniMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl" />
});

export default function CitizenComplaintForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState(3);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "fetching" | "success" | "error">("idle");

  useEffect(() => {
    if (!Token.get()) router.push("/login");
  }, [router]);

  // Handle file preview
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

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

    const sanitizedTitle = sanitizeInput(title);
    const sanitizedDescription = sanitizeInput(description);

    const validation = validateComplaint({
      title: sanitizedTitle,
      description: sanitizedDescription,
      severity,
      lat: latitude,
      lng: longitude,
      file: selectedFile,
    });

    if (!validation.valid) {
      setError(validation.errors[0] || "Please check your inputs.");
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
        [selectedFile!]
      );
      router.push("/dashboard/citizen?submission=success");
    } catch (err: any) {
      setError(err?.message ?? "Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  const severityLevels = [
    { level: 1, label: "Low", color: "bg-slate-500", border: "border-slate-200" },
    { level: 2, label: "Medium", color: "bg-blue-500", border: "border-blue-200" },
    { level: 3, label: "High", color: "bg-orange-500", border: "border-orange-200" },
    { level: 4, label: "Critical", color: "bg-red-600", border: "border-red-200" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      
      {/* FORM HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="bg-blue-900 text-white p-1.5 rounded shadow-sm">
               <Shield size={18} />
             </div>
             <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Official Grievance Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            New Complaint Registration
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Please provide accurate details. False reporting is a punishable offense under Municipal Act 1957.
          </p>
        </div>
        
        {/* Status Indicator */}
        <div className="hidden md:block text-right">
           <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">System Status</div>
           <div className="flex items-center justify-end gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
             <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
             </span>
             <span className="text-xs font-bold">GPS Geofencing Active</span>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: DETAILS (8 cols) --- */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                 <FileText size={18} className="text-slate-500" />
                 <h3 className="font-bold text-slate-800">Incident Details</h3>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                {/* Title Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">
                    Subject / Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
                    placeholder="e.g., Deep Pothole at MG Road Intersection"
                    disabled={loading}
                  />
                </div>

                {/* Description Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all placeholder:text-slate-400 resize-none"
                    placeholder="Describe the issue in detail. Mention specific landmarks if possible..."
                    disabled={loading}
                  />
                  <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
                    <Info size={14} className="mt-0.5 text-blue-600" />
                    <p>Please stick to facts. Abusive language will lead to account suspension.</p>
                  </div>
                </div>

                {/* Severity Selector (Segmented Control) */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {severityLevels.map((lvl) => (
                      <button
                        key={lvl.level}
                        type="button"
                        onClick={() => setSeverity(lvl.level)}
                        className={cn(
                          "relative py-3 px-2 rounded-lg border-2 text-sm font-bold transition-all flex flex-col items-center justify-center gap-1",
                          severity === lvl.level 
                            ? `bg-slate-900 text-white border-slate-900 shadow-md` 
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                         {severity === lvl.level && (
                           <motion.div layoutId="active-dot" className={`w-2 h-2 rounded-full absolute top-2 right-2 ${lvl.color.replace('bg-', 'text-')}`} />
                         )}
                         {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Error Message Display */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm flex items-start gap-3"
                >
                  <AlertCircle className="text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-800 text-sm">Submission Error</h4>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* --- RIGHT COLUMN: EVIDENCE & LOCATION (5 cols) --- */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Location Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-min">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <MapPin size={18} className="text-slate-500" />
                   <h3 className="font-bold text-slate-800">Location</h3>
                 </div>
                 {locationStatus === 'success' && (
                   <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">LOCKED</span>
                 )}
              </div>
              
              <div className="relative h-48 bg-slate-100 w-full">
                 {latitude && longitude ? (
                   <MiniMap lat={latitude} lng={longitude} />
                 ) : (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                     <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                       <Crosshair size={24} className="opacity-50" />
                     </div>
                     <span className="text-xs font-medium">Map Preview unavailable</span>
                   </div>
                 )}
                 
                 {/* Floating Action Button */}
                 <div className="absolute bottom-4 right-4 left-4">
                   <button
                     type="button"
                     onClick={getLocation}
                     disabled={locationStatus === 'fetching'}
                     className={cn(
                       "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm shadow-lg transition-all",
                       locationStatus === 'success' 
                         ? "bg-slate-800 text-white hover:bg-slate-900" 
                         : "bg-white text-blue-700 hover:bg-blue-50"
                     )}
                   >
                     {locationStatus === 'fetching' ? (
                       <Loader2 className="animate-spin" size={16} />
                     ) : locationStatus === 'success' ? (
                       <CheckCircle2 size={16} />
                     ) : (
                       <Crosshair size={16} />
                     )}
                     {locationStatus === 'fetching' ? "Acquiring Satellites..." : locationStatus === 'success' ? "Update GPS Location" : "Detect My Location"}
                   </button>
                 </div>
              </div>
              <div className="px-4 py-2 bg-slate-50 text-[10px] text-slate-500 text-center border-t border-slate-200">
                 Lat: {latitude?.toFixed(6) || '--'} | Long: {longitude?.toFixed(6) || '--'}
              </div>
            </div>

            {/* Evidence Upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                 <Camera size={18} className="text-slate-500" />
                 <h3 className="font-bold text-slate-800">Photo Evidence</h3>
              </div>

              <div className="p-6">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                  ref={fileInputRef}
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group",
                    selectedFile 
                      ? "border-green-400 bg-green-50/30" 
                      : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/50"
                  )}
                >
                  {previewUrl ? (
                    <div className="absolute inset-0 w-full h-full">
                      {selectedFile?.type.startsWith('video') ? (
                         <div className="w-full h-full flex items-center justify-center bg-black/5">
                           <FileText size={40} className="text-slate-600" />
                         </div>
                      ) : (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">Change File</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload size={20} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Click to Upload</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG, MP4 (Max 50MB)</p>
                    </>
                  )}
                </div>
                
                {selectedFile && (
                   <div className="flex items-center justify-between mt-3 bg-green-50 border border-green-200 p-2 rounded-lg">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                        <span className="text-xs font-medium text-green-800 truncate">{selectedFile.name}</span>
                      </div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="text-slate-400 hover:text-red-500">
                        <X size={16} />
                      </button>
                   </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-600/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <> <Loader2 className="animate-spin" /> Processing... </>
              ) : (
                <> Submit Complaint <ChevronRight /> </>
              )}
            </button>
            
            <p className="text-xs text-center text-slate-400">
              By submitting, you agree to the <a href="#" className="underline hover:text-blue-600">Terms of Service</a>.
            </p>

          </div>
        </div>
      </form>
    </div>
  );
}