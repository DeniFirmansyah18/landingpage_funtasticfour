"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Settings2,
  FolderKanban,
  MessageSquare,
  Tag,
  HelpCircle,
  Phone,
  Sparkles,
  Database,
  CheckCircle2,
  Loader2,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { useCollectionCount, seedCollection, seedDocument, getCollection } from "@/lib/hooks/useFirestore";
import {
  defaultHero,
  defaultContact,
  defaultServices,
  defaultPortfolio,
  defaultPricing,
  defaultFAQ,
} from "@/lib/cms-defaults";
import { toast } from "@/components/admin/Toast";
import { useAuth } from "@/lib/hooks/useAuth";

const sections = [
  { label: "Hero Banner", href: "/admin/hero", icon: Sparkles, collection: null, code: "01" },
  { label: "Pilar Layanan", href: "/admin/layanan", icon: Settings2, collection: "services", code: "02" },
  { label: "Karya / Portfolio", href: "/admin/portfolio", icon: FolderKanban, collection: "portfolio", code: "03" },
  { label: "Paket & Harga", href: "/admin/harga", icon: Tag, collection: "pricing", code: "04" },
  { label: "Invoice Tagihan", href: "/admin/invoice", icon: FileText, collection: "invoices", code: "05" },
  { label: "Pertanyaan FAQ", href: "/admin/faq", icon: HelpCircle, collection: "faq", code: "06" },
  { label: "Info Kontak", href: "/admin/kontak", icon: Phone, collection: null, code: "07" },
  { label: "Google Analytics", href: "/admin/analytics", icon: BarChart3, collection: null, code: "08" },
];

function StatCard({
  label,
  href,
  icon: Icon,
  collection,
  code,
}: {
  label: string;
  href: string;
  icon: React.ElementType;
  collection: string | null;
  code: string;
}) {
  const count = collection ? useCollectionCount(collection) : null;

  return (
    <Link
      href={href}
      className="bg-[#141414] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between group hover:border-white hover:bg-black transition-all duration-300 min-h-[160px]"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-mono text-xs text-neutral-500 group-hover:text-neutral-300 transition">
          /{code}
        </span>
      </div>

      <div>
        <div className="flex items-baseline justify-between mt-4">
          <div className="font-display text-3xl md:text-4xl text-white">
            {count !== null ? count : "ACTIVE"}
          </div>
          <div className="w-6 h-6 rounded-full border border-neutral-700 flex items-center justify-center group-hover:border-white transition">
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
          </div>
        </div>
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mt-1">
          {label}
        </div>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const existing = await getCollection<{ id: string }>("services");
      if (existing.length > 0) {
        toast("Data sudah ada! Hapus data lama terlebih dahulu jika ingin reset.", "warning");
        setSeeding(false);
        return;
      }

      await seedDocument("site", "hero", defaultHero);
      await seedDocument("site", "contact", defaultContact);
      await seedCollection("services", defaultServices);
      await seedCollection("portfolio", defaultPortfolio);
      await seedCollection("pricing", defaultPricing);
      await seedCollection("faq", defaultFAQ);

      setSeeded(true);
      toast("Data default berhasil disinkronkan ke Firestore! 🎉", "success");
    } catch (err) {
      toast("Gagal memuat data. Silakan periksa koneksi Firebase.", "error");
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-800 pb-8 gap-4">
        <div>
          <span className="pill-badge bg-white text-black mb-2">
            // CMS CONTROL CENTER
          </span>
          <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tight text-white leading-none">
            Dashboard
          </h1>
        </div>
        <div className="font-mono text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-xl">
          AUTHENTICATED: <span className="text-white font-bold">{user?.email}</span>
        </div>
      </div>

      {/* Database Quick Seed Banner */}
      <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase">
              Inisialisasi Firestore Data
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-0.5 max-w-lg">
              Muat struktur dan konten default awal ke Firebase Firestore agar semua section siap dikustomisasi.
            </p>
          </div>
        </div>

        <button
          onClick={handleSeed}
          disabled={seeding || seeded}
          className="btn-brutalist-white text-xs whitespace-nowrap disabled:opacity-50 shrink-0"
        >
          {seeding ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> MENGISI DATA...
            </>
          ) : seeded ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> DATA TERMUAT
            </>
          ) : (
            <>
              <Database className="w-3.5 h-3.5" /> MUAT DATA DEFAULT
            </>
          )}
        </button>
      </div>

      {/* Sections Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            // CMS SECTION MODULES
          </h2>
          <span className="text-[10px] font-mono text-neutral-500">8 MODULES ONLINE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sections.map((s) => (
            <StatCard key={s.href} {...s} />
          ))}
        </div>
      </div>

      {/* Technical Protocol Notes */}
      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-neutral-850 font-mono text-xs text-neutral-400 space-y-2">
        <div className="text-white font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400" />
          // CMS OPERATING GUIDELINES
        </div>
        <ul className="space-y-1 text-neutral-400 pl-6 list-disc text-[11px] font-sans">
          <li>Setiap pembaruan data otomatis tersinkronisasi secara instan ke landing page publik.</li>
          <li>Format foto pada galeri portofolio mendukung URL CDN langsung atau penyimpanan cloud.</li>
          <li>Gunakan fitur preview &quot;Lihat Website&quot; untuk memeriksa hasil render UI secara live.</li>
        </ul>
      </div>
    </div>
  );
}
