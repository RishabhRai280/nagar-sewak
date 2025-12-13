"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Construction, FileText, Clock, CheckCircle, Star, ArrowRight, HelpCircle, Briefcase, MapPin, Camera, DollarSign, AlertTriangle } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";
import { Token, fetchCurrentUserProfile, UserStore } from "@/lib/api/api";
import { useRouter } from "next/navigation";

export default function ContractorGuidePage() {
  const { collapsed } = useSidebar();
  const [activeSection, setActiveSection] = useState<'overview' | 'projects' | 'bidding' | 'execution' | 'quality'>('overview');
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const checkRole = async () => {
      let role = "citizen";
      const cached = UserStore.get();
      if (cached) {
        role = deriveRole(cached.roles);
      } else if (Token.get()) {
        try {
          const profile = await fetchCurrentUserProfile();
          role = deriveRole(profile.roles);
        } catch (e) { console.error(e); }
      }

      if (role !== "contractor" && role !== "admin") {
        router.replace("/help"); // Redirect unauthorized
      } else {
        setAuthorized(true);
      }
    };
    checkRole();
  }, [router]);

  const deriveRole = (roles?: string[]) => {
    if (!roles) return "citizen";
    if (roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")) return "admin";
    if (roles.includes("CONTRACTOR")) return "contractor";
    return "citizen";
  }

  if (!authorized) return null; // Or a loading spinner

  const sections = [
    { id: 'overview', title: 'Getting Started', icon: HelpCircle },
    { id: 'projects', title: 'Project Management', icon: Briefcase },
    { id: 'bidding', title: 'Bidding Process', icon: DollarSign },
    { id: 'execution', title: 'Project Execution', icon: Construction },
    { id: 'quality', title: 'Quality & Standards', icon: Star },
  ];

  return (
    <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
      <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 hidden lg:block transition-all duration-300`}></div>

      <Sidebar />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-12 pt-32 lg:pt-36 relative z-10 overflow-y-auto w-full transition-all duration-300">
        {/* Header - Aligned to Citizen Dashboard Style */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] to-[#f97316]"></div>
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#1e3a8a] rounded-xl flex items-center justify-center shadow-md">
                <Construction className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Contractor User Guide</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Partner Documentation</p>
              </div>
            </div>
            <Link href="/help" className="text-sm font-bold text-[#1e3a8a] hover:underline flex items-center gap-1 uppercase tracking-wide">
              <ArrowRight className="rotate-180" size={16} /> Back to Help Center
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-2 mt-8 border-t border-slate-100 pt-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${activeSection === section.id
                    ? 'bg-[#1e3a8a] text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                <section.icon size={16} />
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">Welcome to Contractor Portal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-[#1e3a8a]">Core Responsibilities</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-700"><CheckCircle size={14} /></div>
                      <div>
                        <strong className="block text-slate-900 text-sm mb-1">Project Execution</strong>
                        <span className="text-slate-600 text-sm">Execute assigned municipal projects on time, within budget, and adhering to quality standards.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-700"><CheckCircle size={14} /></div>
                      <div>
                        <strong className="block text-slate-900 text-sm mb-1">Transparent Bidding</strong>
                        <span className="text-slate-600 text-sm">Participate in open tenders for new infrastructure and maintenance works.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-700"><CheckCircle size={14} /></div>
                      <div>
                        <strong className="block text-slate-900 text-sm mb-1">Progress Reporting</strong>
                        <span className="text-slate-600 text-sm">Submit real-time updates, including media evidence and milestone completions.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-[#111827] mb-4 uppercase tracking-wide">Quick Shortcuts</h3>
                  <div className="space-y-3">
                    <Link href="/dashboard/contractor#projects" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-[#1e3a8a] hover:shadow-md transition group">
                      <div className="p-2 bg-blue-50 text-[#1e3a8a] rounded-lg group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors"><Briefcase size={20} /></div>
                      <span className="font-bold text-slate-700 group-hover:text-[#1e3a8a] transition-colors">Active Projects</span>
                      <ArrowRight className="text-slate-300 ml-auto group-hover:text-[#1e3a8a]" size={16} />
                    </Link>
                    <Link href="/dashboard/contractor#available" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-600 hover:shadow-md transition group">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors"><DollarSign size={20} /></div>
                      <span className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">View Tenders</span>
                      <ArrowRight className="text-slate-300 ml-auto group-hover:text-emerald-600" size={16} />
                    </Link>
                    <Link href="/dashboard/contractor" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-600 hover:shadow-md transition group">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors"><Star size={20} /></div>
                      <span className="font-bold text-slate-700 group-hover:text-purple-600 transition-colors">Performance Ratings</span>
                      <ArrowRight className="text-slate-300 ml-auto group-hover:text-purple-600" size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-8 uppercase tracking-wide border-b border-slate-100 pb-4">Project Lifecycle Management</h2>

              <div className="relative border-l-2 border-slate-200 ml-4 space-y-12">
                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-50"></div>
                  <h3 className="text-lg font-bold text-[#1e3a8a] mb-2 uppercase tracking-wide">Phase 1: Assignment & Kickoff</h3>
                  <p className="text-slate-600 text-sm mb-4">Upon winning a tender, the project is added to your dashboard. Review contract terms, conduct site surveys, and mobilize resources immediately.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-slate-700">
                      <strong>Requirements:</strong> Sign initial agreements & verify site access.
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-slate-700">
                      <strong>Timeline:</strong> Typically 3-5 days post-award.
                    </div>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-600 border-4 border-slate-50"></div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2 uppercase tracking-wide">Phase 2: Execution & Reporting</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700"><strong>Daily Logs:</strong> Maintain on-site logs of worker attendance and material usage.</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700"><strong>Milestone Updates:</strong> Update the dashboard when key stages (e.g., "Foundation Laid", "Wiring Complete") are reached.</p>
                    </div>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-4 border-slate-50"></div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2 uppercase tracking-wide">Phase 3: Completion & Review</h3>
                  <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="text-emerald-600" size={20} />
                      <h4 className="font-bold text-slate-900 text-sm uppercase">Final Inspection</h4>
                    </div>
                    <p className="text-xs text-slate-500">Submit final report with comprehensive photo evidence. A municipal engineer will verify quality before closing the project.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bidding Section */}
        {activeSection === 'bidding' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">Tendering Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-[#111827] mb-2 uppercase tracking-wide text-sm">1. Discovery</h3>
                    <p className="text-sm text-slate-600">Navigate to "Available Works". Use filters to find tenders matching your specialization (Roads, Electrical, Sanitation).</p>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-[#111827] mb-2 uppercase tracking-wide text-sm">2. Proposal Strategy</h3>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>• Analyze the "Sanctioned Budget" vs. your cost estimate.</li>
                      <li>• Check the "Severity" level - higher severity often means urgent timelines but potentially faster clearance.</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-[#111827] mb-2 uppercase tracking-wide text-sm">3. Submission</h3>
                    <p className="text-sm text-slate-600">Enter your bid amount and upload technical proposals. Ensure all compliance documents (licenses, insurance) are up to date in your profile.</p>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-[#111827] mb-2 uppercase tracking-wide text-sm">4. Award</h3>
                    <p className="text-sm text-slate-600">Winners are notified via dashboard alerts. Unsuccessful bids are archived in "History" with feedback if available.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Execution Section */}
        {activeSection === 'execution' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">On-Site Execution Best Practices</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={24} />
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-wide mb-2">Documentation</h3>
                  <p className="text-xs text-slate-600">Take clear "Before" and "After" photos with geotags enabled. This is mandatory for payment processing.</p>
                </div>
                <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl text-center">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-wide mb-2">Safety First</h3>
                  <p className="text-xs text-slate-600">Ensure all workers wear PPE. Barricade work sites to ensure citizen safety.</p>
                </div>
                <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl text-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock size={24} />
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-wide mb-2">Timeliness</h3>
                  <p className="text-xs text-slate-600">Delays must be reported immediately with justification. Unexplained delays affect your rating.</p>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Quality Section */}
        {activeSection === 'quality' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">Quality & Ratings System</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Star size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Rating Criteria</h3>
                  </div>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• <strong>Quality of Work:</strong> Durability and finish.</li>
                    <li>• <strong>Schedule Adherence:</strong> Finishing on or before deadline.</li>
                    <li>• <strong>Compliance:</strong> Safety gear and proper documentation.</li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CheckCircle size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Benefits of High Rating</h3>
                  </div>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Priority visibility for new high-value tenders.</li>
                    <li>• "Trusted Partner" badge on profile.</li>
                    <li>• Faster invoice processing and clearance.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}