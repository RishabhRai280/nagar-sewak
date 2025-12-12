"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, DollarSign, FileText, Calendar, Save, Upload, X, Navigation, Map as MapIcon, Loader, AlertCircle, Image, Video, Paperclip } from "lucide-react";
import { createProject, Token } from "@/lib/api/api";

const MiniMap = dynamic(() => import("../../../components/shared/MiniMap"), { ssr: false });
const LocationPicker = dynamic(() => import("../../../components/shared/LocationPicker"), { ssr: false });

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "fetching" | "success" | "error">("idle");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    expectedDuration: "",
    priority: "medium",
    category: "",
    location: "",
    lat: null as number | null,
    lng: null as number | null
  });

  const [files, setFiles] = useState({
    headerImage: null as File | null,
    headerVideo: null as File | null,
    documents: [] as File[]
  });

  useEffect(() => {
    if (!Token.get()) {
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
        setFormData(prev => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }));
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
    setFormData(prev => ({ ...prev, lat, lng }));
    setLocationStatus("success");
    setError(null);
  };

  const handleFileChange = (type: 'headerImage' | 'headerVideo' | 'documents', e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (type === 'documents') {
      if (files.documents.length + selectedFiles.length > 10) {
        setError("Maximum 10 documents allowed");
        return;
      }
      setFiles(prev => ({ ...prev, documents: [...prev.documents, ...selectedFiles] }));
    } else {
      setFiles(prev => ({ ...prev, [type]: selectedFiles[0] }));
    }
    setError(null);
  };

  const removeFile = (type: 'headerImage' | 'headerVideo' | 'documents', index?: number) => {
    if (type === 'documents' && typeof index === 'number') {
      setFiles(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }));
    } else {
      setFiles(prev => ({ ...prev, [type]: type === 'documents' ? [] : null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title || !formData.description || !formData.budget || !formData.category) {
        throw new Error("Please fill in all required fields");
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        expectedDuration: formData.expectedDuration ? parseInt(formData.expectedDuration) : undefined,
        priority: formData.priority,
        category: formData.category,
        location: formData.location,
        lat: formData.lat,
        lng: formData.lng
      };

      await createProject(projectData, files);
      
      router.push("/projects?created=success");
    } catch (error: any) {
      setError(error.message || "Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
            <ArrowLeft size={20} />
            Back to Projects
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Create New Project</h1>
              <p className="text-slate-600">Add a new infrastructure project to the system</p>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-md">
              <div className="flex gap-3 items-start">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-red-800 font-bold text-sm mb-1">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  >
                    <option value="">Select category</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="water-supply">Water Supply</option>
                    <option value="roads">Roads & Transportation</option>
                    <option value="parks">Parks & Recreation</option>
                    <option value="utilities">Utilities</option>
                    <option value="housing">Housing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-900"
                  placeholder="Describe the project objectives, scope, and expected outcomes"
                />
              </div>
            </div>

            {/* Financial & Timeline */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                Financial & Timeline
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Budget (₹) *
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Expected Duration (months)
                  </label>
                  <input
                    type="number"
                    name="expectedDuration"
                    value={formData.expectedDuration}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    placeholder="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Media */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Location Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Location Details
                </h2>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Location Description
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    placeholder="e.g., Main Street, Downtown Area, Ward 5"
                  />
                </div>

                {/* Location Picker */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Project Location</label>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="rounded-lg overflow-hidden border border-slate-200 h-48 relative bg-slate-100">
                      {formData.lat && formData.lng ? (
                        <MiniMap lat={formData.lat} lng={formData.lng} />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                          <MapPin size={32} className="mb-2 opacity-30" />
                          <span className="text-sm font-medium opacity-60">Select Location</span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button
                        type="button"
                        onClick={getLocation}
                        className={`py-3 px-4 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
                          locationStatus === "success"
                            ? "bg-emerald-500 text-white shadow-lg"
                            : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        {locationStatus === "fetching" ? (
                          <Loader className="animate-spin" size={16} />
                        ) : (
                          <Navigation size={16} />
                        )}
                        {locationStatus === "fetching" ? "Getting GPS..." : "Use GPS"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMapPicker(true)}
                        className="py-3 px-4 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
                      >
                        <MapIcon size={16} />
                        Pick on Map
                      </button>
                    </div>
                    {formData.lat && formData.lng && (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-sm text-emerald-700">
                          <strong>Selected:</strong> {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Media Upload Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Project Media
                </h2>

                {/* Header Image */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <Image className="inline w-4 h-4 mr-1" />
                    Header Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('headerImage', e)}
                      className="hidden"
                      id="header-image"
                    />
                    {files.headerImage ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(files.headerImage)}
                          alt="Header preview"
                          className="w-full h-32 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('headerImage')}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="header-image"
                        className="block w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
                      >
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 hover:text-blue-500">
                          <Upload size={24} className="mb-2" />
                          <span className="text-sm font-medium">Upload Header Image</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Header Video */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <Video className="inline w-4 h-4 mr-1" />
                    Header Video (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange('headerVideo', e)}
                      className="hidden"
                      id="header-video"
                    />
                    {files.headerVideo ? (
                      <div className="relative">
                        <video
                          src={URL.createObjectURL(files.headerVideo)}
                          controls
                          className="w-full h-32 object-cover rounded-lg border border-slate-200 bg-black"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('headerVideo')}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="header-video"
                        className="block w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all"
                      >
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 hover:text-purple-500">
                          <Video size={24} className="mb-2" />
                          <span className="text-sm font-medium">Upload Header Video</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <Paperclip className="inline w-4 h-4 mr-1" />
                    Project Documents ({files.documents.length}/10)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      onChange={(e) => handleFileChange('documents', e)}
                      multiple
                      className="hidden"
                      id="documents"
                    />
                    <label
                      htmlFor="documents"
                      className="block w-full p-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-center"
                    >
                      <div className="flex flex-col items-center text-slate-400 hover:text-emerald-500">
                        <Paperclip size={20} className="mb-1" />
                        <span className="text-sm font-medium">Upload Documents</span>
                        <span className="text-xs">PDF, DOC, XLS, PPT files</span>
                      </div>
                    </label>
                    {files.documents.length > 0 && (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {files.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                            <span className="text-sm text-slate-700 truncate">{doc.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile('documents', index)}
                              className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <Link href="/projects" className="flex-1">
                <button
                  type="button"
                  className="w-full px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Create Project
                  </>
                )}
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
                  <h3 className="text-2xl font-bold text-slate-900">Select Project Location</h3>
                  <p className="text-sm text-slate-600 mt-1">Click anywhere on the map to set the project location</p>
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
                  lat={formData.lat}
                  lng={formData.lng}
                  onLocationSelect={handleMapLocationSelect}
                />
              </div>
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                {formData.lat && formData.lng ? (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-600">Selected: </span>
                      <span className="font-mono font-bold text-slate-900">
                        {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
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
    </div>
  );
}