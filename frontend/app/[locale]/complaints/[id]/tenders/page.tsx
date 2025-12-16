"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Token, fetchTendersForComplaint, TenderData } from "@/lib/api";
import { ArrowLeft, DollarSign, Clock, FileText, User, Star, AlertCircle, Download } from "lucide-react";
import Link from "next/link";

export default function ComplaintTendersPage() {
  const router = useRouter();
  const params = useParams();
  const complaintId = params?.id as string;

  const [tenders, setTenders] = useState<TenderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Token.get()) {
      router.push("/login");
      return;
    }

    const loadTenders = async () => {
      try {
        const data = await fetchTendersForComplaint(Number(complaintId));
        setTenders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load tenders");
      } finally {
        setLoading(false);
      }
    };

    if (complaintId) loadTenders();
  }, [complaintId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 font-medium">Loading tenders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link href="/dashboard/admin">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

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
        <Link href="/dashboard/admin">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-6 flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-md rounded-xl text-slate-700 font-bold hover:bg-white transition shadow-sm text-sm"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </motion.button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">
            Tender Submissions
          </h1>
          <p className="text-slate-600">Review and manage contractor proposals for complaint #{complaintId}</p>
        </div>

        {/* Tenders Grid */}
        {tenders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/60 text-center"
          >
            <FileText className="mx-auto text-slate-400 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Tenders Submitted</h3>
            <p className="text-slate-600">No contractors have submitted proposals for this complaint yet.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tenders.map((tender, index) => (
              <motion.div
                key={tender.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    tender.status === "ACCEPTED"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : tender.status === "REJECTED"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-orange-100 text-orange-700 border-orange-200"
                  }`}>
                    {tender.status}
                  </span>
                  {tender.documentUrls && tender.documentUrls.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 font-bold">
                      <FileText size={12} />
                      {tender.documentUrls.length} docs
                    </div>
                  )}
                </div>

                {/* Contractor Info */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {tender.contractorName?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/contractors/${tender.contractorId}`}>
                      <p className="font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer truncate">
                        {tender.contractorName || 'Unknown Contractor'}
                      </p>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Star size={12} className="text-yellow-500" />
                      {tender.contractorAvgRating?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Bid Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-xs text-blue-600 font-bold flex items-center gap-1">
                      <DollarSign size={14} /> BID AMOUNT
                    </span>
                    <span className="text-lg font-extrabold text-slate-900">₹{tender.quoteAmount?.toLocaleString() || '0'}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Clock size={14} /> DURATION
                    </span>
                    <span className="text-lg font-extrabold text-slate-900">{tender.estimatedDays} days</span>
                  </div>
                </div>

                {/* Description Preview */}
                <div className="mb-4">
                  <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
                    {tender.description}
                  </p>
                </div>

                {/* Action Button */}
                <Link href={`/tenders/${tender.id}`}>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <FileText size={18} />
                    View Full Details
                  </button>
                </Link>

                {/* Submission Date */}
                <div className="mt-3 text-xs text-slate-500 text-center">
                  Submitted: {new Date(tender.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
