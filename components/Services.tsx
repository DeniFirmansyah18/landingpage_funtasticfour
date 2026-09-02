"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Globe,
  Smartphone,
  Palette,
  Wrench,
  Code2,
  Layers,
  Zap,
  Star,
  ArrowRight,
  Check,
} from "lucide-react";
import { useCollection } from "@/lib/hooks/useFirestore";
import { defaultServices } from "@/lib/cms-defaults";
import type { ServiceItem } from "@/lib/cms-types";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Palette,
  Wrench,
  Code2,
  Layers,
  Zap,
  Star,
};

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: firestoreServices } = useCollection<ServiceItem>("services");

  const services = firestoreServices.length > 0 ? firestoreServices : defaultServices;

  const scrollToKontak = () => {
    const el = document.getElementById("kontak");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="layanan" className="py-28 px-6 md:px-12 bg-white text-black">
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-neutral-200 pb-8">
          <div>
            <span className="pill-badge bg-black text-white mb-3">
              03/05 // PILAR LAYANAN
            </span>
            <h2 className="font-display text-4xl md:text-7xl uppercase tracking-tight leading-none">
              Services & Expertise
            </h2>
          </div>
          <p className="text-neutral-600 text-sm md:text-base max-w-md mt-4 md:mt-0 font-light">
            4 pilar layanan utama yang dirancang untuk memberikan dampak nyata dan akselerasi bisnis Anda.
          </p>
        </div>

        {/* Services Grid (Brutalist Editorial Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Globe;
            const stepNumber = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#f8f8f8] border border-neutral-300 rounded-3xl p-8 md:p-10 flex flex-col justify-between group hover:border-black hover:bg-white hover:shadow-2xl transition-all duration-300 relative"
              >
                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-neutral-300 group-hover:text-black transition-colors">
                      /{stepNumber}
                    </span>
                  </div>

                  {/* Title & Badge */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-display text-2xl md:text-3xl uppercase tracking-wide">
                      {service.title}
                    </h3>
                    {service.badge && (
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-neutral-200 px-2.5 py-0.5 rounded-full text-neutral-800">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-8 font-light">
                    {service.description}
                  </p>

                  {/* Features with checkmark */}
                  <div className="space-y-3 mb-8 border-t border-neutral-200 pt-6">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3">
                        <span className="text-green-600 font-bold text-sm">✔</span>
                        <span className="text-xs md:text-sm text-neutral-800 font-medium font-sans">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consultation link */}
                <button
                  onClick={scrollToKontak}
                  className="w-full pt-4 border-t border-neutral-200 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-black group-hover:underline cursor-pointer"
                >
                  <span>KONSULTASIKAN PROYEK INI</span>
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Big Circular "Get In Touch" Action Banner (Inspired by octopus.my.id) */}
        <div className="mt-16 bg-neutral-900 text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
              // READY TO ELEVATE YOUR TECH?
            </p>
            <h3 className="font-display text-2xl md:text-4xl uppercase">
              Konsultasikan Visi & Roadmap Bisnis Anda
            </h3>
            <p className="text-neutral-400 text-sm mt-2 font-light">
              Dapatkan proposal teknis, estimasi timeline, dan blueprint arsitektur tanpa biaya komitmen.
            </p>
          </div>

          <button
            onClick={scrollToKontak}
            className="btn-brutalist-white whitespace-nowrap px-8 py-4 shrink-0"
          >
            HUBUNGI KAMI SEKARANG
          </button>
        </div>
      </div>
    </section>
  );
}
