"use client";
import { useState } from "react";
import { useCollection, addItem, updateItem, deleteItem, seedCollection } from "@/lib/hooks/useFirestore";
import { defaultServices } from "@/lib/cms-defaults";
import { toast } from "@/components/admin/Toast";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { ServiceItem } from "@/lib/cms-types";
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Loader2,
  Check,
  Globe,
  Smartphone,
  Palette,
  Wrench,
  Code2,
  Layers,
  Zap,
  Star,
  Database,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Palette,
  Wrench,
  Code2,
  Layers,
  Zap,
  Star,
};

const ICON_OPTIONS = ["Globe", "Smartphone", "Palette", "Wrench", "Code2", "Layers", "Zap", "Star"];

const inputClass =
  "w-full rounded-xl px-4 py-3 text-xs font-mono text-white bg-[#0a0a0a] border border-neutral-800 focus:border-white focus:outline-none transition";

const emptyForm = (order: number): Omit<ServiceItem, "id"> => ({
  title: "",
  description: "",
  features: [""],
  color: "#ffffff",
  bgGlow: "rgba(255,255,255,0.08)",
  iconName: "Globe",
  badge: "",
  order,
});

export default function LayananAdminPage() {
  const { data: services, loading } = useCollection<ServiceItem>("services");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ServiceItem, "id">>(emptyForm(0));
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm(services.length));
    setShowForm(true);
  };

  const openEdit = (svc: ServiceItem) => {
    setEditId(svc.id);
    setForm({
      title: svc.title || "",
      description: svc.description || "",
      features: svc.features && svc.features.length > 0 ? [...svc.features] : [""],
      color: svc.color || "#ffffff",
      bgGlow: svc.bgGlow || "rgba(255,255,255,0.08)",
      iconName: svc.iconName || "Globe",
      badge: svc.badge || "",
      order: typeof svc.order === "number" ? svc.order : services.length,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast("Judul layanan wajib diisi.", "error");
      return;
    }
    setSaving(true);
    try {
      const cleanFeatures = form.features.map((f) => f.trim()).filter(Boolean);
      const payload: Omit<ServiceItem, "id"> = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        badge: form.badge.trim(),
        features: cleanFeatures.length > 0 ? cleanFeatures : ["Layanan profesional"],
        order: Number(form.order) || 0,
      };

      if (editId) {
        await updateItem("services", editId, payload);
        toast("Layanan berhasil diperbarui!", "success");
      } else {
        await addItem("services", payload);
        toast("Layanan baru berhasil ditambahkan!", "success");
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast("Gagal menyimpan layanan.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem("services", deleteTarget);
      toast("Layanan berhasil dihapus.", "success");
    } catch (err) {
      console.error(err);
      toast("Gagal menghapus layanan.", "error");
    }
    setDeleteTarget(null);
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      await seedCollection("services", defaultServices);
      toast("Data layanan default berhasil dimuat ke Firestore!", "success");
    } catch (err) {
      console.error(err);
      toast("Gagal memuat layanan default.", "error");
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
            // MODULE 02
          </span>
          <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white leading-none">
            Pilar Layanan
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {services.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="py-2.5 px-4 rounded-full bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 hover:text-white transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Database className="w-3.5 h-3.5 text-yellow-400" />
              {seeding ? "MEMUAT..." : "MUAT LAYANAN DEFAULT"}
            </button>
          )}
          <button
            onClick={openAdd}
            className="btn-brutalist-white text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> TAMBAH LAYANAN
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
                {editId ? "EDIT LAYANAN" : "TAMBAH LAYANAN BARU"}
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
                    Judul Layanan *
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className={inputClass}
                    placeholder="Pembuatan Website"
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

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Deskripsi Lengkap
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className={`${inputClass} resize-none font-sans`}
                  placeholder="Website profesional yang cepat, responsif, dan dioptimalkan untuk SEO..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Icon Layanan
                  </label>
                  <select
                    value={form.iconName}
                    onChange={(e) => setForm((p) => ({ ...p, iconName: e.target.value }))}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {ICON_OPTIONS.map((i) => (
                      <option key={i} value={i} className="bg-[#0e0e0e] text-white">
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Badge Khusus (Opsional)
                  </label>
                  <input
                    value={form.badge}
                    onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                    className={inputClass}
                    placeholder="ENTERPRISE / OPTIONAL"
                  />
                </div>
              </div>

              {/* Features List */}
              <div className="pt-2 border-t border-neutral-850">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Daftar Kapabilitas / Fitur
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
                {saving ? "MENYIMPAN..." : "SIMPAN LAYANAN"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services Cards List */}
      {loading ? (
        <div className="flex items-center gap-2 text-neutral-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" /> MEMUAT DATA LAYANAN DARI FIRESTORE...
        </div>
      ) : services.length === 0 ? (
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
          <p className="text-neutral-400 text-sm">
            Belum ada layanan di database Firestore (masih menggunakan fallback default di landing page).
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="btn-secondary text-xs"
            >
              <Database className="w-3.5 h-3.5 text-yellow-400" />
              {seeding ? "MEMUAT..." : "SINKRONKAN LAYANAN DEFAULT"}
            </button>
            <button onClick={openAdd} className="btn-brutalist-white text-xs">
              <Plus className="w-3.5 h-3.5" /> BUAT LAYANAN PERTAMA
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc, idx) => {
            const IconComponent = ICON_MAP[svc.iconName] || Globe;
            return (
              <div
                key={svc.id}
                className="bg-[#141414] border border-neutral-800 rounded-3xl p-7 flex flex-col justify-between hover:border-white transition-all duration-300 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      ORDER: {svc.order ?? idx}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl uppercase tracking-wide text-white mb-2">
                    {svc.title}
                  </h2>
                  <p className="text-xs text-neutral-400 line-clamp-3 mb-6 font-sans leading-relaxed">
                    {svc.description}
                  </p>

                  <div className="space-y-2 mb-6 border-t border-neutral-850 pt-4 text-xs font-sans">
                    {svc.features?.map((f, fi) => (
                      <div key={fi} className="flex items-start gap-2 text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-4 border-t border-neutral-800">
                  <button
                    onClick={() => openEdit(svc)}
                    className="flex-1 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-bold uppercase text-neutral-300 hover:text-white hover:bg-neutral-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" /> EDIT
                  </button>
                  <button
                    onClick={() => setDeleteTarget(svc.id)}
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-red-950/40 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Layanan"
        message="Apakah Anda yakin ingin menghapus layanan ini secara permanen dari Firestore?"
        confirmLabel="HAPUS SEKARANG"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
