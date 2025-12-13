"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { fetchAdminDashboard, AdminDashboardData, Token } from "@/lib/api/api";
import { BarChart3, Activity, MapPin, RefreshCcw, ArrowRight, Construction } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function AdminProjectsPage() {
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
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-[#1e3a8a] rounded-full animate-spin" />
          <p className="text-[#1e3a8a] font-bold text-lg tracking-wide uppercase">Loading Projects...</p>
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
              <div className="w-14 h-14 bg-[#1e3a8a] rounded-xl flex items-center justify-center shadow-md">
                <Construction className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Projects Management</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Oversee Infrastructure Development</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/projects/new">
                <button className="px-5 py-2.5 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition shadow-sm">
                  + New Project
                </button>
              </Link>
              <button onClick={loadData} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 hover:border-[#1e3a8a] transition shadow-sm">
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Project Status Overview */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-blue-50 text-[#1e3a8a] rounded-lg flex items-center justify-center">
                <Activity size={20} />
              </div>
              <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight">Status Overview</h2>
            </div>

            <div className="space-y-4">
              {data?.projectStatusBreakdown?.map((entry, i) => {
                const statusSlug = entry.status.toLowerCase().replace(/ /g, '-');
                return (
                  <Link key={i} href={`/projects/status/${statusSlug}`}>
                    <div className="group cursor-pointer hover:bg-slate-50 p-4 rounded-xl transition-all border border-slate-100 hover:border-blue-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-slate-800 uppercase tracking-wide text-sm group-hover:text-[#1e3a8a] transition">{entry.status}</span>
                        <span className="text-2xl font-black text-slate-900">{entry.projectCount}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(entry.projectCount / (data.totalProjects || 1)) * 100}%` }}
                          className="h-full bg-[#1e3a8a] rounded-full"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                        <span>Total Budget</span>
                        <span>₹{Number(entry.totalBudget).toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {!data?.projectStatusBreakdown?.length && (
                <div className="text-center py-12 text-slate-400">
                  <BarChart3 className="mx-auto mb-2 opacity-50" size={32} />
                  <p className="font-medium text-sm">No project data found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Ward Activity Hotspots */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight">Ward Hotspots</h2>
            </div>
            <div className="space-y-4">
              {data?.wardComplaintHeatmap?.slice(0, 5).map((ward, i) => (
                <Link key={i} href={`/map?ward=${ward.wardName}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#1e3a8a] hover:bg-slate-50 transition cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-slate-400 text-sm">#{i + 1}</div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-[#1e3a8a] transition">{ward.wardName}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase">{ward.zone} Zone</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 uppercase">
                        {ward.complaintCount} Issues
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase">
                        {ward.projectCount} Projects
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              {!data?.wardComplaintHeatmap?.length && (
                <div className="text-center py-12 text-slate-400">
                  <MapPin className="mx-auto mb-2 opacity-50" size={32} />
                  <p className="font-medium text-sm">No ward activity data available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}