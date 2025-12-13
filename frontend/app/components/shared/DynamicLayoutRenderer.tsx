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

  // Hide header ONLY on dashboard pages and Help pages (since Help uses Sidebar layout)
  const shouldHideHeader = isDashboardPage || pathname.includes("/help");

  // Hide footer on dashboard AND map pages
  const shouldHideFooter = isDashboardPage || isMapPage;

  return (
    <>
      {!shouldHideHeader && <Header />}

      {/* No padding for dashboard pages (they have their own layout with sidebar), map page (full-screen), or auth pages (full-screen) */}
      <main className="">
        {children}
      </main>

      {!shouldHideFooter && <Footer />}
    </>
  );
}
