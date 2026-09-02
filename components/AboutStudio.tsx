"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function AboutStudio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const highlights = [
    "Full-Stack Development end-to-end tanpa pihak ketiga yang lambat.",
    "Desain antarmuka kelas dunia dengan micro-interactions responsif.",
    "Arsitektur serverless, database cepat, dan deployment aman (Vercel, Docker, Cloudflare).",
    "Dukungan purna jual, pemeliharaan berkelanjutan, dan garansi performa.",
  ];

  return (
    <section
      id="about"
      className="bg-[#111111] text-white py-28 md:py-36 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 grid-bg-dark opacity-30 pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-neutral-800 pb-12 mb-16">
          <div className="flex items-start gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-display text-[14vw] md:text-[8vw] leading-none m-0 p-0 tracking-tighter text-[#eaeaea]"
            >
              /ABOUT
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-2 md:mt-4"
            >
              <ArrowUpRight className="w-12 h-12 md:w-20 md:h-20 text-neutral-500 stroke-[1.5]" />
            </motion.div>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Statement */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 space-y-6"
          >
            <p className="text-2xl md:text-4xl leading-snug text-neutral-100 font-light">
              &ldquo;Kami percaya solusi digital terbaik bukan yang paling rumit,
              tetapi yang paling presisi dalam <span className="font-normal text-white underline decoration-neutral-600 underline-offset-8">menyelesaikan masalah bisnis nyata</span>.&rdquo;
            </p>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed pt-4 font-light">
              <strong>FuntasticFour</strong> adalah startup rekayasa perangkat lunak dan desain multidisiplin.
              Kami menggabungkan ketajaman rekayasa kode Full-Stack dengan kepekaan visual tingkat tinggi untuk menghasilkan
              produk digital yang tangguh, cepat, dan bernilai jual tinggi.
            </p>
            <div className="pt-4">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 border border-neutral-800 px-3.5 py-1.5 rounded-full bg-neutral-900/80">
                CURRENTLY SERVING: UMKM, STARTUPS & ENTERPRISE
              </span>
            </div>
          </motion.div>

          {/* Highlights & Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="lg:col-span-5 bg-[#0a0a0a] border border-neutral-800 p-8 rounded-2xl space-y-6 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                // KEUNGGULAN UTAMA
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="space-y-4">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">STANDAR: PRODUCTION-GRADE</span>
              <a
                href="#kontak"
                className="text-xs font-mono font-bold text-white uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                Mulai Kolaborasi &rarr;
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
