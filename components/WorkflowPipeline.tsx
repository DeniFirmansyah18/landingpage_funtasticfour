"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Terminal, Code2, Rocket, ArrowRight } from "lucide-react";

interface PipelineStep {
  id: string;
  stepNum: string;
  title: string;
  subtitle: string;
  description: string;
  techs: string[];
  specs: {
    statusLabel: string;
    runtime: string;
    outputSummary: string;
    details: Array<{ label: string; value: string }>;
  };
}

const steps: PipelineStep[] = [
  {
    id: "discovery",
    stepNum: "01",
    title: "DISCOVERY & SPEC",
    subtitle: "Riset Kebutuhan & Desain Arsitektur",
    description:
      "Kami membedah tantangan bisnis, mendefinisikan requirement spesifik, merancang user journey, dan memetakan struktur database serta flow aplikasi.",
    techs: ["Figma", "User Journey", "System Architecture", "Wireframing"],
    specs: {
      statusLabel: "PHASE: 01 // ANALYSIS_OK",
      runtime: "Avg 2-3 Hari",
      outputSummary: "PRD & High-Fidelity Prototype Terverifikasi",
      details: [
        { label: "Target Deliverable", value: "Wireframe UI + Architecture Blueprint" },
        { label: "Validation Metric", value: "100% User Flow Alignment" },
        { label: "Tech Baseline", value: "Tailored to client business goals" },
      ],
    },
  },
  {
    id: "build",
    stepNum: "02",
    title: "ARCHITECTURE & BUILD",
    subtitle: "Rekayasa Kode Bersih & Integrasi Sistem",
    description:
      "Pengembangan Full-Stack intensif dengan kode terstruktur, modular, dan type-safe. Setiap komponen diuji dengan unit test dan integrasi API real-time.",
    techs: ["Next.js 16", "React 19", "TypeScript", "TailwindCSS", "Firebase/PostgreSQL"],
    specs: {
      statusLabel: "PHASE: 02 // BUILD_ACTIVE",
      runtime: "Avg 7-14 Hari",
      outputSummary: "Production-Ready Full Stack Application",
      details: [
        { label: "Code Standard", value: "ESLint, TypeScript Strict, Zero Debt" },
        { label: "Performance Score", value: "Lighthouse 95+ Score Target" },
        { label: "Security Layer", value: "JWT, Firestore Rules, SSL Encrypted" },
      ],
    },
  },
  {
    id: "launch",
    stepNum: "03",
    title: "LAUNCH & SLA SUPPORT",
    subtitle: "Deployment Global & Pemeliharaan 24/7",
    description:
      "Peluncuran ke production server berkecepatan tinggi dengan integrasi CDN, pemantauan error otomatis, analitik pengguna, serta dukungan pemeliharaan purna jual.",
    techs: ["Vercel CI/CD", "Docker", "Cloudflare", "Google Analytics", "SLA 99.9%"],
    specs: {
      statusLabel: "PHASE: 03 // DEPLOYED_LIVE",
      runtime: "Continuous Support",
      outputSummary: "Live Production with 24/7 Monitoring",
      details: [
        { label: "Infrastructure", value: "Edge Network + Multi-Region CDN" },
        { label: "Support Guarantee", value: "Dedicated WhatsApp & Fast Fix SLA" },
        { label: "Handover Docs", value: "Full Admin Guide & Source Code Access" },
      ],
    },
  },
];

export default function WorkflowPipeline() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const current = steps[activeTab];

  return (
    <section id="cara-kerja" className="py-24 px-6 md:px-12 bg-[#f4f4f4] relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="pill-badge bg-black text-white mb-3">
              02/05 // WORKFLOW ENGINE
            </span>
            <h2 className="font-display text-4xl md:text-7xl uppercase text-black leading-none">
              Interactive Pipeline
            </h2>
          </div>
          <p className="text-neutral-600 text-sm md:text-base max-w-md mt-4 md:mt-0 font-light">
            Alur kerja terstruktur dari konsep hingga deployment live. Klik tiap tahapan untuk melihat spesifikasi detail.
          </p>
        </div>

        {/* Main Interactive Container */}
        <div className="bg-[#0e0e0e] text-white rounded-3xl p-6 md:p-12 flex flex-col lg:flex-row gap-10 overflow-hidden relative shadow-2xl border border-neutral-800">
          {/* Left Column: Interactive Trigger List */}
          <div className="lg:w-1/2 flex flex-col justify-between z-10 space-y-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                PILIH TAHAPAN SPRINT // INTERACTIVE
              </p>

              <div className="space-y-4">
                {steps.map((step, idx) => {
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveTab(idx)}
                      className={`w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-start justify-between border cursor-pointer ${
                        isActive
                          ? "bg-neutral-900 border-neutral-700 text-white shadow-lg"
                          : "bg-transparent border-neutral-850 text-neutral-500 hover:text-neutral-300 hover:border-neutral-700"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                              isActive ? "bg-white text-black" : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {step.stepNum}
                          </span>
                          <span className="font-display text-xl md:text-2xl tracking-wide uppercase">
                            {step.title}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans pl-9">
                          {step.subtitle}
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 transition-transform ${
                          isActive ? "bg-white text-black translate-x-1" : "bg-neutral-800 text-neutral-600"
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom active description summary */}
            <div className="pt-4 border-t border-neutral-800">
              <p className="text-sm text-neutral-300 leading-relaxed font-sans min-h-[48px]">
                {current.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {current.techs.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                  >
                    #{tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Simulated Terminal & Output Console */}
          <div className="lg:w-1/2 bg-[#060606] rounded-2xl border border-neutral-800 p-6 flex flex-col justify-between relative min-h-[420px]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 font-mono text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-neutral-300 font-semibold">{current.specs.statusLabel}</span>
              </div>
              <span className="text-[10px] text-green-400 bg-green-950/60 border border-green-800/60 px-2 py-0.5 rounded">
                LIVE_SPEC
              </span>
            </div>

            {/* Terminal Body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="my-auto py-4 space-y-4 font-mono text-xs"
              >
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-2">
                  <div className="text-neutral-500 text-[10px] uppercase">// PRIMARY SPECIFICATION</div>
                  <div className="text-white text-sm font-bold">{current.specs.outputSummary}</div>
                  <div className="text-neutral-400 text-xs">Est. Timeline: <span className="text-yellow-400 font-semibold">{current.specs.runtime}</span></div>
                </div>

                <div className="space-y-2.5">
                  {current.specs.details.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className="bg-neutral-900/60 border border-neutral-800/80 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]"
                    >
                      <span className="text-neutral-400">&gt; {detail.label}:</span>
                      <span className="text-white font-medium">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Terminal Footer */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between font-mono text-[10px] text-neutral-500">
              <span>FUNTASTICFOUR PIPELINE RUNNER</span>
              <span className="text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                READY
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
