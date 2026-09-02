"use client";
import { useState } from "react";
import { useCollection, addItem, updateItem, deleteItem, seedCollection } from "@/lib/hooks/useFirestore";
import { defaultFAQ } from "@/lib/cms-defaults";
import { toast } from "@/components/admin/Toast";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { FAQItem } from "@/lib/cms-types";
import { Plus, Trash2, Pencil, Save, X, Loader2, ChevronDown, Database } from "lucide-react";

const inputClass =
  "w-full rounded-xl px-4 py-3 text-xs font-mono text-white bg-[#0a0a0a] border border-neutral-800 focus:border-white focus:outline-none transition";

const empty = (order: number): Omit<FAQItem, "id"> => ({
  question: "",
  answer: "",
  order,
});

export default function FAQAdminPage() {
  const { data: items, loading } = useCollection<FAQItem>("faq");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<FAQItem, "id">>(empty(0));
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const openAdd = () => {
    setEditId(null);
    setForm(empty(items.length));
    setShowForm(true);
  };

  const openEdit = (item: FAQItem) => {
    setEditId(item.id);
    setForm({
      question: item.question || "",
      answer: item.answer || "",
      order: typeof item.order === "number" ? item.order : items.length,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.question.trim()) {
      toast("Pertanyaan FAQ wajib diisi.", "error");
      return;
    }
    setSaving(true);
    try {
      const payload: Omit<FAQItem, "id"> = {
        ...form,
        question: form.question.trim(),
        answer: form.answer.trim(),
        order: Number(form.order) || 0,
      };

      if (editId) {
        await updateItem("faq", editId, payload);
        toast("FAQ berhasil diperbarui!", "success");
      } else {
        await addItem("faq", payload);
        toast("FAQ baru berhasil ditambahkan!", "success");
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast("Gagal menyimpan FAQ.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem("faq", deleteTarget);
      toast("FAQ berhasil dihapus.", "success");
    } catch (err) {
      console.error(err);
      toast("Gagal menghapus FAQ.", "error");
    }
    setDeleteTarget(null);
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      await seedCollection("faq", defaultFAQ);
      toast("Data FAQ default berhasil dimuat ke Firestore!", "success");
    } catch (err) {
      console.error(err);
      toast("Gagal memuat FAQ default.", "error");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="pill-badge bg-white text-black mb-2">
            // MODULE 05
          </span>
          <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white leading-none">
            Pertanyaan FAQ
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
              {seeding ? "MEMUAT..." : "MUAT FAQ DEFAULT"}
            </button>
          )}
          <button
            onClick={openAdd}
            className="btn-brutalist-white text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> TAMBAH FAQ BARU
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
                {editId ? "EDIT PERTANYAAN FAQ" : "TAMBAH FAQ BARU"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-neutral-500 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Pertanyaan *
                  </label>
                  <input
                    value={form.question}
                    onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                    className={inputClass}
                    placeholder="Berapa lama estimasi pengerjaan website?"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Jawaban Lengkap
                </label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
                  rows={5}
                  className={`${inputClass} resize-none font-sans`}
                  placeholder="Tuliskan penjelasan dan rincian jawaban secara transparan..."
                />
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
                {saving ? "MENYIMPAN..." : "SIMPAN FAQ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accordion List */}
      {loading ? (
        <div className="flex items-center gap-2 text-neutral-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" /> MEMUAT FAQ DARI FIRESTORE...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
          <p className="text-neutral-400 text-sm">
            Belum ada data FAQ di database Firestore (masih menggunakan fallback default di landing page).
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="btn-secondary text-xs"
            >
              <Database className="w-3.5 h-3.5 text-yellow-400" />
              {seeding ? "MEMUAT..." : "SINKRONKAN FAQ DEFAULT"}
            </button>
            <button onClick={openAdd} className="btn-brutalist-white text-xs">
              <Plus className="w-3.5 h-3.5" /> BUAT FAQ PERTAMA
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#141414] border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition"
            >
              <div className="flex items-center gap-4 p-5">
                <span className="text-xs font-bold text-neutral-500 font-mono w-6 shrink-0">
                  0{idx + 1}
                </span>
                <button
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  className="flex-1 text-left text-sm font-bold text-white uppercase tracking-wide cursor-pointer hover:underline"
                >
                  {item.question}
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item.id)}
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        expanded === item.id ? "rotate-180 text-white" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {expanded === item.id && (
                <div className="px-6 pb-6 pt-2 border-t border-neutral-850">
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans pt-2">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Pertanyaan FAQ"
        message="Apakah Anda yakin ingin menghapus pertanyaan FAQ ini dari Firestore?"
        confirmLabel="HAPUS SEKARANG"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
