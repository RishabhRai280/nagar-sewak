"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Home, Zap, FileText, FileCheck, Building, Shield, MessageSquare, Eye } from 'lucide-react';

export default function ServicesPage() {
  const t = useTranslations();

  const services = [
    { 
      title: "Property Tax", 
      icon: Home, 
      description: "Pay property taxes online with ease",
      status: "Available",
      link: "/services/property-tax"
    },
    { 
      title: "Water Charges", 
      icon: Zap, 
      description: "View and pay water bills online",
      status: "Available",
      link: "/services/water-charges"
    },
    { 
      title: "Trade License", 
      icon: FileText, 
      description: "Apply for new trade licenses",
      status: "Available",
      link: "/services/trade-license"
    },
    { 
      title: "Birth/Death Certificates", 
      icon: FileCheck, 
      description: "Apply for birth and death certificates",
      status: "Available",
      link: "/services/certificates"
    },
    { 
      title: "Building Plan Approval", 
      icon: Building, 
      description: "Submit building plans for approval",
      status: "Available",
      link: "/services/building-plan"
    },
    { 
      title: "Fire NOC", 
      icon: Shield, 
      description: "Apply for fire safety clearance",
      status: "Available",
      link: "/services/fire-noc"
    },
    { 
      title: "Grievances", 
      icon: MessageSquare, 
      description: "File complaints and grievances",
      status: "Available",
      link: "/report"
    },
    { 
      title: "RTI Applications", 
      icon: Eye, 
      description: "Right to Information requests",
      status: "Available",
      link: "/services/rti"
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
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Online Services</h1>
          <p className="text-lg text-slate-600">Access government services digitally. Fast, secure, and available 24/7.</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link key={index} href={service.link}>
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <service.icon className="text-blue-600 group-hover:text-white" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {service.status}
                  </span>
                  <span className="text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Access →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Need Help?</h2>
          <p className="text-slate-600 mb-6">
            Our support team is available 24/7 to assist you with any service-related queries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
              View FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}