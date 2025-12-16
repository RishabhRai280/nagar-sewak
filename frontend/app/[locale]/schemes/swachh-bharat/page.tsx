"use client";

import Link from 'next/link';
import { ArrowLeft, Recycle, CheckCircle, ExternalLink, Download, Phone, Mail, MapPin, Users, DollarSign, Calendar, FileText, Trash2 } from 'lucide-react';

export default function SwachhBharatPage() {
  const objectives = [
    "Eliminate open defecation by constructing toilets for households, schools, and public facilities",
    "Eradicate manual scavenging and provide alternative livelihoods",
    "Municipal solid waste management in all statutory towns",
    "Bring about behavioral change regarding healthy sanitation practices",
    "Generate awareness about sanitation and its linkage with public health",
    "Strengthen urban local bodies to design, execute and operate systems"
  ];

  const components = [
    {
      title: "Household Toilets",
      description: "Construction of individual household latrines with proper sewerage systems or septic tanks",
      target: "4.1 Crore households"
    },
    {
      title: "Community & Public Toilets",
      description: "Construction and maintenance of community toilet complexes and public toilet facilities",
      target: "2.6 Lakh community toilets"
    },
    {
      title: "Solid Waste Management",
      description: "100% scientific processing and disposal of municipal solid waste in all statutory towns",
      target: "4,041 statutory towns"
    },
    {
      title: "IEC & Public Awareness",
      description: "Information, Education and Communication for bringing behavioral change",
      target: "Nationwide campaign"
    }
  ];

  const benefits = [
    "Financial assistance for toilet construction",
    "Improved health and hygiene conditions",
    "Reduced healthcare costs",
    "Enhanced dignity, especially for women",
    "Environmental protection and cleanliness",
    "Employment generation in sanitation sector"
  ];

  const eligibility = [
    "All households without access to toilets",
    "Below Poverty Line (BPL) families get priority",
    "Scheduled Castes/Scheduled Tribes families",
    "Small and marginal farmers",
    "Landless laborers with homestead",
    "Women-headed households"
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
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Recycle className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Swachh Bharat Mission</h1>
              <p className="text-xl text-green-100">Clean India Mission - Swachh Bharat Abhiyan</p>
              <div className="flex items-center gap-4 mt-4 text-green-100">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Launched: October 2, 2014
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  Target: Open Defecation Free India
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Mission Overview</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Swachh Bharat Mission (SBM) is a nationwide campaign initiated by the Government of India to eliminate open defecation and improve solid waste management. The mission aims to achieve the vision of a 'Clean India' by October 2, 2019, marking the 150th birth anniversary of Mahatma Gandhi.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                The mission is implemented in two phases: Swachh Bharat Mission (Gramin) for rural areas and Swachh Bharat Mission (Urban) for urban areas, covering all statutory towns in the country.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Mission Vision</h3>
                <p className="text-green-700 text-sm">
                  "To achieve universal sanitation coverage and to put focus on sanitation and cleanliness" - Making India Open Defecation Free (ODF) and improving solid waste management.
                </p>
              </div>
            </div>

            {/* Mission Objectives */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Mission Objectives</h2>
              <div className="space-y-3">
                {objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                    <p className="text-slate-600">{objective}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Components */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Mission Components</h2>
              <div className="space-y-4">
                {components.map((component, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900">{component.title}</h3>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {component.target}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{component.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility & Benefits */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Eligibility Criteria</h2>
                <div className="space-y-3">
                  {eligibility.map((criteria, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-slate-600 text-sm">{criteria}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Key Benefits</h2>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-slate-600 text-sm">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Assistance */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Financial Assistance</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Rural Areas (SBM-G)</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• ₹12,000 per household toilet</li>
                    <li>• Additional ₹4,000 for difficult areas</li>
                    <li>• 60% Central + 40% State funding</li>
                    <li>• Direct Benefit Transfer (DBT) to beneficiaries</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Urban Areas (SBM-U)</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• ₹4,000 per household toilet</li>
                    <li>• Community toilets: ₹2.5 lakh per seat</li>
                    <li>• Public toilets: ₹5 lakh per seat</li>
                    <li>• 60% Central + 20% State + 20% ULB</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How to Apply */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Apply</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Visit Local Office</h3>
                    <p className="text-slate-600 text-sm">Contact your Gram Panchayat (rural) or Municipal Corporation (urban)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Submit Application</h3>
                    <p className="text-slate-600 text-sm">Fill the application form with required documents</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Verification & Approval</h3>
                    <p className="text-slate-600 text-sm">Local authorities will verify eligibility and approve the application</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Construction & Payment</h3>
                    <p className="text-slate-600 text-sm">Construct toilet as per guidelines and receive financial assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Official Portal Card */}
<div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl p-6">
  <h3 className="text-xl font-bold mb-4">Swachh Bharat Mission</h3>
  <p className="text-green-100 mb-6 text-sm">
    Access official information, guidelines, dashboards, and track Swachh Bharat Mission progress.
  </p>

  <a
    href="https://sbm.gov.in/sbm"
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full bg-white text-green-600 text-center py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors mb-3"
  >
    <span className="flex items-center justify-center gap-2">
      Visit Official Website <ExternalLink size={16} />
    </span>
  </a>

  <a
    href="https://sbm.gov.in/sbm/rpt/Dashboard.aspx"
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full border-2 border-white text-white text-center py-2 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors text-sm"
  >
    View Progress Dashboard
  </a>
</div>


            {/* Mission Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Mission Achievements</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Rural Toilets Built</span>
                  <span className="font-bold text-slate-900">10+ Crore</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">ODF Villages</span>
                  <span className="font-bold text-slate-900">6+ Lakh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">ODF Districts</span>
                  <span className="font-bold text-slate-900">700+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">ODF States/UTs</span>
                  <span className="font-bold text-slate-900">36/36</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Investment</span>
                  <span className="font-bold text-slate-900">₹3+ Lakh Crore</span>
                </div>
              </div>
            </div>

            {/* SBM 2.0 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Swachh Bharat Mission 2.0</h3>
              <p className="text-slate-600 text-sm mb-4">
                Phase II focuses on sustaining ODF status and managing liquid and plastic waste in villages.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">ODF Plus villages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">Greywater management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">Plastic waste management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">Biodegradable waste management</span>
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
                    <p className="font-medium text-slate-900 text-sm">Helpline</p>
                    <p className="text-slate-600 text-sm">1800-11-0001</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-green-500" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Email Support</p>
                    <p className="text-slate-600 text-sm">sbm@gov.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-green-500 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Address</p>
                    <p className="text-slate-600 text-sm">Ministry of Jal Shakti, New Delhi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile App */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Swachh Bharat App</h3>
              <p className="text-slate-600 text-sm mb-4">
                Report sanitation issues, find public toilets, and participate in cleanliness drives.
              </p>
              <div className="space-y-2">
                <a href="https://play.google.com/store/apps/details?id=com.nic.swachhbharat" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm">
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
    href="https://sbm.gov.in/sbmPhase2/Home/Guidelines"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
  >
    <FileText size={14} />
    Official Guidelines
  </a>

  <a
    href="https://sbm.gov.in/sbmPhase2/Secure/Dashboard.aspx"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
  >
    <FileText size={14} />
    Progress Dashboard
  </a>

  <a
    href="https://sbm.gov.in/sbmPhase2/Home/FAQs"
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