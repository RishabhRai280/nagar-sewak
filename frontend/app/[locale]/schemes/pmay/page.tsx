"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Home, CheckCircle, ExternalLink, Download, Phone, Mail, MapPin, Users, Calendar, FileText } from 'lucide-react';

export default function PMAYPage() {
  const t = useTranslations('pmayPage');

  const benefitCategories = ['ews', 'lig', 'mig1', 'mig2'];
  const eligibilityKeys = ['c1', 'c2', 'c3', 'c4'];
  const documentKeys = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/schemes" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={20} />
          {t('backLink')}
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Home className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
              <p className="text-xl text-orange-100">{t('subtitle')}</p>
              <div className="flex items-center gap-4 mt-4 text-orange-100">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {t('launched')}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  {t('beneficiaries')}
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('overview.title')}</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {t('overview.p1')}
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                {t('overview.p2')}
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">{t('overview.mission.title')}</h3>
                <p className="text-orange-700 text-sm">
                  {t('overview.mission.desc')}
                </p>
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('eligibility.title')}</h2>
              <div className="space-y-3">
                {eligibilityKeys.map((key) => (
                  <div key={key} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                    <p className="text-slate-600">{t(`eligibility.${key}`)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">{t('eligibility.special.title')}</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• {t('eligibility.special.l1')}</li>
                  <li>• {t('eligibility.special.l2')}</li>
                  <li>• {t('eligibility.special.l3')}</li>
                </ul>
              </div>
            </div>

            {/* Benefits & Subsidy */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('benefits.title')}</h2>
              <div className="space-y-4">
                {benefitCategories.map((cat) => (
                  <div key={cat} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900">{t(`benefits.categories.${cat}.name`)}</h3>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {t(`benefits.categories.${cat}.subsidy`)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">{t('benefits.income')}</span>
                        <p className="font-medium text-slate-700">{t(`benefits.categories.${cat}.income`)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">{t('benefits.loan')}</span>
                        <p className="font-medium text-slate-700">{t(`benefits.categories.${cat}.loan`)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('documents.title')}</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {documentKeys.map((key) => (
                  <div key={key} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <FileText className="text-blue-500 flex-shrink-0" size={16} />
                    <span className="text-slate-700 text-sm">{t(`documents.${key}`)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Apply */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('apply.title')}</h2>
              <div className="space-y-4">
                {['s1', 's2', 's3', 's4'].map((step, index) => (
                  <div key={step} className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{t(`apply.${step}.title`)}</h3>
                      <p className="text-slate-600 text-sm">{t(`apply.${step}.desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Now Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">{t('sidebar.applyBox.title')}</h3>
              <p className="text-orange-100 mb-6 text-sm">
                {t('sidebar.applyBox.desc')}
              </p>
              <a
                href="https://pmaymis.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-orange-600 text-center py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  {t('sidebar.applyBox.btnApply')} <ExternalLink size={16} />
                </span>
              </a>
              <a
                href="https://pmaymis.gov.in/PMAYMIS2_2024/TrackApplication.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-3 border-2 border-white text-white text-center py-2 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors text-sm"
              >
                {t('sidebar.applyBox.btnTrack')}
              </a>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{t('sidebar.stats.title')}</h3>
              <div className="space-y-4">
                {['s1', 's2', 's3', 's4'].map((stat) => (
                  <div key={stat} className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">{t(`sidebar.stats.${stat}.label`)}</span>
                    <span className="font-bold text-slate-900">{t(`sidebar.stats.${stat}.val`)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{t('sidebar.help.title')}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-500" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{t('sidebar.help.helpline')}</p>
                    <p className="text-slate-600 text-sm">011-23060484</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-500" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{t('sidebar.help.email')}</p>
                    <p className="text-slate-600 text-sm">pmay-mis@gov.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-500 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{t('sidebar.help.address')}</p>
                    <p className="text-slate-600 text-sm">{t('sidebar.help.addrVal')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{t('sidebar.links.title')}</h3>
              <div className="space-y-2">
                <a
                  href="https://pmaymis.gov.in/PMAYMIS2_2024/PDF/Operational_Guidelines_of_PMAY-U.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Download size={14} />
                  {t('sidebar.links.l1')}
                </a>
                <a
                  href="https://pmaymis.gov.in/PMAYMIS2_2024/Open/Find_Ben_Fund_Released.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <FileText size={14} />
                  {t('sidebar.links.l2')}
                </a>
                <a
                  href="https://pmayuclap.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <FileText size={14} />
                  {t('sidebar.links.l3')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}