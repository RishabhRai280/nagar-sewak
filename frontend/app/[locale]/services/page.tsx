"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Home, Zap, FileText, FileCheck, Building, Shield, MessageSquare, Eye } from 'lucide-react';

export default function ServicesPage() {
  const t = useTranslations('servicesPage');

  const services = [
    { id: "propertyTax", icon: Home, link: "/services/property-tax" },
    { id: "waterCharges", icon: Zap, link: "/services/water-charges" },
    { id: "tradeLicense", icon: FileText, link: "/services/trade-license" },
    { id: "certificates", icon: FileCheck, link: "/services/certificates" },
    { id: "buildingPlan", icon: Building, link: "/services/building-plan" },
    { id: "fireNoc", icon: Shield, link: "/services/fire-noc" },
    { id: "grievances", icon: MessageSquare, link: "/report" },
    { id: "rti", icon: Eye, link: "/services/rti" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} />
            {t('backHome')}
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('title')}</h1>
          <p className="text-lg text-slate-600">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link key={service.id} href={service.link}>
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <service.icon className="text-blue-600 group-hover:text-white" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {t(`items.${service.id}.title`)}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{t(`items.${service.id}.desc`)}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {t(`items.${service.id}.status`)}
                  </span>
                  <span className="text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('access')} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('help.title')}</h2>
          <p className="text-slate-600 mb-6">
            {t('help.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {t('help.contact')}
            </button>
            <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
              {t('help.faq')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}