"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { Token, fetchCurrentUserProfile, UserProfile } from "@/lib/api/api";
import { TrendingUp, Award, Star } from 'lucide-react';
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

export default function CitizenAnalyticsPage() {
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
    const pending = complaints.filter(c => c.status?.toLowerCase() === "pending").length;
    const inProgress = complaints.filter(c => c.status?.toLowerCase() === "in_progress").length;
    const resolved = complaints.filter(c => c.status?.toLowerCase() === "resolved").length;
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
          <p className="text-slate-500 font-medium">Loading analytics...</p>
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
        {/* Analytics Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-emerald-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Analytics & Insights</h1>
                <p className="text-slate-600">Your community impact and engagement metrics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Impact Metrics */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Impact Metrics</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">Resolution Rate</span>
                  <span className="text-sm font-bold text-slate-900">
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">High Priority Reports</span>
                  <span className="text-sm font-bold text-slate-900">
                    {stats.total > 0 ? Math.round((stats.highPriority / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.highPriority / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">Active Reports</span>
                  <span className="text-sm font-bold text-slate-900">
                    {stats.total > 0 ? Math.round(((stats.pending + stats.inProgress) / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? ((stats.pending + stats.inProgress) / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Community Contribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Community Contribution</h2>
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {Math.min(100, stats.total * 10 + stats.resolved * 15)}
                </h3>
                <p className="text-sm font-medium text-slate-600">Citizen Score</p>
                <p className="text-xs text-slate-500 mt-1">Based on reports and resolutions</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h4 className="text-lg font-bold text-slate-900">{stats.resolved}</h4>
                  <p className="text-xs text-slate-600">Issues Resolved</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="text-lg font-bold text-slate-900">{stats.total}</h4>
                  <p className="text-xs text-slate-600">Total Reports</p>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="text-orange-600" size={20} />
                  <h3 className="font-semibold text-slate-900">Recognition Level</h3>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {stats.total >= 10 ? 'Community Champion' : 
                   stats.total >= 5 ? 'Active Citizen' : 
                   stats.total >= 1 ? 'Contributing Member' : 'New Member'}
                </p>
                <p className="text-sm text-slate-600">
                  {stats.total >= 10 ? 'Outstanding community contributor!' : 
                   stats.total >= 5 ? 'Great job helping your community!' : 
                   stats.total >= 1 ? 'Thank you for your contributions!' : 'Welcome to the community!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}