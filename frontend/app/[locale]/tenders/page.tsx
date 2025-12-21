"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, FileText, Download, ExternalLink, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchAllTenders, TenderData } from '@/lib/api/api';

// Mixed type for both API and mock data
type DisplayTender = TenderData | {
  id: string;
  title: string;
  department: string;
  category: string;
  estimatedValue: string;
  publishDate: string;
  lastDate: string;
  status: string;
  description: string;
  eligibility: string;
  documents: string[];
};

export default function TendersPage() {
  const t = useTranslations();
  const [tenders, setTenders] = useState<DisplayTender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTenders = async () => {
      try {
        setLoading(true);
        const response = await fetchAllTenders();
        setTenders(response.tenders || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load tenders');
        // Fallback to mock data
        setTenders(mockTenders);
      } finally {
        setLoading(false);
      }
    };

    loadTenders();
  }, []);

  const mockTenders = [
    {
      id: "TNR-2025-001",
      title: "Construction of Community Center in Ward 12",
      department: "Public Works Department",
      category: "Construction",
      estimatedValue: "₹25,00,000",
      publishDate: "2025-12-20",
      lastDate: "2026-01-15",
      status: "Active",
      description: "Construction of a modern community center with multipurpose hall, library, and recreational facilities.",
      eligibility: "Class A contractors with minimum 5 years experience",
      documents: ["Tender Notice", "Technical Specifications", "BOQ"]
    },
    {
      id: "TNR-2025-002",
      title: "Supply of LED Street Lights for Zone A",
      department: "Electrical Department",
      category: "Supply",
      estimatedValue: "₹15,00,000",
      publishDate: "2025-12-18",
      lastDate: "2026-01-10",
      status: "Active",
      description: "Supply and installation of energy-efficient LED street lights across Zone A covering 200 locations.",
      eligibility: "Registered electrical contractors",
      documents: ["Tender Notice", "Technical Specifications", "Terms & Conditions"]
    },
    {
      id: "TNR-2025-003",
      title: "Waste Management Services Contract",
      department: "Sanitation Department",
      category: "Services",
      estimatedValue: "₹50,00,000",
      publishDate: "2025-12-15",
      lastDate: "2025-12-30",
      status: "Closed",
      description: "Comprehensive waste collection, transportation, and disposal services for residential areas.",
      eligibility: "Companies with waste management license",
      documents: ["Tender Notice", "Service Requirements", "Contract Terms"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'Closed':
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Evaluation':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Construction':
        return 'bg-blue-100 text-blue-800';
      case 'Supply':
        return 'bg-purple-100 text-purple-800';
      case 'Services':
        return 'bg-orange-100 text-orange-800';
      case 'Maintenance':
        return 'bg-green-100 text-green-800';
      case 'Technology':
        return 'bg-indigo-100 text-indigo-800';
      case 'Government':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Tenders & Procurement</h1>
          <p className="text-lg text-slate-600">Latest procurement opportunities and government tenders for contractors and suppliers.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-3" />
            <span className="text-slate-600">Loading tenders...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <p className="text-yellow-800">
              <strong>Notice:</strong> Unable to load live tender data. Showing sample data below.
            </p>
          </div>
        )}

        {/* Filters */}
        {!loading && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Categories</option>
                <option>Construction</option>
                <option>Supply</option>
                <option>Services</option>
                <option>Maintenance</option>
                <option>Technology</option>
              </select>
              <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Status</option>
                <option>Active</option>
                <option>Closed</option>
                <option>Under Evaluation</option>
              </select>
              <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Departments</option>
                <option>Public Works Department</option>
                <option>Electrical Department</option>
                <option>Sanitation Department</option>
                <option>IT Department</option>
              </select>
            </div>
          </div>
        )}

        {/* Tenders List */}
        {!loading && (
          <div className="space-y-6">
            {tenders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Tenders Available</h3>
                <p className="text-slate-500">New procurement opportunities will appear here when published.</p>
              </div>
            ) : (
              tenders.map((tender, index) => {
                // Check if this is real API data or mock data
                const isRealTender = 'complaintId' in tender && tender.complaintId;
                const displayTitle = isRealTender
                  ? ((tender as TenderData).title || (tender as TenderData).complaintTitle || `Tender #${tender.id}`)
                  : (tender as any).title;
                const displayValue = isRealTender
                  ? `₹${(((tender as TenderData).budget || (tender as TenderData).quoteAmount || 0) / 100000).toFixed(1)}L`
                  : (tender as any).estimatedValue;
                const displayStatus = isRealTender
                  ? ((tender as TenderData).status === 'OPEN' ? 'Active' : (tender as TenderData).status === 'CLOSED' ? 'Closed' : (tender as TenderData).status)
                  : (tender as any).status;
                const displayCategory = isRealTender ? 'Government' : (tender as any).category;
                const displayDepartment = isRealTender ? 'Municipal Corporation' : (tender as any).department;

                return (
                  <div key={tender.id || index} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-slate-500">
                            {isRealTender ? `TND-${tender.id}` : (tender as any).id}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(displayStatus)}`}>
                            {displayStatus}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(displayCategory)}`}>
                            {displayCategory}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{displayTitle}</h3>
                        <p className="text-slate-600 mb-3">{tender.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Department: {displayDepartment}</span>
                          <span>•</span>
                          <span>Est. Value: {displayValue}</span>
                          {isRealTender && (tender as TenderData).complaintId && (
                            <>
                              <span>•</span>
                              <span>Complaint ID: {(tender as TenderData).complaintId}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="lg:text-right">
                        <div className="text-2xl font-bold text-slate-900 mb-1">{displayValue}</div>
                        <div className="text-sm text-slate-500 mb-3">Estimated Value</div>
                        <div className="flex lg:flex-col gap-2">
                          {isRealTender ? (
                            <Link href={`/tenders/${tender.id}`}>
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                                View Details
                              </button>
                            </Link>
                          ) : (
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                              View Details
                            </button>
                          )}
                          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-sm">
                            Download
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-slate-700">Published:</span>
                          <span className="text-slate-600 ml-2">
                            {isRealTender
                              ? new Date((tender as TenderData).createdAt).toLocaleDateString()
                              : new Date((tender as any).publishDate).toLocaleDateString()
                            }
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Last Date:</span>
                          <span className="text-slate-600 ml-2">
                            {isRealTender
                              ? ((tender as TenderData).endDate ? new Date((tender as TenderData).endDate!).toLocaleDateString() : 'TBD')
                              : new Date((tender as any).lastDate).toLocaleDateString()
                            }
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">
                            {isRealTender ? 'Complaint' : 'Eligibility'}:
                          </span>
                          <span className="text-slate-600 ml-2">
                            {isRealTender
                              ? ((tender as TenderData).complaintTitle || `Complaint #${(tender as TenderData).complaintId}`)
                              : (tender as any).eligibility
                            }
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="font-semibold text-slate-700 text-sm">Documents:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {isRealTender ? (
                            (tender as TenderData).documentUrls && (tender as TenderData).documentUrls.length > 0 ? (
                              (tender as TenderData).documentUrls.map((doc: string, docIndex: number) => (
                                <a
                                  key={docIndex}
                                  href={`http://localhost:8080${doc}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium hover:bg-slate-200 transition-colors"
                                >
                                  <Download size={12} />
                                  Document {docIndex + 1}
                                </a>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500">No documents available</span>
                            )
                          ) : (
                            (tender as any).documents.map((doc: string, docIndex: number) => (
                              <button
                                key={docIndex}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium hover:bg-slate-200 transition-colors"
                              >
                                <Download size={12} />
                                {doc}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tender Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">For Contractors</h3>
              <ul className="text-slate-600 space-y-1 text-sm">
                <li>• Ensure valid contractor license</li>
                <li>• Submit all required documents</li>
                <li>• Follow technical specifications</li>
                <li>• Meet eligibility criteria</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Important Dates</h3>
              <ul className="text-slate-600 space-y-1 text-sm">
                <li>• Pre-bid meeting: As mentioned in tender</li>
                <li>• Submission deadline: Strictly enforced</li>
                <li>• Technical evaluation: 7-10 days</li>
                <li>• Award notification: Within 15 days</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Tender Guidelines
            </button>
            <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}