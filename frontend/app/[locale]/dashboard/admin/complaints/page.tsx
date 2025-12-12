"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { fetchAdminDashboard, AdminDashboardData, Token } from "@/lib/api/api";
import { AlertTriangle, Clock, Activity, CheckCircle, MapPin, RefreshCcw } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function AdminComplaintsPage() {
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminDashboard();
      setData(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Token.get()) { 
      router.push("/login"); 
      return; 
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
      <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 hidden lg:block transition-all duration-300`}></div>
      
      <Sidebar />

      <main className="flex-1 px-6 pb-12 pt-24 lg:px-10 lg:pb-16 lg:pt-28 relative z-10 overflow-y-auto w-full transition-all duration-300">
        {/* Complaints Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Complaints Management</h1>
                <p className="text-slate-600">Monitor and resolve citizen complaints</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/map">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                  View on Map
                </button>
              </Link>
              <button onClick={loadData} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                <RefreshCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-600" size={16} />
              </div>
              <h3 className="font-bold text-slate-900">Pending</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">{data?.pendingComplaintsCount || 0}</div>
            <p className="text-sm text-slate-600">Awaiting action</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="text-blue-600" size={16} />
              </div>
              <h3 className="font-bold text-slate-900">In Progress</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {data?.recentComplaints?.filter(c => c.status === 'In Progress').length || 0}
            </div>
            <p className="text-sm text-slate-600">Being resolved</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={16} />
              </div>
              <h3 className="font-bold text-slate-900">Resolved</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {data?.recentComplaints?.filter(c => c.status === 'Resolved').length || 0}
            </div>
            <p className="text-sm text-slate-600">Successfully closed</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-purple-600" size={16} />
              </div>
              <h3 className="font-bold text-slate-900">High Priority</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {data?.recentComplaints?.filter(c => c.severity >= 4).length || 0}
            </div>
            <p className="text-sm text-slate-600">Urgent attention needed</p>
          </div>
        </div>

        <GlassCard title="Recent Complaints" icon={AlertTriangle}>
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {data?.recentComplaints?.map((complaint, i) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition text-lg">{complaint.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        'bg-orange-100 text-orange-700 border border-orange-200'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    {complaint.wardLabel && (
                      <p className="text-slate-600 text-sm mb-3">Ward: {complaint.wardLabel}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className={`flex items-center gap-1 font-medium ${
                        complaint.severity >= 4 ? 'text-red-600' : 
                        complaint.severity >= 3 ? 'text-orange-600' : 'text-yellow-600'
                      }`}>
                        <AlertTriangle size={14} />
                        Severity: {complaint.severity}/5
                      </span>
                      {complaint.lat && complaint.lng && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {complaint.lat.toFixed(4)}, {complaint.lng.toFixed(4)}
                        </span>
                      )}
                      <span className="text-slate-400">
                        ID: #{complaint.id}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <Link href={`/complaints/${complaint.id}`}>
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition border border-slate-200">
                      View Details
                    </button>
                  </Link>
                  <Link href={`/map?complaintId=${complaint.id}`}>
                    <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg transition border border-blue-200">
                      View on Map
                    </button>
                  </Link>
                  <Link href={`/complaints/${complaint.id}/tenders`}>
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition">
                      Manage Tenders
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
            {!data?.recentComplaints?.length && (
              <div className="text-center py-12 text-slate-500">
                <AlertTriangle className="mx-auto mb-3 opacity-50" size={48} />
                <p className="font-medium">No recent complaints to display</p>
                <p className="text-sm mt-1">All complaints are being handled efficiently</p>
              </div>
            )}
          </div>
        </GlassCard>
      </main>
    </div>
  );
}

function GlassCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Icon className="text-blue-600" size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}