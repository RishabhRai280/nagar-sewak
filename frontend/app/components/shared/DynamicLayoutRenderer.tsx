"use client";

import { usePathname } from "@/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function DynamicLayoutRenderer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  const isMapPage = pathname === "/map";
  const isDashboardPage = pathname.includes("/dashboard");
  const isHelpPage = pathname.includes("/help");

  // Hide header ONLY on dashboard pages and Help pages (since Help uses Sidebar layout)
  const shouldHideHeader = isDashboardPage || isHelpPage;

  // Hide footer on dashboard AND map pages
  const shouldHideFooter = isDashboardPage || isMapPage;

  return (
    <>
      {!shouldHideHeader && <Header />}

      {/* No padding for dashboard pages (they have their own layout with sidebar), map page (full-screen), or auth pages (full-screen) */}
      <main className="">
        {children}
      </main>

      {!shouldHideFooter && (
        <div className={`transition-all duration-300 ${isHelpPage ? (collapsed ? 'ml-16' : 'ml-64') : ''}`}>
          <Footer />
        </div>
      )}
    </>
  );
}
