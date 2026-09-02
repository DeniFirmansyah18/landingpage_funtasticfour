"use client";
import { useState, useEffect } from "react";
import { useDocument, setDocument } from "@/lib/hooks/useFirestore";
import { toast } from "@/components/admin/Toast";
import { defaultHero } from "@/lib/cms-defaults";
import type { HeroData, HeroStat } from "@/lib/cms-types";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl px-4 py-3 text-xs font-mono text-white bg-[#0a0a0a] border border-neutral-800 focus:border-white focus:outline-none transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function HeroEditorPage() {
  const { data, loading } = useDocument<HeroData>("site", "hero");
  const [form, setForm] = useState<HeroData>(defaultHero);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const update = (field: keyof HeroData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const updateStat = (i: number, field: keyof HeroStat, value: string) =>
    setForm((f) => {
      const stats = [...f.stats];
      stats[i] = { ...stats[i], [field]: value };
      return { ...f, stats };
    });

  const addStat = () =>
    setForm((f) => ({ ...f, stats: [...f.stats, { value: "", label: "" }] }));

  const removeStat = (i: number) =>
    setForm((f) => ({ ...f, stats: f.stats.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDocument("site", "hero", form);
      toast("Hero section berhasil disimpan!", "success");
    } catch {
      toast("Gagal menyimpan. Coba lagi.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
        <Loader2 className="w-4 h-4 animate-spin" /> MEMUAT DATA HERO...
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="pill-badge bg-white text-black mb-2">
            // MODULE 01
          </span>
          <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white leading-none">
            Hero Editor
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-brutalist-white text-xs disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Main Text Content */}
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-neutral-850">
            // TEKS UTAMA & HEADLINE
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Headline Utama">
              <input
                value={form.headline}
                onChange={(e) => update("headline", e.target.value)}
                className={inputClass}
                placeholder="REKAYASA DIGITAL"
              />
            </Field>
            <Field label="Headline Aksen (Pudar)">
              <input
                value={form.headlineAccent}
                onChange={(e) => update("headlineAccent", e.target.value)}
                className={inputClass}
                placeholder="BERKELAS DUNIA"
              />
            </Field>
          </div>

          <Field label="Subtitle / Deskripsi Hero">
            <textarea
              value={form.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none font-sans text-sm`}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <Field label="Teks Tombol Utama">
              <input
                value={form.ctaPrimary}
                onChange={(e) => update("ctaPrimary", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Teks Tombol Sekunder">
              <input
                value={form.ctaSecondary}
                onChange={(e) => update("ctaSecondary", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-850">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              // METRIK STATISTIK (CENTERED STRIP)
            </h2>
            <button
              onClick={addStat}
              className="py-1.5 px-3 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Stat
            </button>
          </div>

          <div className="space-y-3">
            {form.stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  placeholder="200+"
                  className={`${inputClass} w-32`}
                />
                <input
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  placeholder="Proyek Selesai"
                  className={`${inputClass} flex-1`}
                />
                <button
                  onClick={() => removeStat(i)}
                  className="p-2.5 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
