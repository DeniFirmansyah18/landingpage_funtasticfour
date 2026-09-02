"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useCollection } from "@/lib/hooks/useFirestore";
import { defaultFAQ } from "@/lib/cms-defaults";
import type { FAQItem } from "@/lib/cms-types";

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const { data: firestoreFAQ } = useCollection<FAQItem>("faq");
  const faqs = firestoreFAQ.length > 0 ? firestoreFAQ : defaultFAQ;

  return (
    <section id="faq" className="py-28 px-6 md:px-12 bg-[#f4f4f4] text-black">
      <div className="max-w-4xl mx-auto" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <span className="pill-badge bg-black text-white mb-3">
            // FREQUENTLY ASKED
          </span>
          <h2 className="font-display text-4xl md:text-7xl uppercase tracking-tight leading-none mb-4">
            Questions & Answers
          </h2>
          <p className="text-neutral-600 text-sm md:text-base max-w-lg mx-auto font-light">
            Informasi lengkap seputar alur kerja sama, garansi pemeliharaan, dan dukungan teknis kami.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.id || i}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white border-black shadow-md"
                    : "bg-[#f9f9f9] border-neutral-300 hover:border-neutral-500"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 pr-4">
                    <span className="font-mono text-xs text-neutral-400 font-bold">
                      0{i + 1}
                    </span>
                    <span className="font-sans font-bold text-base md:text-lg text-black">
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? "bg-black text-white" : "bg-neutral-200 text-black"
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-neutral-100 text-neutral-600 text-sm md:text-base leading-relaxed font-light">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
