"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Home, Heart, GraduationCap, Stethoscope, Building2 } from 'lucide-react';

export default function SchemesPage() {
  const t = useTranslations('schemesPage');

  const schemes = [
    { id: "pmay", color: "bg-orange-500", icon: Home },
    { id: "ayushman-bharat", color: "bg-green-500", icon: Stethoscope },
    { id: "jan-aushadhi", color: "bg-blue-500", icon: Heart },
    { id: "swachh-bharat", color: "bg-purple-500", icon: Building2 },
    { id: "pm-kisan", color: "bg-yellow-500", icon: GraduationCap },
    { id: "beti-bachao", color: "bg-pink-500", icon: Heart }
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schemes.map((scheme) => (
            <Link key={scheme.id} href={`/schemes/${scheme.id}`}>
              <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className={`h-2 ${scheme.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 ${scheme.color} rounded-lg flex items-center justify-center`}>
                      <scheme.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {t(`items.${scheme.id}.category`)}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors text-lg">
                    {t(`items.${scheme.id}.title`)}
                  </h3>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {t(`items.${scheme.id}.desc`)}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-500">{t('common.eligibility')}</span>
                      <span className="text-slate-700 text-right flex-1 ml-2">{t(`items.${scheme.id}.eligibility`)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-500">{t('common.benefits')}</span>
                      <span className="text-slate-700 text-right flex-1 ml-2">{t(`items.${scheme.id}.benefits`)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {t('common.active')}
                    </span>
                    <span className="text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('common.learnMore')} →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">{t('applyProcess.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold">{step}</span>
                </div>
                <h3 className="font-semibold mb-2">{t(`applyProcess.steps.step${step}.title`)}</h3>
                <p className="text-blue-100 text-sm">{t(`applyProcess.steps.step${step}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}