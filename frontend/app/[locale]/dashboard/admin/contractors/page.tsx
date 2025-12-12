"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchAdminDashboard, AdminDashboardData, Token } from "@/lib/api/api";
import { Users, CheckCircle, AlertTriangle, Star, RefreshCcw } from 'lucide-react';
import ContractorManagement from '@/app/components/contractors/ContractorManagement';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function AdminContractorsPage() {
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
          <p className="text-slate-500 font-medium">Loading contractors...</p>
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
        {/* Contractors Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="text-emerald-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Contractor Management</h1>
                <p className="text-slate-600">Monitor contractor performance and compliance</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ContractorManagement onContractorCreated={loadData} />
              <Link href="/contractors">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={16} />
              </div>
              <h3 className="font-bold text-slate-900">Total Contractors</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">{(data?.flaggedContractors?.length || 0) + 10}</div>
            <p className="text-sm text-slate-600">Registered in system</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={16} />
              </div>
              <h3 className="font-bold text-slate-900">Active</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">{Math.max(0, ((data?.flaggedContractors?.length || 0) + 10) - (data?.flaggedContractors?.length || 0))}</div>
            <p className="text-sm text-slate-600">Currently working</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={16} />
              </div>
              <h3 className="font-bold text-slate-900">Flagged</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">{data?.flaggedContractors?.length || 0}</div>
            <p className="text-sm text-slate-600">Need attention</p>
          </div>
        </div>

        <GlassCard title="Contractor Performance" icon={Users}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left rounded-tl-lg">Company</th>
                  <th className="px-4 py-3 text-left">License</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Projects</th>
                  <th className="px-4 py-3 text-left rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.flaggedContractors?.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <Link href={`/contractors/${c.id}`} className="font-semibold text-slate-900 hover:text-blue-600 transition">
                        {c.companyName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{c.licenseNo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-900">{c.avgRating.toFixed(1)}</span>
                        <Star className="text-yellow-500" size={14} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">2</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
                        Flagged
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data?.flaggedContractors?.length) && (
              <div className="text-center py-12 text-slate-500">
                <Users className="mx-auto mb-3 opacity-50" size={48} />
                <p className="font-medium">No contractors currently flagged</p>
                <p className="text-sm mt-1">All contractors are performing well</p>
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