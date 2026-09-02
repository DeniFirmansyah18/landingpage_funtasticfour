"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Zap, Star, Building2, Crown, Rocket } from "lucide-react";
import { useCollection } from "@/lib/hooks/useFirestore";
import { defaultPricing } from "@/lib/cms-defaults";
import type { PricingPlan } from "@/lib/cms-types";

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Star,
  Building2,
  Crown,
  Rocket,
};

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { data: firestorePlans } = useCollection<PricingPlan>("pricing");
  const plans = firestorePlans.length > 0 ? firestorePlans : defaultPricing;

  const scrollToKontak = () => {
    const el = document.getElementById("kontak");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="harga" className="py-28 px-6 md:px-12 bg-[#f4f4f4] text-black">
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-neutral-300 pb-8">
          <div>
            <span className="pill-badge bg-black text-white mb-3">
              // PAKET & INVESTASI
            </span>
            <h2 className="font-display text-4xl md:text-7xl uppercase tracking-tight leading-none">
              Pricing Plans
            </h2>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const IconComponent = iconMap[plan.iconName] || Zap;
            const priceVal = plan.priceMonthly || plan.priceYearly || "Custom";

            return (
              <motion.div
                key={plan.id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-3xl p-8 md:p-10 flex flex-col justify-between bg-white text-black border border-neutral-300 hover:border-black transition-all duration-300 relative shadow-sm hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-neutral-100 text-black">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400 font-semibold uppercase">
                      TIER 0{i + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl uppercase tracking-wide mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed mb-6 font-light text-neutral-600">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8 pb-6 border-b border-neutral-200">
                    {priceVal === "Custom" ? (
                      <div className="font-display text-4xl uppercase">CUSTOM</div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-sm text-neutral-400">Rp</span>
                        <span className="font-display text-5xl">{priceVal}</span>
                        <span className="font-mono text-sm text-neutral-400">K</span>
                      </div>
                    )}
                    <div className="text-[11px] font-mono mt-1 text-neutral-500">
                      {priceVal === "Custom"
                        ? "Disesuaikan dengan skala kebutuhan proyek"
                        : "Paket lengkap siap pakai"}
                    </div>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-xs md:text-sm">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
                        <span className="text-neutral-700">{feat}</span>
                      </li>
                    ))}
                    {plan.notIncluded?.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-3 text-xs opacity-40 line-through"
                      >
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-neutral-400" />
                        <span className="text-neutral-400">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  onClick={scrollToKontak}
                  className="btn-brutalist-black w-full justify-center"
                >
                  {plan.cta || "PILIH PAKET INI"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
