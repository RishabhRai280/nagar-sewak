"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Token, fetchTenderById, TenderData, acceptTender, fetchComplaintById, ComplaintDetail, API_BASE_URL } from "@/lib/api/api";
import { UserStore } from "@/lib/api/store";
import { ArrowLeft, DollarSign, Clock, FileText, Download, User, Star, Building2, CheckCircle, AlertCircle, MapPin, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { getRoleBasedBackUrl } from "@/lib/utils/navigation";

export default function TenderDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const id = params?.id as string;

  const [tender, setTender] = useState<TenderData | null>(null);
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!Token.get()) {
      router.push("/login");
      return;
    }

    // Get user role
    const user = UserStore.get();
    if (user?.roles) {
      if (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN")) {
        setUserRole("ADMIN");
      } else if (user.roles.includes("CONTRACTOR")) {
        setUserRole("CONTRACTOR");
      } else {
        setUserRole("CITIZEN");
      }
    }

    const loadTender = async () => {
      try {
        const tenderData = await fetchTenderById(Number(id));
        setTender(tenderData);

        // Fetch complaint details if complaintId is available
        if (tenderData.complaintId) {
          try {
            const complaintData = await fetchComplaintById(tenderData.complaintId);
            setComplaint(complaintData);
          } catch (complaintErr) {
            console.warn("Failed to load complaint details:", complaintErr);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load tender details");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadTender();
  }, [id, router]);

  const handleAccept = async () => {
    if (!tender || !confirm("Are you sure you want to accept this tender? This will create a project and reject other tenders.")) return;

    setAccepting(true);
    try {
      await acceptTender(tender.id);
      alert("Tender accepted successfully! Project has been created.");
      router.push(getRoleBasedBackUrl(pathname));
    } catch (err: any) {
      alert(err.message || "Failed to accept tender");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 font-medium">Loading tender details...</div>
      </div>
    );
  }

  if (error || !tender) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error || "Tender not found"}</p>
          <Link href={getRoleBasedBackUrl(pathname)}>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const statusColor =
    tender.status === "ACCEPTED"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : tender.status === "REJECTED"
        ? "bg-red-100 text-red-700 border-red-200"
        : "bg-orange-100 text-orange-700 border-orange-200";

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-200 rounded-full blur-[120px] opacity-40"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24 lg:pt-28">
        {/* Back Button */}
        <Link href={getRoleBasedBackUrl(pathname)}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-4 lg:mb-6 flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-md rounded-xl text-slate-700 font-bold hover:bg-white transition shadow-sm text-sm"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </motion.button>
        </Link>

        {/* Complaint Details Section */}
        {complaint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-blue-200 mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">Related Complaint</h2>
                <p className="text-sm text-slate-600">This tender is for the following complaint:</p>
              </div>
              <Link href={`/complaints/${complaint.id}`}>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm">
                  <Eye size={16} />
                  View Details
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900">{complaint.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${complaint.severity >= 4 ? 'bg-red-100 text-red-700 border-red-200' :
                  complaint.severity >= 3 ? 'bg-orange-100 text-orange-700 border-orange-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}>
                  Severity {complaint.severity}/5
                </span>
              </div>

              <p className="text-slate-700 mb-4 leading-relaxed">{complaint.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>Location: {complaint.lat?.toFixed(4)}, {complaint.lng?.toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Reported: {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText size={14} />
                  <span>ID: #{complaint.id}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - Tender Details */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Tender Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-xl border border-white/60"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 mb-2">Tender Proposal</h1>
                  <p className="text-sm text-slate-600">For: {tender.complaintTitle}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusColor} uppercase whitespace-nowrap`}>
                  {tender.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <DollarSign size={18} />
                    <span className="text-xs font-bold uppercase">Quoted Amount</span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">₹{tender.quoteAmount?.toLocaleString() || '0'}</p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <Clock size={18} />
                    <span className="text-xs font-bold uppercase">Duration</span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">{tender.estimatedDays} Days</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                  <FileText size={16} /> Proposal Description
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm lg:text-base">{tender.description}</p>
              </div>
            </motion.div>

            {/* Documents Card */}
            {tender.documentUrls && tender.documentUrls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-xl border border-white/60"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-blue-500" />
                  Supporting Documents ({tender.documentUrls.length})
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {tender.documentUrls.map((url, index) => {
                    const filename = url.split('/').pop() || `document-${index + 1}`;
                    const extension = filename.split('.').pop()?.toLowerCase();

                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition group">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{filename}</p>
                          <p className="text-xs text-slate-500 uppercase">{extension} file</p>
                        </div>
                        <a
                          href={`${API_BASE_URL}${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition border border-blue-200 group-hover:border-blue-400"
                        >
                          <Download size={18} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Contractor Info */}
          <div className="space-y-4 lg:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-xl border border-white/60"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-500" />
                Contractor Profile
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {tender.contractorName?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1">
                    <Link href={`/contractors/${tender.contractorId}`}>
                      <p className="font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer">{tender.contractorName}</p>
                    </Link>
                    <p className="text-xs text-slate-500">{tender.contractorCompany}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600 flex items-center gap-2">
                      <Building2 size={16} /> License
                    </span>
                    <span className="text-sm font-bold text-slate-900">{tender.contractorLicense}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600 flex items-center gap-2">
                      <Star size={16} /> Rating
                    </span>
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                      {tender.contractorAvgRating?.toFixed(1) || 'N/A'} <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    </span>
                  </div>
                </div>

                <Link href={`/contractors/${tender.contractorId}`}>
                  <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition border border-slate-200">
                    View Full Profile
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Accept Tender Button - Only for Admins */}
            {tender.status === "PENDING" && userRole === "ADMIN" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {accepting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Accept Tender & Create Project
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
