"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp, Lock } from "lucide-react";
import { useDocument } from "@/lib/hooks/useFirestore";
import { defaultContact } from "@/lib/cms-defaults";
import type { ContactData } from "@/lib/cms-types";

// Social Icons
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconLinkedin = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const IconYoutube = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Footer() {
  const { data: firestoreContact } = useDocument<ContactData>("site", "contact");
  const contact = firestoreContact || defaultContact;
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNavClick = (href: string) => {
    if (href.startsWith("/")) return;
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6 md:px-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Massive Display Brand Typography */}
        <div className="border-b border-neutral-800 pb-12 mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <h2 className="font-display text-[12vw] sm:text-[10vw] leading-[0.8] tracking-tighter uppercase text-white select-none">
              FUNTASTICFOUR
            </h2>
            <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
              <span className="text-xs font-mono text-green-400 flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                OPEN FOR NEW COMMISSIONS
              </span>
              <span className="text-xs font-mono text-neutral-400">
                LOCAL TIME: {time || "08:00:00 WIB"} (JAKARTA)
              </span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16 font-mono text-xs">
          <div>
            <span className="text-neutral-500 uppercase tracking-widest block mb-4">
              // STARTUP
            </span>
            <p className="text-neutral-400 leading-relaxed font-sans text-sm">
              Startup rekayasa digital end-to-end berstandar enterprise untuk website modern, aplikasi mobile, dan service perangkat.
            </p>
          </div>

          <div>
            <span className="text-neutral-500 uppercase tracking-widest block mb-4">
              // NAVIGASI
            </span>
            <ul className="space-y-2.5 uppercase font-bold text-neutral-300">
              <li>
                <button onClick={() => handleNavClick("#about")} className="hover:text-white transition">
                  Tentang Startup
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("#layanan")} className="hover:text-white transition">
                  Layanan & Solusi
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("#portfolio")} className="hover:text-white transition">
                  Karya Terpilih
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("#harga")} className="hover:text-white transition">
                  Paket & Harga
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-neutral-500 uppercase tracking-widest block mb-4">
              // CONTACT & HUB
            </span>
            <div className="space-y-2 text-neutral-300">
              <div>{contact.email}</div>
              <div>{contact.phone}</div>
              <div className="text-neutral-500">{contact.location}</div>
            </div>
          </div>

          <div>
            <span className="text-neutral-500 uppercase tracking-widest block mb-4">
              // SOCIAL & ADMIN
            </span>
            <div className="flex gap-2.5 mb-4">
              {[
                { icon: IconInstagram, href: contact.instagram || "#" },
                { icon: IconX, href: contact.twitter || "#" },
                { icon: IconLinkedin, href: contact.linkedin || "#" },
                { icon: IconYoutube, href: contact.youtube || "#" },
              ].map(({ icon: IconComp, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition"
                >
                  <IconComp />
                </a>
              ))}
            </div>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition text-[11px]"
            >
              <Lock className="w-3 h-3" /> ADMIN PORTAL
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} FUNTASTICFOUR STARTUP. ALL RIGHTS RESERVED.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition cursor-pointer uppercase"
          >
            <span>BACK TO TOP</span>
            <div className="w-6 h-6 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <ArrowUp className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
