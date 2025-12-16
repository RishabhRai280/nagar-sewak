"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList, Search, AlertTriangle, MapPin, Calendar, FileText, Save } from "lucide-react";
import { createTender, fetchOpenComplaints } from "@/lib/api/api";

interface Complaint {
  id: number;
  title: string;
  description: string;
  severity: number;
  status: string;
  lat?: number;
  lng?: number;
  createdAt?: string;
}

export default function CreateTenderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    quoteAmount: "",
    estimatedDays: "",
    materials: "",
    methodology: "",
    timeline: ""
  });

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const openComplaints = await fetchOpenComplaints();
        setComplaints(openComplaints as any);
        
        // Check if complaintId is provided in URL
        const urlParams = new URLSearchParams(window.location.search);
        const complaintId = urlParams.get('complaintId');
        
        if (complaintId) {
          const preSelectedComplaint = openComplaints.find((c: any) => c.id.toString() === complaintId);
          if (preSelectedComplaint) {
            setSelectedComplaint(preSelectedComplaint as any);
          }
        }
      } catch (error) {
        console.error("Failed to load complaints:", error);
        setComplaints([]);
      }
    };

    loadComplaints();
  }, []);

  const filteredComplaints = complaints.filter(complaint =>
    complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) {
      alert("Please select a complaint first");
      return;
    }

    setLoading(true);

    try {
      const tenderData = {
        complaintId: selectedComplaint.id,
        description: formData.description,
        quoteAmount: parseFloat(formData.quoteAmount),
        estimatedDays: parseInt(formData.estimatedDays),
        materials: formData.materials,
        methodology: formData.methodology,
        timeline: formData.timeline
      };

      await createTender(tenderData);
      
      alert("Tender submitted successfully!");
      router.push("/tenders");
    } catch (error: any) {
      alert(error.message || "Failed to create tender. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return "text-red-600 bg-red-50 border-red-200";
    if (severity >= 3) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/tenders" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4">
            <ArrowLeft size={20} />
            Back to Tenders
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Create New Tender</h1>
              <p className="text-slate-600">Create a tender for complaint resolution</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Complaint Selection */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Select Complaint</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              />
            </div>

            {/* Complaints List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  onClick={() => setSelectedComplaint(complaint)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedComplaint?.id === complaint.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{complaint.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getSeverityColor(complaint.severity)}`}>
                      {complaint.severity}/5
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">{complaint.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>#{complaint.id}</span>
                    {complaint.lat && complaint.lng && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{complaint.lat.toFixed(4)}, {complaint.lng.toFixed(4)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredComplaints.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <AlertTriangle className="mx-auto mb-2 opacity-50" size={32} />
                <p>No complaints found matching your search</p>
              </div>
            )}
          </div>

          {/* Tender Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Tender Details</h2>
            
            {!selectedComplaint ? (
              <div className="text-center py-12 text-slate-500">
                <ClipboardList className="mx-auto mb-4 opacity-50" size={48} />
                <p>Please select a complaint to create a tender</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selected Complaint Info */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-1">Selected Complaint</h3>
                  <p className="text-sm text-purple-700">{selectedComplaint.title}</p>
                  <p className="text-xs text-purple-600 mt-1">Complaint #{selectedComplaint.id}</p>
                </div>

                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Tender Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Describe your approach to resolve this complaint..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Quote Amount (₹) *
                    </label>
                    <input
                      type="number"
                      name="quoteAmount"
                      value={formData.quoteAmount}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Estimated Days *
                    </label>
                    <input
                      type="number"
                      name="estimatedDays"
                      value={formData.estimatedDays}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="7"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Materials Required
                  </label>
                  <textarea
                    name="materials"
                    value={formData.materials}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="List the materials needed for this project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Methodology
                  </label>
                  <textarea
                    name="methodology"
                    value={formData.methodology}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Explain your approach and methodology..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Project Timeline
                  </label>
                  <textarea
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Provide a detailed timeline for project completion..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-slate-200">
                  <Link href="/tenders" className="flex-1">
                    <button
                      type="button"
                      className="w-full px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Create Tender
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}