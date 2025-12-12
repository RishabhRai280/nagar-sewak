"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Plus, Search, Filter, Star, MapPin, Calendar, Phone, Mail, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { fetchAllContractors } from "@/lib/api/api";

interface Contractor {
  id: number;
  companyName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  licenseNo?: string;
  specialization?: string[];
  avgRating?: number;
  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;
  isFlagged?: boolean;
  address?: string;
  registeredAt?: string;
  lastActive?: string;
}

export default function ContractorsPage() {
  const router = useRouter();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");

  useEffect(() => {
    const loadContractors = async () => {
      try {
        const response = await fetchAllContractors({
          search: searchTerm || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          specialization: specializationFilter !== "all" ? specializationFilter : undefined,
          page: 1,
          limit: 50
        });
        setContractors(response.contractors as any);
      } catch (error) {
        console.error("Failed to load contractors:", error);
        setContractors([]);
      } finally {
        setLoading(false);
      }
    };

    loadContractors();
  }, [searchTerm, statusFilter, specializationFilter]);

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = contractor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contractor.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contractor.licenseNo || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && (contractor.activeProjects || 0) > 0) ||
                         (statusFilter === "flagged" && contractor.isFlagged) ||
                         (statusFilter === "inactive" && (contractor.activeProjects || 0) === 0);
    
    const matchesSpecialization = specializationFilter === "all" || 
                                 contractor.specialization?.some(spec => 
                                   spec.toLowerCase().includes(specializationFilter.toLowerCase())
                                 ) || false;
    
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  const stats = {
    total: contractors.length,
    active: contractors.filter(c => (c.activeProjects || 0) > 0).length,
    flagged: contractors.filter(c => c.isFlagged || false).length,
    avgRating: contractors.reduce((sum, c) => sum + (c.avgRating || 0), 0) / contractors.length || 0
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-slate-300"}
      />
    ));
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
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
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="text-emerald-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Contractor Management</h1>
              <p className="text-slate-600">Monitor contractor performance and compliance</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600" size={16} />
                </div>
                <h3 className="font-bold text-slate-900">Total</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-emerald-600" size={16} />
                </div>
                <h3 className="font-bold text-slate-900">Active</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.active}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={16} />
                </div>
                <h3 className="font-bold text-slate-900">Flagged</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.flagged}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="text-yellow-600" size={16} />
                </div>
                <h3 className="font-bold text-slate-900">Avg Rating</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.avgRating.toFixed(1)}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search contractors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="flagged">Flagged</option>
              </select>
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Specializations</option>
                <option value="road">Road Construction</option>
                <option value="water">Water Supply</option>
                <option value="electrical">Electrical</option>
                <option value="parks">Parks & Recreation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contractors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContractors.map((contractor, index) => (
            <motion.div
              key={contractor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Users className="text-emerald-600" size={20} />
                  </div>
                  {contractor.isFlagged && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
                      Flagged
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">#{contractor.id}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                {contractor.companyName}
              </h3>
              <p className="text-slate-600 text-sm mb-2">{contractor.contactPerson || 'N/A'}</p>
              <p className="text-slate-500 text-xs mb-4">License: {contractor.licenseNo || 'N/A'}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderStars(contractor.avgRating || 0)}
                </div>
                <span className="text-sm font-semibold text-slate-900">{(contractor.avgRating || 0).toFixed(1)}</span>
                <span className="text-xs text-slate-500">({contractor.totalProjects || 0} projects)</span>
              </div>

              {/* Specializations */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {(contractor.specialization || []).slice(0, 2).map((spec, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {spec}
                    </span>
                  ))}
                  {(contractor.specialization || []).length > 2 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                      +{(contractor.specialization || []).length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-900">{contractor.activeProjects || 0}</div>
                  <div className="text-xs text-slate-500">Active</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">{contractor.completedProjects || 0}</div>
                  <div className="text-xs text-slate-500">Completed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">{contractor.totalProjects || 0}</div>
                  <div className="text-xs text-slate-500">Total</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone size={12} />
                  <span>{contractor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={12} />
                  <span className="truncate">{contractor.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>Last active: {contractor.lastActive ? new Date(contractor.lastActive).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              {/* Actions */}
              <Link href={`/contractors/${contractor.id}`}>
                <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                  View Details
                  <ArrowRight size={16} />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredContractors.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No contractors found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || statusFilter !== "all" || specializationFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No contractors have been registered yet"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}