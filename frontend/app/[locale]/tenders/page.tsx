"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardList, Plus, Search, Filter, Calendar, DollarSign, Users, ArrowRight, AlertTriangle } from "lucide-react";
import { fetchAllTenders } from "@/lib/api/api";

interface Tender {
  id: number;
  complaintId: number;
  complaintTitle: string;
  description: string;
  quoteAmount: number;
  estimatedDays: number;
  status: string;
  contractorId: number;
  contractorName: string;
  createdAt: string;
  updatedAt: string;
  severity?: number;
}

export default function TendersPage() {
  const router = useRouter();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadTenders = async () => {
      try {
        const response = await fetchAllTenders({
          search: searchTerm || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          page: 1,
          limit: 50
        });
        setTenders(response.tenders);
      } catch (error) {
        console.error("Failed to load tenders:", error);
        setTenders([]);
      } finally {
        setLoading(false);
      }
    };

    loadTenders();
  }, [searchTerm, statusFilter]);

  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = tender.complaintTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tender.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tender.contractorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tender.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return "text-red-600";
    if (severity >= 3) return "text-orange-600";
    return "text-yellow-600";
  };

  const stats = {
    total: tenders.length,
    pending: tenders.filter(t => t.status === "PENDING").length,
    accepted: tenders.filter(t => t.status === "ACCEPTED").length,
    rejected: tenders.filter(t => t.status === "REJECTED").length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Tender Management</h1>
              <p className="text-slate-600">Review and manage all tender submissions</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="text-blue-600" size={16} />
                </div>
                <h3 className="font-bold text-slate-900">Total</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-yellow-600" size={16} />
                </div>
                <h3 className="font-bold text-slate-900">Pending</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.pending}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users className="text-emerald-600" size={16} />
                </div>
                <h3 className="font-bold text-slate-900">Accepted</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.accepted}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={16} />
                </div>
                <h3 className="font-bold text-slate-900">Rejected</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.rejected}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tenders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <Link href="/tenders/create">
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2">
                <Plus size={20} />
                Create Tender
              </button>
            </Link>
          </div>
        </div>

        {/* Tenders List */}
        <div className="space-y-4">
          {filteredTenders.map((tender, index) => (
            <motion.div
              key={tender.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(tender.status)}`}>
                        {tender.status}
                      </span>
                      <span className="text-xs text-slate-500">Tender #{tender.id}</span>
                      {tender.severity && (
                        <div className={`flex items-center gap-1 text-xs font-bold ${getSeverityColor(tender.severity)}`}>
                          <AlertTriangle size={12} />
                          Severity {tender.severity}/5
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {tender.complaintTitle}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {tender.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-emerald-600" />
                      <span className="font-semibold">₹{tender.quoteAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      <span>{tender.estimatedDays} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-purple-600" />
                      <span>{tender.contractorName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <span>Submitted {new Date(tender.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/complaints/${tender.complaintId}`}>
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                      View Complaint
                    </button>
                  </Link>
                  <Link href={`/tenders/${tender.id}`}>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2">
                      View Details
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTenders.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tenders found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "No tender submissions have been made yet"
              }
            </p>
            <Link href="/tenders/create">
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                Create New Tender
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}