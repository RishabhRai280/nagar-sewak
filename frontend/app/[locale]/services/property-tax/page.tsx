"use client";

import Link from 'next/link';
import { ArrowLeft, Home, CreditCard, FileText, Calendar } from 'lucide-react';

export default function PropertyTaxPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/services" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={20} />
          Back to Services
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white text-center">
            <Home className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Property Tax Service</h1>
            <p className="text-xl text-blue-100">Pay your property taxes online with ease</p>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-12 h-12 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Service Coming Soon</h2>
              <p className="text-slate-600 max-w-md mx-auto">
                We're working hard to bring you online property tax services. This feature will be available soon.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-3">What You'll Be Able To Do</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    View property tax details
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Pay taxes online securely
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Download payment receipts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    View payment history
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-3">Current Options</h3>
                <p className="text-slate-600 mb-4">
                  Until online services are available, you can:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Visit municipal office
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Call helpline: 1800-11-2025
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Email: tax@nagarsewak.gov.in
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Link href="/report">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-4">
                  Report an Issue
                </button>
              </Link>
              <Link href="/services">
                <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                  Browse Other Services
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}