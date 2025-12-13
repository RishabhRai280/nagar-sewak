"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, BarChart3, Users, FileText, Settings, CheckCircle, Clock, Star, ArrowRight, HelpCircle, Shield, Briefcase, MapPin, AlertTriangle, TrendingUp } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";
import { Token, fetchCurrentUserProfile, UserStore } from "@/lib/api/api";
import { useRouter } from "next/navigation";

export default function AdminGuidePage() {
  const { collapsed } = useSidebar();
  const [activeSection, setActiveSection] = useState<'overview' | 'management' | 'monitoring' | 'contractors' | 'analytics'>('overview');
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

      if (role !== "admin") {
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
    { id: 'overview', title: 'Admin Overview', icon: HelpCircle },
    { id: 'management', title: 'Issue Management', icon: FileText },
    { id: 'monitoring', title: 'System Monitoring', icon: BarChart3 },
    { id: 'contractors', title: 'Contractors', icon: Users },
    { id: 'analytics', title: 'Analytics', icon: TrendingUp },
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
                <Shield className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Admin User Guide</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">System Administration</p>
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
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">Welcome to Administration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-[#1e3a8a]">Primary Functions</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-700"><CheckCircle size={14} /></div>
                      <div>
                        <strong className="block text-slate-900 text-sm mb-1">Issue Resolution</strong>
                        <span className="text-slate-600 text-sm">Review incoming citizen reports, verify severity, and assign them to qualified contractors.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-700"><CheckCircle size={14} /></div>
                      <div>
                        <strong className="block text-slate-900 text-sm mb-1">Resource Allocation</strong>
                        <span className="text-slate-600 text-sm">Manage municipal budgets, approve tenders, and oversee project expenditures.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-700"><CheckCircle size={14} /></div>
                      <div>
                        <strong className="block text-slate-900 text-sm mb-1">System Oversight</strong>
                        <span className="text-slate-600 text-sm">Monitor overall system health, contractor performance ratings, and response time metrics.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-[#111827] mb-4 uppercase tracking-wide">Quick Shortcuts</h3>
                  <div className="space-y-3">
                    <Link href="/dashboard/admin#complaints" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-[#1e3a8a] hover:shadow-md transition group">
                      <div className="p-2 bg-blue-50 text-[#1e3a8a] rounded-lg group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors"><FileText size={20} /></div>
                      <span className="font-bold text-slate-700 group-hover:text-[#1e3a8a] transition-colors">Pending Issues</span>
                      <ArrowRight className="text-slate-300 ml-auto group-hover:text-[#1e3a8a]" size={16} />
                    </Link>
                    <Link href="/dashboard/admin#contractors" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-600 hover:shadow-md transition group">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Users size={20} /></div>
                      <span className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">Contractor Stats</span>
                      <ArrowRight className="text-slate-300 ml-auto group-hover:text-emerald-600" size={16} />
                    </Link>
                    <Link href="/dashboard/admin#projects" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-600 hover:shadow-md transition group">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors"><Briefcase size={20} /></div>
                      <span className="font-bold text-slate-700 group-hover:text-purple-600 transition-colors">Active Projects</span>
                      <ArrowRight className="text-slate-300 ml-auto group-hover:text-purple-600" size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Management Section */}
        {activeSection === 'management' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-8 uppercase tracking-wide border-b border-slate-100 pb-4">Issue Management Workflow</h2>

              <div className="relative border-l-2 border-slate-200 ml-4 space-y-12">
                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#1e3a8a] border-4 border-slate-50"></div>
                  <h3 className="text-lg font-bold text-[#1e3a8a] mb-2 uppercase tracking-wide">Step 1: Triage & Verification</h3>
                  <p className="text-slate-600 text-sm mb-4">Validate incoming citizen reports. Check evidence media and geolocation.</p>
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <strong>Action:</strong> Mark invalid/duplicate reports immediately to declutter the queue.
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-4 border-slate-50"></div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2 uppercase tracking-wide">Step 2: Prioritization & Budgeting</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700"><strong>Severity High:</strong> 24-48hr TAT. Safety critical (e.g. open manhole).</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700"><strong>Severity Low:</strong> Scheduled maintenance. Budget approval required.</p>
                    </div>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-4 border-slate-50"></div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2 uppercase tracking-wide">Step 3: Tender & Assignment</h3>
                  <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <p className="text-xs text-slate-500">Create a tender for the work or directly assign to an empanelled contractor if urgent. Monitor the contractor's acceptance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Section */}
        {activeSection === 'monitoring' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">Real-Time System Monitoring</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="text-blue-600" size={20} />
                      <h3 className="font-bold text-[#111827] uppercase tracking-wide text-sm">Volume Metrics</h3>
                    </div>
                    <p className="text-sm text-slate-600">Track the daily/weekly volume of incoming reports to identify spikes in specific wards.</p>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="text-orange-600" size={20} />
                      <h3 className="font-bold text-[#111827] uppercase tracking-wide text-sm">Resolution Time</h3>
                    </div>
                    <p className="text-sm text-slate-600">Monitor adherence to SLA. Alerts are triggered when resolution time exceeds standard limits.</p>
                  </div>
                </div>

                <div className="p-5 bg-[#1f2937] border border-slate-700 rounded-xl text-white">
                  <h3 className="font-bold text-white mb-4 uppercase tracking-wide text-sm flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-400" />
                    Critical Alerts Logic
                  </h3>
                  <ul className="text-sm text-slate-300 space-y-3">
                    <li className="flex gap-2"><span className="text-red-400">●</span> Rapid increase in "Water" complaints = Potential Pipeline Burst.</li>
                    <li className="flex gap-2"><span className="text-red-400">●</span> Contractor inactivity &gt; 3 days on Active Project.</li>
                    <li className="flex gap-2"><span className="text-red-400">●</span> Budget over-utilization warnings.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contractors Section */}
        {activeSection === 'contractors' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">Contractor Oversight</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Onboarding</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Verify licenses, insurance, and past performance history before enabling platform access.</p>
                  <Link href="/contractors" className="text-xs font-bold text-emerald-600 uppercase tracking-wider hover:underline">Manage Contractors →</Link>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Star size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Performance Review</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Contractors are rated automatically based on timeliness and quality. Use these ratings for future project allocations.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">Reports & Data</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
                    <h3 className="font-black text-slate-900 uppercase text-3xl mb-1">94%</h3>
                    <p className="text-xs text-slate-600 font-bold uppercase">Resolution Efficiency</p>
                  </div>
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <h3 className="font-black text-slate-900 uppercase text-3xl mb-1">4.2/5</h3>
                    <p className="text-xs text-slate-600 font-bold uppercase">Citizen Satisfaction</p>
                  </div>
                  <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl text-center">
                    <h3 className="font-black text-slate-900 uppercase text-3xl mb-1">Avg 3d</h3>
                    <p className="text-xs text-slate-600 font-bold uppercase">Turnaround Time</p>
                  </div>
                </div>

                <div className="p-6 border border-slate-200 rounded-xl bg-slate-50">
                  <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide text-sm flex items-center gap-2">
                    <FileText size={16} /> Export Options
                  </h4>
                  <div className="flex gap-3">
                    <button className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-700 hover:border-[#1e3a8a] hover:text-[#1e3a8a]">Download PDF Report</button>
                    <button className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-700 hover:border-[#1e3a8a] hover:text-[#1e3a8a]">Export Raw CSV</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}