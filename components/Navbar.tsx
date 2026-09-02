"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "TENTANG", href: "#about" },
  { label: "LAYANAN", href: "#layanan" },
  { label: "CARA KERJA", href: "#cara-kerja" },
  { label: "KARYA", href: "#portfolio" },
  { label: "HARGA", href: "#harga" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#f4f4f4]/90 backdrop-blur-md border-b border-neutral-300 py-4 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo Badge */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="bg-black text-white font-display px-2.5 py-1 text-sm tracking-wider group-hover:bg-neutral-800 transition">
              F4
            </div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
              FUNTASTICFOUR.STARTUP
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-10 text-xs font-mono font-semibold tracking-widest uppercase text-neutral-800">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="hover:text-black hover:underline underline-offset-8 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#kontak"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#kontak");
              }}
              className="border border-black rounded-full px-6 py-2 text-xs font-mono font-bold tracking-widest uppercase text-black hover:bg-black hover:text-white transition duration-300"
            >
              HIRE US
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-black hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black text-white flex flex-col justify-between p-8 transition-all duration-500 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center pt-2">
          <div className="bg-white text-black font-display px-2.5 py-1 text-sm tracking-wider">
            F4
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-white hover:opacity-70"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-6 my-auto">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="font-display text-4xl text-left text-neutral-300 hover:text-white transition"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-neutral-800 flex flex-col gap-4">
          <a
            href="#kontak"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#kontak");
            }}
            className="btn-brutalist-white w-full justify-center"
          >
            HUBUNGI KAMI
          </a>
          <p className="text-xs font-mono text-neutral-500 text-center">
            JAKARTA, IDN · AVAILABLE FOR NEW PROJECTS
          </p>
        </div>
      </div>
    </>
  );
}
