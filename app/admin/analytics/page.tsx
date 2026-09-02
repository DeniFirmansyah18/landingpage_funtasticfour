"use client";
import { useState } from "react";
import {
  BarChart3,
  Activity,
  MousePointerClick,
  MessageCircle,
  FileText,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";
import { toast } from "@/components/admin/Toast";

export default function AnalyticsAdminPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(GA_MEASUREMENT_ID);
    setCopied(true);
    toast("GA Measurement ID berhasil disalin!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleEvents = [
    {
      name: "page_view",
      type: "Automatic",
      desc: "Melacak setiap kali pengunjung membuka halaman website",
      icon: Activity,
    },
    {
      name: "click_whatsapp",
      type: "Custom Lead",
      desc: "Melacak pengunjung yang mengklik tombol WhatsApp CTA",
      icon: MessageCircle,
    },
    {
      name: "submit_contact_form",
      type: "Conversion",
      desc: "Melacak pengiriman formulir penawaran/konsultasi",
      icon: FileText,
    },
    {
      name: "click_cta",
      type: "Engagement",
      desc: "Melacak klik pada tombol CTA utama (Hero, Layanan, Harga)",
      icon: MousePointerClick,
    },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="pill-badge bg-white text-black mb-2">
            // MODULE 07
          </span>
          <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white leading-none">
            Google Analytics 4
          </h1>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                  ● ACTIVE TELEMETRY
                </span>
              </div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                GA4 MEASUREMENT STREAM
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Terhubung via environment variable <code className="text-white font-mono">NEXT_PUBLIC_GA_MEASUREMENT_ID</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="px-4 py-3 rounded-xl bg-black border border-neutral-800 font-mono text-xs font-bold text-white flex-1 md:flex-initial">
              {GA_MEASUREMENT_ID}
            </div>
            <button
              onClick={handleCopyId}
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
              title="Salin ID"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tracked Events Guide */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            // TELEMETRY EVENT PIPELINE
          </h2>
          <span className="text-[10px] text-neutral-500">4 EVENTS TRACKED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleEvents.map((ev) => {
            const Icon = ev.icon;
            return (
              <div
                key={ev.name}
                className="bg-[#141414] border border-neutral-800 rounded-2xl p-5 flex items-start gap-4 hover:border-neutral-600 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-white">{ev.name}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-md font-semibold text-neutral-400 bg-neutral-900 border border-neutral-800 uppercase">
                      {ev.type}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">{ev.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 rounded-3xl bg-[#0e0e0e] border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-xs">
          <Zap className="w-4 h-4 text-yellow-400" />
          // LIVE MONITORING GUIDE
        </div>
        <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-400 font-sans leading-relaxed">
          <li>Buka konsol <strong className="text-white">Google Analytics 4</strong> di <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="text-white underline inline-flex items-center gap-1 font-mono">analytics.google.com <ExternalLink className="w-3 h-3" /></a>.</li>
          <li>Pilih properti proyek dengan ID <code className="text-white font-mono bg-black px-1.5 py-0.5 rounded border border-neutral-800">{GA_MEASUREMENT_ID}</code>.</li>
          <li>Masuk ke menu <strong className="text-white">Reports &gt; Realtime</strong> untuk memantau pengunjung secara langsung.</li>
        </ol>
      </div>
    </div>
  );
}
