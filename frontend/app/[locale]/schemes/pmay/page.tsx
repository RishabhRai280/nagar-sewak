"use client";

import Link from 'next/link';
import { ArrowLeft, Home, CheckCircle, ExternalLink, Download, Phone, Mail, MapPin, Users, DollarSign, Calendar, FileText } from 'lucide-react';

export default function PMAYPage() {
  const eligibilityCriteria = [
    "Family should not own a pucca house anywhere in India",
    "No family member should have availed central assistance under any housing scheme",
    "Annual household income should be within prescribed limits",
    "Family should not have availed loan under any housing scheme from any financial institution"
  ];

  const documents = [
    "Aadhaar Card of all family members",
    "Income Certificate",
    "Caste Certificate (if applicable)",
    "Bank Account Details",
    "Property Documents (if any)",
    "Affidavit for not owning house"
  ];

  const benefits = [
    {
      category: "EWS (Economically Weaker Section)",
      income: "Up to ₹3 lakh per annum",
      subsidy: "₹2.67 lakh interest subsidy",
      loanAmount: "Up to ₹6 lakh"
    },
    {
      category: "LIG (Lower Income Group)",
      income: "₹3-6 lakh per annum",
      subsidy: "₹2.67 lakh interest subsidy",
      loanAmount: "Up to ₹6 lakh"
    },
    {
      category: "MIG-I (Middle Income Group-I)",
      income: "₹6-12 lakh per annum",
      subsidy: "₹2.35 lakh interest subsidy",
      loanAmount: "Up to ₹9 lakh"
    },
    {
      category: "MIG-II (Middle Income Group-II)",
      income: "₹12-18 lakh per annum",
      subsidy: "₹2.30 lakh interest subsidy",
      loanAmount: "Up to ₹12 lakh"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link href="/schemes" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={20} />
          Back to Government Schemes
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Home className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Pradhan Mantri Awas Yojana (PMAY)</h1>
              <p className="text-xl text-orange-100">Housing for All - Affordable Housing Scheme</p>
              <div className="flex items-center gap-4 mt-4 text-orange-100">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Launched: 2015
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  Beneficiaries: 1+ Crore
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Scheme Overview</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Pradhan Mantri Awas Yojana (PMAY) is a flagship mission of the Government of India to provide affordable housing to the urban and rural poor. The scheme aims to provide pucca houses to all eligible families by 2022, now extended to 2025.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Under this scheme, the government provides interest subsidy on home loans to make housing affordable for economically weaker sections, lower income groups, and middle income groups.
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">Mission Objective</h3>
                <p className="text-orange-700 text-sm">
                  "Housing for All by 2025" - To ensure every family has access to adequate, safe, and affordable housing with basic amenities.
                </p>
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Eligibility Criteria</h2>
              <div className="space-y-3">
                {eligibilityCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                    <p className="text-slate-600">{criteria}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Special Provisions</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Priority to women, SC/ST, OBC, minorities, and differently-abled persons</li>
                  <li>• Mandatory to have at least one adult woman member as owner/co-owner</li>
                  <li>• Senior citizens (60+ years) get additional benefits</li>
                </ul>
              </div>
            </div>

            {/* Benefits & Subsidy */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Benefits & Interest Subsidy</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900">{benefit.category}</h3>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {benefit.subsidy}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Annual Income:</span>
                        <p className="font-medium text-slate-700">{benefit.income}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Max Loan Amount:</span>
                        <p className="font-medium text-slate-700">{benefit.loanAmount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Required Documents</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {documents.map((document, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <FileText className="text-blue-500 flex-shrink-0" size={16} />
                    <span className="text-slate-700 text-sm">{document}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Apply */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Apply</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Visit Official Website</h3>
                    <p className="text-slate-600 text-sm">Go to the official PMAY website and register yourself</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Fill Application Form</h3>
                    <p className="text-slate-600 text-sm">Complete the online application form with accurate details</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Upload Documents</h3>
                    <p className="text-slate-600 text-sm">Upload all required documents in the specified format</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Submit & Track</h3>
                    <p className="text-slate-600 text-sm">Submit application and track status using application number</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Apply Now Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Apply for PMAY</h3>
              <p className="text-orange-100 mb-6 text-sm">
                Apply directly on the official government site for Pradhan Mantri Awas Yojana.
              </p>
              <a
                href="https://pmaymis.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-orange-600 text-center py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  Apply Now <ExternalLink size={16} />
                </span>
              </a>
              <a
                href="https://pmaymis.gov.in/PMAYMIS2_2024/TrackApplication.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-3 border-2 border-white text-white text-center py-2 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors text-sm"
              >
                Track Application Status
              </a>
            </div>



            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Scheme Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Houses Sanctioned</span>
                  <span className="font-bold text-slate-900">1.2+ Crore</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Houses Completed</span>
                  <span className="font-bold text-slate-900">80+ Lakh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Investment</span>
                  <span className="font-bold text-slate-900">₹7+ Lakh Crore</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">States Covered</span>
                  <span className="font-bold text-slate-900">All 36</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-500" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Helpline</p>
                    <p className="text-slate-600 text-sm">011-23060484</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-500" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Email Support</p>
                    <p className="text-slate-600 text-sm">pmay-mis@gov.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-500 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Address</p>
                    <p className="text-slate-600 text-sm">Ministry of Housing & Urban Affairs, Nirman Bhawan, New Delhi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Useful Links</h3>
              <div className="space-y-2">
                <a
                  href="https://pmaymis.gov.in/PMAYMIS2_2024/PDF/Operational_Guidelines_of_PMAY-U.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Download size={14} />
                  PMAY Operational Guidelines (PDF)
                </a>
                <a
                  href="https://pmaymis.gov.in/PMAYMIS2_2024/Open/Find_Ben_Fund_Released.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <FileText size={14} />
                  Beneficiary Funds Released
                </a>
                <a
                  href="https://pmayuclap.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <FileText size={14} />
                  CLSS Awas Portal (Subsidy Status)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}