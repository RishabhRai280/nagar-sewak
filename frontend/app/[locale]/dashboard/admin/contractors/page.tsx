"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchAdminDashboard, AdminDashboardData, Token, fetchAllContractors, ContractorProfile } from "@/lib/api/api";
import { Users, CheckCircle, AlertTriangle, Star, RefreshCcw } from 'lucide-react';
import ContractorManagement from '@/app/components/contractors/ContractorManagement';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";
import { useTranslations } from "next-intl";

export default function AdminContractorsPage() {
  const t = useTranslations('dashboard.admin.contractorsPage');
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [allContractors, setAllContractors] = useState<ContractorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardRes, contractorsRes] = await Promise.all([
        fetchAdminDashboard(),
        fetchAllContractors({ limit: 100 })
      ]);
      setData(dashboardRes);
      setAllContractors(contractorsRes.contractors);
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

  const activeContractorsCount = allContractors.filter(c => c.projects && c.projects.some(p => p.status === 'In Progress' || p.status === 'Assigned')).length;
  const flaggedContractorsCount = data?.flaggedContractors?.length || 0;
  const totalContractorsCount = allContractors.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-[#1e3a8a] rounded-full animate-spin" />
          <p className="text-[#1e3a8a] font-bold text-lg tracking-wide uppercase">{t('loading')}</p>
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
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-md border border-emerald-100">
                <Users size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">{t('title')}</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">{t('subtitle')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ContractorManagement onContractorCreated={loadData} />
              <Link href="/contractors">
                <button className="px-4 py-2 bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-100 transition shadow-sm">
                  {t('viewAll')}
                </button>
              </Link>
              <button onClick={loadData} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 hover:border-[#1e3a8a] transition shadow-sm">
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
                <Users size={16} />
              </div>
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">{t('stats.total')}</h3>
            </div>
            <div className="text-3xl font-black text-[#111827] mb-1">{totalContractorsCount}</div>
            <p className="text-xs text-slate-500 font-medium">{t('stats.totalDesc')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100">
                <CheckCircle size={16} />
              </div>
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">{t('stats.active')}</h3>
            </div>
            <div className="text-3xl font-black text-[#111827] mb-1">{activeContractorsCount}</div>
            <p className="text-xs text-slate-500 font-medium">{t('stats.activeDesc')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center border border-red-100">
                <AlertTriangle size={16} />
              </div>
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">{t('stats.flagged')}</h3>
            </div>
            <div className="text-3xl font-black text-[#111827] mb-1">{flaggedContractorsCount}</div>
            <p className="text-xs text-slate-500 font-medium">{t('stats.flaggedDesc')}</p>
          </div>
        </div>

        {/* Solid Card for Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-[#1e3a8a] rounded-lg flex items-center justify-center">
              <Users size={20} />
            </div>
            <h2 className="text-xl font-black text-[#111827] uppercase tracking-tight">{t('performance')}</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">{t('table.company')}</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">{t('table.license')}</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">{t('table.rating')}</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">{t('table.projects')}</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">{t('table.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.flaggedContractors?.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <Link href={`/contractors/${c.id}`} className="font-bold text-[#1e3a8a] hover:underline transition">
                        {c.companyName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600 font-medium">{c.licenseNo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded w-fit border border-yellow-100">
                        <span className="font-bold">{c.avgRating.toFixed(1)}</span>
                        <Star className="text-yellow-500 fill-yellow-500" size={12} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-bold">
                      {/* Calculate active projects for this flagged contractor if possible, else default to 'Check' */}
                      <Link href={`/contractors/${c.id}`} className="text-blue-600 hover:underline text-xs">{t('viewDetails')}</Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-wide border border-red-200">
                        {t('stats.flagged')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data?.flaggedContractors?.length) && (
              <div className="text-center py-16 text-slate-400 bg-slate-50/50">
                <Users className="mx-auto mb-3 opacity-50" size={48} />
                <p className="font-bold text-lg">{t('noFlagged')}</p>
                <p className="text-sm mt-1 max-w-sm mx-auto">{t('noFlaggedDesc')}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}