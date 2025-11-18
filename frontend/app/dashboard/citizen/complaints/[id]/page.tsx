// frontend/app/dashboard/citizen/complaints/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { fetchComplaintById, ComplaintDetail } from "@/lib/api";
import { ArrowLeft, MapPin, AlertTriangle, Clock, Star, CheckCircle, Edit, Link2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import CitizenDashboardLayout from "@/app/components/CitizenDashboardLayout"; 

// Dynamically load MiniMap (prevents server-side Leaflet rendering)
const MiniMap = dynamic(() => import("@/app/components/MiniMap"), { ssr: false });

// Extend the ComplaintDetail type for fields used in the UI
// These fields are returned by the backend's ComplaintResponse
interface FullComplaintDetail extends ComplaintDetail {
    photoUrl?: string | null;
    projectId?: number | null;
    projectTitle?: string | null;
    rating?: number | null; 
    userFullName?: string | null; 
}

export default function CitizenComplaintDetails() {
  const [id, setId] = useState<number | null>(null);
  const [data, setData] = useState<FullComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Get ID from URL path (Client-side)
  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/");
    // Find the last numeric part of the URL
    const parsed = parseInt(parts[parts.length - 1], 10); 
    if (!isNaN(parsed)) setId(parsed);
    else setError("Invalid complaint ID.");
  }, []);

  // 2. Fetch data once ID is set
  useEffect(() => {
    if (id == null) return;
    setLoading(true);
    fetchComplaintById(id)
      .then((d) => {
          // Type cast the fetched data to our extended type
          setData(d as FullComplaintDetail);
      })
      .catch((e) => {
          setError(e.message ?? "Failed to load complaint details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <CitizenDashboardLayout>
        <div className="flex items-center justify-center h-[50vh] text-xl text-slate-600">
          <Clock className="animate-spin mr-3" /> Loading complaint...
        </div>
      </CitizenDashboardLayout>
    );

  if (error)
    return (
      <CitizenDashboardLayout>
        <div className="p-10 text-center bg-red-50 border border-red-300 rounded-lg text-red-700">
          <AlertCircle className="inline mr-2" /> Error: {error}
        </div>
      </CitizenDashboardLayout>
    );
      
  if (!data) return <CitizenDashboardLayout><div className="p-10 text-center text-slate-500">Complaint not found.</div></CitizenDashboardLayout>;

  // --- Helper Constants for UI ---
  const severityColor = data.severity >= 4 ? 'bg-red-600' : data.severity === 3 ? 'bg-yellow-600' : 'bg-emerald-600';
  const statusColor = data.status?.toLowerCase() === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 
                      data.status?.toLowerCase() === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                      'bg-orange-100 text-orange-700';
  const isResolved = data.status?.toLowerCase() === 'resolved';
  // Photo URL correction: The backend ComplaintResponse provides the full path starting with /uploads/complaints/filename.jpg
  // Example: data.photoUrl = "/uploads/complaints/1763131283439_blueberry.jpg"
  const fullPhotoUrl = data.photoUrl ? `http://localhost:8080${data.photoUrl}` : null; 


  return (
    <CitizenDashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Back Button */}
            <motion.button
                onClick={() => window.history.back()}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
            >
                <ArrowLeft size={18} />
                Back to Dashboard
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-xl rounded-2xl border border-slate-100 overflow-hidden"
            >
                {/* Header Section */}
                <div className="p-6 md:p-8 border-b border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{data.title}</h1>
                            <p className="text-sm text-slate-500">
                                Reported by <span className="font-semibold">{data.userFullName ?? "Citizen"}</span> on 
                                {data.createdAt ? ` ${new Date(data.createdAt).toLocaleDateString()}` : " N/A"}
                            </p>
                        </div>
                        
                        <span className={`px-4 py-2 text-sm font-bold rounded-full whitespace-nowrap ${statusColor}`}>
                            {data.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                    
                    {/* Left Column: Details & Description (2/3 width) */}
                    <div className="lg:col-span-2 p-6 md:p-8 space-y-6">
                        
                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Issue Details</h2>

                        <p className="text-slate-700 leading-relaxed text-[16px]">
                            {data.description || "No detailed description provided."}
                        </p>

                        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <Star size={16} className="text-slate-500" />
                                <span className="text-slate-600">Severity:</span>
                                <span className={`px-3 py-1 rounded-full text-white font-bold ${severityColor}`}>
                                    {data.severity}/5
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-slate-500" />
                                <span className="text-slate-600">GPS:</span>
                                <span className="text-blue-700">
                                    {data.lat?.toFixed(5)}, {data.lng?.toFixed(5)}
                                </span>
                            </div>
                        </div>
                        
                        {/* Project Link */}
                        {data.projectId && (
                            <Link href={`/projects/${data.projectId}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium">
                                <Link2 size={18} /> Linked Project: <span className="underline">{data.projectTitle || `Project ID ${data.projectId}`}</span>
                            </Link>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="pt-4 flex gap-4">
                            {/* Rate Work Button */}
                            {isResolved && !data.rating && (
                                <Link href={`/rate/${data.id}`} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition shadow-lg">
                                    <Star size={20} /> Rate the Resolution
                                </Link>
                            )}
                            {/* Edit Complaint Button (only if status is pending) */}
                            {data.status?.toLowerCase() === 'pending' && (
                                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">
                                    <Edit size={20} /> Edit Complaint
                                </button>
                            )}
                            {/* Rating Display */}
                            {data.rating && (
                                <div className="flex items-center gap-2 text-indigo-600 font-bold">
                                    <CheckCircle size={20} /> Rated {data.rating}/5
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Image & Map (1/3 width) */}
                    <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50 p-6 md:p-8 space-y-6">
                        
                        {/* Image Proof */}
                        {fullPhotoUrl ? (
                            <div className="space-y-3">
                                <p className="text-lg font-bold text-slate-800">Photo Evidence</p>
                                <img
                                    src={fullPhotoUrl} 
                                    alt="Complaint photo proof"
                                    className="w-full h-48 object-cover rounded-xl shadow-md border border-slate-200"
                                />
                                <a
                                    href={fullPhotoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    View Full Image <ExternalLink size={14} />
                                </a>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-100 text-slate-500 rounded-lg text-sm text-center">
                                No Photo Proof Available.
                            </div>
                        )}

                        {/* Location Map */}
                        <div className="space-y-3">
                            <p className="text-lg font-bold text-slate-800">Exact Location</p>
                            {data.lat && data.lng && (
                                <div className="h-64 rounded-xl overflow-hidden border-2 border-slate-300 shadow-lg">
                                    {/* MiniMap will dynamically load here */}
                                    <MiniMap lat={data.lat} lng={data.lng} />
                                </div>
                            )}
                            <a
                                href={`http://googleusercontent.com/maps.google.com/3{data.lat},${data.lng}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                                Open in Google Maps <MapPin size={14} />
                            </a>
                        </div>

                    </div>

                </div>
            </motion.div>
        </div>
    </CitizenDashboardLayout>
  );
}