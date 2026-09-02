"use client";
import { useState, useEffect } from "react";

interface LogMessage {
  category: string;
  title: string;
  detail: string;
  status: string;
}

const logEntries: LogMessage[] = [
  {
    category: "// SYSTEM STATUS",
    title: "All Startup Systems Operational",
    detail: "Next.js 16 + React 19 + Firebase Active · Latency < 12ms",
    status: "bg-green-500",
  },
  {
    category: "// CURRENT CAPABILITY",
    title: "Full-Stack Web & Mobile Engine",
    detail: "High concurrency architecture, microservices, tailor-made UI/UX.",
    status: "bg-blue-500",
  },
  {
    category: "// AVAILABILITY",
    title: "Open for Q1/Q2 Projects",
    detail: "Fast turnaround sprint: MVP delivery in 7-14 business days.",
    status: "bg-yellow-400",
  },
  {
    category: "// QUALITY METRIC",
    title: "100% Production Grade",
    detail: "Zero tech debt guarantee with comprehensive QA and SLA support.",
    status: "bg-purple-500",
  },
];

export default function StickySystemLog() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      setVisible(true);
    }, 1200);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logEntries.length);
    }, 6000);

    return () => {
      clearTimeout(showTimeout);
      clearInterval(interval);
    };
  }, []);

  const current = logEntries[currentIndex];

  return (
    <aside
      aria-label="System status log"
      className={`fixed top-20 right-4 sm:right-8 z-40 w-72 max-w-[calc(100vw-2rem)] bg-[#0d0d0d] text-white border border-neutral-800 rounded-xl p-4 shadow-2xl transition-all duration-700 pointer-events-none hidden md:block ${
        visible ? "translate-x-0 opacity-90" : "translate-x-12 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between mb-2 border-b border-neutral-800 pb-2">
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest truncate mr-2">
          {current.category}
        </span>
        <span className={`w-2 h-2 rounded-full ${current.status} animate-pulse shrink-0`} />
      </div>
      <h3 className="text-xs font-bold text-white font-mono mb-1 leading-snug">
        {current.title}
      </h3>
      <p className="text-[10px] font-mono text-neutral-400 leading-relaxed">
        {current.detail}
      </p>
    </aside>
  );
}
