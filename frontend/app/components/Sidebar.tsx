// frontend/app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import TopBar from "./shared/TopBar";

type SidebarRole = "citizen" | "admin" | "contractor";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, toggleCollapsed } = useSidebar();
  const [role, setRole] = useState<SidebarRole>("citizen");
  const [loading, setLoading] = useState(true);
  const [hash, setHash] = useState<string>("");

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
    { label: "Dashboard", href: "/dashboard/citizen", icon: LayoutDashboard },
    { label: "My Reports", href: "/dashboard/citizen/reports", icon: ClipboardList },
    { label: "History", href: "/dashboard/citizen/history", icon: Bell },
    { label: "Profile", href: "/dashboard/citizen/profile", icon: User },
    { label: "Analytics", href: "/dashboard/citizen/analytics", icon: BarChart3 },
    { label: "Report Issue", href: "/report", icon: FileEdit },
    { label: "Live Map", href: "/map", icon: Map },
  ];

  const adminNav = [
    { label: "Home", href: "/", icon: Home },
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Projects", href: "/dashboard/admin/projects", icon: BarChart3 },
    { label: "Tenders", href: "/dashboard/admin/tenders", icon: ClipboardList },
    { label: "Complaints", href: "/dashboard/admin/complaints", icon: Bell },
    { label: "Contractors", href: "/dashboard/admin/contractors", icon: Users },
    { label: "Live Map", href: "/map", icon: Map },
  ];

  const contractorNav = [
    { label: "Dashboard", href: "/dashboard/contractor", icon: LayoutDashboard },
    { label: "Projects", href: "/dashboard/contractor/projects", icon: BarChart3 },
    { label: "Available Works", href: "/dashboard/contractor/available", icon: FileEdit },
    { label: "Live Map", href: "/map", icon: Map },
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

  return (
    <>
      {/* Top Gov Strip (Fixed) */}
      <div className="fixed top-0 left-0 right-0 z-[60]">
        <TopBar />
      </div>

      {/* Main Header (Below TopBar) */}
      <header className="fixed top-[45px] md:top-[37px] left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleCollapsed}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-lg leading-none">Nagar Sewak</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Citizen Portal</span>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200">
            <div className="w-9 h-9 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold shadow-md">
              <User size={16} />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-bold text-slate-900">User Profile</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">{effectiveRole}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`${collapsed ? "w-16" : "w-64"} bg-[#1e3a8a] text-white fixed inset-y-0 left-0 flex-col hidden lg:flex z-40 shadow-xl transition-all duration-300 pt-[calc(45px+4rem)] md:pt-[calc(37px+4rem)]`}>
        {/* Collapse Toggle */}
        <div className="px-4 py-3 flex justify-end">
          <button
            onClick={toggleCollapsed}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-blue-200 hover:text-white"
          >
            <ChevronLeft size={16} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Menu Label */}
        {!collapsed && (
          <div className="px-6 py-2">
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest opacity-80">Main Menu</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
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
                  // Same page, just change hash
                  const itemHash = `#${(item as any).section}`;
                  setHash(itemHash);
                  window.history.pushState(null, '', targetUrl);
                  window.dispatchEvent(new HashChangeEvent('hashchange'));
                  setTimeout(() => scrollToHash(itemHash), 150);
                } else {
                  // Different page, navigate
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
                  className={`flex items-center ${collapsed ? "justify-center px-1" : "gap-3 px-4"} py-3 mx-1 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden ${isActive
                    ? "bg-white/10 text-[#f97316] font-bold shadow-inner"
                    : "text-blue-100 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#f97316] rounded-r-full"></div>}
                  <item.icon size={20} className={`transition-colors relative z-10 ${isActive ? "text-[#f97316]" : "text-blue-200 group-hover:text-white"}`} />
                  {!collapsed && <span className="text-sm tracking-wide relative z-10">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Gov Pattern Overlay Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

        {/* Footer Actions */}
        <div className="p-4 mt-auto border-t border-white/10 relative z-10 bg-[#172554]">
          <button
            onClick={handleLogout}
            className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-4"} py-2.5 w-full text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-sm group`}
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform text-blue-300" />
            {!collapsed && "Sign Out"}
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