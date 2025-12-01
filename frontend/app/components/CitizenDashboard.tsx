"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "./Sidebar";
import Link from "next/link";
import { Token, fetchCurrentUserProfile, UserProfile, buildAssetUrl } from "@/lib/api";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, Plus, Eye, MapPin } from 'lucide-react';
import NotificationWrapper from "./NotificationWrapper";

interface DashboardComplaint {
  id: number;
  title: string;
  description?: string | null;
  severity: number;
  status?: string | null;
  photoUrl?: string | null; 
  rating?: number | null;   
  projectId?: number | null; 
}

export default function CitizenDashboardComponent() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Token.get()) {
      router.push("/login");
      return;
    }
    const loadProfile = async () => {
      try {
        const profile = await fetchCurrentUserProfile();
        setUserData(profile);
      } catch (err: any) {
        setError(err.message || "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [router]);

  const complaints: DashboardComplaint[] = (userData?.complaints ?? []) as DashboardComplaint[];

  const stats = useMemo(() => {
    const pending = complaints.filter(c => c.status?.toLowerCase() === "pending").length;
    return {
      total: complaints.length,
      pending,
      resolved: complaints.length - pending,
    };
  }, [complaints]);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500 font-medium">Loading...</div>;

  if (!userData) return null;

  return (
    <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
      
      {/* --- GLOBAL PARALLAX BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
         <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-200 rounded-full blur-[120px] opacity-40" />
         <motion.div animate={{ x: [0, -50, 0], y: [0, -50, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-200 rounded-full blur-[120px] opacity-40" />
      </div>

      <Sidebar />

      {/* Main Content - Better spacing */}
      <main className="flex-1 px-6 pb-12 pt-24 lg:px-10 lg:pb-16 lg:pt-28 relative z-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-1">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{userData.fullName || userData.username}</span>
            </h1>
            <p className="text-slate-600 font-medium text-sm lg:text-base">Here is what's happening with your reports.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <NotificationWrapper />
            <Link href="/report">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 text-sm lg:text-base">
                <Plus size={18} /> Report New Issue
                </button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Cards (Glass) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10">
          <StatCard label="Total Reports" value={stats.total} icon={AlertCircle} color="blue" delay={0.1} />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="orange" delay={0.2} />
          <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle} color="emerald" delay={0.3} />
        </div>

        {/* Complaints List (Glass) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-xl border border-white/60 p-6 lg:p-8"
        >
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-6 lg:mb-8 flex items-center gap-2">
            <div className="h-6 lg:h-8 w-1 bg-blue-600 rounded-full"/> Your History
          </h2>

          {complaints.length === 0 ? (
            <div className="text-center py-12 lg:py-16 bg-white/40 rounded-2xl border border-dashed border-slate-300">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertCircle className="text-slate-400" size={28} />
              </div>
              <p className="text-slate-600 text-base lg:text-lg font-medium">No complaints submitted yet.</p>
              <p className="text-slate-500 text-sm mt-1">Be the change your community needs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:gap-4">
              {complaints.map((complaint, i) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white/50 hover:bg-white/80 border border-white/60 hover:border-blue-200 rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 items-start">
                    {/* Thumbnail - Show first image or grid if multiple */}
                    <div className="w-full sm:w-20 lg:w-24 h-20 lg:h-24 flex-shrink-0 bg-slate-200 rounded-lg lg:rounded-xl overflow-hidden shadow-inner relative">
                        {(complaint as any).photoUrls && (complaint as any).photoUrls.length > 0 ? (
                            <>
                                <img src={(complaint as any).photoUrls[0] || ''} className="w-full h-full object-cover" alt="evidence" onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/100?text=No+Img'} />
                                {(complaint as any).photoUrls.length > 1 && (
                                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                                        +{(complaint as any).photoUrls.length - 1}
                                    </div>
                                )}
                            </>
                        ) : complaint.photoUrl ? (
                            <img src={buildAssetUrl(complaint.photoUrl) || ''} className="w-full h-full object-cover" alt="evidence" onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/100?text=No+Img'} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400"><MapPin size={24}/></div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <h3 className="text-base lg:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-700 transition-colors">{complaint.title}</h3>
                            <StatusBadge status={complaint.status} />
                        </div>
                        <p className="text-slate-600 text-xs lg:text-sm mt-1 line-clamp-2 leading-relaxed">{complaint.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 lg:gap-4 mt-3 lg:mt-4 text-xs lg:text-sm">
                            <span className={`flex items-center gap-1.5 font-bold ${complaint.severity >= 4 ? 'text-red-600' : 'text-yellow-600'}`}>
                                <AlertCircle size={14} /> Severity {complaint.severity}/5
                            </span>
                            <Link href={`/dashboard/citizen/complaints/${complaint.id}`} className="ml-auto flex items-center gap-1 text-blue-600 font-bold hover:underline">
                                View Details <Eye size={14} />
                            </Link>
                        </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, delay }: any) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    }[color as string] || "bg-slate-50 text-slate-600";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wide">{label}</h3>
                <div className={`p-2.5 rounded-xl ${colorStyles} border`}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-900">{value}</p>
        </motion.div>
    )
}

function StatusBadge({ status }: { status?: string | null }) {
    const s = status?.toLowerCase() || 'pending';
    const styles = s === 'resolved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                   s === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                   'bg-orange-100 text-orange-700 border-orange-200';
    
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles}`}>
            {s.replace('_', ' ')}
        </span>
    )
}