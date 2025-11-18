"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, MapPin, TrendingUp, Shield, Users, BarChart3, Zap, Globe, FileText, Star, Award, MessageCircle, Bug, Clock, Scale, Database, FileEdit } from "lucide-react";

export default function StunningLandingPage() {
  const features = [
    {
      icon: MapPin,
      title: "Live Project Tracking",
      description: "Track all development works with budget transparency, contractor details, and geo-locations on an interactive map.",
      color: "blue",
      // UPDATED PATH: Assumes file is at /public/live_project_tracking.png
      image: "/live_project_tracking.png", 
    },
    {
      icon: FileEdit, 
      title: "Smart Geo-Tagged Complaints",
      description: "Report issues instantly with GPS location, photos, and real-time resolution tracking. Get instant zone routing.",
      color: "red",
      // UPDATED PATH: Assumes file is at /public/geo_tagged_complaints.png
      image: "/geo_tagged_complaints.png",
    },
    {
      icon: Star,
      title: "Contractor Rating System",
      description: "Rate completed projects and hold contractors accountable. Automatic flagging for poor performers.",
      color: "indigo",
      // UPDATED PATH: Assumes file is at /public/contractor_rating.png
      image: "/contractor_rating.png",
    },
    {
      icon: BarChart3,
      title: "Admin Dashboard & Analytics",
      description: "Real-time insights into active projects, pending complaints, resolution times, and flagged contractors.",
      color: "emerald",
      // UPDATED PATH: Assumes file is at /public/admin_dashboard.png
      image: "/admin_dashboard.png",
    },
    {
      icon: Shield,
      title: "Transparent Governance",
      description: "Full budget breakdowns, contractor identities, and project statuses visible to all citizens.",
      color: "purple",
      // UPDATED PATH: Assumes file is at /public/transparent_governance.png
      image: "/transparent_governance.png",
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Get instant notifications on complaint status, project progress, and resolution updates.",
      color: "orange",
      // UPDATED PATH: Assumes file is at /public/real_time_updates.png
      image: "/real_time_updates.png",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "500+", label: "Projects Tracked", icon: TrendingUp },
    { number: "2K+", label: "Issues Resolved", icon: CheckCircle },
    { number: "95%", label: "Satisfaction Rate", icon: Star },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Citizen, Mumbai",
      content: "Nagar Sewak has transformed how we report issues. My complaint about a pothole was resolved in just 3 days!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Community Leader, Delhi",
      content: "The transparency in project budgets and contractor ratings gives us confidence in our local governance.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      role: "Administrator, Ahmedabad",
      content: "The dashboard helps us track everything in real-time. It's a game-changer for municipal management.",
      rating: 5,
    },
  ];

  // Utility function for Tailwind class generation
  const getFeatureClasses = (color: string) => {
    return {
      bg: `bg-${color}-50`,
      text: `text-${color}-600`,
      ring: `ring-${color}-500`,
      shadow: `shadow-lg`,
    };
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full pt-32 pb-40 bg-white overflow-hidden border-b border-slate-100">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-4 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm font-semibold text-blue-700"
            >
              🚀 Civic Technology for Smart Cities
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-7xl font-extrabold leading-tight text-slate-900 mb-6"
            >
              Building
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block"> Trust & Transparency</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-xl md:text-2xl text-slate-600 max-w-xl leading-relaxed"
            >
              A platform enabling citizens and administration to collaborate seamlessly for accountable and efficient local governance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition transform hover:scale-105 flex items-center gap-2"
              >
                Start Reporting <ArrowRight size={20} />
              </Link>

              <Link
                href="/map"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition border border-slate-200 shadow-md"
              >
                View Live Map
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-wrap gap-8 text-sm text-slate-600"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-500" />
                <span>Free to Use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-500" />
                <span>Real-Time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-500" />
                <span>Geo-Tagging</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Illustration/Mockup Placeholder - ENHANCED */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center relative w-full max-w-lg"
          >
            <div className="relative w-full aspect-square bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-8 overflow-hidden">
                
                {/* Background Pattern/Shadow Layer */}
                <div className="absolute inset-0 bg-white/10 blur-3xl opacity-50" />
                
                {/* Central Focus: Layered Icons */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center space-y-4">
                    <MapPin size={100} className="opacity-90 drop-shadow-lg" />
                    <BarChart3 size={48} className="absolute top-10 right-10 opacity-30 rotate-12" />
                    <Scale size={48} className="absolute bottom-10 left-10 opacity-30 -rotate-12" />
                    
                    <h3 className="text-3xl font-extrabold drop-shadow-md pt-6">Real-Time Data View</h3>
                    <p className="text-lg opacity-85">Mapping Governance in Action</p>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center p-4 rounded-xl transition hover:bg-white"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4 border border-blue-200">
                    <Icon className="text-blue-600" size={28} />
                  </div>
                  <div className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-1">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROBLEMS WE SOLVE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-slate-900">
              Solving <span className="text-blue-600">Core Governance Issues</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Addressing the challenges in modern civic governance and citizen engagement with technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Lack of Transparency",
                desc: "Citizens have no visibility into projects, funds, or contractor performance.",
                icon: Scale, // Replaced emoji with Scale icon
                color: "red",
              },
              {
                title: "Slow Grievance Handling",
                desc: "Reporting and resolving local issues is slow, inefficient, and lacks tracking.",
                icon: Clock, // Replaced emoji with Clock icon
                color: "orange",
              },
              {
                title: "Poor Accountability",
                desc: "Contractors lack performance tracking and quality assurance is often minimal.",
                icon: Bug, // Replaced emoji with Bug icon (represents issues/problems)
                color: "blue",
              },
              {
                title: "Data Silos",
                desc: "Administrators struggle with manual data instead of real-time analytics and unified dashboards.",
                icon: Database, // Replaced emoji with Database icon
                color: "purple",
              },
            ].map((p, i) => {
              const ProblemIcon = p.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-slate-50 p-8 rounded-2xl shadow-md text-center border-t-4 border-blue-600 hover:shadow-xl transition"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4 border border-blue-200">
                    <ProblemIcon className="text-blue-600" size={28} /> {/* Render Lucide Icon */}
                  </div>
                  <h4 className="text-2xl font-bold mb-3 text-slate-900">{p.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Changed to bg-white */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12" // mb-20 -> mb-12
          >
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              Powerful <span className="text-blue-600">Governance Features</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need for transparent, efficient, and accountable civic engagement.
            </p>
          </motion.div>

          <div className="space-y-10"> {/* space-y-12 -> space-y-10 */}
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              const classes = getFeatureClasses(feature.color);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${!isEven ? "md:flex-row-reverse" : ""}`}
                >
                  <div className={isEven ? "" : "md:order-2"}>
                    <div className="inline-flex items-center gap-3 mb-3">
                      <div className={`p-3 rounded-xl ${classes.bg}`}>
                        <Icon className={`${classes.text}`} size={28} />
                      </div>
                      <span className={`text-sm font-semibold ${classes.text} uppercase tracking-wide`}>
                        {feature.title}
                      </span>
                    </div>
                    <h3 className={`text-4xl font-extrabold ${classes.text} mb-3`}>{feature.title}</h3>
                    <p className="text-lg text-slate-700 mb-4 leading-relaxed">{feature.description}</p>
                    <ul className="space-y-3">
                      {[
                        "Real-time status tracking on Map",
                        "User-friendly mobile interface",
                        "Secured, audited data transactions",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700">
                          <CheckCircle className="text-emerald-500 flex-shrink-0" size={20} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: IMAGE COLUMN - UNBOXED */}
                  <div className={isEven ? "" : "md:order-1"}>
                    <img
                      src={feature.image}
                      alt={feature.title + ' Illustration'}
                      className="w-full h-auto" 
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-slate-900">
              Trusted by the <span className="text-blue-600">Community</span>
            </h2>
            <p className="text-xl text-slate-600">Real feedback from citizens and administrators</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-50 p-8 rounded-2xl shadow-md border border-slate-200"
              >
                <MessageCircle className="text-blue-500 mb-4" size={28} />
                <p className="text-slate-700 mb-6 leading-relaxed italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="text-amber-400 fill-amber-400" size={18} />
                  ))}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-slate-900">Get Started in <span className="text-blue-600">4 Simple Steps</span></h2>
            <p className="text-xl text-slate-600">Your journey to active civic engagement starts now.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Register", desc: "Create your free citizen account securely." },
              { step: "2", title: "Report", desc: "Submit geo-tagged issues with photos instantly." },
              { step: "3", title: "Track", desc: "Monitor complaint and project status in real-time." },
              { step: "4", title: "Rate", desc: "Provide feedback by rating completed public works." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 bg-white rounded-xl shadow-md border border-slate-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-3xl font-extrabold mb-6 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-blue-700 to-indigo-700 text-white text-center relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award size={64} className="mx-auto mb-6 text-blue-200 opacity-80" />
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">Start Making a Difference Today</h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Join NagarSewak and contribute to building a more transparent and responsive local government.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="bg-white text-blue-700 px-10 py-4 rounded-full text-xl font-bold shadow-2xl hover:bg-slate-200 transition transform hover:scale-105 flex items-center gap-2"
              >
                Create Account <ArrowRight size={24} />
              </Link>
              <Link
                href="/report"
                className="bg-white/20 backdrop-blur text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-white/30 transition border-2 border-white/30"
              >
                Report an Issue
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}