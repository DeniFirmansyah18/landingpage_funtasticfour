"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ToastContainer from "@/components/admin/Toast";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin-login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-neutral-400">INITIALIZING CMS CONSOLE...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-neutral-100 font-sans">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0e0e0e]">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-white text-black font-display px-2 py-0.5 text-xs">F4</div>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
                CMS CONSOLE
              </span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
