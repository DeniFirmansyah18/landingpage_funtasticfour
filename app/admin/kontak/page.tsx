"use client";
import { useState, useEffect } from "react";
import { useDocument, setDocument } from "@/lib/hooks/useFirestore";
import { toast } from "@/components/admin/Toast";
import { defaultContact } from "@/lib/cms-defaults";
import type { ContactData } from "@/lib/cms-types";
import { Save, Loader2, Mail, Phone, MapPin, MessageCircle, Globe } from "lucide-react";

const inputClass =
  "w-full rounded-xl px-4 py-3 text-xs font-mono text-white bg-[#0a0a0a] border border-neutral-800 focus:border-white focus:outline-none transition";

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 font-mono">
        <Icon className="w-3.5 h-3.5 text-neutral-400" /> {label}
      </label>
      {children}
    </div>
  );
}

export default function KontakAdminPage() {
  const { data, loading } = useDocument<ContactData>("site", "contact");
  const [form, setForm] = useState<ContactData>(defaultContact);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const update = (field: keyof ContactData, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDocument("site", "contact", form);
      toast("Info kontak berhasil disimpan ke Firestore!", "success");
    } catch {
      toast("Gagal menyimpan info kontak.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
        <Loader2 className="w-4 h-4 animate-spin" /> MEMUAT INFO KONTAK...
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="pill-badge bg-white text-black mb-2">
            // MODULE 06
          </span>
          <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white leading-none">
            Info Kontak & Hub
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-brutalist-white text-xs disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? "MENYIMPAN..." : "SIMPAN KONTAK"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Core Direct Channels */}
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-neutral-850">
            // DIRECT COMMUNICATION CHANNELS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Email Resmi" icon={Mail}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
                placeholder="hello@funtasticfour.id"
              />
            </Field>
            <Field label="Nomor Telepon" icon={Phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="+62 812 3456 7890"
              />
            </Field>
          </div>

          <Field label="Lokasi Kantor / Headquarters" icon={MapPin}>
            <input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className={inputClass}
              placeholder="Jakarta, Indonesia"
            />
          </Field>

          <Field label="WhatsApp Direct URL" icon={MessageCircle}>
            <input
              value={form.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              className={inputClass}
              placeholder="https://wa.me/6281234567890"
            />
          </Field>
        </div>

        {/* Social Links */}
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-neutral-850">
            // SOCIAL NETWORKS & PLATFORMS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {([
              { field: "instagram" as const, label: "Instagram Profile URL" },
              { field: "twitter" as const, label: "Twitter / X Profile URL" },
              { field: "linkedin" as const, label: "LinkedIn Company URL" },
              { field: "youtube" as const, label: "YouTube Channel URL" },
            ] as const).map(({ field, label }) => (
              <Field key={field} label={label} icon={Globe}>
                <input
                  value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </Field>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 font-sans">
            💡 Isi dengan tautan lengkap (https://...) atau tanda pagar (#) jika profil belum tersedia.
          </p>
        </div>
      </div>
    </div>
  );
}
