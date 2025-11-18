// frontend/app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileEdit,
  Map,
  Star,
  Bell,
  User,
  LogOut,
  ClipboardList,
  Building2,
  Users,
  Award // Assuming Award for ratings/reviews summary
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  // FIX: Ensure role state includes 'contractor' type
  const [role, setRole] = useState<"citizen" | "admin" | "contractor">("citizen"); 
  const [name, setName] = useState("User");

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    let storedUser: any = {}; 

    if (storedUserString) {
      try {
        storedUser = JSON.parse(storedUserString);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
    
    if (storedUser?.roles && Array.isArray(storedUser.roles)) {
      if (storedUser.roles.includes("ADMIN") || storedUser.roles.includes("SUPER_ADMIN")) {
        setRole("admin");
      } else if (storedUser.roles.includes("CONTRACTOR")) {
        setRole("contractor"); 
      } else {
        setRole("citizen");
      }
    } else {
        setRole("citizen");
    }

    if (storedUser?.fullName) setName(storedUser.fullName);
    else if (storedUser?.username) setName(storedUser.username);
    else setName("Guest"); 
  }, []);
  
  const effectiveRole = role; 

  const citizenNav = [
    { label: "My Dashboard", href: "/dashboard/citizen", icon: LayoutDashboard },
    { label: "Report New Issue", href: "/report", icon: FileEdit },
    { label: "Live Map", href: "/map", icon: Map },
    { label: "Rate Projects", href: "/map", icon: Star }, 
    { label: "Notifications", href: "/citizen/notifications", icon: Bell }, 
    { label: "Profile", href: "/citizen/profile", icon: User }, 
  ];

  const adminNav = [
    { label: "Admin Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Live Map", href: "/map", icon: Map },
    { label: "Manage Complaints", href: "/admin/complaints", icon: ClipboardList }, 
    { label: "Manage Users", href: "/admin/users", icon: Users }, 
    { label: "Profile", href: "/dashboard/admin", icon: User },
  ];
  
  const contractorNav = [
    { label: "My Work Dashboard", href: "/dashboard/contractor", icon: LayoutDashboard },
    { label: "Reviews & Ratings", href: "/contractor/reviews", icon: Award }, 
    { label: "Assigned Projects", href: "/contractor/projects", icon: Building2 }, 
    { label: "Live Map", href: "/map", icon: Map },
    { label: "Profile", href: "/contractor/profile", icon: User }, 
  ];


  const navItems = 
    effectiveRole === "admin" ? adminNav :
    effectiveRole === "contractor" ? contractorNav :
    citizenNav;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shadow-xl sticky top-0 h-screen flex flex-col hidden lg:flex">
      {/* Brand & User Info */}
      <div className="p-6 border-b border-slate-200">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
          NagarSewak
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Logged in as: <span className="font-semibold text-slate-700 capitalize">{effectiveRole}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const uniqueKey = item.label;
          
          const isMapLink = item.href === '/map';
          
          const isActiveForLink = isMapLink 
            ? pathname === item.href 
            : pathname.startsWith(item.href);


          return (
            <motion.div
              key={uniqueKey} 
              whileHover={{ x: 5 }}
            >
              <Link href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition text-base font-medium ${
                    isActiveForLink
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}