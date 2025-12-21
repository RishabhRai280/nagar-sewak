"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Token,
  fetchContractorDashboard,
  ContractorDashboardData,
} from "@/lib/api/api";
import {
  Construction,
  AlertTriangle,
  RefreshCcw,
  Search,
  ChevronRight,
} from "lucide-react";
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";
import { useTranslations } from "next-intl";

export default function ContractorAvailablePage() {
  const t = useTranslations("dashboard.contractor.availablePage");
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [data, setData] = useState<ContractorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openComplaints, setOpenComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"severity" | "recent">("recent");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedData, openData] = await Promise.all([
        fetchContractorDashboard(),
        import("@/lib/api/api").then((mod) => mod.fetchOpenComplaints()),
      ]);
      setData(fetchedData);
      setOpenComplaints(openData);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error loading dashboard");
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

  const filteredComplaints = useMemo(() => {
    let filtered = [...openComplaints];
    if (filterSeverity) {
      filtered = filtered.filter((c) => c.severity >= filterSeverity);
    }
    if (sortBy === "severity") {
      filtered.sort((a, b) => b.severity - a.severity);
    } else {
      filtered.sort((a, b) => b.id - a.id);
    }
    return filtered;
  }, [openComplaints, filterSeverity, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-[#1e3a8a] rounded-full animate-spin" />
          <p className="text-[#1e3a8a] font-bold text-lg tracking-wide uppercase">
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md border border-slate-200">
          <p className="text-red-600 mb-4 font-bold">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
      <div
        className={`${collapsed ? "w-16" : "w-64"
          } flex-shrink-0 hidden lg:block transition-all duration-300`}
      ></div>

      <Sidebar />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-12 pt-32 lg:pt-36 relative z-10 overflow-y-auto w-full transition-all duration-300">
        {/* Consistent Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] to-[#f97316]"></div>
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shadow-md border border-orange-100">
                <Search size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">
                  {t("title")}
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                  {t("subtitle")}
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <div className="relative">
                <select
                  value={filterSeverity || ""}
                  onChange={(e) =>
                    setFilterSeverity(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] uppercase cursor-pointer hover:bg-slate-100 transition appearance-none"
                >
                  <option value="">{t("filters.allSeverity")}</option>
                  <option value="4">{t("filters.high")}</option>
                  <option value="3">{t("filters.medium")}</option>
                  <option value="1">{t("filters.low")}</option>
                </select>
                <ChevronRight
                  className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                  size={12}
                />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "severity" | "recent")
                  }
                  className="pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] uppercase cursor-pointer hover:bg-slate-100 transition appearance-none"
                >
                  <option value="recent">{t("filters.mostRecent")}</option>
                  <option value="severity">
                    {t("filters.highestSeverity")}
                  </option>
                </select>
                <ChevronRight
                  className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                  size={12}
                />
              </div>

              <button
                onClick={loadData}
                className="px-4 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 hover:border-[#1e3a8a] transition shadow-sm"
              >
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-100 uppercase tracking-wide">
            {t("opportunitiesFound", { count: filteredComplaints.length })}
          </span>
        </div>

        {/* Available Works Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
          <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-tight flex items-center gap-2">
            <AlertTriangle className="text-orange-600" size={24} />
            {t("openTenders")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((c) => (
                <div
                  key={c.id}
                  className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:border-[#1e3a8a] transition flex flex-col group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-100 uppercase tracking-wide">
                      {t("card.pendingBid")}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      #{c.id}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#111827] text-lg mb-2 line-clamp-1 group-hover:text-[#1e3a8a] transition">
                    {c.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6 bg-slate-50 p-2 rounded border border-slate-100">
                    <AlertTriangle
                      size={14}
                      className={
                        c.severity >= 4 ? "text-red-500" : "text-amber-500"
                      }
                    />
                    <span className="uppercase font-bold text-slate-700">
                      {t("card.severityLevel")}: {c.severity}/5
                    </span>
                  </div>

                  <button
                    onClick={() => router.push(`/tenders/create?complaintId=${c.id}`)}
                    className="w-full py-3 bg-[#1e3a8a] text-white font-bold text-xs uppercase rounded-lg hover:bg-blue-900 transition flex items-center justify-center gap-2 shadow-sm shadow-blue-900/20"
                  >
                    {t("card.placeTender")}
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
                <Construction
                  className="mx-auto mb-4 opacity-50 text-blue-400"
                  size={48}
                />
                <p className="text-lg font-bold">{t("empty.title")}</p>
                <p className="text-sm mt-1">{t("empty.desc")}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
