"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { fetchAdminDashboard, AdminDashboardData, Token, fetchAllComplaints, ComplaintData } from "@/lib/api/api";
import { AlertTriangle, Clock, Activity, CheckCircle, MapPin, RefreshCcw, FileText, ChevronRight } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function AdminComplaintsPage() {
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [allComplaints, setAllComplaints] = useState<ComplaintData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardRes, complaintsRes] = await Promise.all([
        fetchAdminDashboard(),
        fetchAllComplaints()
      ]);
      setData(dashboardRes);
      setAllComplaints(complaintsRes);
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
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-[#1e3a8a] rounded-full animate-spin" />
          <p className="text-[#1e3a8a] font-bold text-lg tracking-wide uppercase">Loading Complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md border border-slate-200">
          <p className="text-red-600 mb-4 font-bold">{error}</p>
          <button onClick={loadData} className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pendingCount = allComplaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = allComplaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = allComplaints.filter(c => c.status === 'Resolved').length;
  const highPriorityCount = allComplaints.filter(c => c.severity >= 4).length;

  return (
    <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
      <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 hidden lg:block transition-all duration-300`}></div>

      <Sidebar />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-12 pt-32 lg:pt-36 relative z-10 overflow-y-auto w-full transition-all duration-300">

        {/* Consistent Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] to-[#f97316]"></div>
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-md border border-red-100">
                <AlertTriangle size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Complaints Management</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Resolve Citizen Grievances</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/map">
                <button className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition shadow-sm flex items-center gap-2">
                  <MapPin size={18} /> View Map
                </button>
              </Link>
              <button onClick={loadData} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 hover:border-[#1e3a8a] transition shadow-sm">
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center border border-orange-100">
                <Clock size={16} />
              </div>
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Pending</h3>
            </div>
            <div className="text-3xl font-black text-[#111827] mb-1">{pendingCount}</div>
            <p className="text-xs text-slate-500 font-medium">Awaiting action</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
                <Activity size={16} />
              </div>
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">In Progress</h3>
            </div>
            <div className="text-3xl font-black text-[#111827] mb-1">
              {inProgressCount}
            </div>
            <p className="text-xs text-slate-500 font-medium">Being resolved</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100">
                <CheckCircle size={16} />
              </div>
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Resolved</h3>
            </div>
            <div className="text-3xl font-black text-[#111827] mb-1">
              {resolvedCount}
            </div>
            <p className="text-xs text-slate-500 font-medium">Successfully closed</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center border border-purple-100">
                <AlertTriangle size={16} />
              </div>
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">High Priority</h3>
            </div>
            <div className="text-3xl font-black text-[#111827] mb-1">
              {highPriorityCount}
            </div>
            <p className="text-xs text-slate-500 font-medium">Urgent attention needed</p>
          </div>
        </div>

        {/* Complaints List - Solid Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-[#1e3a8a] rounded-lg flex items-center justify-center">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-black text-[#111827] uppercase tracking-tight">Recent Complaints</h2>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {allComplaints.slice(0, 50).map((complaint, i) => ( // limit list to 50 for performance
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#1e3a8a] hover:shadow-md transition group"
              >
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${complaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        complaint.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>
                        {complaint.status}
                      </span>
                      <span className="text-xs font-bold text-slate-400">#{complaint.id}</span>
                    </div>
                    <h4 className="font-bold text-[#111827] text-lg group-hover:text-[#1e3a8a] transition">{complaint.title}</h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mt-2">
                      {/* Note: wardLabel is not always available in basic ComplaintData, so we check properties carefully */}
                      {(complaint as any).wardLabel && (
                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                          <MapPin size={12} /> Ward: {(complaint as any).wardLabel}
                        </span>
                      )}
                      <span className={`flex items-center gap-1 px-2 py-1 rounded border ${complaint.severity >= 4 ? 'bg-red-50 text-red-700 border-red-100' :
                        complaint.severity >= 3 ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                        }`}>
                        <AlertTriangle size={12} />
                        Severity: {complaint.severity}/5
                      </span>
                      {complaint.lat && complaint.lng && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin size={12} />
                          {complaint.lat.toFixed(4)}, {complaint.lng.toFixed(4)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <Link href={`/complaints/${complaint.id}`} className="flex-1 md:flex-none">
                      <button className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase rounded-lg transition border border-slate-200 hover:border-slate-300">
                        Details
                      </button>
                    </Link>
                    <Link href={`/map?complaintId=${complaint.id}`} className="flex-1 md:flex-none">
                      <button className="w-full px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded-lg transition border border-blue-200 hover:border-blue-300">
                        Map
                      </button>
                    </Link>
                    <Link href={`/complaints/${complaint.id}/tenders`} className="flex-1 md:flex-none">
                      <button className="w-full px-4 py-2.5 bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-bold uppercase rounded-lg transition shadow-sm">
                        Tenders
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            {!allComplaints?.length && (
              <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <AlertTriangle className="mx-auto mb-4 opacity-50" size={48} />
                <p className="font-bold text-lg">No complaints found</p>
                <p className="text-sm mt-1">Great job! All issues are resolved.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}