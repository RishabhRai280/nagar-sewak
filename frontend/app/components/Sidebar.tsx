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
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleCollapsed}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">Nagar Sevak</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-slate-900">Admin User</div>
              <div className="text-xs text-slate-500 capitalize">{effectiveRole}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-64"} bg-white border-r border-slate-200 fixed inset-y-0 left-0 flex-col hidden lg:flex z-40 shadow-lg transition-all duration-300 pt-16`}>
        {/* Collapse Toggle */}
        <div className="px-4 py-2 border-b border-slate-200 flex justify-end">
          <button
            onClick={toggleCollapsed}
            className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
          >
            <ChevronLeft size={16} className={`text-slate-600 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

      {/* Menu Label */}
      {!collapsed && (
        <div className="px-6 py-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">MENU</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
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
                className={`flex items-center ${collapsed ? "justify-center px-3" : "gap-3 px-4"} py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <item.icon size={20} className={`transition-colors ${isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"}`} />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Support Section */}
      <div className="px-4 py-4 border-t border-slate-200">
        {!collapsed && <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block px-2">SUPPORT</span>}
        <div className="space-y-1">
          <Link href={`/help/${effectiveRole}-guide`} className={`flex items-center ${collapsed ? "justify-center px-3" : "gap-3 px-4"} py-3 mx-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 w-full text-left`}>
            <HelpCircle size={20} className="text-slate-500" />
            {!collapsed && <span className="font-medium text-sm">User Guide</span>}
          </Link>
          <button className={`flex items-center ${collapsed ? "justify-center px-3" : "gap-3 px-4"} py-3 mx-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 w-full text-left`}>
            <ShieldCheck size={20} className="text-slate-500" />
            {!collapsed && <span className="font-medium text-sm">Settings</span>}
          </button>
        </div>
      </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 mt-auto">
          <button
            onClick={handleLogout}
            className={`flex items-center ${collapsed ? "justify-center px-3" : "gap-3 px-4"} py-3 w-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg transition-all duration-200 font-medium text-sm group border border-slate-200 hover:border-red-200`}
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
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