"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Settings2,
  FolderKanban,
  MessageSquare,
  Tag,
  HelpCircle,
  Phone,
  LogOut,
  ExternalLink,
  X,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Hero Banner", href: "/admin/hero", icon: Sparkles },
  { label: "Layanan", href: "/admin/layanan", icon: Settings2 },
  { label: "Portfolio", href: "/admin/portfolio", icon: FolderKanban },
  { label: "Harga", href: "/admin/harga", icon: Tag },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "Kontak", href: "/admin/kontak", icon: Phone },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-black text-white font-mono">
      {/* Brand Header */}
      <div className="flex items-center justify-between gap-3 px-6 py-6 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="bg-white text-black font-display px-2.5 py-1 text-sm tracking-wider">
            F4
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              CMS CONSOLE
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-neutral-400">FIRESTORE LIVE</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav list */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] text-neutral-500 uppercase tracking-widest">
          // NAVIGATION
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 border ${
                active
                  ? "bg-white text-black font-bold border-white shadow-md"
                  : "bg-transparent text-neutral-400 border-transparent hover:text-white hover:bg-neutral-900 hover:border-neutral-800"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-black" : "text-neutral-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Lihat Website
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 h-screen sticky top-0 border-r border-neutral-800">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <aside
            className="w-64 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
