
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Token, UserStore } from "@/lib/api";
import { useTranslations } from 'next-intl';
import {
  ArrowRight, CheckCircle, MapPin, TrendingUp, Shield, Users,
  BarChart3, Zap, Star, Award, Clock, Camera, CheckCircle2, FileText, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GovLandingPage() {
  const t = useTranslations('landing');
  const [ctaLink, setCtaLink] = useState("/register");

  useEffect(() => {
    if (Token.get()) {
      const user = UserStore.get();
      let target = "/dashboard/citizen";
      if (user) {
        const hasAdminAccess = user.roles.some((role) => role === 'ADMIN' || role === 'SUPER_ADMIN');
        const isContractor = user.roles.includes('CONTRACTOR');
        if (hasAdminAccess) target = "/dashboard/admin";
        else if (isContractor) target = "/dashboard/contractor";
      }
      setCtaLink(target);
    }
  }, []);

  const features = [
    { icon: MapPin, title: t('features.liveTracking.title'), description: t('features.liveTracking.description'), color: "blue" },
    { icon: TrendingUp, title: t('features.smartComplaints.title'), description: t('features.smartComplaints.description'), color: "green" }, // Gov Green
    { icon: Star, title: t('features.contractorRating.title'), description: t('features.contractorRating.description'), color: "orange" }, // Gov Saffron
    { icon: BarChart3, title: t('features.adminDashboard.title'), description: t('features.adminDashboard.description'), color: "blue" },
    { icon: Shield, title: t('features.transparentGovernance.title'), description: t('features.transparentGovernance.description'), color: "blue" },
    { icon: Zap, title: t('features.realTimeUpdates.title'), description: t('features.realTimeUpdates.description'), color: "orange" },
    { icon: Camera, title: t('features.aiVerification.title'), description: t('features.aiVerification.description'), color: "blue" },
    { icon: Award, title: t('features.citizenRewards.title'), description: t('features.citizenRewards.description'), color: "green" },
  ];

  const stats = [
    { number: "10K+", label: t('stats.activeUsers'), icon: Users },
    { number: "500+", label: t('stats.projectsTracked'), icon: MapPin },
    { number: "2K+", label: t('stats.issuesResolved'), icon: CheckCircle },
    { number: "95%", label: t('stats.satisfactionRate'), icon: Star },
  ];

  return (
    <div className="relative min-h-screen w-full bg-slate-50 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* Hero Section - Official & Solid */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 border-b-8 border-orange-500">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 opacity-95"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-20 text-center">
          {/* National Emblem */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-orange-500/20 blur-xl rounded-full"></div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Satyamev Jayate"
                className="w-32 h-32 md:w-40 md:h-40 invert brightness-0 drop-shadow-2xl"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 uppercase tracking-tighter drop-shadow-lg">
            Nagar <span className="text-orange-500">Sewak</span>
          </h1>

          <p className="text-xl md:text-3xl text-blue-100 max-w-4xl mx-auto mb-10 font-light leading-relaxed border-t border-blue-800/50 pt-8">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/login">
              <button className="px-10 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xl shadow-[0_8px_0_rgb(194,65,12)] hover:shadow-[0_4px_0_rgb(194,65,12)] hover:translate-y-[4px] transition-all flex items-center gap-3">
                {t('hero.startReporting')}
                <ArrowRight size={24} />
              </button>
            </Link>
            <Link href="/about">
              <button className="px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xl border-2 border-slate-600 hover:border-slate-500 transition-all">
                {t('hero.viewLiveMap')}
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-400 w-8 h-8" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">Gov Secured</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-blue-400 w-8 h-8" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">10M+ Citizens</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="text-orange-400 w-8 h-8" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">Paperless</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS STRIP: Elevated --- */}
      <section className="relative z-20 -mt-20 mx-4 md:mx-12 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon size={32} />
                </div>
                <span className="text-4xl font-extrabold text-slate-900 mb-1">{stat.number}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SCHEMES TICKER: Digital India Marquee --- */}
      <section className="py-4 bg-orange-50 border-y border-orange-100 overflow-hidden mb-20">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded uppercase min-w-max">{t('initiatives.title')}</span>
          <div className="flex gap-12 animate-marquee whitespace-nowrap text-slate-600 text-sm font-semibold">
            <span>Swachh Bharat Abhiyan</span>
            <span>•</span>
            <span>Digital India Corporation</span>
            <span>•</span>
            <span>Smart Cities Mission</span>
            <span>•</span>
            <span>Amrut Scheme</span>
            <span>•</span>
            <span>Pradhan Mantri Awas Yojana</span>
            <span>•</span>
            <span>National Urban Digital Mission</span>
          </div>
        </div>
      </section>

      {/* --- VISUAL SPOTLIGHT: "Why Nagar Sewak?" --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              {t('spotlight.title')} <span className="text-blue-700">{t('spotlight.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t('spotlight.subtitle')}
            </p>
          </div>

          <div className="space-y-32">
            {/* Feature 1: Transparent Governance */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-8">
                <div className="inline-block p-3 rounded-lg bg-blue-100 text-blue-700">
                  <Shield size={32} />
                </div>
                <h3 className="text-4xl font-bold text-slate-900">{t('spotlight.transparency.title')}</h3>
                <p className="text-lg text-slate-600 leading-loose">
                  {t('spotlight.transparency.description')}
                </p>
                <ul className="space-y-4">
                  {[t('spotlight.transparency.list.audit'), t('spotlight.transparency.list.budget'), t('spotlight.transparency.list.accountability')].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                      <CheckCircle className="text-green-600" size={20} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-3xl transform rotate-3"></div>
                <img
                  src="/transparent_governance.png"
                  alt="Transparent Governance Dashboard Visualization"
                  className="relative rounded-3xl shadow-2xl border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature 2: Geo-Tagging */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-8">
                <div className="inline-block p-3 rounded-lg bg-orange-100 text-orange-600">
                  <MapPin size={32} />
                </div>
                <h3 className="text-4xl font-bold text-slate-900">{t('spotlight.geo.title')}</h3>
                <p className="text-lg text-slate-600 leading-loose">
                  {t('spotlight.geo.description')}
                </p>
                <ul className="space-y-4">
                  {[t('spotlight.geo.list.location'), t('spotlight.geo.list.evidence'), t('spotlight.geo.list.cluster')].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                      <CheckCircle className="text-orange-500" size={20} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-3xl transform -rotate-3"></div>
                <img
                  src="/geo_tagged_complaints.png"
                  alt="Geo Tagging Map Interface"
                  className="relative rounded-3xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature 3: Contractor Rating (Using available asset) */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-8">
                <div className="inline-block p-3 rounded-lg bg-green-100 text-green-700">
                  <Star size={32} />
                </div>
                <h3 className="text-4xl font-bold text-slate-900">{t('spotlight.contracts.title')}</h3>
                <p className="text-lg text-slate-600 leading-loose">
                  {t('spotlight.contracts.description')}
                </p>
                <div className="flex gap-4">
                  <div className="px-6 py-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-3xl font-bold text-green-600 mb-1">4.8/5</div>
                    <div className="text-sm text-slate-500">{t('spotlight.contracts.stats.rating')}</div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-3xl font-bold text-slate-900 mb-1">15ms</div>
                    <div className="text-sm text-slate-500">{t('spotlight.contracts.stats.speed')}</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 to-transparent rounded-3xl transform rotate-3"></div>
                <img
                  src="/contractor_rating.png"
                  alt="Contractor Rating System"
                  className="relative rounded-3xl shadow-2xl border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID: Secondary Details --- */}
      <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t('featuresGrid.title')} <span className="text-blue-700">{t('featuresGrid.titleHighlight')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const borderClass = feature.color === 'orange' ? 'border-orange-500' : feature.color === 'green' ? 'border-green-600' : 'border-blue-600';
              const iconClass = feature.color === 'orange' ? 'text-orange-600 bg-orange-50' : feature.color === 'green' ? 'text-green-700 bg-green-50' : 'text-blue-700 bg-blue-50';

              return (
                <div
                  key={i}
                  className={`bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border-b-4 ${borderClass} group`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${iconClass} group-hover:scale-110 transition-transform`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('cta.title')}</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">{t('cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={ctaLink} className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold shadow-lg transition-all flex items-center justify-center gap-2">
              {t('cta.createAccount')}
            </Link>
            <Link href="/report" className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded font-semibold transition-all">
              {t('cta.reportIssue')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}