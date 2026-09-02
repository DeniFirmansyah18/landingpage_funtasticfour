"use client";
import { useState } from "react";
import { useCollection, addItem, updateItem, deleteItem, seedCollection } from "@/lib/hooks/useFirestore";
import { defaultPricing } from "@/lib/cms-defaults";
import { toast } from "@/components/admin/Toast";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { PricingPlan } from "@/lib/cms-types";
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Loader2,
  Star,
  Check,
  Zap,
  Building2,
  Crown,
  Rocket,
  Database,
} from "lucide-react";

const ICON_OPTIONS = [
  { name: "Zap", icon: Zap },
  { name: "Star", icon: Star },
  { name: "Building2", icon: Building2 },
  { name: "Crown", icon: Crown },
  { name: "Rocket", icon: Rocket },
];

const COLOR_PRESETS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ec4899", "#ffffff"];

const inputClass =
  "w-full rounded-xl px-4 py-3 text-xs font-mono text-white bg-[#0a0a0a] border border-neutral-800 focus:border-white focus:outline-none transition";

const empty = (order: number): Omit<PricingPlan, "id"> => ({
  name: "",
  iconName: "Zap",
  priceMonthly: "",
  priceYearly: "",
  color: "#6366f1",
  bgGlow: "rgba(99,102,241,0.1)",
  description: "",
  features: [""],
  notIncluded: [],
  cta: "Pilih Paket Ini",
  popular: false,
  order,
});

export default function HargaAdminPage() {
  const { data: items, loading } = useCollection<PricingPlan>("pricing");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<PricingPlan, "id">>(empty(0));
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const openAdd = () => {
    setEditId(null);
    setForm(empty(items.length));
    setShowForm(true);
  };

  const openEdit = (item: PricingPlan) => {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      iconName: item.iconName || "Zap",
      priceMonthly: item.priceMonthly || "",
      priceYearly: item.priceYearly || "",
      color: item.color || "#6366f1",
      bgGlow: item.bgGlow || "rgba(99,102,241,0.1)",
      description: item.description || "",
      features: item.features && item.features.length > 0 ? [...item.features] : [""],
      notIncluded: item.notIncluded ? [...item.notIncluded] : [],
      cta: item.cta || "Pilih Paket Ini",
      popular: Boolean(item.popular),
      order: typeof item.order === "number" ? item.order : items.length,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast("Nama paket wajib diisi.", "error");
      return;
    }
    setSaving(true);
    try {
      const cleanFeatures = form.features.map((f) => f.trim()).filter(Boolean);
      const payload: Omit<PricingPlan, "id"> = {
        ...form,
        name: form.name.trim(),
        priceMonthly: form.priceMonthly.trim(),
        priceYearly: form.priceYearly ? form.priceYearly.trim() : form.priceMonthly.trim(),
        description: form.description.trim(),
        cta: form.cta.trim() || "Pilih Paket Ini",
        features: cleanFeatures.length > 0 ? cleanFeatures : ["Fitur dasar"],
        order: Number(form.order) || 0,
      };

      if (editId) {
        await updateItem("pricing", editId, payload);
        toast("Paket harga berhasil diperbarui!", "success");
      } else {
        await addItem("pricing", payload);
        toast("Paket harga baru berhasil ditambahkan!", "success");
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast("Gagal menyimpan paket harga. Coba lagi.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem("pricing", deleteTarget);
      toast("Paket harga berhasil dihapus dari Firestore.", "success");
    } catch (err) {
      console.error(err);
      toast("Gagal menghapus paket harga.", "error");
    }
    setDeleteTarget(null);
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      await seedCollection("pricing", defaultPricing);
      toast("Data paket default berhasil dimuat ke Firestore!", "success");
    } catch (err) {
      console.error(err);
      toast("Gagal memuat paket default.", "error");
    } finally {
      setSeeding(false);
    }
  };

  const updateFeature = (i: number, v: string) => {
    const f = [...form.features];
    f[i] = v;
    setForm((p) => ({ ...p, features: f }));
  };

  const addFeature = () => setForm((p) => ({ ...p, features: [...p.features, ""] }));
  const removeFeature = (i: number) =>
    setForm((p) => ({
      ...p,
      features: p.features.length > 1 ? p.features.filter((_, idx) => idx !== i) : [""],
    }));

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="pill-badge bg-white text-black mb-2">
            // MODULE 05
          </span>
          <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white leading-none">
            Paket & Harga
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {items.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="py-2.5 px-4 rounded-full bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 hover:text-white transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Database className="w-3.5 h-3.5 text-yellow-400" />
              {seeding ? "MEMUAT..." : "MUAT PAKET DEFAULT"}
            </button>
          )}
          <button
            onClick={openAdd}
            className="btn-brutalist-white text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> TAMBAH PAKET BARU
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-xl bg-[#0e0e0e] border border-neutral-800 rounded-3xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h2 className="font-display text-xl uppercase tracking-wide text-white">
                {editId ? "EDIT PAKET HARGA" : "TAMBAH PAKET HARGA BARU"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-neutral-500 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Nama Paket *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className={inputClass}
                    placeholder="e.g. Starter / Custom"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Nomor Urut (Order)
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Harga Paket (K / Custom)
                  </label>
                  <input
                    value={form.priceMonthly}
                    onChange={(e) => setForm((p) => ({ ...p, priceMonthly: e.target.value }))}
                    className={inputClass}
                    placeholder="e.g. 999 atau Custom"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Icon Representasi
                  </label>
                  <select
                    value={form.iconName}
                    onChange={(e) => setForm((p) => ({ ...p, iconName: e.target.value }))}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.name} value={opt.name} className="bg-[#0e0e0e] text-white">
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Deskripsi Singkat Paket
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className={`${inputClass} resize-none font-sans`}
                  placeholder="Cocok untuk UMKM dan landing page cepat..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Teks Tombol CTA
                </label>
                <input
                  value={form.cta}
                  onChange={(e) => setForm((p) => ({ ...p, cta: e.target.value }))}
                  className={inputClass}
                  placeholder="PILIH PAKET INI"
                />
              </div>

              {/* Features List */}
              <div className="pt-2 border-t border-neutral-850">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Daftar Fitur Termasuk
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-xs text-white hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Fitur
                  </button>
                </div>
                <div className="space-y-2.5">
                  {form.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                      <input
                        value={feat}
                        onChange={(e) => updateFeature(idx, e.target.value)}
                        className={`${inputClass} flex-1`}
                        placeholder={`Fitur ke-${idx + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="p-2 text-neutral-500 hover:text-red-400 transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
              >
                BATAL
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-brutalist-white flex-1 justify-center py-3 text-xs disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? "MENYIMPAN..." : "SIMPAN PAKET"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Cards List */}
      {loading ? (
        <div className="flex items-center gap-2 text-neutral-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" /> MEMUAT DATA PAKET DARI FIRESTORE...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
          <p className="text-neutral-400 text-sm">
            Belum ada paket harga di database Firestore (masih menggunakan fallback default di landing page).
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="btn-secondary text-xs"
            >
              <Database className="w-3.5 h-3.5 text-yellow-400" />
              {seeding ? "MEMUAT..." : "SINKRONKAN PAKET DEFAULT"}
            </button>
            <button onClick={openAdd} className="btn-brutalist-white text-xs">
              <Plus className="w-3.5 h-3.5" /> BUAT PAKET PERTAMA
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#141414] border border-neutral-800 rounded-3xl p-7 flex flex-col justify-between hover:border-white transition-all duration-300 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
                    TIER 0{idx + 1}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    ORDER: {item.order ?? idx}
                  </span>
                </div>

                <h2 className="font-display text-2xl uppercase tracking-wide text-white mb-1">
                  {item.name}
                </h2>
                <div className="font-display text-3xl text-white mb-3">
                  {item.priceMonthly === "Custom"
                    ? "CUSTOM"
                    : `Rp ${item.priceMonthly}K`}
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2 mb-6 font-sans">
                  {item.description}
                </p>

                <div className="space-y-2 mb-6 border-t border-neutral-850 pt-4 text-xs font-sans">
                  {item.features?.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2 text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-bold uppercase text-neutral-300 hover:text-white hover:bg-neutral-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> EDIT
                </button>
                <button
                  onClick={() => setDeleteTarget(item.id)}
                  className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-red-950/40 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Paket Harga"
        message="Apakah Anda yakin ingin menghapus paket harga ini secara permanen dari Firestore?"
        confirmLabel="HAPUS SEKARANG"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
