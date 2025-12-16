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
  const isReportPage = pathname.includes("/report");
  const isAuthPage =
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/forgot-password") ||
    pathname.includes("/reset-password");

  // Hide header on dashboard pages, Help pages, report page, and auth pages only
  const shouldHideHeader = isDashboardPage || isHelpPage || isReportPage || isAuthPage;

  // Hide footer on dashboard, map, report, and auth pages
  const shouldHideFooter = isDashboardPage || isMapPage || isReportPage || isAuthPage;

  return (
    <>
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="skip-link"
        tabIndex={1}
      >
        Skip to main content
      </a>

      {!shouldHideHeader && <Header />}

      {/* No padding for dashboard pages (they have their own layout with sidebar), map page (full-screen), or auth pages (full-screen) */}
      <main id="main-content" className="" tabIndex={-1}>
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
