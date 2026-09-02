"use client";

interface MarqueeTickerProps {
  items?: string[];
  reverse?: boolean;
}

const defaultItems = [
  "MEMECAHKAN MASALAH BISNIS",
  "FULL-STACK WEB & MOBILE",
  "UI/UX CRAFT & DESIGN SYSTEM",
  "CLOUD ARCHITECTURE & DEVOPS",
  "REPARASI & HARDWARE SERVICE",
  "HIGH-PERFORMANCE ENGINEERING",
];

export default function MarqueeTicker({
  items = defaultItems,
  reverse = false,
}: MarqueeTickerProps) {
  return (
    <div className="ticker-border overflow-hidden select-none" aria-hidden="true">
      <div className={reverse ? "marquee-content-reverse" : "marquee-content"}>
        {/* Repeat list 4 times for continuous smooth looping */}
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 px-4">
            <span className="text-sm md:text-base font-display tracking-widest uppercase text-white whitespace-nowrap">
              {item}
            </span>
            <span className="text-neutral-500 text-lg leading-none pb-0.5">✺</span>
          </div>
        ))}
      </div>
    </div>
  );
}
