"use client";

import Link from 'next/link';
import { ArrowLeft, Heart, CheckCircle, ExternalLink, Download, Phone, Mail, MapPin, Users, DollarSign, Calendar, FileText, Stethoscope } from 'lucide-react';

export default function AyushmanBharatPage() {
  const eligibilityCriteria = [
    "Family should be listed in SECC 2011 (Socio-Economic Caste Census)",
    "Family should fall under defined deprivation criteria",
    "Rural families: As per SECC 2011 automatic inclusion criteria",
    "Urban families: Based on 11 defined occupational criteria"
  ];

  const documents = [
    "Aadhaar Card of all family members",
    "Ration Card",
    "Mobile Number (for OTP verification)",
    "SECC 2011 Family ID (if available)",
    "Any government-issued photo ID",
    "Address Proof"
  ];

  const benefits = [
    "Free treatment up to ₹5 lakh per family per year",
    "Cashless and paperless treatment at empaneled hospitals",
    "Coverage for pre and post-hospitalization expenses",
    "No restriction on family size and age",
    "Covers secondary and tertiary care hospitalization",
    "Portable across the country"
  ];

  const coveredTreatments = [
    "Cancer Treatment", "Heart Surgery", "Kidney Transplant", "Brain Surgery",
    "Bypass Surgery", "Angioplasty", "Knee Replacement", "Cataract Surgery",
    "Dialysis", "Chemotherapy", "Radiotherapy", "ICU Treatment"
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link href="/schemes" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={20} />
          Back to Government Schemes
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl text-white p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Stethoscope className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Ayushman Bharat - PMJAY</h1>
              <p className="text-xl text-green-100">Pradhan Mantri Jan Arogya Yojana</p>
              <div className="flex items-center gap-4 mt-4 text-green-100">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Launched: September 2018
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  Coverage: 12+ Crore Families
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
                Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (AB-PMJAY) is the world's largest health insurance scheme aimed at providing health coverage to over 12 crore poor and vulnerable families (approximately 55 crore beneficiaries).
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                The scheme provides cashless and paperless access to services for the beneficiary at the point of service. It covers up to ₹5 lakh per family per year for secondary and tertiary care hospitalization across public and private empaneled hospitals.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Mission Objective</h3>
                <p className="text-green-700 text-sm">
                  "Health for All" - To achieve universal health coverage and provide financial protection against catastrophic health expenditure.
                </p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                    <p className="text-slate-700 text-sm">{benefit}</p>
                  </div>
                ))}
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
                <h3 className="font-semibold text-blue-800 mb-2">Automatic Inclusion Categories (Rural)</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Households without shelter</li>
                  <li>• Destitute/living on alms</li>
                  <li>• Manual scavenger families</li>
                  <li>• Primitive tribal groups</li>
                  <li>• Legally released bonded laborers</li>
                </ul>
              </div>
            </div>

            {/* Covered Treatments */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Major Treatments Covered</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {coveredTreatments.map((treatment, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <Heart className="text-red-500 flex-shrink-0" size={16} />
                    <span className="text-slate-700 text-sm">{treatment}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> Over 1,900+ medical packages are covered under the scheme including complex surgeries and treatments.
                </p>
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

            {/* How to Use */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use Ayushman Bharat Card</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Check Eligibility</h3>
                    <p className="text-slate-600 text-sm">Verify your eligibility on the official website using mobile number or name</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Get Ayushman Card</h3>
                    <p className="text-slate-600 text-sm">Visit nearest Common Service Center (CSC) or empaneled hospital to get your card</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Visit Empaneled Hospital</h3>
                    <p className="text-slate-600 text-sm">Go to any empaneled hospital with your Ayushman card and Aadhaar</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Get Cashless Treatment</h3>
                    <p className="text-slate-600 text-sm">Receive treatment without any payment at the hospital</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Check Eligibility & Apply */}
<div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-xl p-6">
  <h3 className="text-xl font-bold mb-4">Check Your Eligibility</h3>
  <p className="text-green-100 mb-6 text-sm">
    Check if you're eligible for Ayushman Bharat and find nearby empaneled hospitals.
  </p>

  <a
    href="https://mera.pmjay.gov.in"
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full bg-white text-green-600 text-center py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors mb-3"
  >
    <span className="flex items-center justify-center gap-2">
      Check Eligibility <ExternalLink size={16} />
    </span>
  </a>

  <a
    href="https://hospitals.pmjay.gov.in"
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full border-2 border-white text-white text-center py-2 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors text-sm"
  >
    Find Empaneled Hospitals
  </a>
</div>


            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Scheme Impact</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Families Covered</span>
                  <span className="font-bold text-slate-900">12+ Crore</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Beneficiaries</span>
                  <span className="font-bold text-slate-900">55+ Crore</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Empaneled Hospitals</span>
                  <span className="font-bold text-slate-900">27,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Treatments Given</span>
                  <span className="font-bold text-slate-900">5+ Crore</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Coverage Amount</span>
                  <span className="font-bold text-slate-900">₹5 Lakh/Year</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="text-green-500" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Toll-Free Helpline</p>
                    <p className="text-slate-600 text-sm">14555 / 1800-111-565</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-green-500" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Email Support</p>
                    <p className="text-slate-600 text-sm">support@pmjay.gov.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-green-500 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Address</p>
                    <p className="text-slate-600 text-sm">National Health Authority, New Delhi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile App */}
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
  <h3 className="text-lg font-bold text-slate-900 mb-4">Mobile App</h3>
  <p className="text-slate-600 text-sm mb-4">
    Download the official Ayushman Bharat app to check eligibility, find hospitals, and track treatments.
  </p>
  <div className="space-y-2">
    <a
      href="https://play.google.com/store/apps/details?id=com.nha.pmjay"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
    >
      <Download size={14} />
      Download Android App
    </a>
    <a
      href="https://apps.apple.com/in/app/pmjay/id1459844314"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
    >
      <Download size={14} />
      Download iOS App
    </a>
  </div>
</div>


            {/* Related Links */}
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
  <h3 className="text-lg font-bold text-slate-900 mb-4">Useful Links</h3>
  <div className="space-y-2">
    <a
      href="https://pmjay.gov.in/sites/default/files/2019-07/PMJAY%20Guidelines_0.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
    >
      <Download size={14} />
      Download Guidelines (PDF)
    </a>
    <a
      href="https://pmjay.gov.in"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
    >
      <FileText size={14} />
      About PMJAY
    </a>
    <a
      href="https://pmjay.gov.in/faq"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
    >
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