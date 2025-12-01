"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Token, fetchComplaintById, ComplaintDetail } from "@/lib/api";
import { ArrowLeft, MapPin, Calendar, User, AlertCircle, CheckCircle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import ComplaintVoting from "@/app/components/ComplaintVoting";
import EnhancedComplaintComments from "@/app/components/EnhancedComplaintComments";

const MiniMap = dynamic(() => import("@/app/components/MiniMap"), { ssr: false });

export default function ComplaintDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error || "Complaint not found"}</p>
          <Link href="/dashboard/citizen">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const statusColor =
    complaint.status?.toLowerCase() === "resolved"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : complaint.status?.toLowerCase() === "in_progress"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-orange-100 text-orange-700 border-orange-200";

  const images = complaint.photoUrls && complaint.photoUrls.length > 0 ? complaint.photoUrls : complaint.photoUrl ? [complaint.photoUrl] : [];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-200 rounded-full blur-[120px] opacity-40"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24 lg:pt-28">
        {/* Back Button */}
        <Link href="/dashboard/citizen">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-4 lg:mb-6 flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-md rounded-xl text-slate-700 font-bold hover:bg-white transition shadow-sm text-sm"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </motion.button>
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - Images & Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-xl border border-white/60"
              >
                <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-3 lg:mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-500" />
                  Evidence Photos ({images.length})
                </h3>

                {/* Main Image */}
                <div className="relative rounded-xl lg:rounded-2xl overflow-hidden shadow-lg mb-3 lg:mb-4 bg-slate-100">
                  <img
                    src={images[selectedImageIndex]}
                    alt={`Evidence ${selectedImageIndex + 1}`}
                    className="w-full h-64 lg:h-96 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/800x600/e2e8f0/64748b?text=Image+${selectedImageIndex + 1}`;
                    }}
                  />
                  {images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Grid */}
                {images.length > 1 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 lg:gap-3">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative rounded-lg lg:rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-blue-500 shadow-lg scale-105"
                            : "border-transparent hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-16 lg:h-20 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/200/e2e8f0/64748b?text=${index + 1}`;
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-xl border border-white/60"
            >
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3 className="text-base lg:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" />
                  Location
                </h3>
                <Link href={`/map?lat=${complaint.lat}&lng=${complaint.lng}`} target="_blank">
                  <button className="flex items-center gap-1 text-xs lg:text-sm text-blue-600 font-bold hover:underline">
                    View on Main Map <ExternalLink size={12} />
                  </button>
                </Link>
              </div>

              <div className="rounded-xl lg:rounded-2xl overflow-hidden shadow-lg h-48 lg:h-64 bg-slate-100">
                {complaint.lat && complaint.lng ? (
                  <MiniMap lat={complaint.lat} lng={complaint.lng} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <MapPin size={32} />
                  </div>
                )}
              </div>

              <div className="mt-3 lg:mt-4 text-xs lg:text-sm text-slate-600 font-mono bg-slate-50 p-2.5 lg:p-3 rounded-lg lg:rounded-xl">
                <span className="font-bold">Coordinates:</span> {complaint.lat?.toFixed(6)}, {complaint.lng?.toFixed(6)}
              </div>
            </motion.div>

            {/* Voting Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-xl border border-white/60"
            >
              <ComplaintVoting complaintId={complaint.id} />
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-xl border border-white/60"
            >
              <EnhancedComplaintComments complaintId={complaint.id} />
            </motion.div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-xl border border-white/60"
            >
              <div className="space-y-3 lg:space-y-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusColor} uppercase`}>
                    {complaint.status}
                  </span>
                </div>

                <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 leading-tight">{complaint.title}</h1>

                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg border text-xs lg:text-sm ${
                    complaint.severity >= 4
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}>
                    <AlertCircle size={14} />
                    <span className="font-bold">Severity: {complaint.severity}/5</span>
                  </div>
                </div>

                <div className="pt-3 lg:pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Description</h4>
                  <p className="text-slate-700 leading-relaxed text-sm lg:text-base">{complaint.description}</p>
                </div>

                <div className="pt-3 lg:pt-4 border-t border-slate-200 space-y-2 lg:space-y-3">
                  {complaint.userFullName && (
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-slate-400" />
                      <span className="text-slate-600">Reported by:</span>
                      <span className="font-bold text-slate-900">{complaint.userFullName}</span>
                    </div>
                  )}

                  {complaint.createdAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-slate-400" />
                      <span className="text-slate-600">Created:</span>
                      <span className="font-bold text-slate-900">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {complaint.resolvedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-emerald-500" />
                      <span className="text-slate-600">Resolved:</span>
                      <span className="font-bold text-slate-900">
                        {new Date(complaint.resolvedAt).toLocaleDateString()}
                      </span>
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
