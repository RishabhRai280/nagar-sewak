// frontend/app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileEdit,
  Map,
  Bell,
  User,
  LogOut,
  ClipboardList,
  Users,
  BarChart3,
} from "lucide-react";
import { Token, fetchCurrentUserProfile, UserProfile, UserStore } from "@/lib/api";

type SidebarRole = "citizen" | "admin" | "contractor";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<SidebarRole>("citizen");
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

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

  const hydrateFromProfile = (profile: UserProfile) => {
    setRole(deriveRole(profile.roles));
  };

  const effectiveRole = role; 

  const citizenNav = [
    { label: "Dashboard", href: "/dashboard/citizen", icon: LayoutDashboard },
    { label: "Report Issue", href: "/report", icon: FileEdit },
    { label: "Live Map", href: "/map", icon: Map },
    { label: "Notifications", href: "/citizen/notifications", icon: Bell }, 
    { label: "My Profile", href: "/citizen/profile", icon: User }, 
  ];

  const adminNav = [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Insights", href: "/dashboard/admin#insights", icon: BarChart3 },
    { label: "Complaints", href: "/dashboard/admin#complaints", icon: ClipboardList }, 
    { label: "Contractors", href: "/dashboard/admin#contractors", icon: Users }, 
    { label: "Live Map", href: "/map", icon: Map },
  ];
  
  // Contractor uses the dashboard itself mostly, but sidebar can persist if needed for layout consistency
  // Or, if you removed it in the page, this array is unused for them.
  const contractorNav = [
    { label: "Workspace", href: "/dashboard/contractor", icon: LayoutDashboard },
    { label: "Live Map", href: "/map", icon: Map },
  ];

  const navItems = 
    effectiveRole === "admin" ? adminNav :
    effectiveRole === "contractor" ? contractorNav :
    citizenNav;

  const handleLogout = () => {
    UserStore.remove();
    Token.remove();
    router.push("/login");
  };

  if (loading) {
    return (
      <aside className="w-72 bg-white/50 border-r border-white/40 hidden lg:flex flex-col animate-pulse backdrop-blur-xl pt-28 h-screen sticky top-0">
        <div className="p-8">
          <div className="h-8 bg-slate-200/50 rounded w-32 mb-6" />
          <div className="space-y-4">
             <div className="h-12 bg-slate-200/50 rounded-xl" />
             <div className="h-12 bg-slate-200/50 rounded-xl" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-white/70 backdrop-blur-3xl border-r border-white/50 shadow-2xl sticky top-0 min-h-screen flex-col hidden lg:flex z-40 transition-all duration-500 ease-in-out`}>
      {/* Collapse Toggle Arrow - At Top */}
      <div className="px-4 py-6 mt-20 border-b border-white/40 flex items-center justify-between">
        <div className={`flex items-center gap-2 transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
            {effectiveRole}
          </span>
        </div>
        
        {/* Arrow Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/50 rounded-lg transition-all duration-300 group"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg 
            className={`w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-all duration-500 ${collapsed ? 'rotate-180' : 'rotate-0'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const targetPath = item.href.split("#")[0];
          const isMapLink = targetPath === '/map';
          const isActive = isMapLink ? pathname === targetPath : pathname.startsWith(targetPath);

          return (
            <Link key={item.label} href={item.href} className="block group/link" title={collapsed ? item.label : undefined}>
                <div
                  className={`flex items-center ${collapsed ? 'justify-center px-3' : 'gap-3 px-4'} py-3.5 rounded-xl cursor-pointer transition-all duration-500 ease-in-out group relative overflow-hidden ${
                    isActive
                      ? "bg-white shadow-lg shadow-slate-200/50 text-blue-700"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <item.icon 
                    size={20} 
                    className={`transition-all duration-300 z-10 flex-shrink-0 ${
                      isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"
                    } ${collapsed ? 'scale-110' : 'scale-100'}`} 
                  />
                  <span 
                    className={`font-bold text-sm z-10 whitespace-nowrap transition-all duration-500 ${
                      collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />}
                  
                  {/* Tooltip on hover when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover/link:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap z-50 shadow-xl">
                      {item.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                    </div>
                  )}
                </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/40 bg-white/30 backdrop-blur-md">
        <button
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? 'justify-center px-3' : 'gap-3 px-4'} py-3 w-full bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl border border-white/60 hover:border-red-100 transition-all duration-500 shadow-sm hover:shadow-md font-bold text-sm group relative`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
          <span 
            className={`whitespace-nowrap transition-all duration-500 ${
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            }`}
          >
            Sign Out
          </span>
          
          {/* Tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap z-50 shadow-xl">
              Sign Out
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}

function deriveRole(roles?: string[]): SidebarRole {
  if (!roles || roles.length === 0) return "citizen";
  if (roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")) return "admin";
  if (roles.includes("CONTRACTOR")) return "contractor";
  return "citizen";
}