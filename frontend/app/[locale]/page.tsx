
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Token, UserStore, fetchAllTenders, TenderData } from "@/lib/api/api";
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const HomeMapPreview = dynamic(() => import('@/app/components/shared/HomeMapPreview'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Loading map...</p>
      </div>
    </div>
  )
});
import {
  ArrowRight, CheckCircle, MapPin, TrendingUp, Shield, Users,
  BarChart3, Zap, Star, Award, Clock, Camera, CheckCircle2, FileText, ShieldCheck,
  Bell, MessageSquare, Eye, ThumbsUp, Download, Smartphone, Globe, Lock,
  Headphones, Mail, Phone, Building2, Briefcase, Heart, Lightbulb, Target,
  AlertCircle, ChevronRight, ChevronDown, Play, ExternalLink, Send, Search,
  Calendar, User, Settings, HelpCircle, BookOpen, FileCheck, Layers, PieChart,
  Activity, Cpu, Database, Cloud, Code, Sparkles, Rocket, Trophy, Megaphone,
  Navigation, Upload, Image, Vote, MessageCircle, Repeat, DollarSign, Percent,
  TrendingDown, BarChart, LineChart, Wifi, WifiOff, Fingerprint, Key, UserCheck,
  Home, Building, Gavel, CreditCard, GraduationCap, Stethoscope, Car, Plane,
  Loader2, Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GovLandingPage() {
  const t = useTranslations();
  const [ctaLink, setCtaLink] = useState("/register");
  const [dashboardLink, setDashboardLink] = useState("/login");
  const [analyticsLink, setAnalyticsLink] = useState("/login");
  const [currentTime, setCurrentTime] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  useEffect(() => {
    // Set current time to avoid hydration mismatch
    setCurrentTime(new Date().toLocaleTimeString());

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000);

    if (Token.get()) {
      const user = UserStore.get();
      let target = "/dashboard/citizen";
      let analytics = "/dashboard/citizen/reports";

      if (user) {
        const hasAdminAccess = user.roles.some((role) => role === 'ADMIN' || role === 'SUPER_ADMIN');
        const isContractor = user.roles.includes('CONTRACTOR');

        if (hasAdminAccess) {
          target = "/dashboard/admin";
          analytics = "/dashboard/admin"; // Admin dashboard has analytics built-in
        } else if (isContractor) {
          target = "/dashboard/contractor";
          analytics = "/dashboard/contractor"; // Contractor dashboard has analytics built-in
        }
      }

      setCtaLink(target);
      setDashboardLink(target);
      setAnalyticsLink(analytics);
    } else {
      // For non-logged users, redirect dashboard actions to login
      setDashboardLink("/login");
      setAnalyticsLink("/login");
    }

    // Cleanup interval on unmount
    return () => clearInterval(timeInterval);

    // Fetch real tender data
    const loadTenders = async () => {
      try {
        setLoading(true);
        const response = await fetchAllTenders({ limit: 3 });
        if (response.tenders && response.tenders.length > 0) {
          // Map the API response to our display format
          const mappedTenders = response.tenders.map(tender => ({
            id: tender.id,
            title: tender.title || tender.complaintTitle || `Tender #${tender.id}`,
            budget: tender.budget || tender.quoteAmount || 0,
            description: tender.description || "No description available",
            status: tender.status,
            createdAt: tender.createdAt,
            complaintId: tender.complaintId
          }));
          setTenders(mappedTenders);
        }
      } catch (error) {
        console.log('Using fallback tender data');
        // Keep the fallback data if API fails
      } finally {
        setLoading(false);
      }
    };

    loadTenders();
  }, []);



  const stats = [
    { id: "activeUsers", number: "12.5L", icon: Users, color: "blue" },
    { id: "projectsTracked", number: "142", icon: Building2, color: "orange" },
    { id: "satisfactionRate", number: "94%", icon: Star, color: "green" },
    { id: "support", number: "24/7", icon: Headphones, color: "purple" },
  ];

  // Online Services Data
  const onlineServices = [
    { id: "propertyTax", icon: Home, link: "/services/property-tax" },
    { id: "waterCharges", icon: Zap, link: "/services/water-charges" },
    { id: "tradeLicense", icon: FileText, link: "/services/trade-license" },
    { id: "certificates", icon: FileCheck, link: "/services/certificates" },
    { id: "buildingPlan", icon: Building, link: "/services/building-plan" },
    { id: "fireNoc", icon: Shield, link: "/services/fire-noc" },
    { id: "grievances", icon: MessageSquare, link: "/report" },
    { id: "rti", icon: Eye, link: "/services/rti" }
  ];

  // Government Schemes
  const govSchemes = [
    { id: "pmay", category: "Housing", color: "bg-orange-500", link: "/schemes/pmay" },
    { id: "janAushadhi", category: "Healthcare", color: "bg-green-500", link: "/schemes/jan-aushadhi" },
    { id: "swachhBharat", category: "Sanitation", color: "bg-blue-500", link: "/schemes/swachh-bharat" },
    { id: "ayushman", category: "Healthcare", color: "bg-purple-500", link: "/schemes/ayushman-bharat" }
  ];

  // Tenders & Circulars - State for real data
  const [tenders, setTenders] = useState<any[]>([
    {
      id: 1,
      title: "Construction of Community Center in Ward 12",
      budget: 2500000,
      description: "Construction of a modern community center with multipurpose hall, library, and recreational facilities.",
      status: "OPEN",
      createdAt: "2025-12-20T00:00:00"
    },
    {
      id: 2,
      title: "Supply of LED Street Lights for Zone A",
      budget: 1500000,
      description: "Supply and installation of energy-efficient LED street lights across Zone A covering 200 locations.",
      status: "OPEN",
      createdAt: "2025-12-18T00:00:00"
    },
    {
      id: 3,
      title: "Waste Management Services Contract",
      budget: 5000000,
      description: "Comprehensive waste collection, transportation, and disposal services for residential areas.",
      status: "CLOSED",
      createdAt: "2025-12-15T00:00:00"
    }
  ]);
  const [loading, setLoading] = useState(false);


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
    <div className="relative min-h-screen w-full bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* ========================================
          HERO SECTION - Government Portal Style
      ======================================== */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt="Government Building Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-blue-900/60"></div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Government Branding */}
              <div className="flex items-center gap-4 mb-8">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Government of India"
                  className="w-16 h-16 invert brightness-0"
                />
                <div>
                  <h2 className="text-2xl font-bold">{t('common.govIndia')}</h2>
                  <p className="text-blue-200 text-sm">{t('common.ministry')}</p>
                </div>
              </div>

              <div>
                <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                  <span dangerouslySetInnerHTML={{ __html: t.raw('landing.hero.empowering') }} />
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-lg">
                  {t('landing.hero.description')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={ctaLink}>
                  <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                    {t('landing.hero.getStarted')}
                    <ArrowRight size={20} />
                  </button>
                </Link>
                <Link href="/services">
                  <button className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 rounded-lg font-bold text-lg transition-all">
                    {t('landing.hero.viewServices')}
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Content - Service Cards in 3x2 Grid */}
            <div className="grid grid-cols-3 gap-4">
              <Link href="/report">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="text-white" size={20} />
                  </div>
                  <h3 className="font-semibold mb-1 text-white text-sm">{t('landing.hero.cards.complaints.title')}</h3>
                  <p className="text-blue-200 text-xs">{t('landing.hero.cards.complaints.desc')}</p>
                </div>
              </Link>

              <Link href={dashboardLink}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <h3 className="font-semibold mb-1 text-white text-sm">{t('landing.hero.cards.track.title')}</h3>
                  <p className="text-blue-200 text-xs">{t('landing.hero.cards.track.desc')}</p>
                </div>
              </Link>

              <Link href={analyticsLink}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BarChart3 className="text-white" size={20} />
                  </div>
                  <h3 className="font-semibold mb-1 text-white text-sm">{t('landing.hero.cards.analytics.title')}</h3>
                  <p className="text-blue-200 text-xs">{t('landing.hero.cards.analytics.desc')}</p>
                </div>
              </Link>

              <Link href="/services">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Settings className="text-white" size={20} />
                  </div>
                  <h3 className="font-semibold mb-1 text-white text-sm">{t('landing.hero.cards.services.title')}</h3>
                  <p className="text-blue-200 text-xs">{t('landing.hero.cards.services.desc')}</p>
                </div>
              </Link>

              <Link href="/tenders">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Briefcase className="text-white" size={20} />
                  </div>
                  <h3 className="font-semibold mb-1 text-white text-sm">{t('landing.hero.cards.tenders.title')}</h3>
                  <p className="text-blue-200 text-xs">{t('landing.hero.cards.tenders.desc')}</p>
                </div>
              </Link>

              <Link href="/login">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Shield className="text-white" size={20} />
                  </div>
                  <h3 className="font-semibold mb-1 text-white text-sm">{t('landing.hero.cards.secure.title')}</h3>
                  <p className="text-blue-200 text-xs">{t('landing.hero.cards.secure.desc')}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          STATS SECTION - Government Dashboard Style
      ======================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('landing.platformStats.title')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('landing.platformStats.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300",
                  stat.color === "blue" && "bg-blue-50 text-blue-700 border-2 border-blue-200",
                  stat.color === "orange" && "bg-orange-50 text-orange-600 border-2 border-orange-200",
                  stat.color === "green" && "bg-green-50 text-green-700 border-2 border-green-200",
                  stat.color === "purple" && "bg-purple-50 text-purple-700 border-2 border-purple-200"
                )}>
                  <stat.icon size={28} />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-2">{stat.number}</div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  {t(`landing.platformStats.${stat.id}`)}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{t('landing.platformStats.systemStatus')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{t('landing.platformStats.lastUpdated')}: {currentTime || t('common.loading')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>{t('landing.platformStats.responseTime')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          ONLINE SERVICES SECTION
      ======================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('landing.onlineServices.title')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('landing.onlineServices.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {onlineServices.map((service, index) => (
              <Link key={index} href={service.link}>
                <div className="group bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                    <service.icon className="text-blue-600 group-hover:text-white" size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {t(`landing.onlineServices.${service.id}.title`)}
                  </h3>
                  <p className="text-sm text-slate-600">{t(`landing.onlineServices.${service.id}.desc`)}</p>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('landing.onlineServices.access')} <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                {t('landing.onlineServices.viewAll')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          ENHANCED GEOGRAPHICAL VIEW & TENDERS SECTION
      ======================================== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('landing.cityOverview.title')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('landing.cityOverview.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Enhanced Geographical View - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t('landing.cityOverview.mapTitle')}</h3>
                    <p className="text-slate-600">{t('landing.cityOverview.mapDesc')}</p>
                  </div>
                  <Link href="/map">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <Maximize2 size={16} />
                      {t('landing.cityOverview.fullMap')}
                    </button>
                  </Link>
                </div>
              </div>

              {/* Enhanced Map Preview */}
              <HomeMapPreview />

              <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">25</div>
                    <div className="text-sm text-slate-600">{t('landing.cityOverview.wardBoundaries')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">142</div>
                    <div className="text-sm text-slate-600">{t('landing.cityOverview.activeComplaints')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">38</div>
                    <div className="text-sm text-slate-600">{t('landing.cityOverview.ongoingProjects')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tenders & Circulars - Takes 1 column */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('landing.latestTenders.title')}</h3>
                <p className="text-slate-600 text-sm">{t('landing.latestTenders.subtitle')}</p>
              </div>

              {loading ? (
                <div className="p-6 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">{t('landing.latestTenders.loading')}</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                  {tenders.length > 0 ? (
                    tenders.slice(0, 3).map((tender, index) => {
                      // Check if this is real API data or mock data
                      const isRealTender = tender.complaintId && tender.complaintId > 0;
                      const linkHref = isRealTender ? `/tenders/${tender.id}` : '/tenders';

                      return (
                        <Link key={tender.id || index} href={linkHref}>
                          <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tender.status === 'OPEN' || tender.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : tender.status === 'CLOSED' || tender.status === 'Closed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {tender.status === 'OPEN' ? 'Active' : tender.status === 'CLOSED' ? 'Closed' : tender.status}
                              </span>
                            </div>
                            <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm line-clamp-2 mb-2">
                              {tender.title}
                            </h4>
                            {tender.description && (
                              <p className="text-xs text-slate-500 line-clamp-2 mb-3">{tender.description}</p>
                            )}
                            <div className="flex justify-between items-center text-xs text-slate-600">
                              <span className="font-semibold">
                                ₹{tender.budget ? (tender.budget / 100000).toFixed(1) + 'L' : 'TBD'}
                              </span>
                              <span>{new Date(tender.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-2 flex items-center text-blue-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                              {isRealTender ? t('landing.latestTenders.viewDetails') : t('landing.latestTenders.browse')} <ArrowRight size={12} className="ml-1" />
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="text-slate-400" size={24} />
                      </div>
                      <h4 className="font-semibold text-slate-700 mb-2">{t('landing.latestTenders.noActive')}</h4>
                      <p className="text-sm text-slate-500 mb-4">
                        {t('landing.latestTenders.noActiveDesc')}
                      </p>
                      <Link href="/tenders">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                          {t('landing.latestTenders.viewAll')}
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                <Link href="/tenders">
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm flex items-center gap-1 mx-auto">
                    {t('landing.latestTenders.viewAll')} <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          GOVERNMENT SCHEMES SECTION
      ======================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('landing.govSchemes.title')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('landing.govSchemes.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {govSchemes.map((scheme, index) => (
              <Link key={index} href={scheme.link}>
                <div className="group bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className={`h-2 ${scheme.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {scheme.category}
                      </span>
                      <ArrowRight className="text-slate-400 group-hover:text-blue-600 transition-colors" size={16} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {t(`landing.govSchemes.${scheme.id}.title`)}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{t(`landing.govSchemes.${scheme.id}.desc`)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/schemes">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                View All Schemes
              </button>
            </Link>
          </div>
        </div>
      </section>



      {/* ========================================
          CONTACT & MOBILE APP SECTION
      ======================================== */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Contact Us</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Helpline</h3>
                    <p className="text-blue-200">1800-11-2025</p>
                    <p className="text-sm text-slate-400">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Support</h3>
                    <p className="text-blue-200">support@nagarsewak.gov.in</p>
                    <p className="text-sm text-slate-400">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office Address</h3>
                    <p className="text-blue-200">Ministry of Urban Affairs</p>
                    <p className="text-sm text-slate-400">Nirman Bhawan, New Delhi - 110011</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="font-semibold mb-3">Emergency Services</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-400">100</div>
                    <div className="text-xs text-slate-400">Police</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">101</div>
                    <div className="text-xs text-slate-400">Fire</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">108</div>
                    <div className="text-xs text-slate-400">Ambulance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile App Section */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <Smartphone className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">
                  Nagar Sewak <span className="text-orange-400">Mobile App</span>
                </h2>
                <p className="text-blue-200 mb-6">
                  Download our mobile app for faster access to government services on the go.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "File complaints with GPS location",
                  "Track application status",
                  "Receive push notifications",
                  "Offline form filling",
                  "Multi-language support"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={16} />
                    <span className="text-sm text-blue-100">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-black rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </div>
                <div className="flex-1 bg-black rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          FINAL CTA SECTION
      ======================================== */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Make a <span className="text-orange-300">Difference</span>?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of citizens in building a better, more transparent governance system. Your voice matters.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={ctaLink}>
              <button className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2">
                Get Started Now
                <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/report">
              <button className="px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                Report an Issue
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-blue-200">
            <div className="flex items-center gap-2">
              <Shield size={20} />
              <span className="text-sm font-semibold">Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={20} />
              <span className="text-sm font-semibold">Available in Hindi & English</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span className="text-sm font-semibold">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}