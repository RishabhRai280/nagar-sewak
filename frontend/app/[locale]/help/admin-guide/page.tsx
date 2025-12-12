"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, BarChart3, Users, FileText, Settings, CheckCircle, Clock, Star, ArrowRight, HelpCircle, Shield, Briefcase, MapPin, AlertTriangle } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function AdminGuidePage() {
  const { collapsed } = useSidebar();
  const [activeSection, setActiveSection] = useState<'overview' | 'management' | 'monitoring' | 'contractors' | 'analytics'>('overview');

  const sections = [
    { id: 'overview', title: 'Admin Overview', icon: HelpCircle },
    { id: 'management', title: 'Issue Management', icon: FileText },
    { id: 'monitoring', title: 'System Monitoring', icon: BarChart3 },
    { id: 'contractors', title: 'Contractor Management', icon: Users },
    { id: 'analytics', title: 'Analytics & Reports', icon: Star },
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
              <Shield className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin User Guide</h1>
              <p className="text-slate-600">Complete guide for managing the municipal system and overseeing operations</p>
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
              <h2 className="text-xl font-bold text-slate-900 mb-6">Admin Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Core Responsibilities</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">Review and prioritize citizen reports</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">Assign issues to appropriate contractors</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">Monitor project progress and budgets</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">Generate reports and analytics</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Key Features</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <BarChart3 className="text-blue-600" size={20} />
                      <span className="font-medium text-slate-900">Real-time Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <Users className="text-emerald-600" size={20} />
                      <span className="font-medium text-slate-900">Contractor Management</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <FileText className="text-purple-600" size={20} />
                      <span className="font-medium text-slate-900">Issue Tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold text-slate-900">Issue Management</h3>
                </div>
                <p className="text-slate-700 text-sm mb-4">Review, prioritize, and assign citizen reports to contractors</p>
                <Link href="/dashboard/admin#complaints" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Manage Issues →
                </Link>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="text-emerald-600" size={24} />
                  <h3 className="text-lg font-semibold text-slate-900">Project Oversight</h3>
                </div>
                <p className="text-slate-700 text-sm mb-4">Monitor active projects, budgets, and contractor performance</p>
                <Link href="/dashboard/admin#projects" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  View Projects →
                </Link>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="text-purple-600" size={24} />
                  <h3 className="text-lg font-semibold text-slate-900">Analytics</h3>
                </div>
                <p className="text-slate-700 text-sm mb-4">Generate reports and analyze system performance metrics</p>
                <Link href="/dashboard/admin" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  View Analytics →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Management Section */}
        {activeSection === 'management' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Issue Management Workflow</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 1: Review New Reports</h3>
                  <p className="text-slate-700 mb-3">Monitor incoming citizen reports and assess their validity and priority.</p>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Check report details and evidence</li>
                    <li>• Verify location accuracy</li>
                    <li>• Assess severity and urgency</li>
                    <li>• Flag duplicate or invalid reports</li>
                  </ul>
                </div>

                <div className="border-l-4 border-emerald-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 2: Categorize & Prioritize</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-2">High Priority</h4>
                      <p className="text-sm text-red-700">Safety hazards, infrastructure failures, emergency repairs</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-900 mb-2">Medium Priority</h4>
                      <p className="text-sm text-yellow-700">Maintenance issues, quality of life improvements</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Low Priority</h4>
                      <p className="text-sm text-green-700">Cosmetic issues, long-term improvements</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Scheduled</h4>
                      <p className="text-sm text-blue-700">Routine maintenance, planned upgrades</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 3: Assign to Contractors</h3>
                  <p className="text-slate-700 mb-3">Match issues with qualified contractors based on expertise and availability.</p>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Review contractor specializations</li>
                    <li>• Check current workload and capacity</li>
                    <li>• Consider location and travel time</li>
                    <li>• Set deadlines and budget constraints</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 4: Monitor Progress</h3>
                  <p className="text-slate-700 mb-3">Track project status and ensure timely completion.</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2">
                      <Clock className="text-orange-600" size={16} />
                      <span>Track deadlines</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <CheckCircle className="text-emerald-600" size={16} />
                      <span>Verify completion</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Star className="text-purple-600" size={16} />
                      <span>Rate performance</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Section */}
        {activeSection === 'monitoring' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">System Monitoring</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Key Metrics to Monitor</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="text-blue-600" size={20} />
                        <h4 className="font-semibold text-slate-900">Report Volume</h4>
                      </div>
                      <p className="text-sm text-slate-700">Track daily/weekly report submissions and identify trends</p>
                    </div>
                    
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="text-emerald-600" size={20} />
                        <h4 className="font-semibold text-slate-900">Resolution Rate</h4>
                      </div>
                      <p className="text-sm text-slate-700">Monitor percentage of issues resolved within target timeframes</p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="text-purple-600" size={20} />
                        <h4 className="font-semibold text-slate-900">Contractor Performance</h4>
                      </div>
                      <p className="text-sm text-slate-700">Evaluate contractor efficiency, quality, and reliability</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Alert System</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="text-red-600" size={16} />
                        <span className="font-semibold text-red-900">Critical Issues</span>
                      </div>
                      <p className="text-sm text-red-700">High-severity reports requiring immediate attention</p>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="text-yellow-600" size={16} />
                        <span className="font-semibold text-yellow-900">Overdue Projects</span>
                      </div>
                      <p className="text-sm text-yellow-700">Projects exceeding their deadline</p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="text-blue-600" size={16} />
                        <span className="font-semibold text-blue-900">Budget Alerts</span>
                      </div>
                      <p className="text-sm text-blue-700">Projects approaching or exceeding budget limits</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contractors Section */}
        {activeSection === 'contractors' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Contractor Management</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Onboarding New Contractors</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Verify licenses and certifications</li>
                      <li>• Review insurance coverage</li>
                      <li>• Assess specialization areas</li>
                      <li>• Set up system access and permissions</li>
                      <li>• Establish communication protocols</li>
                    </ul>
                  </div>
                  
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Evaluation</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Track completion times</li>
                      <li>• Monitor quality ratings</li>
                      <li>• Review citizen feedback</li>
                      <li>• Assess budget adherence</li>
                      <li>• Evaluate communication effectiveness</li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Contractor Categories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-purple-300">
                      <h4 className="font-semibold text-slate-900 mb-2">Infrastructure</h4>
                      <p className="text-sm text-slate-600">Roads, bridges, utilities, drainage systems</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-purple-300">
                      <h4 className="font-semibold text-slate-900 mb-2">Maintenance</h4>
                      <p className="text-sm text-slate-600">Parks, lighting, signage, cleaning services</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-purple-300">
                      <h4 className="font-semibold text-slate-900 mb-2">Emergency</h4>
                      <p className="text-sm text-slate-600">24/7 response, safety hazards, urgent repairs</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Best Practices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-slate-700">
                      <li>• Maintain diverse contractor pool</li>
                      <li>• Regular performance reviews</li>
                      <li>• Clear communication channels</li>
                      <li>• Fair workload distribution</li>
                    </ul>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Competitive bidding processes</li>
                      <li>• Quality assurance protocols</li>
                      <li>• Timely payment processing</li>
                      <li>• Continuous improvement feedback</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Analytics & Reporting</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Report Types</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Operational Reports</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Daily/weekly activity summaries</li>
                        <li>• Issue resolution statistics</li>
                        <li>• Contractor performance metrics</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Financial Reports</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Budget utilization analysis</li>
                        <li>• Cost per resolution tracking</li>
                        <li>• Contractor payment summaries</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Strategic Reports</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Long-term trend analysis</li>
                        <li>• Resource allocation insights</li>
                        <li>• Community satisfaction metrics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Key Performance Indicators</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-900">Average Resolution Time</span>
                      <span className="text-blue-600 font-bold">3.2 days</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-900">Citizen Satisfaction</span>
                      <span className="text-emerald-600 font-bold">4.6/5.0</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-900">Budget Efficiency</span>
                      <span className="text-purple-600 font-bold">92%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-900">Contractor Reliability</span>
                      <span className="text-orange-600 font-bold">88%</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-slate-900 mb-2">Export Options</h4>
                    <p className="text-sm text-slate-700 mb-3">Generate reports in multiple formats:</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-white rounded text-xs font-medium">PDF</span>
                      <span className="px-2 py-1 bg-white rounded text-xs font-medium">Excel</span>
                      <span className="px-2 py-1 bg-white rounded text-xs font-medium">CSV</span>
                    </div>
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