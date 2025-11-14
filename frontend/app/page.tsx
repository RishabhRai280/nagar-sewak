"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, MapPin, TrendingUp, Shield, Users, BarChart3, Zap, Globe, FileText, Star, Award } from "lucide-react";

export default function StunningLandingPage() {
  const features = [
    {
      icon: MapPin,
      title: "Live Project Tracking",
      description: "Track all development works with budget transparency, contractor details, and geo-locations on an interactive map.",
      image: "/api/placeholder/600/400",
      color: "blue",
    },
    {
      icon: FileText,
      title: "Smart Geo-Tagged Complaints",
      description: "Report issues instantly with GPS location, photos, and real-time resolution tracking. Get instant zone routing.",
      image: "/api/placeholder/600/400",
      color: "red",
    },
    {
      icon: Star,
      title: "Contractor Rating System",
      description: "Rate completed projects and hold contractors accountable. Automatic flagging for poor performers.",
      image: "/api/placeholder/600/400",
      color: "purple",
    },
    {
      icon: BarChart3,
      title: "Admin Dashboard & Analytics",
      description: "Real-time insights into active projects, pending complaints, resolution times, and flagged contractors.",
      image: "/api/placeholder/600/400",
      color: "green",
    },
    {
      icon: Shield,
      title: "Transparent Governance",
      description: "Full budget breakdowns, contractor identities, and project statuses visible to all citizens.",
      image: "/api/placeholder/600/400",
      color: "indigo",
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Get instant notifications on complaint status, project progress, and resolution updates.",
      image: "/api/placeholder/600/400",
      color: "yellow",
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
      content: "The dashboard helps us track everything in real-time. It&apos;s a game-changer for municipal management.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full pt-32 pb-40 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520975918318-3a8c04f7e6b0?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-indigo-900/50"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold"
            >
              🚀 Next-Gen Civic Technology Platform
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-7xl font-extrabold leading-tight drop-shadow-xl mb-6"
            >
              Transforming Cities with
              <span className="text-yellow-300 block"> Transparent Governance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-xl md:text-2xl opacity-90 max-w-xl leading-relaxed"
            >
              A comprehensive civic technology platform enabling citizens, administrators, and contractors to collaborate seamlessly for cleaner, safer, and more accountable cities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/register"
                className="bg-yellow-300 text-black px-8 py-4 rounded-xl text-lg font-bold shadow-2xl hover:bg-yellow-400 transition transform hover:scale-105 flex items-center gap-2"
              >
                Start Reporting <ArrowRight size={20} />
              </Link>

              <Link
                href="#features"
                className="bg-white/20 backdrop-blur px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/30 transition border-2 border-white/30"
              >
                Explore Features
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-wrap gap-8 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-300" />
                <span>Free to Use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-300" />
                <span>Real-Time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-300" />
                <span>100% Transparent</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center relative"
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border-4 border-white/20 p-8">
                <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <Globe size={120} className="mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-semibold">City Governance</p>
                    <p className="text-sm opacity-75">Platform Preview</p>
                  </div>
                </div>
                <p className="text-center text-white/80 text-sm mt-4">Image placeholder - City governance dashboard visualization</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-gray-200">
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
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                    <Icon className="text-white" size={32} />
                  </div>
                  <div className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROBLEMS WE SOLVE */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-gray-800">Problems We Solve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Addressing the core challenges in modern civic governance and citizen engagement
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Lack of Transparency",
                desc: "Citizens have no visibility into projects, funds, or contractor performance.",
                icon: "🔍",
                color: "red",
              },
              {
                title: "Slow Grievance Handling",
                desc: "Reporting and resolving local issues is slow, inefficient, and lacks tracking.",
                icon: "⏱️",
                color: "orange",
              },
              {
                title: "Poor Accountability",
                desc: "Contractors and officials lack performance tracking and rating systems.",
                icon: "📊",
                color: "blue",
              },
              {
                title: "No Real-Time Insights",
                desc: "Administrators rely on manual data instead of live analytics and dashboards.",
                icon: "📈",
                color: "green",
              },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-xl text-center border-t-4 border-blue-600 hover:shadow-2xl transition"
              >
                <div className="text-6xl mb-4">{p.icon}</div>
                <h4 className="text-2xl font-bold mb-3 text-gray-800">{p.title}</h4>
                <p className="text-gray-600 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-blue-700 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for transparent, efficient, and accountable civic governance
            </p>
          </motion.div>

          <div className="space-y-32">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${!isEven ? "md:flex-row-reverse" : ""}`}
                >
                  <div className={isEven ? "" : "md:order-2"}>
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className={`p-3 rounded-xl bg-${feature.color}-100`}>
                        <Icon className={`text-${feature.color}-600`} size={32} />
                      </div>
                      <span className={`text-sm font-semibold text-${feature.color}-600 uppercase tracking-wide`}>
                        Feature {index + 1}
                      </span>
                    </div>
                    <h3 className="text-4xl font-extrabold text-gray-900 mb-6">{feature.title}</h3>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">{feature.description}</p>
                    <ul className="space-y-3">
                      {[
                        "Real-time updates and notifications",
                        "Mobile-responsive design",
                        "Secure authentication system",
                        "Comprehensive analytics dashboard",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={isEven ? "" : "md:order-1"}>
                    <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
                        <div className="text-center text-white p-8">
                          <Icon size={80} className="mx-auto mb-4 opacity-80" />
                          <p className="text-xl font-semibold mb-2">{feature.title}</p>
                          <p className="text-sm opacity-75">Feature visualization placeholder</p>
                          <p className="text-xs opacity-50 mt-4">Image: {feature.image}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-gray-800">What People Say</h2>
            <p className="text-xl text-gray-600">Real feedback from our community</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="text-yellow-400 fill-yellow-400" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">&quot;{testimonial.content}&quot;</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-gray-800">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get started</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Register", desc: "Create your free account as a citizen" },
              { step: "2", title: "Report", desc: "Submit geo-tagged complaints with photos" },
              { step: "3", title: "Track", desc: "Monitor project progress and complaint status" },
              { step: "4", title: "Rate", desc: "Rate completed projects and contractors" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-full text-3xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award size={64} className="mx-auto mb-6 opacity-80" />
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">Join the Movement for Better Cities</h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Together, let&apos;s build a transparent, responsive, and citizen-driven governance system. Start making a difference today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="bg-white text-indigo-700 px-10 py-4 rounded-full text-xl font-bold shadow-2xl hover:bg-gray-200 transition transform hover:scale-105 flex items-center gap-2"
              >
                Get Started Free <ArrowRight size={24} />
              </Link>
              <Link
                href="/map"
                className="bg-white/20 backdrop-blur text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-white/30 transition border-2 border-white/30"
              >
                Explore Live Map
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
