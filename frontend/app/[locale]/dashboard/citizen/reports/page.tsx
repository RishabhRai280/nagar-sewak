"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Token, fetchCurrentUserProfile, UserProfile, buildAssetUrl } from "@/lib/api/api";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, Plus, Share2, ClipboardList, AlertTriangle, RefreshCcw, Search } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

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

export default function CitizenReportsPage() {
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');

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
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const profile = await fetchCurrentUserProfile();
      setUserData(profile);
    } catch (err: any) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const complaints: DashboardComplaint[] = (userData?.complaints ?? []) as DashboardComplaint[];

  const filteredComplaints = useMemo(() => {
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status?.toLowerCase() === statusFilter);
    }

    return filtered;
  }, [complaints, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading your reports...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
      <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 hidden lg:block transition-all duration-300`}></div>

      <Sidebar />

      <main className="flex-1 px-6 pb-12 pt-24 lg:px-10 lg:pb-16 lg:pt-28 relative z-10 overflow-y-auto w-full transition-all duration-300">
        {/* Reports Header - Gov Style */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 mb-8 border-l-4 border-l-[#1e3a8a]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1e3a8a] rounded-lg flex items-center justify-center shadow-md">
                <ClipboardList className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Official Reports</h1>
                <p className="text-sm font-medium text-slate-500">Repository of your submitted grievances</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/report">
                <button className="px-5 py-2.5 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition shadow-sm flex items-center gap-2 uppercase text-xs tracking-wider">
                  <Plus size={16} />
                  New Report
                </button>
              </Link>
              <button onClick={loadData} className="px-3 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition shadow-sm">
                <RefreshCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search - Sharp & Professional */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by Report ID, Title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition text-slate-900 text-sm font-medium placeholder:text-slate-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition text-slate-900 text-sm font-bold bg-white min-w-[180px]"
            >
              <option value="all">View: All Reports</option>
              <option value="pending">Status: Pending</option>
              <option value="in_progress">Status: In Progress</option>
              <option value="resolved">Status: Resolved</option>
            </select>
          </div>
        </div>

        {/* Reports Grid - Official Card Style */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 min-h-[400px]">
          <h2 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest border-b border-slate-100 pb-2">
            Records ({filteredComplaints.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint, i) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group bg-white border border-slate-200 rounded-xl p-0 hover:border-[#1e3a8a] transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-md
                    ${complaint.severity >= 4 ? 'border-l-4 border-l-red-600' :
                      complaint.severity >= 3 ? 'border-l-4 border-l-orange-500' :
                        'border-l-4 border-l-blue-500'}`}
                >
                  <div className="p-5 flex gap-5 items-start">
                    {/* Thumbnail - Sharp Square */}
                    <div className="w-24 h-24 flex-shrink-0 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden relative">
                      {(() => {
                        const urls =
                          (complaint as any).photoUrls && (complaint as any).photoUrls.length > 0
                            ? (complaint as any).photoUrls
                            : complaint.photoUrl
                              ? [buildAssetUrl(complaint.photoUrl) || ""]
                              : [];
                        if (urls.length === 0) {
                          return (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                              <AlertTriangle size={24} />
                            </div>
                          );
                        }
                        const first = urls[0];
                        const isVideo = /\.(mp4|webm|ogg)$/i.test(first);
                        return (
                          <>
                            {isVideo ? (
                              <video src={first} className="w-full h-full object-cover bg-black" />
                            ) : (
                              <img
                                src={first}
                                className="w-full h-full object-cover"
                                alt="evidence"
                                onError={(e) =>
                                  ((e.target as HTMLImageElement).src = "https://placehold.co/100?text=No+Media")
                                }
                              />
                            )}
                            {urls.length > 1 && (
                              <div className="absolute bottom-0 right-0 bg-black/80 text-white text-[10px] px-1.5 py-0.5 font-bold">
                                +{urls.length - 1}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">ID: #{complaint.id}</span>
                          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-[#1e3a8a] transition-colors">{complaint.title}</h3>
                        </div>
                        <StatusBadge status={complaint.status} />
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-3 font-medium">{complaint.description}</p>

                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded border ${complaint.severity >= 4 ? 'bg-red-50 text-red-700 border-red-100' :
                            complaint.severity >= 3 ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                          Severity {complaint.severity}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Share Logic
                      }}
                      className="text-slate-500 hover:text-[#1e3a8a] transition"
                      title="Share"
                    >
                      <Share2 size={16} />
                    </button>
                    <Link href={`/dashboard/citizen/complaints/${complaint.id}`} className="text-xs font-bold text-[#1e3a8a] hover:underline uppercase tracking-wider flex items-center gap-1">
                      View Full Details <Share2 size={12} className="rotate-[-90deg]" />
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                  <ClipboardList className="text-slate-300" size={32} />
                </div>
                <h3 className="text-slate-900 font-bold text-lg mb-1">No Records Found</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                  {searchTerm || statusFilter !== 'all' ? 'Your search filters returned no results.' : 'You have not submitted any reports yet.'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Link href="/report">
                    <button className="px-6 py-2.5 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition shadow-sm uppercase text-xs tracking-wider">
                      File New Complaint
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status?: string | null }) {
  const s = status?.toLowerCase() || 'pending';
  // Official Gov Colors: Solid, Darker text, Subtle background
  const styles = s === 'resolved' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' :
    s === 'in_progress' ? 'bg-blue-50 text-blue-900 border border-blue-200' :
      'bg-amber-50 text-amber-900 border border-amber-200';

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles}`}>
      {s.replace('_', ' ')}
    </span>
  )
}