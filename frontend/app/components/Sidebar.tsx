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
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<"citizen" | "admin">("citizen");
  const [name, setName] = useState("User");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.role) setRole(storedUser.role);
    if (storedUser?.fullName) setName(storedUser.fullName);
    else if (storedUser?.username) setName(storedUser.username);
  }, []);

  const citizenNav = [
    { label: "Dashboard", href: "/citizen/dashboard", icon: LayoutDashboard },
    { label: "Report Complaint", href: "/report", icon: FileEdit },
    { label: "Track on Map", href: "/map", icon: Map },
    { label: "Rate Services", href: "/citizen/rate", icon: Star },
    { label: "Notifications", href: "/citizen/notifications", icon: Bell },
    { label: "Profile", href: "/citizen/profile", icon: User },
  ];

  const adminNav = [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    {
      label: "Manage Complaints",
      href: "/dashboard/admin/complaints",
      icon: ClipboardList,
    },
    { label: "Projects", href: "/dashboard/admin/projects", icon: Building2 },
    { label: "Track on Map", href: "/dashboard/admin/map", icon: Map },
    {
      label: "Citizen Feedback",
      href: "/dashboard/admin/feedback",
      icon: Star,
    },
    {
      label: "Notifications",
      href: "/dashboard/admin/notifications",
      icon: Bell,
    },
    { label: "Profile", href: "/dashboard/admin/profile", icon: User },
  ];

  const navItems = role === "admin" ? adminNav : citizenNav;

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col border-r border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="font-semibold text-xl tracking-wide">Nagar Sewak</div>
        <div className="text-sm text-gray-400 mt-1">
          {name} • {role === "admin" ? "Admin" : "Citizen"}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
                pathname === item.href
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
