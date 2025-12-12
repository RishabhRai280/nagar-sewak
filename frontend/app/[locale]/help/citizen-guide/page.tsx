"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, FileText, AlertCircle, Map, User, TrendingUp, CheckCircle, Clock, Star, ArrowRight, HelpCircle, MessageSquare, Camera, MapPin, Bell, LayoutDashboard } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function CitizenGuidePage() {
  const { collapsed } = useSidebar();
  const [activeSection, setActiveSection] = useState<'overview' | 'reporting' | 'tracking' | 'features' | 'tips'>('overview');

  const sections = [
    { id: 'overview', title: 'Getting Started', icon: HelpCircle },
    { id: 'reporting', title: 'How to Report Issues', icon: FileText },
    { id: 'tracking', title: 'Tracking Your Reports', icon: CheckCircle },
    { id: 'features', title: 'Unique Features', icon: Star },
    { id: 'tips', title: 'Tips & Best Practices', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
      <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 hidden lg:block transition-all duration-300`}></div>
      
      <Sidebar />

      <main className="flex-1 px-6 pb-12 pt-24 lg:px-10 lg:pb-16 lg:pt-28 relative z-10 overflow-y-auto w-full transition-all duration-300">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Citizen User Guide</h1>
              <p className="text-slate-600">Learn how to effectively use the citizen dashboard and report community issues</p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Welcome to Your Citizen Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">What You Can Do</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">Report community issues and problems</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">Track the status of your reports</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">View community issues on an interactive map</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">Monitor your community impact</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Quick Navigation</h3>
                  <div className="space-y-2">
                    <Link href="/dashboard/citizen" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                      <LayoutDashboard className="text-blue-600" size={20} />
                      <span className="font-medium text-slate-900">Dashboard Overview</span>
                      <ArrowRight className="text-slate-400 ml-auto" size={16} />
                    </Link>
                    <Link href="/report" className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">
                      <FileText className="text-emerald-600" size={20} />
                      <span className="font-medium text-slate-900">Submit New Report</span>
                      <ArrowRight className="text-slate-400 ml-auto" size={16} />
                    </Link>
                    <Link href="/dashboard/citizen/reports" className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                      <AlertCircle className="text-purple-600" size={20} />
                      <span className="font-medium text-slate-900">My Reports</span>
                      <ArrowRight className="text-slate-400 ml-auto" size={16} />
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
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">How to Report Community Issues</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 1: Access the Report Form</h3>
                  <p className="text-slate-700 mb-3">Click the "New Report" button from your dashboard or navigate directly to the report page.</p>
                  <Link href="/report" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <FileText size={16} />
                    Start New Report
                  </Link>
                </div>

                <div className="border-l-4 border-emerald-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 2: Provide Issue Details</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-emerald-600 mt-0.5" size={16} />
                      <span><strong>Title:</strong> Write a clear, descriptive title</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-emerald-600 mt-0.5" size={16} />
                      <span><strong>Description:</strong> Provide detailed information about the issue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-emerald-600 mt-0.5" size={16} />
                      <span><strong>Severity:</strong> Rate the urgency from 1 (low) to 5 (critical)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-emerald-600 mt-0.5" size={16} />
                      <span><strong>Location:</strong> Pin the exact location on the map</span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 3: Add Evidence</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Camera className="text-purple-600" size={20} />
                        <h4 className="font-semibold text-slate-900">Photos & Videos</h4>
                      </div>
                      <p className="text-sm text-slate-700">Upload clear images or videos showing the issue</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="text-orange-600" size={20} />
                        <h4 className="font-semibold text-slate-900">Location Data</h4>
                      </div>
                      <p className="text-sm text-slate-700">Precise GPS coordinates help authorities respond faster</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 4: Submit & Track</h3>
                  <p className="text-slate-700 mb-3">After submitting, you'll receive a unique report ID. You can track progress in your dashboard.</p>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Bell size={16} />
                    <span>You'll receive notifications when your report status changes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Section */}
        {activeSection === 'tracking' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Tracking Your Reports</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Report Status Meanings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Clock className="text-orange-600" size={20} />
                      <div>
                        <h4 className="font-semibold text-slate-900">Pending</h4>
                        <p className="text-sm text-slate-600">Report received and awaiting review</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <TrendingUp className="text-blue-600" size={20} />
                      <div>
                        <h4 className="font-semibold text-slate-900">In Progress</h4>
                        <p className="text-sm text-slate-600">Authorities are working on the issue</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <CheckCircle className="text-emerald-600" size={20} />
                      <div>
                        <h4 className="font-semibold text-slate-900">Resolved</h4>
                        <p className="text-sm text-slate-600">Issue has been successfully addressed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Where to Track</h3>
                  <div className="space-y-3">
                    <Link href="/dashboard/citizen/reports" className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:shadow-md transition">
                      <AlertCircle className="text-blue-600" size={20} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">My Reports Page</h4>
                        <p className="text-sm text-slate-600">View all your reports with search and filter options</p>
                      </div>
                      <ArrowRight className="text-slate-400" size={16} />
                    </Link>
                    
                    <Link href="/dashboard/citizen/history" className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:shadow-md transition">
                      <Clock className="text-purple-600" size={20} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">History Timeline</h4>
                        <p className="text-sm text-slate-600">Chronological view of all your submissions</p>
                      </div>
                      <ArrowRight className="text-slate-400" size={16} />
                    </Link>

                    <Link href="/map" className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:shadow-md transition">
                      <Map className="text-emerald-600" size={20} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">Live Map</h4>
                        <p className="text-sm text-slate-600">See your reports and community issues on the map</p>
                      </div>
                      <ArrowRight className="text-slate-400" size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {activeSection === 'features' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Unique Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="text-blue-600" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Citizen Score System</h3>
                  </div>
                  <p className="text-slate-700 mb-3">Earn points for community contributions:</p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• +10 points per report submitted</li>
                    <li>• +15 bonus points when issues are resolved</li>
                    <li>• Unlock achievement levels (Bronze, Silver, Gold)</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Map className="text-emerald-600" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Interactive Map</h3>
                  </div>
                  <p className="text-slate-700 mb-3">Advanced mapping features:</p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Real-time issue visualization</li>
                    <li>• GPS-accurate location pinning</li>
                    <li>• Community issue clustering</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-purple-600" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Analytics Dashboard</h3>
                  </div>
                  <p className="text-slate-700 mb-3">Track your community impact:</p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Resolution rate tracking</li>
                    <li>• Community contribution metrics</li>
                    <li>• Personal impact visualization</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="text-orange-600" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Smart Notifications</h3>
                  </div>
                  <p className="text-slate-700 mb-3">Stay informed automatically:</p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Status change alerts</li>
                    <li>• Community updates</li>
                    <li>• Achievement notifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        {activeSection === 'tips' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Tips & Best Practices</h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="text-emerald-600" size={20} />
                    Writing Effective Reports
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Use clear, descriptive titles (e.g., "Broken streetlight on Main St near Park Ave")</li>
                    <li>• Include specific details: time, weather conditions, safety concerns</li>
                    <li>• Take multiple photos from different angles</li>
                    <li>• Be objective and factual in your descriptions</li>
                  </ul>
                </div>

                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Camera className="text-blue-600" size={20} />
                    Photo & Video Guidelines
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Ensure good lighting and clear focus</li>
                    <li>• Include context (surrounding area, street signs, landmarks)</li>
                    <li>• Avoid including people's faces for privacy</li>
                    <li>• Keep file sizes reasonable (under 10MB per file)</li>
                  </ul>
                </div>

                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Star className="text-purple-600" size={20} />
                    Maximizing Your Impact
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Report issues promptly when you notice them</li>
                    <li>• Follow up on resolved issues to confirm completion</li>
                    <li>• Share the platform with neighbors to build community engagement</li>
                    <li>• Use the map to check if similar issues have already been reported</li>
                  </ul>
                </div>

                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="text-orange-600" size={20} />
                    What NOT to Report
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Emergency situations (call 911 instead)</li>
                    <li>• Private property issues (contact property owner)</li>
                    <li>• Complaints about individuals or businesses</li>
                    <li>• Issues outside your municipality's jurisdiction</li>
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