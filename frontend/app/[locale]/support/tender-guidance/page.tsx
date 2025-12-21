"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle, AlertCircle, Info, Users, DollarSign, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function TenderGuidancePage() {
  const [activeSection, setActiveSection] = useState("overview");

  const downloadGuide = (type: string) => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#'; // In real implementation, this would be the actual PDF URL
    link.download = `tender-guidance-${type}.pdf`;
    link.click();
    alert(`Downloading ${type} guide...`);
  };

  const sections = [
    { id: "overview", title: "Overview", icon: Info },
    { id: "eligibility", title: "Eligibility", icon: Users },
    { id: "process", title: "Process", icon: FileText },
    { id: "documents", title: "Documents", icon: CheckCircle },
    { id: "evaluation", title: "Evaluation", icon: Shield },
    { id: "payment", title: "Payment", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 lg:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Tender Guidance</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Complete guide for contractors on how to participate in municipal tenders and projects
          </p>
        </motion.div>

        {/* Download Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <button
            onClick={() => downloadGuide('complete')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg"
          >
            <Download size={18} />
            Download Complete Guide
          </button>
          <button
            onClick={() => downloadGuide('quick-reference')}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg"
          >
            <Download size={18} />
            Quick Reference Card
          </button>
          <button
            onClick={() => downloadGuide('checklist')}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg"
          >
            <Download size={18} />
            Document Checklist
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-32">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Navigation</h3>
              <nav className="space-y-2">
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                        activeSection === section.id
                          ? "bg-blue-100 text-blue-700 font-bold"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={18} />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              
              {/* Overview Section */}
              {activeSection === "overview" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Tender Process Overview</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-blue-900 mb-3">What is the Tender Process?</h3>
                      <p className="text-blue-800 leading-relaxed">
                        The tender process is a transparent and competitive method for awarding municipal contracts. 
                        It ensures fair competition among qualified contractors and helps achieve the best value for public projects.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <CheckCircle className="text-green-600" size={24} />
                          <h3 className="text-lg font-bold text-green-900">Benefits</h3>
                        </div>
                        <ul className="text-green-800 space-y-2">
                          <li>• Fair and transparent process</li>
                          <li>• Equal opportunity for all contractors</li>
                          <li>• Competitive pricing</li>
                          <li>• Quality assurance</li>
                          <li>• Timely project completion</li>
                        </ul>
                      </div>

                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Clock className="text-orange-600" size={24} />
                          <h3 className="text-lg font-bold text-orange-900">Timeline</h3>
                        </div>
                        <ul className="text-orange-800 space-y-2">
                          <li>• Tender publication: Day 1</li>
                          <li>• Submission deadline: Day 15</li>
                          <li>• Evaluation period: 5-7 days</li>
                          <li>• Award announcement: Day 25</li>
                          <li>• Contract signing: Day 30</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Eligibility Section */}
              {activeSection === "eligibility" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Eligibility Criteria</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className="text-red-600" size={24} />
                        <h3 className="text-lg font-bold text-red-900">Mandatory Requirements</h3>
                      </div>
                      <ul className="text-red-800 space-y-2">
                        <li>• Valid contractor license from competent authority</li>
                        <li>• Company registration certificate</li>
                        <li>• GST registration and compliance</li>
                        <li>• PAN card and tax compliance certificates</li>
                        <li>• Minimum 2 years of relevant experience</li>
                        <li>• Financial capacity as per tender requirements</li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                        <Users className="text-slate-600 mx-auto mb-3" size={32} />
                        <h3 className="font-bold text-slate-900 mb-2">Experience</h3>
                        <p className="text-slate-700 text-sm">Minimum 2 years in similar projects</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                        <DollarSign className="text-slate-600 mx-auto mb-3" size={32} />
                        <h3 className="font-bold text-slate-900 mb-2">Financial</h3>
                        <p className="text-slate-700 text-sm">Adequate financial capacity</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                        <Shield className="text-slate-600 mx-auto mb-3" size={32} />
                        <h3 className="font-bold text-slate-900 mb-2">Legal</h3>
                        <p className="text-slate-700 text-sm">All legal compliances met</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Process Section */}
              {activeSection === "process" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Step-by-Step Process</h2>
                  
                  <div className="space-y-6">
                    {[
                      {
                        step: 1,
                        title: "Registration",
                        description: "Create your contractor account on the platform with all required details and documents.",
                        color: "blue"
                      },
                      {
                        step: 2,
                        title: "Browse Tenders",
                        description: "View available tender opportunities that match your expertise and capacity.",
                        color: "green"
                      },
                      {
                        step: 3,
                        title: "Prepare Proposal",
                        description: "Prepare your technical and financial proposal with all required documents.",
                        color: "orange"
                      },
                      {
                        step: 4,
                        title: "Submit Bid",
                        description: "Submit your complete proposal before the deadline through the online portal.",
                        color: "purple"
                      },
                      {
                        step: 5,
                        title: "Evaluation",
                        description: "Wait for the evaluation committee to review and assess all submitted proposals.",
                        color: "red"
                      },
                      {
                        step: 6,
                        title: "Award",
                        description: "If selected, you'll receive the award notification and contract documents.",
                        color: "emerald"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex gap-6">
                        <div className={`flex-shrink-0 w-12 h-12 bg-${item.color}-100 text-${item.color}-700 rounded-full flex items-center justify-center font-bold text-lg`}>
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                          <p className="text-slate-700 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents Section */}
              {activeSection === "documents" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Required Documents</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-yellow-900 mb-3">Document Checklist</h3>
                      <p className="text-yellow-800 mb-4">
                        Ensure all documents are clear, valid, and in PDF format (max 5MB each).
                      </p>
                      <button
                        onClick={() => downloadGuide('checklist')}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition"
                      >
                        <Download size={16} />
                        Download Checklist
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Legal Documents</h3>
                        <ul className="space-y-3">
                          {[
                            "Contractor License",
                            "Company Registration Certificate",
                            "GST Registration Certificate",
                            "PAN Card",
                            "Tax Compliance Certificate",
                            "Power of Attorney (if applicable)"
                          ].map((doc, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                              <span className="text-slate-700">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Technical Documents</h3>
                        <ul className="space-y-3">
                          {[
                            "Technical Proposal",
                            "Work Methodology",
                            "Project Timeline",
                            "Resource Allocation Plan",
                            "Quality Assurance Plan",
                            "Safety Management Plan"
                          ].map((doc, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <CheckCircle className="text-blue-600 flex-shrink-0" size={16} />
                              <span className="text-slate-700">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Evaluation Section */}
              {activeSection === "evaluation" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Evaluation Criteria</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-purple-900 mb-3">Evaluation Process</h3>
                      <p className="text-purple-800 leading-relaxed">
                        All proposals are evaluated by a qualified committee based on technical competence, 
                        financial viability, and past performance. The process is transparent and merit-based.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-blue-900 mb-3">Technical (40%)</h3>
                        <ul className="text-blue-800 space-y-2 text-sm">
                          <li>• Methodology & approach</li>
                          <li>• Resource allocation</li>
                          <li>• Timeline feasibility</li>
                          <li>• Quality measures</li>
                          <li>• Innovation & efficiency</li>
                        </ul>
                      </div>

                      <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-green-900 mb-3">Financial (35%)</h3>
                        <ul className="text-green-800 space-y-2 text-sm">
                          <li>• Quoted price</li>
                          <li>• Cost breakdown</li>
                          <li>• Value for money</li>
                          <li>• Payment terms</li>
                          <li>• Financial capacity</li>
                        </ul>
                      </div>

                      <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-orange-900 mb-3">Experience (25%)</h3>
                        <ul className="text-orange-800 space-y-2 text-sm">
                          <li>• Past performance</li>
                          <li>• Similar project experience</li>
                          <li>• Client references</li>
                          <li>• Completion record</li>
                          <li>• Quality ratings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Section */}
              {activeSection === "payment" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Terms</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-green-900 mb-3">Payment Schedule</h3>
                      <p className="text-green-800 leading-relaxed">
                        Payments are made based on project milestones and verified completion of work phases. 
                        This ensures quality delivery and proper fund utilization.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { milestone: "Project Start", percentage: "10%", description: "Advance payment" },
                        { milestone: "25% Complete", percentage: "20%", description: "First milestone" },
                        { milestone: "50% Complete", percentage: "30%", description: "Mid-project" },
                        { milestone: "75% Complete", percentage: "25%", description: "Near completion" },
                        { milestone: "100% Complete", percentage: "15%", description: "Final payment" }
                      ].map((payment, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-2">{payment.percentage}</div>
                          <div className="font-bold text-slate-900 mb-1">{payment.milestone}</div>
                          <div className="text-sm text-slate-600">{payment.description}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-3">Payment Process</h3>
                      <ol className="text-slate-700 space-y-2">
                        <li>1. Milestone completion and verification</li>
                        <li>2. Invoice submission with required documents</li>
                        <li>3. Administrative review and approval</li>
                        <li>4. Payment processing (7-14 business days)</li>
                        <li>5. Payment confirmation and receipt</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Need Additional Help?</h2>
          <p className="text-blue-100 mb-6">
            Our tender support team is available to help you with any questions about the process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/support/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition"
            >
              <FileText size={18} />
              Contact Tender Support
            </a>
            <button
              onClick={() => downloadGuide('complete')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition"
            >
              <Download size={18} />
              Download Full Guide
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}