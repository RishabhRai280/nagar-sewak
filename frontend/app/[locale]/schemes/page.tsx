"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Home, Heart, GraduationCap, Stethoscope, Building2, X, ExternalLink, FileText, Users, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

export default function SchemesPage() {
  const t = useTranslations();
  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  const schemes = [
    {
      id: "pmay",
      title: "Pradhan Mantri Awas Yojana",
      category: "Housing",
      description: "Affordable housing scheme for economically weaker sections and low-income groups",
      eligibility: "Annual income up to ₹18 lakh",
      benefits: "Interest subsidy up to ₹2.67 lakh",
      color: "bg-orange-500",
      icon: Home,
      officialWebsite: "https://pmaymis.gov.in/",
      detailedDescription: "The Pradhan Mantri Awas Yojana (PMAY) is a flagship mission of the Government of India being implemented by the Ministry of Housing and Urban Affairs (MoHUA). It aims to provide affordable housing to the urban poor with a target to build 2 crore affordable houses by 31st March 2022.",
      keyFeatures: [
        "Credit Linked Subsidy Scheme (CLSS) for different income groups",
        "In-Situ Slum Redevelopment (ISSR)",
        "Affordable Housing in Partnership (AHP)",
        "Beneficiary-led individual house construction/enhancement (BLC)"
      ],
      documents: [
        "Aadhaar Card",
        "Income Certificate",
        "Property Documents",
        "Bank Account Details",
        "Passport Size Photos"
      ],
      applicationProcess: [
        "Visit the official PMAY website",
        "Register with your Aadhaar number",
        "Fill the application form with required details",
        "Upload necessary documents",
        "Submit the application and note the application ID"
      ]
    },
    {
      id: "ayushman-bharat",
      title: "Ayushman Bharat",
      category: "Healthcare",
      description: "Health insurance scheme providing coverage up to ₹5 lakh per family per year",
      eligibility: "Families listed in SECC 2011",
      benefits: "Cashless treatment at empaneled hospitals",
      color: "bg-green-500",
      icon: Stethoscope,
      officialWebsite: "https://pmjay.gov.in/",
      detailedDescription: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY) is the world's largest health insurance scheme aimed at providing a health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization to over 10.74 crores poor and vulnerable families.",
      keyFeatures: [
        "Coverage up to Rs. 5 lakh per family per year",
        "Cashless and paperless access to services",
        "Coverage for pre and post-hospitalization expenses",
        "No restrictions on family size, age or gender",
        "Covers all pre-existing conditions"
      ],
      documents: [
        "Aadhaar Card",
        "Ration Card",
        "Mobile Number",
        "Any government-issued ID proof"
      ],
      applicationProcess: [
        "Check eligibility on the official website",
        "Visit nearest Common Service Center (CSC)",
        "Provide required documents for verification",
        "Get your Ayushman Bharat card printed",
        "Use the card at any empaneled hospital"
      ]
    },
    {
      id: "jan-aushadhi",
      title: "Jan Aushadhi Scheme",
      category: "Healthcare",
      description: "Generic medicines at affordable prices through dedicated stores",
      eligibility: "All citizens",
      benefits: "Medicines at 50-90% lower cost",
      color: "bg-blue-500",
      icon: Heart,
      officialWebsite: "https://janaushadhi.gov.in/",
      detailedDescription: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) is a campaign launched by the Department of Pharmaceuticals to provide quality medicines at affordable prices to all through dedicated outlets called 'Pradhan Mantri Bhartiya Jan Aushadhi Kendras'.",
      keyFeatures: [
        "Quality generic medicines at affordable prices",
        "50-90% cheaper than branded medicines",
        "Over 1,600 medicines and 240 surgical items available",
        "Quality assurance by Bureau of Indian Standards (BIS)",
        "Pan-India network of Jan Aushadhi stores"
      ],
      documents: [
        "Valid prescription from registered medical practitioner",
        "Identity proof (for certain medicines)",
        "No specific documents required for general medicines"
      ],
      applicationProcess: [
        "Locate nearest Jan Aushadhi Kendra using store locator",
        "Visit the store with valid prescription",
        "Purchase medicines at discounted rates",
        "No registration or application required",
        "Direct purchase from authorized stores"
      ]
    },
    {
      id: "swachh-bharat",
      title: "Swachh Bharat Mission",
      category: "Sanitation",
      description: "Clean India initiative focusing on sanitation and waste management",
      eligibility: "All households and communities",
      benefits: "Toilet construction subsidy",
      color: "bg-purple-500",
      icon: Building2,
      officialWebsite: "https://swachhbharatmission.gov.in/",
      detailedDescription: "Swachh Bharat Mission is a nation-wide campaign in India that aims to clean up the streets, roads and infrastructure of India's cities, towns, and rural areas. The mission's objective is to achieve universal sanitation coverage and to put focus on sanitation.",
      keyFeatures: [
        "Individual Household Latrines (IHHL) construction",
        "Community Sanitary Complexes",
        "Solid and Liquid Waste Management",
        "Information, Education and Communication (IEC) and Public Awareness",
        "Capacity Building and Administrative & Office Expenses (A&OE)"
      ],
      documents: [
        "Aadhaar Card",
        "BPL Certificate (if applicable)",
        "Bank Account Details",
        "Passport Size Photographs",
        "Address Proof"
      ],
      applicationProcess: [
        "Apply through Gram Panchayat or Urban Local Body",
        "Fill the application form with required details",
        "Submit necessary documents",
        "Get verification done by local authorities",
        "Receive subsidy amount in bank account after construction"
      ]
    },
    {
      id: "pm-kisan",
      title: "PM Kisan Samman Nidhi",
      category: "Agriculture",
      description: "Direct income support to farmer families",
      eligibility: "Small and marginal farmers",
      benefits: "₹6,000 per year in three installments",
      color: "bg-yellow-500",
      icon: GraduationCap,
      officialWebsite: "https://pmkisan.gov.in/",
      detailedDescription: "PM-KISAN is a Central Sector scheme with 100% funding from Government of India. Under the scheme, an income support of Rs.6000/- per year is provided to small and marginal farmer families having combined land holding/ownership of up to 2 hectares.",
      keyFeatures: [
        "Direct income support of Rs. 6000 per year",
        "Payment in three equal installments of Rs. 2000 each",
        "Direct Benefit Transfer (DBT) mode",
        "Coverage of all landholding farmer families",
        "No restriction on the use of money"
      ],
      documents: [
        "Aadhaar Card",
        "Bank Account Details",
        "Land Ownership Documents",
        "Citizenship Certificate",
        "Mobile Number"
      ],
      applicationProcess: [
        "Visit the official PM-KISAN website",
        "Click on 'New Farmer Registration'",
        "Fill the registration form with required details",
        "Upload necessary documents",
        "Submit the form and note the registration number"
      ]
    },
    {
      id: "beti-bachao",
      title: "Beti Bachao Beti Padhao",
      category: "Women Empowerment",
      description: "Scheme to address declining child sex ratio and empower girl children",
      eligibility: "Girl children and their families",
      benefits: "Educational support and awareness",
      color: "bg-pink-500",
      icon: Heart,
      officialWebsite: "https://wcd.nic.in/bbbp-scheme",
      detailedDescription: "Beti Bachao Beti Padhao (BBBP) is a Government of India scheme that aims to generate awareness and improve the efficiency of welfare services intended for girls. The scheme was launched with an initial funding of Rs. 100 crore.",
      keyFeatures: [
        "Prevention of gender biased sex selective elimination",
        "Ensuring survival and protection of the girl child",
        "Ensuring education and participation of the girl child",
        "Multi-sectoral action in 161 districts",
        "Advocacy and media campaigns"
      ],
      documents: [
        "Birth Certificate of Girl Child",
        "Aadhaar Card of Parents",
        "Income Certificate",
        "School Enrollment Certificate",
        "Bank Account Details"
      ],
      applicationProcess: [
        "Contact local Anganwadi Center or District Collector Office",
        "Inquire about specific programs in your district",
        "Participate in awareness programs and campaigns",
        "Enroll girl children in educational programs",
        "Access benefits through local implementation agencies"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Government Schemes</h1>
          <p className="text-lg text-slate-600">Explore various government initiatives and welfare schemes designed for citizen welfare.</p>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schemes.map((scheme, index) => (
            <Link key={index} href={`/schemes/${scheme.id}`}>
              <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className={`h-2 ${scheme.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 ${scheme.color} rounded-lg flex items-center justify-center`}>
                      <scheme.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {scheme.category}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors text-lg">
                    {scheme.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {scheme.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-500">Eligibility:</span>
                      <span className="text-slate-700 text-right flex-1 ml-2">{scheme.eligibility}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-500">Benefits:</span>
                      <span className="text-slate-700 text-right flex-1 ml-2">{scheme.benefits}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Active
                    </span>
                    <span className="text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Application Process */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">How to Apply</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Check Eligibility</h3>
              <p className="text-blue-100 text-sm">Verify if you meet the scheme requirements</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Gather Documents</h3>
              <p className="text-blue-100 text-sm">Collect required documents and certificates</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Submit Application</h3>
              <p className="text-blue-100 text-sm">Apply online or visit nearest office</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}