"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Token, UserStore } from "@/lib/api";
import { useTranslations } from 'next-intl';
import {
  ArrowRight, CheckCircle, MapPin, TrendingUp, Shield, Users,
  BarChart3, Zap, Star, Award, MessageCircle, Bug, Clock,
  Scale, Database, FileEdit
} from "lucide-react";

export default function StunningLandingPage() {
  const t = useTranslations('landing');
  const containerRef = useRef(null);
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

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Adjusted Parallax - subtle movements
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  const features = [
    { icon: MapPin, title: t('features.liveTracking.title'), description: t('features.liveTracking.description'), color: "blue", gradient: "from-blue-500 to-cyan-500", image: "/live_project_tracking.png" },
    { icon: FileEdit, title: t('features.smartComplaints.title'), description: t('features.smartComplaints.description'), color: "red", gradient: "from-red-500 to-rose-500", image: "/geo_tagged_complaints.png" },
    { icon: Star, title: t('features.contractorRating.title'), description: t('features.contractorRating.description'), color: "indigo", gradient: "from-indigo-500 to-violet-500", image: "/contractor_rating.png" },
    { icon: BarChart3, title: t('features.adminDashboard.title'), description: t('features.adminDashboard.description'), color: "emerald", gradient: "from-emerald-500 to-teal-500", image: "/admin_dashboard.png" },
    { icon: Shield, title: t('features.transparentGovernance.title'), description: t('features.transparentGovernance.description'), color: "purple", gradient: "from-purple-500 to-fuchsia-500", image: "/transparent_governance.png" },
    { icon: Zap, title: t('features.realTimeUpdates.title'), description: t('features.realTimeUpdates.description'), color: "orange", gradient: "from-orange-500 to-amber-500", image: "/real_time_updates.png" },
  ];

  const stats = [
    { number: "10K+", label: t('stats.activeUsers'), icon: Users, gradient: "from-blue-400 to-indigo-400" },
    { number: "500+", label: t('stats.projectsTracked'), icon: TrendingUp, gradient: "from-emerald-400 to-teal-400" },
    { number: "2K+", label: t('stats.issuesResolved'), icon: CheckCircle, gradient: "from-orange-400 to-amber-400" },
    { number: "95%", label: t('stats.satisfactionRate'), icon: Star, gradient: "from-purple-400 to-pink-400" },
  ];

  const testimonials = [
    { name: t('testimonials.testimonial1.name'), role: t('testimonials.testimonial1.role'), content: t('testimonials.testimonial1.content'), rating: 5 },
    { name: t('testimonials.testimonial2.name'), role: t('testimonials.testimonial2.role'), content: t('testimonials.testimonial2.content'), rating: 5 },
    { name: t('testimonials.testimonial3.name'), role: t('testimonials.testimonial3.role'), content: t('testimonials.testimonial3.content'), rating: 5 },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen w-full bg-slate-50 text-slate-900 overflow-hidden selection:bg-blue-100 selection:text-blue-900">

      {/* --- SLEEK PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* --- BACKGROUND ORBS (Subtle) --- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply" />
        <motion.div style={{ y: y2 }} className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[0%] left-[20%] w-[50%] h-[50%] bg-emerald-100/50 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 w-full pt-32 lg:pt-40 pb-24">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Left: Content */}
          <div className="relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-white/70 backdrop-blur-md border border-white/60 rounded-full text-sm font-bold text-blue-700 shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              {t('badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] text-slate-900 mb-8 tracking-tight"
            >
              {t('hero.title')}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block mt-2">
                {t('hero.titleHighlight')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 font-medium max-w-xl leading-relaxed mb-10"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={ctaLink}
                className="group bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
              >
                {t('hero.startReporting')} 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/map"
                className="bg-white/80 backdrop-blur-md text-slate-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-white transition border border-white shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                {t('hero.viewLiveMap')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-wrap gap-6 text-sm font-semibold text-slate-500"
            >
              {[t('hero.freeToUse'), t('hero.realTimeUpdates'), t('hero.geoTagging')].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center items-center relative h-[500px] lg:h-[700px]"
          >
            {/* Subtle glow behind animation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/50 to-purple-200/50 blur-[100px] rounded-full" />
            
            <div className="relative z-10 w-full h-full scale-[1.2] lg:scale-[1.5]">
              <DotLottieReact
                src="/Under construction.lottie"
                loop
                autoplay
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION - Clean Glass Cards */}
      <section className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -5 }} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 p-6 flex flex-col items-center text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${stat.gradient} text-white rounded-xl mb-4 shadow-md`}>
                    <Icon size={28} strokeWidth={2} />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{stat.number}</div>
                  <div className="text-slate-500 font-bold text-xs uppercase tracking-wide">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Unboxed & Balanced */}
      <section id="features" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              {t('features.title')} <span className="text-blue-600">{t('features.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-24">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                  
                  {/* Text Side - Clean floating container */}
                  <div className={`flex-1 relative p-8 lg:p-10 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm`}>
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg text-white`}>
                        <Icon size={24} strokeWidth={2} />
                      </div>
                      <span className={`text-sm font-bold text-slate-500 uppercase tracking-widest`}>
                        {feature.title}
                      </span>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">{feature.title}</h3>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">{feature.description}</p>
                    
                    {/* Compact Interactive Pills */}
                    <div className="flex flex-wrap gap-3">
                      {[t('features.checkItems.realTimeTracking'), t('features.checkItems.userFriendly'), t('features.checkItems.securedData')].map((item, i) => (
                        <motion.div whileHover={{ scale: 1.02 }} key={i} className="flex items-center gap-2 text-slate-700 font-semibold px-4 py-2 rounded-lg bg-white/60 border border-white shadow-sm text-sm">
                          <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Image Side - Floating freely */}
                  <div className="flex-1 w-full relative flex justify-center items-center">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-br ${feature.gradient} opacity-10 blur-[80px] rounded-full -z-10`} />
                    <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 100 }} className="relative z-10 w-full max-w-md lg:max-w-full">
                      <img src={feature.image} alt={feature.title} className="w-full h-auto object-contain drop-shadow-2xl" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROBLEMS WE SOLVE - Compact Grid */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight">
              {t('problems.title')} <span className="text-blue-600">{t('problems.titleHighlight')}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t('problems.lackTransparency.title'), desc: t('problems.lackTransparency.description'), icon: Scale, color: "blue" },
              { title: t('problems.slowGrievance.title'), desc: t('problems.slowGrievance.description'), icon: Clock, color: "red" },
              { title: t('problems.poorAccountability.title'), desc: t('problems.poorAccountability.description'), icon: Bug, color: "orange" },
              { title: t('problems.dataSilos.title'), desc: t('problems.dataSilos.description'), icon: Database, color: "purple" },
            ].map((p, i) => {
              const ProblemIcon = p.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -5 }} className="bg-white/50 backdrop-blur-lg p-8 rounded-3xl border border-white/60 text-center shadow-lg hover:bg-white/80 transition-all group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-${p.color}-50 rounded-2xl mb-6 text-${p.color}-600 shadow-sm group-hover:scale-110 transition-transform`}>
                    <ProblemIcon size={32} strokeWidth={2} />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-slate-900">{p.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight">
              {t('testimonials.title')} <span className="text-blue-600">{t('testimonials.titleHighlight')}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg relative flex flex-col h-full">
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="text-amber-400 fill-amber-400" size={18} />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic text-lg leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>
                </div>
                <div className="border-t border-slate-200/60 pt-6 mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">{testimonial.name}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION - Balanced & High Impact */}
      <section className="relative z-10 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-blue-700">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 opacity-90"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl mb-8 border border-white/20 shadow-xl">
              <Award size={48} className="text-blue-100" />
            </div>

            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">{t('cta.title')}</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={ctaLink} className="bg-white text-blue-700 px-10 py-4 rounded-full text-xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                {t('cta.createAccount')} <ArrowRight size={24} />
              </Link>
              <Link href="/report" className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-full text-xl font-semibold border border-white/30 hover:bg-white/20 transition-all flex items-center justify-center">
                {t('cta.reportIssue')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}