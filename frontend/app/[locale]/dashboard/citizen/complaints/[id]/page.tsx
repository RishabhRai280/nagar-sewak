"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Token, fetchComplaintById, ComplaintDetail } from "@/lib/api/api";
import { ArrowLeft, MapPin, Calendar, User, AlertCircle, CheckCircle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import ComplaintVoting from "@/app/components/complaints/ComplaintVoting";
import EnhancedComplaintComments from "@/app/components/complaints/EnhancedComplaintComments";
import ShareBar from "@/app/components/shared/ShareBar";

const MiniMap = dynamic(() => import("@/app/components/shared/MiniMap"), { ssr: false });

export default function ComplaintDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  useEffect(() => {
    if (!Token.get()) {
      router.push("/login");
      return;
    }

    const loadComplaint = async () => {
      try {
        const data = await fetchComplaintById(Number(id));
        setComplaint(data);
      } catch (err: any) {
        setError(err.message || "Failed to load complaint details");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadComplaint();
  }, [id, router]);

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
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error || "Complaint not found"}</p>
          <Link href="/dashboard/citizen">
            <button className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition">
              Back to Dashboard
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
        <Link href="/dashboard/citizen">
          <button
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-50 hover:text-[#1e3a8a] transition shadow-sm text-sm"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images & Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media */}
            {mediaItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#1e3a8a]" />
                  Evidence Gallery ({mediaItems.length})
                </h3>

                {/* Main Media */}
                <div className="relative rounded-lg overflow-hidden border border-slate-200 mb-4 bg-slate-100">
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
                        className="w-full h-64 lg:h-[400px] object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/800x600/e2e8f0/64748b?text=Media+${selectedMediaIndex + 1}`;
                        }}
                      />
                    );
                  })()}
                  {mediaItems.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded text-xs font-bold">
                      {selectedMediaIndex + 1} / {mediaItems.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Grid */}
                {mediaItems.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {mediaItems.map((img, index) => {
                      const isVideo = /\.(mp4|webm|ogg)$/i.test(img);
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedMediaIndex(index)}
                          className={`relative rounded-md overflow-hidden border-2 transition-all aspect-square ${selectedMediaIndex === index
                              ? "border-[#1e3a8a] ring-1 ring-[#1e3a8a]"
                              : "border-slate-100 hover:border-slate-300"
                            }`}
                        >
                          {isVideo ? (
                            <video src={img} className="w-full h-full object-cover bg-slate-900" />
                          ) : (
                            <img
                              src={img}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/200/e2e8f0/64748b?text=${index + 1}`;
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} className="text-[#1e3a8a]" />
                  Geolocated Data
                </h3>
                <Link href={`/map?complaintId=${complaint.id}`} target="_blank">
                  <button className="flex items-center gap-1 text-xs text-[#1e3a8a] font-bold hover:underline uppercase tracking-wide">
                    View Full Map <ExternalLink size={12} />
                  </button>
                </Link>
              </div>

              <div className="rounded-lg overflow-hidden border border-slate-200 h-48 lg:h-64 bg-slate-100 shadow-inner">
                {complaint.lat && complaint.lng ? (
                  <MiniMap lat={complaint.lat} lng={complaint.lng} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <MapPin size={32} />
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded-lg border border-slate-100">
                <MapPin size={12} />
                <span className="font-bold text-slate-700">Coordinates:</span>
                {complaint.lat?.toFixed(6)}, {complaint.lng?.toFixed(6)}
              </div>
            </motion.div>

            {/* Voting Section - Wrapped */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle size={14} className="text-[#1e3a8a]" /> Community Consensus
              </h3>
              <ComplaintVoting complaintId={complaint.id} />
            </div>

            {/* Comments Section - Wrapped */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <EnhancedComplaintComments complaintId={complaint.id} />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <ShareBar title={`Complaint #${complaint.id}`} summary={complaint.title} />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-t-4 border-t-[#1e3a8a]"
            >
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
                    <AlertCircle size={12} />
                    Severity {complaint.severity}/5
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Detailed Description</h4>
                  <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">{complaint.description}</p>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4">
                  {complaint.userFullName && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Reported by</span>
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
