"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAdminDashboard,
  AdminDashboardData,
  Token,
  FlaggedContractor,
} from "@/lib/api";
import { LogOut } from "lucide-react";

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
        setError(err?.message || "Error");
        if (String(err.message).includes("Access Denied"))
          router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  if (loading)
    return (
      <div className="text-center text-gray-500 py-20">Loading dashboard…</div>
    );
  if (error && !data)
    return <div className="text-center text-red-600 py-20">Error: {error}</div>;

  const logout = () => {
    Token.remove();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 p-6 border-r border-white/10 backdrop-blur-md bg-white/5">
        <h1 className="text-2xl font-bold mb-8">Nagar Sewak</h1>

        <nav className="space-y-4">
          <button className="w-full text-left text-lg font-medium text-blue-300 hover:text-white transition">
            Admin Dashboard
          </button>

          {/* CONTRACTOR DASHBOARD DISABLED FOR NOW */}
          {/* 
                        Uncomment after building contractor dashboard
                        <button onClick={() => router.push('/dashboard/contractor')}
                            className="w-full text-left text-lg text-gray-400 hover:text-white transition">
                            Contractor Dashboard
                        </button>
                    */}
        </nav>

        <div className="absolute bottom-6 px-4">
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-4xl font-bold mb-10">Administrator Dashboard</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <KpiCard
            label="Active Projects"
            value={data?.activeProjectsCount}
            accent="blue"
          />
          <KpiCard
            label="Pending Complaints"
            value={data?.pendingComplaintsCount}
            accent="yellow"
          />
          <KpiCard
            label="Avg Resolution Time"
            value={`${data?.averageResolutionTime?.toFixed(1) || "N/A"} hrs`}
            accent="rose"
          />
          <KpiCard
            label="Total Budget Sanctioned"
            value={`₹${data?.totalSanctionedBudget?.toLocaleString()}`}
            accent="emerald"
          />
        </div>

        {/* Flagged Contractors Table */}
        <section className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-semibold mb-4 text-red-300">
            Flagged Contractors ({data?.flaggedContractors?.length || 0})
          </h3>

          {!data?.flaggedContractors || data.flaggedContractors.length === 0 ? (
            <p className="text-gray-400">
              No contractors are flagged currently.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-sm text-gray-300">
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">License</th>
                    <th className="py-3 px-4">Avg Rating</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.flaggedContractors.map((c: FlaggedContractor) => (
                    <tr
                      key={c.id}
                      className="border-b border-white/5 hover:bg-white/10"
                    >
                      <td className="py-3 px-4">{c.companyName}</td>
                      <td className="py-3 px-4 text-gray-300">{c.licenseNo}</td>
                      <td className="py-3 px-4 text-red-400 font-bold">
                        {c.avgRating.toFixed(2)} ★
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-red-700/40 border border-red-500 text-red-200 font-semibold">
                          FLAGGED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function KpiCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: any;
  accent: string;
}) {
  return (
    <div
      className={`rounded-2xl p-6 shadow-xl border border-white/10 bg-gradient-to-br from-${accent}-600/20 to-${accent}-800/10 hover:scale-[1.02] transition`}
    >
      <p className="text-gray-300 text-sm">{label}</p>
      <h3 className="text-4xl font-extrabold mt-2">{value}</h3>
    </div>
  );
}
