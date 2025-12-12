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
        {/* Reports Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ClipboardList className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
                <p className="text-slate-600">Manage and track your submitted reports</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/report">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  <Plus size={16} className="mr-2" />
                  New Report
                </button>
              </Link>
              <button onClick={loadData} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                <RefreshCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search your reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Report Details ({filteredComplaints.length} {filteredComplaints.length === 1 ? 'report' : 'reports'})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint, i) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex gap-4 items-start mb-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden shadow-inner relative">
                      {(() => {
                        const urls =
                          (complaint as any).photoUrls && (complaint as any).photoUrls.length > 0
                            ? (complaint as any).photoUrls
                            : complaint.photoUrl
                            ? [buildAssetUrl(complaint.photoUrl) || ""]
                            : [];
                        if (urls.length === 0) {
                          return (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
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
                              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                                +{urls.length - 1}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors">{complaint.title}</h3>
                        <StatusBadge status={complaint.status} />
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-3 mb-3">{complaint.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className={`flex items-center gap-1.5 text-sm font-semibold ${
                          complaint.severity >= 4 ? 'text-red-600' : 
                          complaint.severity >= 3 ? 'text-orange-600' : 'text-yellow-600'
                        }`}>
                          <AlertTriangle size={14} /> Severity {complaint.severity}/5
                        </span>
                        <span className="text-xs text-slate-500">ID: #{complaint.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-slate-100">
                    <Link href={`/dashboard/citizen/complaints/${complaint.id}`} className="flex-1">
                      <button className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                        View Details
                      </button>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const shareUrl = `${window.location.origin}/dashboard/citizen/complaints/${complaint.id}`;
                        if (navigator.share) {
                          navigator.share({ title: complaint.title, url: shareUrl }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(shareUrl).catch(() => {});
                        }
                      }}
                      className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition"
                      title="Share"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <ClipboardList className="mx-auto mb-4 opacity-50 text-blue-400" size={48} />
                <p className="text-lg font-medium">
                  {searchTerm || statusFilter !== 'all' ? 'No reports match your filters' : 'No reports submitted yet'}
                </p>
                <p className="text-sm mt-1">
                  {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Submit your first report to get started'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Link href="/report">
                    <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                      Submit First Report
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
  const styles = s === 'resolved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                 s === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                 'bg-orange-100 text-orange-700 border-orange-200';
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles}`}>
      {s.replace('_', ' ')}
    </span>
  )
}