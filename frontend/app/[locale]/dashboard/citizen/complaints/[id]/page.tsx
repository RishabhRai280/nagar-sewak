"use client";
/* (Keep imports same as before) */
import { useEffect, useState } from "react";
import { fetchComplaintById, ComplaintDetail, buildAssetUrl } from "@/lib/api";
import { ArrowLeft, MapPin, AlertTriangle, Clock, Star, CheckCircle, Edit, Link2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import CitizenDashboardLayout from "@/app/components/CitizenDashboardLayout"; 

const MiniMap = dynamic(() => import("@/app/components/MiniMap"), { ssr: false });

interface FullComplaintDetail extends ComplaintDetail {
    photoUrl?: string | null;
    projectId?: number | null;
    projectTitle?: string | null;
    rating?: number | null; 
    userFullName?: string | null; 
}

export default function CitizenComplaintDetails() {
  /* (Keep logic/state same as before) */
  const [id, setId] = useState<number | null>(null);
  const [data, setData] = useState<FullComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/");
    const parsed = parseInt(parts[parts.length - 1], 10); 
    if (!isNaN(parsed)) setId(parsed);
    else setError("Invalid complaint ID.");
  }, []);

  useEffect(() => {
    if (id == null) return;
    setLoading(true);
    fetchComplaintById(id).then((d) => setData(d as FullComplaintDetail)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CitizenDashboardLayout><div className="p-12 text-center text-slate-500">Loading details...</div></CitizenDashboardLayout>;
  if (error) return <CitizenDashboardLayout><div className="p-12 text-center text-red-500 font-bold">{error}</div></CitizenDashboardLayout>;
  if (!data) return <CitizenDashboardLayout><div className="p-12 text-center text-slate-500">Not found.</div></CitizenDashboardLayout>;

  const severityColor = data.severity >= 4 ? 'bg-red-500' : data.severity === 3 ? 'bg-yellow-500' : 'bg-emerald-500';
  const statusColor = data.status?.toLowerCase() === 'resolved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                      data.status?.toLowerCase() === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                      'bg-orange-100 text-orange-700 border-orange-200';
  const fullPhotoUrl = buildAssetUrl(data.photoUrl);

  return (
    <CitizenDashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
            <motion.button
                onClick={() => window.history.back()}
                whileHover={{ x: -4 }}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition mb-2"
            >
                <ArrowLeft size={20} /> Back
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/50 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-white/20">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">{data.title}</h1>
                        <p className="text-slate-500 font-medium mt-1">Report #{data.id} • {new Date(data.createdAt!).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wide rounded-full border ${statusColor}`}>
                        {data.status?.replace('_', ' ')}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Details */}
                    <div className="lg:col-span-2 p-8 space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-slate-700 text-lg leading-relaxed">{data.description}</p>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="p-4 bg-white/50 rounded-2xl border border-white/60 flex-1">
                                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Severity</span>
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${severityColor}`} />
                                    <span className="font-bold text-slate-800 text-lg">{data.severity}/5</span>
                                </div>
                            </div>
                            <div className="p-4 bg-white/50 rounded-2xl border border-white/60 flex-1">
                                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Location</span>
                                <div className="flex items-center gap-2 text-blue-600 font-bold">
                                    <MapPin size={18} />
                                    <span>{data.lat?.toFixed(4)}, {data.lng?.toFixed(4)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                         {data.status?.toLowerCase() === 'resolved' && !data.rating && (
                            <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-emerald-800">Issue Resolved</p>
                                    <p className="text-sm text-emerald-600">Please verify the work quality.</p>
                                </div>
                                <Link href={`/rate/${data.id}`} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition flex items-center gap-2">
                                    <Star size={18} /> Rate Now
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Image) */}
                    <div className="lg:col-span-1 bg-white/30 border-t lg:border-t-0 lg:border-l border-white/50 p-8">
                         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Evidence</h3>
                         <div className="rounded-2xl overflow-hidden shadow-lg border border-white/50 relative group bg-slate-100 aspect-square">
                            {fullPhotoUrl ? (
                                <img src={fullPhotoUrl} className="w-full h-full object-cover" alt="Proof" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                            )}
                         </div>
                         {fullPhotoUrl && (
                             <a href={fullPhotoUrl} target="_blank" className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white/60 hover:bg-white border border-white/60 rounded-xl text-sm font-bold text-slate-600 transition">
                                <ExternalLink size={16} /> View Full Size
                             </a>
                         )}
                    </div>
                </div>
            </motion.div>
        </div>
    </CitizenDashboardLayout>
  );
}