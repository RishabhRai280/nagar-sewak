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
  Building2,
  Users,
  Award,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { Token, fetchCurrentUserProfile, UserProfile, UserStore } from "@/lib/api";

type SidebarRole = "citizen" | "admin" | "contractor";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<SidebarRole>("citizen");
  const [loading, setLoading] = useState(true);

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
    <aside className="w-72 bg-white/70 backdrop-blur-3xl border-r border-white/50 shadow-2xl sticky top-0 h-screen flex-col hidden lg:flex z-40 pt-28 transition-all duration-300">
      {/* Brand Header */}
      <div className="px-8 pb-8 mb-2 border-b border-white/40">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white shadow-blue-500/30">
                <ShieldCheck size={24} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">NagarSewak</span>
        </div>
        <div className="ml-1 mt-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {effectiveRole}
            </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-6 space-y-3 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const targetPath = item.href.split("#")[0];
          const isMapLink = targetPath === '/map';
          const isActive = isMapLink ? pathname === targetPath : pathname.startsWith(targetPath);

          return (
            <Link key={item.label} href={item.href} className="block">
                <div
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-white shadow-lg shadow-slate-200/50 text-blue-700 scale-105"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <item.icon size={20} className={`transition-colors z-10 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"}`} />
                  <span className="font-bold text-sm z-10">{item.label}</span>
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 rounded-r-full" />}
                </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/40 bg-white/30 backdrop-blur-md">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 px-4 py-4 w-full bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-2xl border border-white/60 hover:border-red-100 transition-all shadow-sm hover:shadow-md font-bold text-sm group"
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          Sign Out
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