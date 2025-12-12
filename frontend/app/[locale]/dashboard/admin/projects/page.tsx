"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { fetchAdminDashboard, AdminDashboardData, Token } from "@/lib/api/api";
import { BarChart3, Activity, MapPin, RefreshCcw } from 'lucide-react';
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading projects...</p>
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
        {/* Projects Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Projects Management</h1>
                <p className="text-slate-600">Monitor and manage all ongoing projects</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/projects/new">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  New Project
                </button>
              </Link>
              <Link href="/projects">
                <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                  View All
                </button>
              </Link>
              <button onClick={loadData} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                <RefreshCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard title="Project Status Overview" icon={Activity}>
            <div className="space-y-4">
              {data?.projectStatusBreakdown?.map((entry, i) => {
                const statusSlug = entry.status.toLowerCase().replace(/ /g, '-');
                return (
                  <Link key={i} href={`/projects/status/${statusSlug}`}>
                    <div className="group cursor-pointer hover:bg-slate-50 p-4 rounded-xl transition-all border border-slate-100 hover:border-blue-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition">{entry.status}</span>
                        <span className="text-2xl font-bold text-slate-900">{entry.projectCount}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(entry.projectCount / (data.totalProjects || 1)) * 100}%` }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:from-blue-600 group-hover:to-indigo-600 transition"
                        />
                      </div>
                      <p className="text-sm text-slate-600">Budget: ₹{Number(entry.totalBudget).toLocaleString()}</p>
                    </div>
                  </Link>
                );
              })}
              {!data?.projectStatusBreakdown?.length && (
                <div className="text-center py-8 text-slate-500">
                  <BarChart3 className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No project data found.</p>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard title="Ward Activity Hotspots" icon={MapPin}>
            <div className="space-y-4">
              {data?.wardComplaintHeatmap?.slice(0, 5).map((ward, i) => (
                <Link key={i} href={`/map?ward=${ward.wardName}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition">{ward.wardName}</p>
                        <p className="text-xs text-slate-500">{ward.zone} Zone</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                        {ward.complaintCount} Issues
                      </span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                        {ward.projectCount} Projects
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              {!data?.wardComplaintHeatmap?.length && (
                <div className="text-center py-8 text-slate-500">
                  <MapPin className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No ward activity data.</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
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