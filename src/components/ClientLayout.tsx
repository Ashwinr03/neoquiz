"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarBackground from "@/components/StarBackground";
import { Toaster } from "sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ❌ Hide footer on quiz routes
  const hideFooter = pathname.startsWith("/quiz");

  return (
    <>
      <StarBackground />
      <Navbar />

      {/* ✅ GLOBAL TOAST CONFIG */}
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          className:
            "mt-16 shadow-lg border border-border bg-background text-foreground",
        }}
      />

      {/* ✅ STABLE SCROLL CONTAINER */}
      <div className="min-h-screen pt-16 flex flex-col">
        <div className="flex-1">{children}</div>
        {!hideFooter && <Footer />}
      </div>
    </>
  );
}