
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Token, UserStore } from "@/lib/api/api";
import { useTranslations } from 'next-intl';
import {
  ArrowRight, CheckCircle, MapPin, TrendingUp, Shield, Users,
  BarChart3, Zap, Star, Award, Clock, Camera, CheckCircle2, FileText, ShieldCheck,
  Bell, MessageSquare, Eye, ThumbsUp, Download, Smartphone, Globe, Lock,
  Headphones, Mail, Phone, Building2, Briefcase, Heart, Lightbulb, Target,
  AlertCircle, ChevronRight, ChevronDown, Play, ExternalLink, Send, Search,
  Calendar, User, Settings, HelpCircle, BookOpen, FileCheck, Layers, PieChart,
  Activity, Cpu, Database, Cloud, Code, Sparkles, Rocket, Trophy, Megaphone,
  Navigation, Upload, Image, Vote, MessageCircle, Repeat, DollarSign, Percent,
  TrendingDown, BarChart, LineChart, Wifi, WifiOff, Fingerprint, Key, UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GovLandingPage() {
  const t = useTranslations('landing');
  const [ctaLink, setCtaLink] = useState("/register");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

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



  const stats = [
    { number: "10K+", label: "activeUsers", icon: Users, color: "blue" },
    { number: "500+", label: "projectsTracked", icon: MapPin, color: "orange" },
    { number: "2K+", label: "issuesResolved", icon: CheckCircle, color: "green" },
    { number: "95%", label: "satisfactionRate", icon: Star, color: "blue" },
  ];


  // FAQ based on translations
  const faqs = [1, 2, 3, 4, 5, 6].map((i) => ({
    question: t(`faqs.q${i}.q`),
    answer: t(`faqs.q${i}.a`)
  }));

  // Success stories with translations and images
  const testimonials = [
    { id: 'rajesh', img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" },
    { id: 'priya', img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" },
    { id: 'amit', img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80" },
    { id: 'sunita', img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80" }
  ].map((item) => ({
    name: t(`testimonials.${item.id}.name`),
    role: t(`testimonials.${item.id}.role`),
    image: item.img,
    rating: 5,
    text: t(`testimonials.${item.id}.text`),
    issue: t(`testimonials.${item.id}.issue`),
    resolution: t(`testimonials.${item.id}.resolution`)
  }));

  return (
    <div className="relative min-h-screen w-full bg-slate-50 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* ========================================
          HERO SECTION
      ======================================== */}
      < section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 border-b-8 border-orange-500" >
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
            {t('hero.title')} <span className="text-orange-500">{t('hero.titleHighlight')}</span>
          </h1>

          <p className="text-xl md:text-3xl text-blue-100 max-w-4xl mx-auto mb-4 font-light leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Link href="/login">
              <button className="px-10 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xl shadow-[0_8px_0_rgb(194,65,12)] hover:shadow-[0_4px_0_rgb(194,65,12)] hover:translate-y-[4px] transition-all flex items-center gap-3">
                {t('hero.startReporting')}
                <ArrowRight size={24} />
              </button>
            </Link>
            <Link href="/map">
              <button className="px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xl border-2 border-slate-600 hover:border-slate-500 transition-all">
                {t('hero.viewLiveMap')}
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-400 w-8 h-8" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">{t('hero.realTimeUpdates')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-blue-400 w-8 h-8" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">10K+ {t('stats.activeUsers')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="text-green-400 w-8 h-8" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">Bilingual</span>
            </div>
          </div>
        </div>
      </section >

      {/* ========================================
          STATS SECTION - Elevated Card
      ======================================== */}
      < section className="relative z-20 -mt-20 mx-4 md:mx-12 mb-20" >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300",
                  stat.color === "blue" && "bg-blue-50 text-blue-700",
                  stat.color === "orange" && "bg-orange-50 text-orange-600",
                  stat.color === "green" && "bg-green-50 text-green-700"
                )}>
                  <stat.icon size={32} />
                </div>
                <span className="text-4xl font-extrabold text-slate-900 mb-1">{stat.number}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t(`stats.${stat.label}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* ========================================
          GOVERNMENT INITIATIVES TICKER
      ======================================== */}
      < section className="py-4 bg-orange-50 border-y border-orange-100 overflow-hidden mb-20" >
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded uppercase min-w-max">
            Government Initiatives
          </span>
          <div className="flex gap-12 whitespace-nowrap text-slate-600 text-sm font-semibold overflow-hidden">
            <div className="flex gap-12 animate-marquee">
              <span>Swachh Bharat Abhiyan</span>
              <span>•</span>
              <span>Digital India Corporation</span>
              <span>•</span>
              <span>Smart Cities Mission</span>
              <span>•</span>
              <span>AMRUT Scheme</span>
              <span>•</span>
              <span>Pradhan Mantri Awas Yojana</span>
              <span>•</span>
              <span>National Urban Digital Mission</span>
            </div>
          </div>
        </div>
      </section >

      {/* ========================================
          HOW IT WORKS - REDESIGNED
      ======================================== */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {t('features.title')} <span className="text-blue-700"></span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t('features.subtitle')}
            </p>
          </div>

          {/* Process Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: 1,
                title: t('features.report.title'),
                description: t('features.report.description'),
                icon: Camera,
                color: "bg-blue-600",
                tags: t.raw('features.report.tags')
              },
              {
                step: 2,
                title: t('features.track.title'),
                description: t('features.track.description'),
                icon: Activity,
                color: "bg-orange-500",
                tags: t.raw('features.track.tags')
              },
              {
                step: 3,
                title: t('features.engage.title'),
                description: t('features.engage.description'),
                icon: Star,
                color: "bg-green-600",
                tags: t.raw('features.engage.tags')
              }
            ].map((step, index) => (
              <div
                key={index}
                className="relative bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden"
              >
                {/* Decorative Gradient Blob */}
                <div className={cn(
                  "absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl transition-all group-hover:opacity-20",
                  step.color === "bg-blue-600" ? "bg-blue-600" : step.color === "bg-orange-500" ? "bg-orange-500" : "bg-green-600"
                )}></div>

                {/* Step Number Badge */}
                <div className={cn(
                  "absolute -top-4 -right-4 w-12 h-12 rounded-full text-white font-bold text-xl flex items-center justify-center shadow-lg ring-4 ring-slate-50",
                  step.color
                )}>
                  {step.step}
                </div>

                {/* Icon */}
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg",
                  step.color
                )}>
                  <step.icon size={32} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Features Tags */}
                <div className="flex flex-wrap gap-2">
                  {(step.tags as string[]).map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold border border-slate-200 group-hover:bg-white group-hover:shadow-sm transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Connecting Arrow (Desktop) */}
                {index < 2 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-6 w-12 h-12 z-20 transform -translate-y-1/2 items-center justify-center">
                    <ArrowRight className="text-slate-300 drop-shadow-sm" size={40} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1"
            >
              {t('features.cta')}
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          REAL FEATURES SHOWCASE
      ======================================== */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              {t('powerfulFeatures.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{t('powerfulFeatures.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
              {t('powerfulFeatures.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { key: 'multiFile', icon: Upload, color: 'blue' },
              { key: 'voting', icon: Vote, color: 'orange' },
              { key: 'comments', icon: MessageCircle, color: 'green' },
              { key: 'tracking', icon: BarChart, color: 'blue' },
              { key: 'rating', icon: Star, color: 'orange' },
              { key: 'tender', icon: DollarSign, color: 'green' },
              { key: 'pdf', icon: FileText, color: 'blue' },
              { key: 'fingerprint', icon: Fingerprint, color: 'orange' },
              { key: 'notifications', icon: Bell, color: 'green' },
              { key: 'gps', icon: MapPin, color: 'blue' },
              { key: 'rbac', icon: Shield, color: 'orange' },
              { key: 'bilingual', icon: Globe, color: 'green' }
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
              >
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                  item.color === 'blue' && "bg-gradient-to-br from-blue-500 to-transparent",
                  item.color === 'orange' && "bg-gradient-to-br from-orange-500 to-transparent",
                  item.color === 'green' && "bg-gradient-to-br from-green-500 to-transparent"
                )}></div>

                <div className="relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg",
                    item.color === 'blue' && "bg-blue-500/20 text-blue-400",
                    item.color === 'orange' && "bg-orange-500/20 text-orange-400",
                    item.color === 'green' && "bg-green-500/20 text-green-400"
                  )}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                    {t(`powerfulFeatures.list.${item.key}.title`)}
                  </h3>
                  <p className="text-blue-100/70 leading-relaxed text-sm mb-4">
                    {t(`powerfulFeatures.list.${item.key}.description`)}
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-blue-200/50 font-mono flex items-center gap-2">
                      <Code size={12} />
                      {t(`powerfulFeatures.list.${item.key}.technical`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          SUCCESS STORIES / TESTIMONIALS
      ======================================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              {t('testimonials.title')} <span className="text-green-700">{t('testimonials.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 hover:border-green-500 transition-all hover:shadow-xl group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-green-400 transition-colors">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">{testimonial.name}</h4>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-yellow-500" size={16} />
                  ))}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed mb-4 italic line-clamp-4">
                  "{testimonial.text}"
                </p>

                <div className="pt-4 border-t border-slate-300 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Issue:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[120px]">{testimonial.issue}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Resolution:</span>
                    <span className="font-semibold text-green-600 truncate max-w-[100px]">{testimonial.resolution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          FAQ SECTION - WITH READ MORE
      ======================================== */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              {t('faqs.title')} <span className="text-blue-700">{t('faqs.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-slate-600">
              {t('faqs.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden hover:border-blue-400 transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white transition-colors"
                >
                  <span className="font-bold text-slate-900 pr-4">{faq.question}</span>
                  <ChevronDown className={cn(
                    "flex-shrink-0 text-blue-600 transition-transform",
                    activeFaq === i && "rotate-180"
                  )} size={24} />
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-200 pt-4 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Read More Button */}
          {!showAllFaqs && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllFaqs(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg"
              >
                Read More FAQs ({faqs.length - 6} more)
                <ChevronDown size={20} />
              </button>
            </div>
          )}

          {/* Show Less Button */}
          {showAllFaqs && (
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setShowAllFaqs(false);
                  window.scrollTo({ top: document.getElementById('faq-section')?.offsetTop || 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
              >
                Show Less
                <ChevronDown size={20} className="rotate-180" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          SECURITY & COMPLIANCE
      ======================================== */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              {t('security.title')} <span className="text-red-700">{t('security.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('security.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { key: 'jwt', icon: Lock },
              { key: 'fingerprint', icon: Fingerprint },
              { key: 'spring', icon: Shield },
              { key: 'encryption', icon: Key },
              { key: 'rbac', icon: UserCheck },
              { key: 'db', icon: Database },
              { key: 'cloud', icon: Cloud },
              { key: 'validation', icon: Code }
            ].map((item, i) => (
              <div key={i} className="text-center p-8 bg-white rounded-xl border border-slate-200 hover:border-red-500 transition-all hover:shadow-xl group hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 group-hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors">
                  <item.icon size={32} />
                </div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">{t(`security.list.${item.key}.title`)}</h3>
                <p className="text-slate-600">{t(`security.list.${item.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          MOBILE APP SECTION
      ======================================== */}
      < section className="py-24 bg-gradient-to-br from-blue-900 to-slate-900 text-white relative overflow-hidden" >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Coming Soon: <span className="text-orange-400">Mobile App</span>
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Report issues on the go with our upcoming native mobile app for Android and iOS.
                Get instant notifications, offline support, and faster performance.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Offline complaint drafting",
                  "Push notifications",
                  "Camera integration",
                  "GPS auto-detection",
                  "Faster performance",
                  "Native UI/UX"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="text-blue-100">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center gap-3">
                  <Smartphone size={24} />
                  <div>
                    <div className="text-xs text-blue-200">Coming to</div>
                    <div className="font-bold">Google Play</div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center gap-3">
                  <Smartphone size={24} />
                  <div>
                    <div className="text-xs text-blue-200">Coming to</div>
                    <div className="font-bold">App Store</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-blue-500/20 blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                <Smartphone className="w-full h-96 text-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* ========================================
          FINAL CTA
      ======================================== */}
      < section className="py-20 bg-white border-t border-slate-200" >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to Make a <span className="text-orange-600">Difference</span>?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens making their communities better. Report issues, track progress, and engage with your local government.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={ctaLink} className="px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2">
              Get Started Now
              <ArrowRight size={20} />
            </Link>
            <Link href="/report" className="px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-lg transition-all">
              Report an Issue
            </Link>
          </div>
        </div>
      </section >

    </div >
  );
}