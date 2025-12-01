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
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col animate-pulse pt-6 min-h-screen sticky top-0">
        <div className="p-4">
          <div className="h-6 bg-slate-200 rounded w-24 mb-4" />
          <div className="space-y-2">
             <div className="h-10 bg-slate-200 rounded" />
             <div className="h-10 bg-slate-200 rounded" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-slate-200 sticky top-0 min-h-screen flex-col hidden lg:flex transition-all duration-300`}>
      {/* Header */}
      <div className="px-4 py-3 mt-16 border-b border-slate-200 flex items-center justify-between">
        <span className={`text-xs font-semibold text-slate-500 uppercase ${collapsed ? 'hidden' : 'block'}`}>
          {effectiveRole}
        </span>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-slate-100 rounded"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg 
            className={`w-4 h-4 text-slate-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const targetPath = item.href.split("#")[0];
          const isMapLink = targetPath === '/map';
          const isActive = isMapLink ? pathname === targetPath : pathname.startsWith(targetPath);

          return (
            <Link key={item.label} href={item.href} title={collapsed ? item.label : undefined}>
                <div
                  className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-lg transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-2 px-3'} py-2.5 w-full text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
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