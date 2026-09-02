"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useDocument } from "@/lib/hooks/useFirestore";
import { defaultHero } from "@/lib/cms-defaults";
import type { HeroData } from "@/lib/cms-types";
import { trackCTAClick } from "@/lib/gtag";

export default function Hero() {
  const { data } = useDocument<HeroData>("site", "hero");
  const hero = data || defaultHero;

  // Filter out any unwanted phrase
  const rawBadge = hero.badge || defaultHero.badge || "";
  const displayBadge =
    rawBadge &&
      !rawBadge.toLowerCase().includes("solusi terpadu") &&
      !rawBadge.toLowerCase().includes("solusi digital terpadu") &&
      !rawBadge.toLowerCase().includes("digital startup & engineering")
      ? rawBadge
      : "";

  const scrollToPortfolio = () => {
    const el = document.getElementById("portfolio");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToKontak = () => {
    const el = document.getElementById("kontak");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-28 pb-20 bg-[#f4f4f4] text-[#111111]">
      {/* Floating Meta Top Left */}
      <div className="absolute top-28 left-6 md:left-12 z-20 max-w-xs pointer-events-none">
        <p className="text-xs font-mono font-bold tracking-widest uppercase text-black">
          // BUSINESS PROBLEM SOLVER
        </p>
        <p className="text-neutral-500 text-xs font-mono mt-1">
          Full-Stack Web, Mobile Apps, UI/UX Craft & Hardware Repair
        </p>
      </div>

      {/* Giant Kinetic Marquee Background */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-full z-0 opacity-10 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="marquee-container">
          <div className="marquee-content text-[16vw] font-display leading-none text-black">
            FUNTASTICFOUR FULL-STACK DIGITAL STARTUP FAST TURNAROUND&nbsp;
          </div>
        </div>
        <div className="marquee-container mt-[-3vw]">
          <div className="marquee-content-reverse text-[16vw] font-display leading-none text-black">
            HIGH PERFORMANCE WEB MOBILE APPS UI/UX CRAFT ENGINEERING&nbsp;
          </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center mt-12">
        {/* Top Status Pill (Only if non-empty) */}
        {displayBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <span className="pill-badge bg-black text-white px-4 py-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              {displayBadge}
            </span>
          </motion.div>
        )}

        {/* Massive Anton Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl md:text-9xl leading-[0.9] tracking-tight uppercase text-black max-w-5xl mx-auto mb-6"
        >
          {hero.headline || "REKAYASA DIGITAL"}{" "}
          <span className="text-neutral-500 block sm:inline">
            {hero.headlineAccent || "BERKELAS DUNIA"}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-neutral-600 text-base md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          {hero.subtitle ||
            "Kami membangun website performa tinggi, aplikasi mobile modern, desain antarmuka presisi, dan perbaikan perangkat berstandar industri."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <button
            onClick={() => {
              trackCTAClick("hero_primary");
              scrollToKontak();
            }}
            className="btn-brutalist-black"
          >
            {hero.ctaPrimary || "KONSULTASI GRATIS"}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              trackCTAClick("hero_secondary");
              scrollToPortfolio();
            }}
            className="btn-outline-dark"
          >
            {hero.ctaSecondary || "LIHAT KARYA TERPILIH"}
          </button>
        </motion.div>

        {/* Centered Minimalist Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 md:gap-16 max-w-4xl mx-auto border-t border-neutral-300 pt-8"
        >
          {(hero.stats || defaultHero.stats).map((stat, i) => (
            <div key={stat.label + i} className="text-center min-w-[120px]">
              <div className="font-display text-3xl md:text-4xl text-black">
                {stat.value}
              </div>
              <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </header>
  );
}
