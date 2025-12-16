"use client";

import Link from 'next/link';
import { ArrowLeft, Wheat, CheckCircle, ExternalLink, Download, Phone, Mail, MapPin, Users, DollarSign, Calendar, FileText, Tractor } from 'lucide-react';

export default function PMKisanPage() {
  const eligibility = [
    "Small and Marginal Farmers (SMF) with cultivable land up to 2 hectares",
    "Farmer families owning cultivable land as per land records",
    "Both landowner farmers and tenant farmers are eligible",
    "Institutional landholders are excluded from the scheme"
  ];

  const exclusions = [
    "Institutional landholders",
    "Farmer families with any member as serving/retired government employee",
    "Farmer families with any member paying income tax",
    "Farmer families with any member as doctor, engineer, lawyer, CA, or architect",
    "Farmer families with any member receiving pension above ₹10,000 per month"
  ];

  const documents = [
    "Aadhaar Card",
    "Bank Account Details (IFSC Code)",
    "Land Ownership Documents",
    "Mobile Number",
    "Passport Size Photograph"
  ];

  const benefits = [
    "Direct income support of ₹6,000 per year",
    "Amount transferred in 3 equal installments of ₹2,000 each",
    "Direct Benefit Transfer (DBT) to bank accounts",
    "No intermediaries - direct government to farmer transfer",
    "Helps in meeting agricultural expenses and household needs"
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
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl text-white p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Wheat className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">PM-KISAN Samman Nidhi</h1>
              <p className="text-xl text-yellow-100">Pradhan Mantri Kisan Samman Nidhi Yojana</p>
              <div className="flex items-center gap-4 mt-4 text-yellow-100">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Launched: February 24, 2019
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  Beneficiaries: 12+ Crore Farmers
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
                PM-KISAN is a Central Sector Scheme launched on 24th February 2019, which provides income support to all landholding farmer families across the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities as well as domestic needs.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Under the scheme, financial benefit of ₹6,000 per year is provided to eligible farmer families, payable in three equal installments of ₹2,000 each every four months through Direct Benefit Transfer (DBT) mode.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Scheme Objective</h3>
                <p className="text-yellow-700 text-sm">
                  "Income Support to Farmers" - To supplement the financial needs of small and marginal farmers in procuring various inputs to ensure proper crop health and appropriate yields.
                </p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits</h2>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-yellow-500 mt-0.5 flex-shrink-0" size={20} />
                    <p className="text-slate-600">{benefit}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Payment Schedule</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-bold text-green-700">1st Installment</div>
                    <div className="text-sm text-green-600">April - July</div>
                    <div className="text-lg font-bold text-green-800">₹2,000</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-700">2nd Installment</div>
                    <div className="text-sm text-green-600">August - November</div>
                    <div className="text-lg font-bold text-green-800">₹2,000</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-700">3rd Installment</div>
                    <div className="text-sm text-green-600">December - March</div>
                    <div className="text-lg font-bold text-green-800">₹2,000</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Eligibility Criteria</h2>
              <div className="space-y-3">
                {eligibility.map((criteria, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                    <p className="text-slate-600">{criteria}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Exclusion Criteria</h2>
              <div className="space-y-3">
                {exclusions.map((exclusion, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="text-slate-600">{exclusion}</p>
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
                    <FileText className="text-yellow-500 flex-shrink-0" size={16} />
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
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Online Registration</h3>
                    <p className="text-slate-600 text-sm">Visit the official PM-KISAN website and click on "New Farmer Registration"</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Fill Details</h3>
                    <p className="text-slate-600 text-sm">Enter Aadhaar number, bank details, and land records information</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Upload Documents</h3>
                    <p className="text-slate-600 text-sm">Upload required documents including land ownership proof</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Verification & Approval</h3>
                    <p className="text-slate-600 text-sm">Local authorities will verify details and approve the application</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Apply Now Card */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Apply for PM-KISAN</h3>
              <p className="text-yellow-100 mb-6 text-sm">
                Register online for PM-KISAN and start receiving ₹6,000 annual income support.
              </p>
              <a 
                href="https://pmkisan.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-white text-yellow-600 text-center py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors mb-3"
              >
                <span className="flex items-center justify-center gap-2">
                  Apply Now <ExternalLink size={16} />
                </span>
              </a>
              <a 
                href="https://pmkisan.gov.in/BeneficiaryStatus.aspx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full border-2 border-white text-white text-center py-2 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors text-sm"
              >
                Check Status
              </a>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Scheme Impact</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Registered Farmers</span>
                  <span className="font-bold text-slate-900">12+ Crore</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Beneficiaries</span>
                  <span className="font-bold text-slate-900">11+ Crore</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Amount Disbursed</span>
                  <span className="font-bold text-slate-900">₹2.8+ Lakh Crore</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Installments Released</span>
                  <span className="font-bold text-slate-900">16+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Annual Support</span>
                  <span className="font-bold text-slate-900">₹6,000</span>
                </div>
              </div>
            </div>

            {/* eKYC Update */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">eKYC Mandatory</h3>
              <p className="text-slate-600 text-sm mb-4">
                All PM-KISAN beneficiaries must complete eKYC to continue receiving benefits.
              </p>
              <div className="space-y-2">
                <a href="https://pmkisan.gov.in/Ekyc.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 text-sm">
                  <ExternalLink size={14} />
                  Complete eKYC Online
                </a>
                <p className="text-xs text-slate-500">
                  Use Aadhaar OTP or biometric authentication
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="text-yellow-500" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">PM-KISAN Helpline</p>
                    <p className="text-slate-600 text-sm">155261 / 1800-115-526</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-yellow-500" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Email Support</p>
                    <p className="text-slate-600 text-sm">pmkisan-ict@gov.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-yellow-500 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Address</p>
                    <p className="text-slate-600 text-sm">Ministry of Agriculture & Farmers Welfare, New Delhi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile App */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">PMKISAN Mobile App</h3>
              <p className="text-slate-600 text-sm mb-4">
                Download the official app to register, check status, and update details.
              </p>
              <div className="space-y-2">
                <a href="https://play.google.com/store/apps/details?id=com.pmkisan.android" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 text-sm">
                  <Download size={14} />
                  Download Android App
                </a>
              </div>
            </div>

            {/* Related Links */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Useful Links</h3>
              <div className="space-y-2">
                <a href="https://pmkisan.gov.in/Documents/PMKisanGuidelines.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 text-sm">
                  <Download size={14} />
                  Download Guidelines (PDF)
                </a>
                <a href="https://pmkisan.gov.in/BeneficiaryStatus.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 text-sm">
                  <FileText size={14} />
                  Check Beneficiary Status
                </a>
                <a href="https://pmkisan.gov.in/FAQ.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 text-sm">
                  <FileText size={14} />
                  Frequently Asked Questions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}