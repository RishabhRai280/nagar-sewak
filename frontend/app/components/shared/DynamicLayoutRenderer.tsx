"use client";

import { usePathname } from "@/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function DynamicLayoutRenderer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMapPage = pathname === "/map";
  const isDashboardPage = pathname.includes("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Hide header/footer on map, dashboard, and auth pages
  const shouldHideHeaderFooter = isMapPage || isDashboardPage || isAuthPage;

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}

      {/* No padding for dashboard pages (they have their own layout with sidebar), map page (full-screen), or auth pages (full-screen) */}
      <main className={shouldHideHeaderFooter ? "" : ""}>
        {children}
      </main>

      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}
