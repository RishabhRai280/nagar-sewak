"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import {
  fetchAdminDashboard,
  AdminDashboardData,
  Token,
  FlaggedContractor,
} from "@/lib/api";
import { LogOut, BarChart3, AlertTriangle, Clock, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboardComponent() {
  const router = useRouter();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Token.get()) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        setData(await fetchAdminDashboard());
      } catch (err: any) {
        setError(err?.message || "Error loading dashboard");
        // Redirect to login if access is denied (403/401)
        if (String(err.message).includes("Access Denied"))
          router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-slate-700 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // --- Error State UI ---
  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-10 rounded-xl shadow-xl bg-white border border-red-200">
          <AlertTriangle className="text-red-600 mx-auto mb-4" size={48} />
          <p className="text-red-700 font-medium">Dashboard Error</p>
          <p className="text-sm text-red-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const logout = () => {
    Token.remove();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sidebar - Used by the main page component */}
      
      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
            Administrator Dashboard
          </h1>
          <p className="text-slate-600">Real-time analytics and governance metrics</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <KpiCard
              label="Active Projects"
              value={data?.activeProjectsCount}
              icon={BarChart3}
              accent="from-blue-400 to-blue-600"
              bgAccent="bg-blue-50"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <KpiCard
              label="Pending Complaints"
              value={data?.pendingComplaintsCount}
              icon={AlertTriangle}
              accent="from-orange-400 to-orange-600"
              bgAccent="bg-orange-50"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <KpiCard
              label="Avg Resolution Time"
              value={`${data?.averageResolutionTime?.toFixed(1) || "N/A"} hrs`}
              icon={Clock}
              accent="from-red-400 to-red-600"
              bgAccent="bg-red-50"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <KpiCard
              label="Total Budget Sanctioned"
              value={`₹${data?.totalSanctionedBudget?.toLocaleString()}`}
              icon={DollarSign}
              accent="from-emerald-400 to-emerald-600"
              bgAccent="bg-emerald-50"
            />
          </motion.div>
        </div>

        {/* Flagged Contractors Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg border border-slate-100 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-red-600" size={28} />
                Flagged Contractors
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                {data?.flaggedContractors?.length || 0} contractor(s) flagged for poor performance
              </p>
            </div>
            <div className="px-4 py-2 bg-red-50 rounded-lg border border-red-200">
              <span className="text-red-700 font-bold text-lg">{data?.flaggedContractors?.length || 0}</span>
            </div>
          </div>

          {!data?.flaggedContractors || data.flaggedContractors.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="text-emerald-600 mx-auto mb-4" size={48} />
              <p className="text-slate-600 font-medium mb-1">No flagged contractors</p>
              <p className="text-slate-500 text-sm">All contractors are performing well</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-900">Company Name</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-900">License No.</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-900">Average Rating</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.flaggedContractors.map((contractor: FlaggedContractor) => (
                    <motion.tr
                      key={contractor.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
                      className="transition"
                    >
                      <td className="py-4 px-6 font-medium text-slate-900">{contractor.companyName}</td>
                      <td className="py-4 px-6 text-slate-600 font-mono text-sm">{contractor.licenseNo}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-red-600">{contractor.avgRating.toFixed(2)}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                          <div className="w-2 h-2 bg-red-600 rounded-full" />
                          FLAGGED
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
  bgAccent,
}: {
  label: string;
  value: any;
  icon: any;
  accent: string;
  bgAccent: string;
}) {
  return (
    <div className={`${bgAccent} rounded-xl p-6 border border-slate-200 hover:shadow-lg transition transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-600 font-medium text-sm">{label}</p>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${accent}`}>
          <Icon className="text-white" size={20} />
        </div>
      </div>
      <h3 className="text-4xl font-bold text-slate-900">{value}</h3>
      <p className="text-xs text-slate-500 mt-3">Real-time data</p>
    </div>
  );
}