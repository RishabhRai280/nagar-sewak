"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Token, UserStore } from "@/lib/api"; // Import Auth Helpers
import { useTranslations } from 'next-intl';
import {
  ArrowRight, CheckCircle, MapPin, TrendingUp, Shield, Users,
  BarChart3, Zap, Star, Award, MessageCircle, Bug, Clock,
  Scale, Database, FileEdit
} from "lucide-react";

export default function StunningLandingPage() {
  const t = useTranslations('landing');
  const containerRef = useRef(null);

  // State to handle the dynamic destination of the "Start Reporting" button
  const [ctaLink, setCtaLink] = useState("/register");

  // --- AUTH CHECK EFFECT ---
  useEffect(() => {
    // Check if user is logged in
    if (Token.get()) {
      const user = UserStore.get();
      // Default to citizen dashboard
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

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax Transforms
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 100]);

  const features = [
    {
      icon: MapPin,
      title: t('features.liveTracking.title'),
      description: t('features.liveTracking.description'),
      color: "blue",
      image: "/live_project_tracking.png",
    },
    {
      icon: FileEdit,
      title: t('features.smartComplaints.title'),
      description: t('features.smartComplaints.description'),
      color: "red",
      image: "/geo_tagged_complaints.png",
    },
    {
      icon: Star,
      title: t('features.contractorRating.title'),
      description: t('features.contractorRating.description'),
      color: "indigo",
      image: "/contractor_rating.png",
    },
    {
      icon: BarChart3,
      title: t('features.adminDashboard.title'),
      description: t('features.adminDashboard.description'),
      color: "emerald",
      image: "/admin_dashboard.png",
    },
    {
      icon: Shield,
      title: t('features.transparentGovernance.title'),
      description: t('features.transparentGovernance.description'),
      color: "purple",
      image: "/transparent_governance.png",
    },
    {
      icon: Zap,
      title: t('features.realTimeUpdates.title'),
      description: t('features.realTimeUpdates.description'),
      color: "orange",
      image: "/real_time_updates.png",
    },
  ];

  const stats = [
    { number: "10K+", label: t('stats.activeUsers'), icon: Users },
    { number: "500+", label: t('stats.projectsTracked'), icon: TrendingUp },
    { number: "2K+", label: t('stats.issuesResolved'), icon: CheckCircle },
    { number: "95%", label: t('stats.satisfactionRate'), icon: Star },
  ];

  const testimonials = [
    {
      name: t('testimonials.testimonial1.name'),
      role: t('testimonials.testimonial1.role'),
      content: t('testimonials.testimonial1.content'),
      rating: 5,
    },
    {
      name: t('testimonials.testimonial2.name'),
      role: t('testimonials.testimonial2.role'),
      content: t('testimonials.testimonial2.content'),
      rating: 5,
    },
    {
      name: t('testimonials.testimonial3.name'),
      role: t('testimonials.testimonial3.role'),
      content: t('testimonials.testimonial3.content'),
      rating: 5,
    },
  ];

  const getFeatureClasses = (color: string) => ({
    bg: `bg-${color}-50`,
    text: `text-${color}-600`,
  });

  return (
    <div ref={containerRef} className="relative min-h-screen w-full bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-blue-200">

      {/* --- SCROLL PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* --- ULTRA VIBRANT FIXED BACKGROUND (Global Parallax) --- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-slate-50">
        {/* Top Left Blob */}
        <motion.div
          style={{ y: y1 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-[800px] h-[800px] bg-blue-400 rounded-full blur-[120px] opacity-30 mix-blend-multiply"
        />
        {/* Middle Right Blob */}
        <motion.div
          style={{ y: y2 }}
          animate={{ scale: [1, 1.1, 1], x: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] -right-40 w-[700px] h-[700px] bg-indigo-300 rounded-full blur-[120px] opacity-30 mix-blend-multiply"
        />
        {/* Bottom Center Blob */}
        <motion.div
          style={{ y: y3 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 left-1/3 w-[900px] h-[900px] bg-emerald-200 rounded-full blur-[120px] opacity-30 mix-blend-multiply"
        />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 w-full pt-32 pb-20 overflow-visible">
        <div className="relative max-w-[90rem] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left: Content */}
          <div className="relative z-20 pl-4 lg:pl-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/60 backdrop-blur-md border border-white/60 rounded-full text-sm font-bold text-blue-700 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {t('badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-7xl font-extrabold leading-[1.1] text-slate-900 mb-6 tracking-tight"
            >
              {t('hero.title')}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                {t('hero.titleHighlight')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-xl md:text-2xl text-slate-700 font-medium max-w-xl leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              {/* UPDATED LINK: Uses state to decide whether to go to Dashboard or Register */}
              <Link
                href={ctaLink}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                {t('hero.startReporting')} <ArrowRight size={20} />
              </Link>

              <Link
                href="/map"
                className="bg-white/60 backdrop-blur-md text-slate-800 px-8 py-4 rounded-xl text-lg font-bold hover:bg-white transition border border-white/60 shadow-sm hover:-translate-y-1"
              >
                {t('hero.viewLiveMap')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-wrap gap-8 text-sm font-semibold text-slate-600"
            >
              {[t('hero.freeToUse'), t('hero.realTimeUpdates'), t('hero.geoTagging')].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-white/20">
                  <CheckCircle size={18} className="text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Animated Illustration (LOTTIE) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center lg:justify-start relative w-full h-full items-center"
          >
            <div className="relative z-10 w-full max-w-[600px] lg:max-w-none lg:w-[130%] scale-[1.6] lg:scale-[1.9] origin-center lg:-ml-10 flex items-center justify-center pointer-events-none">
              <DotLottieReact
                src="/Under construction.lottie"
                loop
                autoplay
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION - Glass Strip */}
      <section className="relative z-10 py-12">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="text-center p-4 rounded-xl transition hover:bg-white/40"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-2xl mb-4 shadow-sm">
                      <Icon size={28} />
                    </div>
                    <div className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-1">{stat.number}</div>
                    <div className="text-slate-600 font-bold">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEMS WE SOLVE - Glass Cards */}
      <section className="relative z-10 py-24">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-slate-900">
              {t('problems.title')} <span className="text-blue-600">{t('problems.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('problems.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: t('problems.lackTransparency.title'), desc: t('problems.lackTransparency.description'), icon: Scale },
              { title: t('problems.slowGrievance.title'), desc: t('problems.slowGrievance.description'), icon: Clock },
              { title: t('problems.poorAccountability.title'), desc: t('problems.poorAccountability.description'), icon: Bug },
              { title: t('problems.dataSilos.title'), desc: t('problems.dataSilos.description'), icon: Database },
            ].map((p, i) => {
              const ProblemIcon = p.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/50 text-center hover:shadow-2xl transition-all duration-300 hover:bg-white/80"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6 text-blue-600">
                    <ProblemIcon size={32} />
                  </div>
                  <h4 className="text-2xl font-bold mb-3 text-slate-900">{p.title}</h4>
                  <p className="text-slate-600 leading-relaxed font-medium">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 py-16">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              {t('features.title')} <span className="text-blue-600">{t('features.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-24">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              const classes = getFeatureClasses(feature.color);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7 }}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${!isEven ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Text Side - Wrapped in Glass for Readability */}
                  <div className={`p-8 md:p-12 rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 shadow-sm ${isEven ? "" : "md:order-2"}`}>
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                        <Icon className={`${classes.text}`} size={28} />
                      </div>
                      <span className={`text-sm font-bold ${classes.text} uppercase tracking-wide`}>
                        {feature.title}
                      </span>
                    </div>
                    <h3 className={`text-4xl font-extrabold text-slate-900 mb-4`}>{feature.title}</h3>
                    <p className="text-lg text-slate-700 mb-8 leading-relaxed font-medium">{feature.description}</p>
                    <ul className="space-y-4">
                      {[t('features.checkItems.realTimeTracking'), t('features.checkItems.userFriendly'), t('features.checkItems.securedData')].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 font-semibold">
                          <CheckCircle className="text-emerald-500 flex-shrink-0" size={20} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image Side */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className={isEven ? "" : "md:order-1"}
                  >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 transform rotate-1 hover:rotate-0 transition-all duration-500">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Glass Cards */}
      <section className="relative z-10 py-24">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-slate-900">
              {t('testimonials.title')} <span className="text-blue-600">{t('testimonials.titleHighlight')}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-lg border border-white/60 relative"
              >
                <div className="absolute -top-6 left-8 bg-blue-600 p-3 rounded-2xl shadow-lg text-white">
                  <MessageCircle size={24} />
                </div>
                <div className="mt-4">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="text-amber-400 fill-amber-400" size={18} />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed italic text-lg font-medium">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="font-bold text-slate-900 text-lg">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 font-semibold">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-24 overflow-hidden">
        {/* Custom Gradient Background for CTA */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-800"></div>

        {/* Decorative overlay blobs inside CTA */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-400 opacity-20 blur-3xl rounded-full"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl mb-8 border border-white/20">
              <Award size={48} className="text-blue-200" />
            </div>

            <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">{t('cta.title')}</h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {/* UPDATED LINK: Uses state to decide whether to go to Dashboard or Register */}
              <Link
                href={ctaLink}
                className="bg-white text-blue-700 px-10 py-5 rounded-full text-xl font-bold shadow-2xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                {t('cta.createAccount')} <ArrowRight size={24} />
              </Link>
              <Link
                href="/report"
                className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full text-xl font-semibold hover:bg-white/20 transition border border-white/30"
              >
                {t('cta.reportIssue')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}