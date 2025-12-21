"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ClipboardList, Map, FileEdit, User, Search, MapPin, Camera, AlertCircle, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function CitizenGuidePage() {
  const { collapsed } = useSidebar();
  const [activeSection, setActiveSection] = useState<'overview' | 'reporting' | 'tracking' | 'features' | 'tips'>('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: HelpCircle },
    { id: 'reporting', title: 'Reporting Issues', icon: FileEdit },
    { id: 'tracking', title: 'Tracking Status', icon: ClipboardList },
    { id: 'features', title: 'Key Features', icon: Map },
    { id: 'tips', title: 'Tips & Tricks', icon: AlertCircle },
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
                <User className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Citizen User Guide</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Platform Documentation</p>
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
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">Welcome to Nagar Sewak</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-[#1e3a8a]">Your Role as a Citizen</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-700"><CheckCircle size={14} /></div>
                      <div>
                        <strong className="block text-slate-900 text-sm mb-1">Report Issues</strong>
                        <span className="text-slate-600 text-sm">Identify and report civic problems like potholes, garbage, or broken streetlights.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-700"><CheckCircle size={14} /></div>
                      <div>
                        <strong className="block text-slate-900 text-sm mb-1">Track Progress</strong>
                        <span className="text-slate-600 text-sm">Follow the status of your complaints from submission to resolution.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-700"><CheckCircle size={14} /></div>
                      <div>
                        <strong className="block text-slate-900 text-sm mb-1">Rate Services</strong>
                        <span className="text-slate-600 text-sm">Provide feedback on completed works to hold contractors accountable.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-[#111827] mb-4 uppercase tracking-wide">Quick Shortcuts</h3>
                  <div className="space-y-3">
                    <Link href="/report" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-[#1e3a8a] hover:shadow-md transition group">
                      <div className="p-2 bg-blue-50 text-[#1e3a8a] rounded-lg group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors"><FileEdit size={20} /></div>
                      <span className="font-bold text-slate-700 group-hover:text-[#1e3a8a] transition-colors">Start New Report</span>
                      <ArrowRight className="text-slate-300 ml-auto group-hover:text-[#1e3a8a]" size={16} />
                    </Link>
                    <Link href="/dashboard/citizen/reports" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-600 hover:shadow-md transition group">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors"><ClipboardList size={20} /></div>
                      <span className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">View My Reports</span>
                      <ArrowRight className="text-slate-300 ml-auto group-hover:text-emerald-600" size={16} />
                    </Link>
                    <Link href="/map" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-600 hover:shadow-md transition group">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors"><Map size={20} /></div>
                      <span className="font-bold text-slate-700 group-hover:text-purple-600 transition-colors">Open Live Map</span>
                      <ArrowRight className="text-slate-300 ml-auto group-hover:text-purple-600" size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reporting Section */}
        {activeSection === 'reporting' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-8 uppercase tracking-wide border-b border-slate-100 pb-4">How to Report an Issue</h2>

              <div className="relative border-l-2 border-slate-200 ml-4 space-y-12">
                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#1e3a8a] border-4 border-slate-50"></div>
                  <h3 className="text-lg font-bold text-[#1e3a8a] mb-2 uppercase tracking-wide">Step 1: Capture Details</h3>
                  <p className="text-slate-600 text-sm mb-4">Click "New Report" and provide a clear title and description of the issue.</p>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-slate-700 flex items-center gap-2">
                    <Camera size={16} />
                    <strong>Pro Tip:</strong> Upload a photo! Reports with photos are prioritized 2x faster.
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-600 border-4 border-slate-50"></div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2 uppercase tracking-wide">Step 2: Pin Location</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                    <div className="flex gap-3">
                      <MapPin size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700">Use the interactive map to place a pin exactly where the issue is. This helps contractors find the spot easily.</p>
                    </div>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-4 border-slate-50"></div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2 uppercase tracking-wide">Step 3: Submit & Verify</h3>
                  <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <p className="text-xs text-slate-500">Review your information and click submit. You will receive a unique Complaint ID (e.g., #CMP-2025-001) for tracking.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Section */}
        {activeSection === 'tracking' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">Understanding Statuses</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-5 bg-white border border-orange-200 rounded-xl shadow-sm border-l-4 border-l-orange-500">
                    <h3 className="font-bold text-orange-700 uppercase tracking-wide text-sm mb-1">Pending</h3>
                    <p className="text-sm text-slate-600">Your report has been received and is waiting for administrator review.</p>
                  </div>
                  <div className="p-5 bg-white border border-blue-200 rounded-xl shadow-sm border-l-4 border-l-blue-500">
                    <h3 className="font-bold text-blue-700 uppercase tracking-wide text-sm mb-1">In Progress</h3>
                    <p className="text-sm text-slate-600">A contractor has been assigned and work is underway.</p>
                  </div>
                  <div className="p-5 bg-white border border-emerald-200 rounded-xl shadow-sm border-l-4 border-l-emerald-500">
                    <h3 className="font-bold text-emerald-700 uppercase tracking-wide text-sm mb-1">Resolved</h3>
                    <p className="text-sm text-slate-600">Work is completed. You can now rate the service.</p>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <h3 className="font-bold text-[#111827] mb-4 uppercase tracking-wide text-sm">
                    Notifications
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">You will receive system notifications when:</p>
                  <ul className="text-sm text-slate-600 space-y-3">
                    <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#1e3a8a]"></span> Status changes</li>
                    <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#1e3a8a]"></span> Contractor uploads proof of work</li>
                    <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#1e3a8a]"></span> Report is closed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {activeSection === 'features' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">Other Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Map size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Live Map</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">See complaints from other citizens around you. This helps avoid duplicate reports for the same pothole!</p>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><User size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Profile & History</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">View improved Impact Score based on your approved reports. Maintain a record of all your civic contributions.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        {activeSection === 'tips' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">Tips for Faster Resolution</h2>

              <div className="space-y-4">
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-4">
                  <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Be Specific</h4>
                    <p className="text-xs text-slate-600 mt-1">Instead of "Bad road", say "Large pothole approx 2ft wide near the bus stop".</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
                  <Camera className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Photos Matter</h4>
                    <p className="text-xs text-slate-600 mt-1">Clear photos help admins judge severity immediately, skipping the inspection verification delay.</p>
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