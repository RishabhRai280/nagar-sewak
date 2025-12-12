"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Construction, FileText, Clock, CheckCircle, Star, ArrowRight, HelpCircle, Briefcase, MapPin, Camera, DollarSign, AlertTriangle } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function ContractorGuidePage() {
  const { collapsed } = useSidebar();
  const [activeSection, setActiveSection] = useState<'overview' | 'projects' | 'bidding' | 'execution' | 'quality'>('overview');

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

      <main className="flex-1 px-6 pb-12 pt-24 lg:px-10 lg:pb-16 lg:pt-28 relative z-10 overflow-y-auto w-full transition-all duration-300">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Construction className="text-orange-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Contractor User Guide</h1>
              <p className="text-slate-600">Complete guide for contractors to manage projects and deliver quality services</p>
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
                    ? 'bg-orange-600 text-white'
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
              <h2 className="text-xl font-bold text-slate-900 mb-6">Contractor Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Your Responsibilities</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">Bid on available municipal projects</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">Execute assigned projects on time and within budget</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">Provide regular progress updates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                      <span className="text-slate-700">Maintain quality standards and documentation</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Platform Benefits</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Briefcase className="text-orange-600" size={20} />
                      <span className="font-medium text-slate-900">Streamlined Project Access</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <DollarSign className="text-blue-600" size={20} />
                      <span className="font-medium text-slate-900">Transparent Bidding Process</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <Star className="text-emerald-600" size={20} />
                      <span className="font-medium text-slate-900">Performance Tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="text-orange-600" size={24} />
                  <h3 className="text-lg font-semibold text-slate-900">Active Projects</h3>
                </div>
                <p className="text-slate-700 text-sm mb-4">Manage your current assignments and track progress</p>
                <Link href="/dashboard/contractor#projects" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                  View Projects →
                </Link>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold text-slate-900">Available Tenders</h3>
                </div>
                <p className="text-slate-700 text-sm mb-4">Browse and bid on new municipal projects</p>
                <Link href="/dashboard/contractor#available" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Browse Tenders →
                </Link>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="text-emerald-600" size={24} />
                  <h3 className="text-lg font-semibold text-slate-900">Performance</h3>
                </div>
                <p className="text-slate-700 text-sm mb-4">Monitor your ratings and build your reputation</p>
                <Link href="/dashboard/contractor" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  View Metrics →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Project Management</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Project Lifecycle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="text-blue-600" size={16} />
                        <h4 className="font-semibold text-blue-900">Bidding</h4>
                      </div>
                      <p className="text-sm text-blue-700">Submit competitive proposals</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-emerald-600" size={16} />
                        <h4 className="font-semibold text-emerald-900">Awarded</h4>
                      </div>
                      <p className="text-sm text-emerald-700">Project assigned to you</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Construction className="text-purple-600" size={16} />
                        <h4 className="font-semibold text-purple-900">In Progress</h4>
                      </div>
                      <p className="text-sm text-purple-700">Active work phase</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="text-green-600" size={16} />
                        <h4 className="font-semibold text-green-900">Completed</h4>
                      </div>
                      <p className="text-sm text-green-700">Project delivered</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-emerald-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Project Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-2">Emergency Repairs</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Safety hazards requiring immediate attention</li>
                        <li>• Infrastructure failures</li>
                        <li>• 24-48 hour response time required</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Infrastructure Projects</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Road construction and repairs</li>
                        <li>• Utility installations</li>
                        <li>• Bridge and drainage work</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Maintenance Services</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Park and recreation facility upkeep</li>
                        <li>• Street lighting and signage</li>
                        <li>• Regular cleaning services</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">Improvement Projects</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Community facility upgrades</li>
                        <li>• Accessibility improvements</li>
                        <li>• Environmental initiatives</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Progress Reporting</h3>
                  <p className="text-slate-700 mb-3">Keep stakeholders informed with regular updates:</p>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Weekly progress reports with photos</li>
                    <li>• Milestone completion notifications</li>
                    <li>• Budget and timeline updates</li>
                    <li>• Issue escalation when needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bidding Section */}
        {activeSection === 'bidding' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Bidding Process</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 1: Browse Available Tenders</h3>
                  <p className="text-slate-700 mb-3">Review open projects that match your expertise and capacity.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-1">Filter by Category</h4>
                      <p className="text-sm text-slate-600">Focus on your specialization areas</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-1">Check Requirements</h4>
                      <p className="text-sm text-slate-600">Ensure you meet all qualifications</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-emerald-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 2: Prepare Your Proposal</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Required Information</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Detailed cost breakdown</li>
                        <li>• Project timeline and milestones</li>
                        <li>• Resource allocation plan</li>
                        <li>• Quality assurance measures</li>
                        <li>• Risk mitigation strategies</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Supporting Documents</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Current licenses and certifications</li>
                        <li>• Insurance coverage proof</li>
                        <li>• Previous project portfolio</li>
                        <li>• Client references</li>
                        <li>• Equipment and personnel availability</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 3: Submit & Track</h3>
                  <p className="text-slate-700 mb-3">Submit your proposal before the deadline and monitor its status.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="text-yellow-600" size={16} />
                        <span className="font-semibold text-yellow-900">Under Review</span>
                      </div>
                      <p className="text-sm text-yellow-700">Proposal being evaluated</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="font-semibold text-green-900">Accepted</span>
                      </div>
                      <p className="text-sm text-green-700">Congratulations! Project awarded</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="text-red-600" size={16} />
                        <span className="font-semibold text-red-900">Not Selected</span>
                      </div>
                      <p className="text-sm text-red-700">Better luck next time</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Bidding Best Practices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900">Do's</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Submit proposals early</li>
                        <li>• Be realistic with timelines</li>
                        <li>• Include detailed breakdowns</li>
                        <li>• Highlight relevant experience</li>
                        <li>• Follow all requirements exactly</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900">Don'ts</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Underbid to win at any cost</li>
                        <li>• Miss submission deadlines</li>
                        <li>• Provide incomplete information</li>
                        <li>• Overcommit your resources</li>
                        <li>• Ignore project specifications</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Execution Section */}
        {activeSection === 'execution' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Project Execution</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Project Kickoff</h3>
                  <p className="text-slate-700 mb-3">Once awarded a project, follow these initial steps:</p>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Review contract terms and conditions</li>
                    <li>• Conduct site survey and assessment</li>
                    <li>• Finalize resource allocation</li>
                    <li>• Establish communication protocols</li>
                    <li>• Submit detailed work plan</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Documentation Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Camera className="text-blue-600" size={20} />
                        <h4 className="font-semibold text-slate-900">Progress Photos</h4>
                      </div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Before, during, and after shots</li>
                        <li>• Date and time stamps</li>
                        <li>• Multiple angles and perspectives</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-emerald-600" size={20} />
                        <h4 className="font-semibold text-slate-900">Work Reports</h4>
                      </div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Daily activity logs</li>
                        <li>• Material usage tracking</li>
                        <li>• Personnel deployment records</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Communication Protocol</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Regular Updates</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Weekly progress reports</li>
                        <li>• Milestone completion notifications</li>
                        <li>• Budget status updates</li>
                        <li>• Timeline adjustments (if needed)</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Issue Escalation</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Immediate notification of delays</li>
                        <li>• Budget overrun alerts</li>
                        <li>• Safety incident reporting</li>
                        <li>• Technical challenge discussions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Safety & Compliance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900">Safety Requirements</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Personal protective equipment</li>
                        <li>• Site safety protocols</li>
                        <li>• Traffic management plans</li>
                        <li>• Emergency response procedures</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900">Regulatory Compliance</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Building codes and standards</li>
                        <li>• Environmental regulations</li>
                        <li>• Permit requirements</li>
                        <li>• Quality control measures</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quality Section */}
        {activeSection === 'quality' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Quality & Standards</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Quality Standards</h3>
                  <p className="text-slate-700 mb-4">All work must meet or exceed municipal standards and industry best practices.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Material Standards</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Use approved suppliers only</li>
                        <li>• Maintain material certifications</li>
                        <li>• Follow storage and handling protocols</li>
                        <li>• Document material usage</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Workmanship Standards</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Follow technical specifications</li>
                        <li>• Implement quality control checks</li>
                        <li>• Maintain clean work sites</li>
                        <li>• Ensure proper finishing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Performance Evaluation</h3>
                  <p className="text-slate-700 mb-4">Your performance is evaluated on multiple criteria:</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                      <Star className="text-blue-600 mx-auto mb-2" size={20} />
                      <h4 className="font-semibold text-slate-900 text-sm">Quality</h4>
                      <p className="text-xs text-slate-600">Work standards</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                      <Clock className="text-emerald-600 mx-auto mb-2" size={20} />
                      <h4 className="font-semibold text-slate-900 text-sm">Timeliness</h4>
                      <p className="text-xs text-slate-600">Schedule adherence</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
                      <DollarSign className="text-purple-600 mx-auto mb-2" size={20} />
                      <h4 className="font-semibold text-slate-900 text-sm">Budget</h4>
                      <p className="text-xs text-slate-600">Cost management</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-center">
                      <FileText className="text-orange-600 mx-auto mb-2" size={20} />
                      <h4 className="font-semibold text-slate-900 text-sm">Communication</h4>
                      <p className="text-xs text-slate-600">Reporting quality</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Building Your Reputation</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Rating System</h4>
                      <p className="text-sm text-slate-700 mb-2">Projects are rated on a 5-star scale based on:</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Overall quality of work delivered</li>
                        <li>• Adherence to timeline and budget</li>
                        <li>• Communication and professionalism</li>
                        <li>• Problem-solving and adaptability</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Benefits of High Ratings</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Priority consideration for new projects</li>
                        <li>• Access to higher-value contracts</li>
                        <li>• Preferred contractor status</li>
                        <li>• Positive references for future opportunities</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Continuous Improvement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900">Feedback Integration</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Review project feedback regularly</li>
                        <li>• Implement suggested improvements</li>
                        <li>• Seek clarification when needed</li>
                        <li>• Document lessons learned</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900">Professional Development</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Stay updated on industry standards</li>
                        <li>• Invest in new technologies</li>
                        <li>• Maintain certifications</li>
                        <li>• Expand service capabilities</li>
                      </ul>
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