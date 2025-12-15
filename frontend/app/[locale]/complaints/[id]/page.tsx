"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, MapPin, Calendar, User, Star, MessageCircle, ThumbsUp, CheckCircle, FileText, ExternalLink } from "lucide-react";
import { fetchComplaintDetails, fetchComplaintById, ComplaintDetail } from "@/lib/api/api";
import ComplaintVoting from "@/app/components/complaints/ComplaintVoting";
import EnhancedComplaintComments from "@/app/components/complaints/EnhancedComplaintComments";
import ShareBar from "@/app/components/shared/ShareBar";
const MiniMap = dynamic(() => import("@/app/components/shared/MiniMap"), { ssr: false });

export default function ComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const complaintId = params.id as string;
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [backUrl, setBackUrl] = useState('/map');

  useEffect(() => {
    // Determine back URL based on referrer
    if (typeof window !== 'undefined') {
      const referrer = document.referrer;
      if (referrer.includes('/dashboard/citizen')) {
        setBackUrl('/dashboard/citizen/reports');
      } else if (referrer.includes('/dashboard')) {
        setBackUrl('/dashboard/citizen');
      } else {
        setBackUrl('/map');
      }
    }

    async function loadComplaint() {
      if (!complaintId) return;
      try {
        setLoading(true);
        // Try the enhanced API first, fallback to basic API
        let data;
        try {
          data = await fetchComplaintById(parseInt(complaintId));
        } catch {
          // Fallback to basic API
          data = await fetchComplaintDetails(parseInt(complaintId));
          const apiData = data as any;
          data = {
            ...apiData,
            userFullName: apiData.citizenName || apiData.userFullName || "Concerned Citizen",
            wardLabel: apiData.wardLabel || "General Ward",
            category: apiData.category || "General",
            photoUrls: apiData.photoUrls || (apiData.photoUrl ? [apiData.photoUrl] : [])
          };
        }
        setComplaint(data);
      } catch (err: any) {
        console.error("Failed to fetch complaint details", err);
        setError(err.message || "Failed to load complaint details");
      } finally {
        setLoading(false);
      }
    }

    loadComplaint();
  }, [complaintId]);





  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 font-medium">Loading complaint details...</div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Complaint Not Found</h2>
          <p className="text-slate-600 mb-6">{error || "The complaint you're looking for doesn't exist or has been removed."}</p>
          <Link href="/map">
            <button className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition">
              Back to previous
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const statusColor =
    complaint.status?.toLowerCase() === "resolved"
      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
      : complaint.status?.toLowerCase() === "in_progress"
        ? "bg-blue-50 text-blue-900 border-blue-200"
        : "bg-amber-50 text-amber-900 border-amber-200";

  const mediaItems = complaint.photoUrls && complaint.photoUrls.length > 0 ? complaint.photoUrls : complaint.photoUrl ? [complaint.photoUrl] : [];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24 lg:pt-28">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-50 hover:text-[#1e3a8a] transition shadow-sm text-sm"
        >
          <ArrowLeft size={16} /> 
          {backUrl.includes('/dashboard') ? 'Back to Dashboard' : 'Back to previous'}
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images & Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Gallery */}
            {mediaItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg border border-slate-200 p-6 relative overflow-hidden"
              >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#1e3a8a] to-blue-600 rounded-lg flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                      Evidence Gallery
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                      {mediaItems.length} file{mediaItems.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Main Media */}
                  <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 mb-4 bg-slate-100 shadow-inner">
                    {(() => {
                      const media = mediaItems[selectedMediaIndex];
                      const isVideo = /\.(mp4|webm|ogg)$/i.test(media);
                      if (isVideo) {
                        return (
                          <video
                            src={media}
                            controls
                            className="w-full h-64 lg:h-[400px] bg-black object-contain"
                          />
                        );
                      }
                      return (
                        <img
                          src={media}
                          alt={`Evidence ${selectedMediaIndex + 1}`}
                          className="w-full h-64 lg:h-[400px] object-contain hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/800x600/e2e8f0/64748b?text=Media+${selectedMediaIndex + 1}`;
                          }}
                        />
                      );
                    })()}
                    {mediaItems.length > 1 && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-black/80 to-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm">
                        {selectedMediaIndex + 1} / {mediaItems.length}
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 border border-white/50">
                      Evidence #{selectedMediaIndex + 1}
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {mediaItems.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {mediaItems.map((img, index) => {
                        const isVideo = /\.(mp4|webm|ogg)$/i.test(img);
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedMediaIndex(index)}
                            className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-square group ${selectedMediaIndex === index
                              ? "border-[#1e3a8a] ring-2 ring-blue-200 shadow-lg"
                              : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                              }`}
                          >
                            {isVideo ? (
                              <video src={img} className="w-full h-full object-cover bg-slate-900" />
                            ) : (
                              <img
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://placehold.co/200/e2e8f0/64748b?text=${index + 1}`;
                                }}
                              />
                            )}
                            {selectedMediaIndex === index && (
                              <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                <CheckCircle className="text-white" size={20} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg border border-slate-200 p-6 relative overflow-hidden"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-green-100 to-transparent rounded-full -translate-y-12 -translate-x-12 opacity-60"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                      <MapPin size={16} className="text-white" />
                    </div>
                    Location Details
                  </h3>
                  <Link href={`/map?complaintId=${complaint.id}`} target="_blank">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold rounded-lg transition-colors border border-green-200">
                      View Full Map <ExternalLink size={12} />
                    </button>
                  </Link>
                </div>

                <div className="rounded-xl overflow-hidden border-2 border-slate-200 h-48 lg:h-64 bg-slate-100 shadow-inner relative">
                  {complaint.lat && complaint.lng ? (
                    <MiniMap lat={complaint.lat} lng={complaint.lng} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <MapPin size={48} className="mb-2 opacity-50" />
                      <p className="text-sm font-medium">Location not available</p>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 border border-white/50">
                    📍 Complaint Location
                  </div>
                </div>

                <div className="mt-4 bg-gradient-to-r from-slate-50 to-green-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <MapPin size={14} className="text-green-600" />
                    <span className="font-bold text-slate-700">GPS Coordinates:</span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-800 tracking-wide">
                    {complaint.lat?.toFixed(6)}, {complaint.lng?.toFixed(6)}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Precision: ±10 meters • Verified location data
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Voting Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-slate-200 p-6 relative overflow-hidden"
            >
              {/* Decorative Background */}
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-100 to-transparent rounded-full translate-y-10 translate-x-10 opacity-60"></div>
              
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <ThumbsUp size={16} className="text-white" />
                  </div>
                  Community Support
                </h3>
                <ComplaintVoting complaintId={complaint.id} />
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg border border-slate-200 p-6 relative overflow-hidden"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-orange-100 to-transparent rounded-full -translate-y-14 translate-x-14 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                    <MessageCircle size={16} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">Discussion & Updates</h3>
                </div>
                <EnhancedComplaintComments complaintId={complaint.id} />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-xl shadow-lg border border-slate-200 p-6 relative overflow-hidden"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] via-purple-600 to-[#f97316]"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Complaint Status</h4>
                  <span className={`inline-block px-3 py-1 rounded text-xs font-bold border uppercase tracking-wide ${statusColor}`}>
                    {complaint.status?.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h1 className="text-xl font-bold text-slate-900 leading-snug mb-2">{complaint.title}</h1>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-bold uppercase ${complaint.severity >= 4
                    ? "bg-red-50 text-red-700 border-red-200"
                    : complaint.severity >= 3 ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                    <AlertTriangle size={12} />
                    Severity {complaint.severity}/5
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Detailed Description</h4>
                  <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">{complaint.description}</p>
                  
                  {/* Share Section */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Share This Complaint</h5>
                    <ShareBar title={`Complaint #${complaint.id}: ${complaint.title}`} summary={complaint.description} />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4">
                  {complaint.userFullName && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Reported By</span>
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <User size={14} className="text-slate-400" /> {complaint.userFullName}
                      </div>
                    </div>
                  )}

                  {complaint.createdAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Date Filed</span>
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Calendar size={14} className="text-slate-400" /> {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {complaint.resolvedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Resolution Date</span>
                      <div className="flex items-center gap-2 font-bold text-emerald-700">
                        <CheckCircle size={14} className="text-emerald-500" /> {new Date(complaint.resolvedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}


                </div>



                {/* Action Buttons */}
                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <Link href={`/complaints/${complaint.id}/tenders`}>
                    <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2">
                      <FileText size={20} />
                      View Tenders
                    </button>
                  </Link>
                  {complaint.status?.toLowerCase() === 'resolved' && (
                    <Link href={`/rate/${complaint.id}`}>
                      <button className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                        <Star size={20} />
                        Rate Resolution
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}