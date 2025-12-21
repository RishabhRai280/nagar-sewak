"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { Token, fetchCurrentUserProfile, UserProfile } from "@/lib/api/api";
import { TrendingUp, Award, Star } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";
import { useTranslations } from "next-intl";

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

export default function CitizenAnalyticsPage() {
  const t = useTranslations('dashboard.citizen.analyticsPage');
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [userData, setUserData] = useState<UserProfile | null>(null);
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
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [router]);

  const complaints: DashboardComplaint[] = (userData?.complaints ?? []) as DashboardComplaint[];

  const stats = useMemo(() => {
    const normalize = (s: string | null | undefined) => (s || '').toLowerCase().trim().replace('_', ' ');

    const pending = complaints.filter(c => normalize(c.status) === "pending").length;
    const inProgress = complaints.filter(c => normalize(c.status) === "in progress").length;
    const resolved = complaints.filter(c => normalize(c.status) === "resolved").length;
    const highPriority = complaints.filter(c => c.severity >= 4).length;

    return {
      total: complaints.length,
      pending,
      inProgress,
      resolved,
      highPriority,
    };
  }, [complaints]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">{t('loading')}</p>
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
        {/* Analytics Header - Gov Style */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 mb-8 border-l-4 border-l-[#1e3a8a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1e3a8a] rounded-lg flex items-center justify-center shadow-md">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{t('title')}</h1>
                <p className="text-sm font-medium text-slate-500">{t('subtitle')}</p>
              </div>
            </div>
            <div className="hidden lg:block text-right">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('totalReports')}</div>
              <div className="text-4xl font-black text-slate-900">{stats.total}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{t('pending')}</div>
            <div className="text-3xl font-black text-slate-900">{stats.pending}</div>
            <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{t('inProgress')}</div>
            <div className="text-3xl font-black text-slate-900">{stats.inProgress}</div>
            <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#1e3a8a]">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{t('resolved')}</div>
            <div className="text-3xl font-black text-slate-900">{stats.resolved}</div>
            <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
              <div className="bg-[#1e3a8a] h-full rounded-full" style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* CHART: Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 flex flex-col h-full">
            <h2 className="text-lg font-bold text-slate-900 mb-8 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-6 bg-[#1e3a8a] rounded-sm"></div> {t('statusDistribution')}
            </h2>

            <div className="flex-1 flex items-end justify-between gap-4 h-64 border-b border-slate-200 pb-2 px-2">
              {/* Pending Bar */}
              <div className="flex flex-col items-center justify-end gap-2 group w-full h-full">
                <div className="text-xs font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{stats.pending}</div>
                <div
                  className="w-full bg-amber-400 rounded-t-sm hover:bg-amber-500 transition-all relative group-hover:scale-y-105 origin-bottom shadow-sm"
                  style={{ height: `${stats.total > 0 ? Math.max(10, (stats.pending / stats.total) * 100) : 0}%` }}
                ></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t('pending')}</span>
              </div>

              {/* In Progress Bar */}
              <div className="flex flex-col items-center justify-end gap-2 group w-full h-full">
                <div className="text-xs font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{stats.inProgress}</div>
                <div
                  className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group-hover:scale-y-105 origin-bottom shadow-sm"
                  style={{ height: `${stats.total > 0 ? Math.max(10, (stats.inProgress / stats.total) * 100) : 0}%` }}
                ></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t('inProgress')}</span>
              </div>

              {/* Resolved Bar */}
              <div className="flex flex-col items-center justify-end gap-2 group w-full h-full">
                <div className="text-xs font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{stats.resolved}</div>
                <div
                  className="w-full bg-[#1e3a8a] rounded-t-sm hover:bg-blue-900 transition-all relative group-hover:scale-y-105 origin-bottom shadow-sm"
                  style={{ height: `${stats.total > 0 ? Math.max(10, (stats.resolved / stats.total) * 100) : 0}%` }}
                ></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t('resolved')}</span>
              </div>
            </div>
          </div>

          {/* Impact Metrics - Clean List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-8 uppercase tracking-wider flex items-center gap-2">
              <div className="w-2 h-6 bg-emerald-600 rounded-sm"></div> {t('performanceMetrics')}
            </h2>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-600">{t('resolutionRate')}</span>
                  <span className="text-lg font-black text-emerald-600">
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 border border-slate-200 inner-shadow">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-600">{t('highPriorityIssues')}</span>
                  <span className="text-lg font-black text-red-600">
                    {stats.total > 0 ? Math.round((stats.highPriority / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 border border-slate-200">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${stats.total > 0 ? (stats.highPriority / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-600">{t('activePipeline')}</span>
                  <span className="text-lg font-black text-blue-600">
                    {stats.total > 0 ? Math.round(((stats.pending + stats.inProgress) / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 border border-slate-200">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${stats.total > 0 ? ((stats.pending + stats.inProgress) / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <div className="text-2xl font-black text-slate-900">{stats.highPriority}</div>
                <div className="text-xs font-bold text-slate-500 uppercase">{t('criticalIssues')}</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <div className="text-2xl font-black text-slate-900">{stats.total}</div>
                <div className="text-xs font-bold text-slate-500 uppercase">{t('totalFiled')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Know More Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-2">
            <div className="w-2 h-6 bg-purple-600 rounded-sm"></div> {t('knowYourData')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
              <h3 className="font-bold text-slate-900 mb-2">{t('resolutionRate')}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t('resolutionRateDesc')}</p>
            </div>
            <div className="p-5 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
              <h3 className="font-bold text-slate-900 mb-2">{t('civicScore')}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t('civicScoreDesc')}</p>
            </div>
            <div className="p-5 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
              <h3 className="font-bold text-slate-900 mb-2">{t('highPriorityIssues')}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t('highPriorityDesc')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}