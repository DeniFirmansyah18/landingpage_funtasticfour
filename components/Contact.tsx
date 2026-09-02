"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useDocument } from "@/lib/hooks/useFirestore";
import { defaultContact } from "@/lib/cms-defaults";
import type { ContactData } from "@/lib/cms-types";
import { trackWhatsAppClick, trackFormSubmit } from "@/lib/gtag";
import { sanitizeText, sanitizeEmail } from "@/lib/sanitize";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });

  const { data: firestoreContact } = useDocument<ContactData>("site", "contact");
  const contact = firestoreContact || defaultContact;

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanName = sanitizeText(formData.name);
    const cleanEmail = sanitizeEmail(formData.email);
    const cleanService = sanitizeText(formData.service);
    const cleanBudget = sanitizeText(formData.budget);
    const cleanMessage = sanitizeText(formData.message);

    if (!cleanName || cleanName.length < 2) {
      setErrorMsg("Mohon masukkan nama yang valid.");
      return;
    }
    if (!cleanEmail) {
      setErrorMsg("Mohon masukkan alamat email yang valid.");
      return;
    }

    setLoading(true);
    trackFormSubmit(cleanService || "Umum");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="kontak" className="py-28 px-6 md:px-12 bg-[#0e0e0e] text-white relative overflow-hidden">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 grid-bg-dark opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-neutral-800 pb-8">
          <div>
            <span className="pill-badge bg-white text-black mb-3">
              // LET&apos;S TALK
            </span>
            <h2 className="font-display text-4xl md:text-8xl uppercase tracking-tight leading-none text-white">
              Get In Touch
            </h2>
          </div>
          <p className="text-neutral-400 text-sm md:text-base max-w-md mt-4 md:mt-0 font-light">
            Ceritakan ide, tantangan, atau proyek Anda. Kami akan merespons dengan konsultasi teknis dalam 1x24 jam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#141414] border border-neutral-800 p-8 rounded-3xl space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                // STARTUP DIRECT CONTACT
              </span>

              <div className="space-y-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">EMAIL</div>
                    <div className="text-sm font-bold text-white group-hover:underline truncate">
                      {contact.email}
                    </div>
                  </div>
                </a>

                <a
                  href={contact.whatsapp || `tel:${contact.phone}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">TELEPON / WA</div>
                    <div className="text-sm font-bold text-white group-hover:underline">
                      {contact.phone}
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">HEADQUARTERS</div>
                    <div className="text-sm font-bold text-white">
                      {contact.location}
                    </div>
                  </div>
                </div>
              </div>

              {contact.whatsapp && (
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackWhatsAppClick("contact_page")}
                  className="w-full bg-[#25d366] hover:bg-[#20bd5a] text-black font-mono font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-full flex items-center justify-center gap-2 transition duration-300 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" /> CHAT INSTAN VIA WHATSAPP
                </a>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-850 text-xs font-mono text-neutral-400 space-y-2">
              <div className="text-white font-bold">// OFFICE HOURS & RESPONSE</div>
              <div>Senin - Sabtu: 08:00 - 20:00 WIB</div>
              <div className="text-green-400">● Tim teknis siap menerima konsultasi langsung</div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-[#141414] border border-neutral-800 p-8 md:p-12 rounded-3xl">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display text-3xl uppercase text-white">
                  Pesan Terkirim
                </h4>
                <p className="text-neutral-400 text-sm max-w-md mx-auto font-light">
                  Terima kasih! Tim FuntasticFour akan meninjau pesan Anda dan segera menghubungi Anda via WhatsApp/Email dalam 1x24 jam.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-brutalist-white text-xs mt-6"
                >
                  KIRIM PESAN LAIN
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs font-mono text-red-300">
                    ⚠ {errorMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      NAMA LENGKAP *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Budi Pratama"
                      className="w-full bg-[#0a0a0a] border border-neutral-750 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:border-white focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      ALAMAT EMAIL *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="budi@company.com"
                      className="w-full bg-[#0a0a0a] border border-neutral-750 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:border-white focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      LAYANAN YANG DIBUTUHKAN
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-[#0a0a0a] border border-neutral-750 rounded-xl px-4 py-3.5 text-sm text-white focus:border-white focus:outline-none transition cursor-pointer"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="website">Pembuatan Website Modern</option>
                      <option value="aplikasi">Pengembangan Aplikasi Mobile</option>
                      <option value="desain">UI/UX Craft & Branding</option>
                      <option value="reparasi">Reparasi & Hardware Service</option>
                      <option value="konsultasi">Konsultasi Arsitektur Digital</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      ESTIMASI ANGGARAN
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full bg-[#0a0a0a] border border-neutral-750 rounded-xl px-4 py-3.5 text-sm text-white focus:border-white focus:outline-none transition cursor-pointer"
                    >
                      <option value="">Pilih Range Budget</option>
                      <option value="<2jt">&lt; Rp 2 Juta</option>
                      <option value="2-8jt">Rp 2 - 8 Juta</option>
                      <option value="8-25jt">Rp 8 - 25 Juta</option>
                      <option value=">25jt">&gt; Rp 25 Juta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    DETAIL BRIEF PROYEK *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Jelaskan kebutuhan, fitur utama, atau target waktu peluncuran..."
                    className="w-full bg-[#0a0a0a] border border-neutral-750 rounded-xl p-4 text-sm text-white placeholder-neutral-600 focus:border-white focus:outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-brutalist-white w-full justify-center py-4 text-xs font-mono font-bold disabled:opacity-50"
                >
                  {loading ? (
                    "MENGIRIM PESAN..."
                  ) : (
                    <>
                      KIRIM BRIEF SEKARANG
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
