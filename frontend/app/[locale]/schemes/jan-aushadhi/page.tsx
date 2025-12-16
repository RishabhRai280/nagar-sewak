"use client";

import Link from 'next/link';
import { ArrowLeft, Heart, CheckCircle, ExternalLink, Download, Phone, Mail, MapPin, Users, DollarSign, Calendar, FileText, Pill } from 'lucide-react';

export default function JanAushadhiPage() {
  const benefits = [
    "Generic medicines at 50-90% lower cost than branded medicines",
    "Same quality and efficacy as branded medicines",
    "Available across 9,000+ Jan Aushadhi stores nationwide",
    "Wide range of 1,800+ medicines and 300+ surgical items",
    "Quality assured by Bureau of Indian Standards (BIS)",
    "Easy accessibility in rural and urban areas"
  ];

  const documents = [
    "Valid prescription from registered doctor",
    "Aadhaar Card (for some schemes)",
    "Any government-issued photo ID",
    "Previous medical records (if applicable)"
  ];

  const medicineCategories = [
    "Cardiovascular medicines", "Diabetes medicines", "Anti-cancer drugs", 
    "Antibiotics", "Pain relievers", "Vitamins & supplements",
    "Respiratory medicines", "Gastrointestinal drugs", "Neurological medicines",
    "Surgical items", "Medical devices", "Nutraceuticals"
  ];

  const qualityAssurance = [
    "WHO-GMP certified manufacturing facilities",
    "Regular quality testing by NABL accredited labs",
    "Bioequivalence studies for all formulations",
    "Stringent quality control at every stage",
    "Compliance with Indian Pharmacopoeia standards"
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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Pill className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Jan Aushadhi Scheme</h1>
              <p className="text-xl text-blue-100">Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)</p>
              <div className="flex items-center gap-4 mt-4 text-blue-100">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Launched: 2008 (Revamped: 2015)
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  Stores: 9,000+ Nationwide
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
                Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) is a campaign launched by the Department of Pharmaceuticals, Government of India, to provide quality medicines at affordable prices to all.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                The scheme aims to reduce healthcare costs by providing generic medicines that are 50-90% cheaper than branded equivalents while maintaining the same quality and efficacy standards.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Mission Objective</h3>
                <p className="text-blue-700 text-sm">
                  "Affordable Healthcare for All" - To make quality generic medicines accessible to every citizen at affordable prices, reducing out-of-pocket healthcare expenses.
                </p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits</h2>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
                    <p className="text-slate-600">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Medicine Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Available Medicine Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {medicineCategories.map((category, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Heart className="text-blue-500 flex-shrink-0" size={16} />
                    <span className="text-slate-700 text-sm">{category}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>Total Products:</strong> Over 1,800 medicines and 300+ surgical items available at Jan Aushadhi stores.
                </p>
              </div>
            </div>

            {/* Quality Assurance */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Quality Assurance</h2>
              <div className="space-y-3">
                {qualityAssurance.map((quality, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                    <p className="text-slate-600">{quality}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Quality Certification</h3>
                <p className="text-yellow-700 text-sm">
                  All Jan Aushadhi medicines are manufactured by WHO-GMP certified companies and undergo rigorous quality testing to ensure they meet international standards.
                </p>
              </div>
            </div>

            {/* How to Purchase */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Purchase Medicines</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Find Nearest Store</h3>
                    <p className="text-slate-600 text-sm">Locate the nearest Jan Aushadhi store using the official website or mobile app</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Bring Prescription</h3>
                    <p className="text-slate-600 text-sm">Carry a valid prescription from a registered medical practitioner</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Purchase Medicines</h3>
                    <p className="text-slate-600 text-sm">Buy generic medicines at significantly lower prices than branded alternatives</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Save Money</h3>
                    <p className="text-slate-600 text-sm">Enjoy savings of 50-90% compared to branded medicines</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What to Bring</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {documents.map((document, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <FileText className="text-blue-500 flex-shrink-0" size={16} />
                    <span className="text-slate-700 text-sm">{document}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Find Store */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Find Jan Aushadhi Store</h3>
              <p className="text-blue-100 mb-6 text-sm">
                Locate the nearest Jan Aushadhi store in your area and check medicine availability.
              </p>
              <a 
                href="https://janaushadhi.gov.in/near-by-pharma" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-white text-blue-600 text-center py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors mb-3"
              >
                <span className="flex items-center justify-center gap-2">
                  Find Store <ExternalLink size={16} />
                </span>
              </a>
              <a 
                href="https://janaushadhi.gov.in/productportfolio/ProductmrpList" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full border-2 border-white text-white text-center py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-sm"
              >
                View Product List
              </a>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Scheme Impact</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Jan Aushadhi Stores</span>
                  <span className="font-bold text-slate-900">9,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Medicines Available</span>
                  <span className="font-bold text-slate-900">1,800+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Surgical Items</span>
                  <span className="font-bold text-slate-900">300+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Average Savings</span>
                  <span className="font-bold text-slate-900">50-90%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">States Covered</span>
                  <span className="font-bold text-slate-900">All 36</span>
                </div>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Price Comparison Examples</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-slate-700 text-sm">Paracetamol 500mg</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 line-through">₹50</div>
                    <div className="font-bold text-green-600">₹5</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-slate-700 text-sm">Metformin 500mg</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 line-through">₹120</div>
                    <div className="font-bold text-green-600">₹12</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-slate-700 text-sm">Amlodipine 5mg</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 line-through">₹80</div>
                    <div className="font-bold text-green-600">₹8</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">*Prices are indicative and may vary</p>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-500" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Helpline</p>
                    <p className="text-slate-600 text-sm">1800-180-5080</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-500" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Email Support</p>
                    <p className="text-slate-600 text-sm">janaushadhi@gov.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-500 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Address</p>
                    <p className="text-slate-600 text-sm">Bureau of Pharma PSUs of India, New Delhi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile App */}
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
  <h3 className="text-lg font-bold text-slate-900 mb-4">Jan Aushadhi Mobile App</h3>
  <p className="text-slate-600 text-sm mb-4">
    Download the official app to find stores, check medicine availability, and compare prices.
  </p>
  <div className="space-y-2">
    <a
      href="https://play.google.com/store/apps/details?id=in.gov.pmbjp"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
    >
      <Download size={14} />
      Download Android App
    </a>
  </div>
</div>

{/* Related Links */}
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
  <h3 className="text-lg font-bold text-slate-900 mb-4">Useful Links</h3>
  <div className="space-y-2">
    <a
      href="https://janaushadhi.gov.in/pdf/Guidelines_for_PMBJK_Opening.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
    >
      <Download size={14} />
      Download Opening Guidelines (PDF)
    </a>
    <a
      href="https://janaushadhi.gov.in/productportfolio/ProductmrpList"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
    >
      <FileText size={14} />
      Complete Product Price List
    </a>
    <a
      href="https://janaushadhi.gov.in/faq"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
    >
      <FileText size={14} />
      Frequently Asked Questions
    </a>
    <a
      href="https://janaushadhi.gov.in/locate-kendra"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
    >
      <FileText size={14} />
      Find a Jan Aushadhi Kendra Near You
    </a>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}