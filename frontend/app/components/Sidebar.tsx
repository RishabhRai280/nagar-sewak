// frontend/app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  FileEdit,
  Map,
  Bell,
  User,
  LogOut,
  ClipboardList,
  Users,
  Award,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  Home,
  HelpCircle,
} from "lucide-react";
import { Token, fetchCurrentUserProfile, UserProfile, UserStore } from "@/lib/api";
import { useSidebar } from "@/app/contexts/SidebarContext";
import { useAccessibility } from "@/app/contexts/AccessibilityContext";
import { useLocale } from "next-intl";

type SidebarRole = "citizen" | "admin" | "contractor";

export default function Sidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, toggleCollapsed } = useSidebar();
  const [role, setRole] = useState<SidebarRole>("citizen");
  const [loading, setLoading] = useState(true);
  const [hash, setHash] = useState<string>("");
  const locale = useLocale();
  const { fontSize, setFontSize } = useAccessibility();

  useEffect(() => {
    const cached = UserStore.get();
    if (cached) {
      hydrateFromProfile(cached);
      setLoading(false);
      return;
    }

    if (!Token.get()) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const profile = await fetchCurrentUserProfile();
        hydrateFromProfile(profile);
      } catch (err) {
        console.error("Failed to load profile for sidebar", err);
        Token.remove();
        UserStore.remove();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const hydrateFromProfile = (profile: UserProfile) => {
    setRole(deriveRole(profile.roles));
  };

  const effectiveRole = role;

  const citizenNav = [
    { label: t('home'), href: "/", icon: Home },
    { label: t('dashboard'), href: "/dashboard/citizen", icon: LayoutDashboard },
    { label: t('myReports'), href: "/dashboard/citizen/reports", icon: ClipboardList },
    { label: t('history'), href: "/dashboard/citizen/history", icon: Bell },
    { label: t('profile'), href: "/dashboard/citizen/profile", icon: User },
    { label: t('analytics'), href: "/dashboard/citizen/analytics", icon: BarChart3 },
    { label: t('reportIssue'), href: "/report", icon: FileEdit },
    { label: t('liveMap'), href: "/map", icon: Map },
    { label: t('helpCenter'), href: "/help", icon: HelpCircle },
  ];

  const adminNav = [
    { label: t('home'), href: "/", icon: Home },
    { label: t('dashboard'), href: "/dashboard/admin", icon: LayoutDashboard },
    { label: t('projects'), href: "/dashboard/admin/projects", icon: BarChart3 },
    { label: t('tenders'), href: "/dashboard/admin/tenders", icon: ClipboardList },
    { label: t('complaints'), href: "/dashboard/admin/complaints", icon: Bell },
    { label: t('contractors'), href: "/dashboard/admin/contractors", icon: Users },
    { label: t('myReports'), href: "/dashboard/citizen/reports", icon: ClipboardList },
    { label: t('reportIssue'), href: "/report", icon: FileEdit },
    { label: t('liveMap'), href: "/map", icon: Map },
    { label: t('helpCenter'), href: "/help", icon: HelpCircle },
  ];

  const contractorNav = [
    { label: t('home'), href: "/", icon: Home },
    { label: t('dashboard'), href: "/dashboard/contractor", icon: LayoutDashboard },
    { label: t('projects'), href: "/dashboard/contractor/projects", icon: BarChart3 },
    { label: t('availableWorks'), href: "/dashboard/contractor/available", icon: FileEdit },
    { label: t('myReports'), href: "/dashboard/citizen/reports", icon: ClipboardList },
    { label: t('reportIssue'), href: "/report", icon: FileEdit },
    { label: t('liveMap'), href: "/map", icon: Map },
    { label: t('helpCenter'), href: "/help", icon: HelpCircle },
  ];

  const navItems =
    effectiveRole === "admin" ? adminNav :
      effectiveRole === "contractor" ? contractorNav :
        citizenNav;

  const scrollToHash = useCallback((hashValue: string) => {
    const id = hashValue.replace("#", "");
    const container = document.querySelector("[data-dashboard-scroll]") as HTMLElement | null;
    const el = document.getElementById(id);
    if (container && el) {
      const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 12;
      container.scrollTo({ top, behavior: "smooth" });
    }
  }, []);



  const handleLogout = () => {
    UserStore.remove();
    Token.remove();
    router.push("/login");
  };

  if (loading) {
    return (
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col animate-pulse shadow-lg pt-16 h-screen fixed inset-y-0 left-0 z-40">
        <div className="p-6">
          <div className="h-6 bg-slate-200 rounded w-20 mb-6" />
          <div className="space-y-3">
            <div className="h-10 bg-slate-200 rounded-lg" />
            <div className="h-10 bg-slate-200 rounded-lg" />
            <div className="h-10 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </aside>
    );
  }

  const switchLanguage = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|hi)/, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <>
      {/* Dashboard Government Header - Matching Main Site */}
      <div className="flex flex-col w-full fixed top-0 left-0 right-0 z-[100]">
        {/* Government Top Strip - Compact */}
        <div className="bg-slate-900 text-white border-b border-slate-700 py-1 px-4 lg:px-6 flex justify-between items-center text-[11px]">
          {/* Left: Government Identity */}
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide uppercase">Government of India</span>
            <span className="hidden md:inline h-3 w-[1px] bg-slate-600"></span>
            <span className="hidden md:inline opacity-80 text-[10px]">Ministry of Urban Affairs</span>
          </div>

          {/* Right: Controls + Role */}
          <div className="flex items-center gap-3">
            {/* Font Size */}
            <div className="hidden md:flex items-center gap-0.5 bg-slate-800/40 rounded px-1 py-0.5 border border-slate-700/50">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition ${fontSize === 'normal' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Normal"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition ${fontSize === 'large' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Large"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('extra-large')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition ${fontSize === 'extra-large' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Extra Large"
              >
                A+
              </button>
            </div>

            {/* Language */}
            <div className="flex items-center gap-0.5 bg-slate-800/40 rounded px-1 py-0.5 border border-slate-700/50">
              <button
                onClick={() => switchLanguage('en')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${locale === 'en' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => switchLanguage('hi')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${locale === 'hi' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                HI
              </button>
            </div>

            {/* Role Badge */}
            <div className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-semibold uppercase tracking-wide">
              {effectiveRole}
            </div>
          </div>
        </div>

        {/* Main Header - Compact */}
        <header className="w-full bg-white py-2 shadow-sm border-b border-slate-200">
          <div className="container mx-auto px-4 lg:px-6 flex justify-between items-center">
            {/* Logo Area */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex flex-col items-center justify-center pb-1">
                <Image
                  src="/images/ashoka-emblem.svg"
                  alt="Satyamev Jayate"
                  width={24}
                  height={36}
                  className="h-9 w-auto object-contain opacity-90"
                />
              </div>
              <div className="h-8 w-[1px] bg-slate-300"></div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 leading-tight">Nagar Sewak</span>
                <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">Citizen Engagement Platform</span>
              </div>
            </Link>

            {/* Right: User Profile */}
            <div className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded-lg transition-colors">
              <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center border border-blue-100">
                <User size={14} className="text-blue-700" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900">{t('userProfile')}</div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`${collapsed ? "w-16" : "w-64"} bg-[#1e3a8a] text-white fixed inset-y-0 left-0 flex-col hidden lg:flex z-40 shadow-xl transition-all duration-300 pt-[119px]`}>
        {/* Collapse Toggle - More prominent and always visible */}
        <div className="px-3 py-3 flex justify-end border-b border-white/10">
          <button
            onClick={toggleCollapsed}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 text-white hover:text-orange-300 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-orange-300/50 shadow-sm"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft size={18} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Menu Label */}
        {!collapsed && (
          <div className="px-6 py-1.5">
            <span className="text-[9px] font-bold text-blue-300 uppercase tracking-widest opacity-80">{t('mainMenu')}</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isMapLink = item.href === '/map';
            const isDashboardLink = item.href.includes("/dashboard/") && (item as any).section;
            const isActive = isMapLink
              ? pathname === item.href
              : isDashboardLink
                ? pathname === item.href && (hash === `#${(item as any).section}` || (!hash && (item as any).section === "overview"))
                : pathname === item.href;

            const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (isDashboardLink) {
                e.preventDefault();
                const targetUrl = `${item.href}#${(item as any).section}`;

                if (pathname === item.href) {
                  const itemHash = `#${(item as any).section}`;
                  setHash(itemHash);
                  window.history.pushState(null, '', targetUrl);
                  window.dispatchEvent(new HashChangeEvent('hashchange'));
                  setTimeout(() => scrollToHash(itemHash), 150);
                } else {
                  router.push(targetUrl);
                }
              }
            };

            return (
              <Link
                key={item.label}
                href={isDashboardLink ? `${item.href}#${(item as any).section}` : item.href}
                className="block"
                onClick={handleClick}
                scroll={false}
              >
                <div
                  className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-4"} py-2.5 mx-1 rounded-lg cursor-pointer transition-all duration-200 group relative overflow-hidden ${isActive
                    ? "bg-white/10 text-[#f97316] font-bold shadow-inner"
                    : "text-blue-100 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#f97316] rounded-r-full"></div>}
                  <div className={`${collapsed ? "w-full" : ""} flex items-center justify-center`}>
                    <item.icon size={18} className={`flex-shrink-0 transition-colors relative z-10 ${isActive ? "text-[#f97316]" : "text-blue-200 group-hover:text-white"}`} />
                  </div>
                  {!collapsed && <span className="text-sm tracking-wide relative z-10">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Gov Pattern Overlay Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

        {/* Footer Actions */}
        <div className="p-3 mt-auto border-t border-white/10 relative z-10 bg-[#172554]">
          <button
            onClick={handleLogout}
            className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-4"} py-2 w-full text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-sm group`}
          >
            <div className={`${collapsed ? "w-full" : ""} flex items-center justify-center`}>
              <LogOut size={16} className="flex-shrink-0 group-hover:-translate-x-1 transition-transform text-blue-300" />
            </div>
            {!collapsed && t('signOut')}
          </button>
        </div>
      </aside>
    </>
  );
}

function deriveRole(roles?: string[]): SidebarRole {
  if (!roles || roles.length === 0) return "citizen";
  if (roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")) return "admin";
  if (roles.includes("CONTRACTOR")) return "contractor";
  return "citizen";
}