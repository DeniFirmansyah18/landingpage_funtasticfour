"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Server, Cpu, Database, Cloud, ShieldCheck } from "lucide-react";

interface NodeSpec {
  id: string;
  title: string;
  category: string;
  tech: string;
  desc: string;
  latency: string;
  status: string;
  icon: React.ElementType;
}

const nodeSpecs: Record<string, NodeSpec> = {
  frontend: {
    id: "frontend",
    title: "MODERN CLIENT ENGINE",
    category: "FRONTEND TIER",
    tech: "Next.js 16 (Turbopack), React 19, TypeScript, TailwindCSS, Framer Motion",
    desc: "Rendering sisi server (SSR) & static pre-rendering (SSG) berkecepatan tinggi dengan optimasi aset otomatis dan micro-interactions 60 FPS.",
    latency: "First Contentful Paint: < 0.4s",
    status: "bg-green-500",
    icon: Layers,
  },
  backend: {
    id: "backend",
    title: "SERVERLESS & API RUNTIME",
    category: "BACKEND TIER",
    tech: "Next.js Server Actions, Node.js, Express, Edge Functions, REST & GraphQL",
    desc: "Endpoint asinkron non-blocking dengan validasi skema type-safe Zod, auth JWT, dan penanganan rate limiting berlapis.",
    latency: "API Response Time: < 35ms",
    status: "bg-blue-500",
    icon: Server,
  },
  database: {
    id: "database",
    title: "HIGH-AVAILABILITY DATASTORE",
    category: "DATABASE & CACHE",
    tech: "Google Cloud Firestore, PostgreSQL, Supabase, Redis In-Memory Cache",
    desc: "Sinkronisasi data real-time, indexing teroptimasi, replikasi multi-region dengan zero-downtime automated backups.",
    latency: "Query Latency: < 15ms",
    status: "bg-yellow-400",
    icon: Database,
  },
  cloud: {
    id: "cloud",
    title: "GLOBAL EDGE INFRASTRUCTURE",
    category: "DEVOPS & DEPLOYMENT",
    tech: "Vercel Enterprise CDN, Cloudflare DNS & WAF, Docker Containers, Linux",
    desc: "Distribusi konten global di 300+ edge locations, SSL otomatis, proteksi DDoS, dan pipeline otomatis CI/CD GitHub Actions.",
    latency: "Global Edge TTFB: < 20ms",
    status: "bg-purple-500",
    icon: Cloud,
  },
  hardware: {
    id: "hardware",
    title: "HARDWARE & REPAIR DIAGNOSTICS",
    category: "LAB & REPAIR",
    tech: "Digital Oscilloscope, Thermal Imaging, Soldering Station, Component Testing",
    desc: "Analisis level mikroskopik untuk motherboard, penggantian komponen presisi, pembersihan thermal paste, dan stress-testing hardware.",
    latency: "Diagnostic Turnaround: 24h",
    status: "bg-emerald-400",
    icon: Cpu,
  },
  security: {
    id: "security",
    title: "ZERO TRUST SECURITY",
    category: "SECURITY & COMPLIANCE",
    tech: "CSP Headers, Sanitization, Secure Cookies, OWASP Top 10 Guardrails",
    desc: "Proteksi penuh terhadap XSS, SQLi, CSRF, enkripsi transit & rest data untuk melindungi privasi pengguna Anda.",
    latency: "Security Score: A+ (Mozilla Obs)",
    status: "bg-indigo-400",
    icon: ShieldCheck,
  },
};

export default function TechArchitecture() {
  const [selectedKey, setSelectedKey] = useState<string>("frontend");
  const activeSpec = nodeSpecs[selectedKey] || nodeSpecs.frontend;

  return (
    <section className="py-28 px-6 md:px-12 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <span className="pill-badge bg-black text-white mb-3">
              04/05 // ENGINEERING STACK
            </span>
            <h2 className="font-display text-4xl md:text-7xl uppercase text-black leading-none">
              Tech & Architecture
            </h2>
          </div>
          <p className="text-neutral-600 text-sm md:text-base max-w-md mt-4 md:mt-0 font-light">
            Standar arsitektur perangkat lunak dan lab hardware modern. Arahkan kursor atau klik modul untuk melihat spesifikasi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Architecture Nodes Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(nodeSpecs).map(([key, item]) => {
              const IconComp = item.icon;
              const isSelected = selectedKey === key;
              return (
                <div
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  onMouseEnter={() => setSelectedKey(key)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[160px] ${
                    isSelected
                      ? "bg-black text-white border-black shadow-xl scale-[1.02]"
                      : "bg-[#f9f9f9] text-black border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        isSelected ? "bg-neutral-800 text-neutral-300" : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {item.category}
                    </span>
                    <IconComp className={`w-5 h-5 ${isSelected ? "text-white" : "text-neutral-600"}`} />
                  </div>

                  <div>
                    <h3 className="font-display text-lg tracking-wide uppercase mb-1">
                      {item.title}
                    </h3>
                    <p className={`text-xs truncate font-mono ${isSelected ? "text-neutral-400" : "text-neutral-500"}`}>
                      {item.tech}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Specification Inspector Panel (Matching octopus.my.id Blueprint Spec) */}
          <div className="lg:col-span-5 bg-[#0d0d0d] text-white rounded-3xl p-7 border border-neutral-800 shadow-2xl sticky top-28">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                // ACTIVE SPECIFICATION INSPECTOR
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${activeSpec.status} animate-pulse`} />
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <p className="text-[10px] text-neutral-500 uppercase">&gt; MODULE NAME:</p>
                <p className="text-base font-bold text-white mt-0.5">{activeSpec.title}</p>
              </div>

              <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850">
                <span className="text-green-400 font-bold block mb-1">&gt; TEKNOLOGI INTI:</span>
                <span className="text-neutral-200 leading-relaxed block">{activeSpec.tech}</span>
              </div>

              <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850">
                <span className="text-yellow-400 font-bold block mb-1">&gt; FUNGSI ARSITEKTUR:</span>
                <p className="text-neutral-400 leading-relaxed font-sans text-xs">{activeSpec.desc}</p>
              </div>

              <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850">
                <span className="text-blue-400 font-bold block mb-1">&gt; TARGET PERFORMANCE:</span>
                <span className="text-white font-semibold">{activeSpec.latency}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 text-[10px] font-mono text-neutral-500 flex justify-between items-center">
              <span>ARCHITECTURE SPEC OK</span>
              <span className="text-neutral-400">NODE ID: {activeSpec.id.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
