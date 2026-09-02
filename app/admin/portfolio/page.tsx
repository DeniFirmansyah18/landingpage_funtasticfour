"use client";
import { useState, useRef } from "react";
import { useCollection, addItem, updateItem, deleteItem, seedCollection } from "@/lib/hooks/useFirestore";
import { defaultPortfolio } from "@/lib/cms-defaults";
import { toast } from "@/components/admin/Toast";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { PortfolioItem } from "@/lib/cms-types";
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Loader2,
  Image as ImageIcon,
  Upload,
  ExternalLink,
  Layers,
  Database,
  Globe,
  Smartphone,
  Palette,
  Wrench,
  Code2,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Palette,
  Wrench,
  Code2,
  Layers,
};

const ICON_OPTIONS = ["Globe", "Smartphone", "Palette", "Wrench", "Code2", "Layers"];
const CATEGORIES = ["Website", "Aplikasi", "Desain", "Reparasi", "Lainnya"];

const inputClass =
  "w-full rounded-xl px-4 py-3 text-xs font-mono text-white bg-[#0a0a0a] border border-neutral-800 focus:border-white focus:outline-none transition";

const empty = (order: number): Omit<PortfolioItem, "id"> => ({
  title: "",
  category: "Website",
  description: "",
  tech: [""],
  color: "#ffffff",
  bg: "rgba(255,255,255,0.08)",
  iconName: "Globe",
  cols: 1,
  order,
  imageUrl: "",
  images: [],
  projectUrl: "",
});

const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
        resolve(compressedDataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function PortfolioAdminPage() {
  const { data: items, loading } = useCollection<PortfolioItem>("portfolio");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<PortfolioItem, "id">>(empty(0));
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditId(null);
    setForm(empty(items.length));
    setNewImageUrl("");
    setShowForm(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditId(item.id);
    const existingImages =
      item.images && item.images.length > 0
        ? [...item.images]
        : item.imageUrl
        ? [item.imageUrl]
        : [];

    setForm({
      title: item.title || "",
      category: item.category || "Website",
      description: item.description || "",
      tech: item.tech && item.tech.length > 0 ? [...item.tech] : [""],
      color: item.color || "#ffffff",
      bg: item.bg || "rgba(255,255,255,0.08)",
      iconName: item.iconName || "Globe",
      cols: item.cols || 1,
      order: typeof item.order === "number" ? item.order : items.length,
      imageUrl: item.imageUrl || existingImages[0] || "",
      images: existingImages,
      projectUrl: item.projectUrl || "",
    });
    setNewImageUrl("");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast("Judul proyek wajib diisi.", "error");
      return;
    }
    setSaving(true);
    try {
      const cleanImages = (form.images || []).filter((img) => img && img.trim() !== "");
      const finalImageUrl = form.imageUrl || cleanImages[0] || "";
      const cleanTech = (form.tech || []).filter((t) => t && t.trim() !== "");
      const payload: Omit<PortfolioItem, "id"> = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl: finalImageUrl,
        images: cleanImages,
        tech: cleanTech.length > 0 ? cleanTech : ["Next.js", "Tailwind"],
        order: Number(form.order) || 0,
        projectUrl: form.projectUrl ? form.projectUrl.trim() : "",
      };

      if (editId) {
        await updateItem("portfolio", editId, payload);
        toast("Karya portfolio berhasil diperbarui!", "success");
      } else {
        await addItem("portfolio", payload);
        toast("Karya portfolio baru berhasil ditambahkan!", "success");
      }
      setShowForm(false);
    } catch (err: unknown) {
      console.error("[Firestore Error]", err);
      toast("Gagal menyimpan portfolio.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem("portfolio", deleteTarget);
      toast("Karya portfolio berhasil dihapus.", "success");
    } catch {
      toast("Gagal menghapus portfolio.", "error");
    }
    setDeleteTarget(null);
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      await seedCollection("portfolio", defaultPortfolio);
      toast("Data portfolio default berhasil dimuat ke Firestore!", "success");
    } catch (err) {
      console.error(err);
      toast("Gagal memuat portfolio default.", "error");
    } finally {
      setSeeding(false);
    }
  };

  const updateTech = (i: number, v: string) => {
    const t = [...form.tech];
    t[i] = v;
    setForm((p) => ({ ...p, tech: t }));
  };
  const addTech = () => setForm((p) => ({ ...p, tech: [...p.tech, ""] }));
  const removeTech = (i: number) =>
    setForm((p) => ({
      ...p,
      tech: p.tech.length > 1 ? p.tech.filter((_, idx) => idx !== i) : [""],
    }));

  const handleAddImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    const currentImages = form.images || [];
    const updatedImages = [...currentImages, url];
    setForm((p) => ({
      ...p,
      images: updatedImages,
      imageUrl: p.imageUrl ? p.imageUrl : url,
    }));
    setNewImageUrl("");
    toast("Foto ditambahkan ke galeri!", "success");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        const compressedBase64 = await compressImageFile(file);
        newUrls.push(compressedBase64);
      }

      if (newUrls.length > 0) {
        const currentImages = form.images || [];
        const updatedImages = [...currentImages, ...newUrls];
        setForm((p) => ({
          ...p,
          images: updatedImages,
          imageUrl: p.imageUrl ? p.imageUrl : updatedImages[0],
        }));
        toast(`${newUrls.length} foto berhasil diunggah!`, "success");
      }
    } catch (err) {
      console.error(err);
      toast("Gagal mengunggah foto.", "error");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.images || [];
    const removedUrl = currentImages[index];
    const updated = currentImages.filter((_, i) => i !== index);
    setForm((p) => ({
      ...p,
      images: updated,
      imageUrl: p.imageUrl === removedUrl ? updated[0] || "" : p.imageUrl,
    }));
    toast("Foto dihapus dari galeri.", "info");
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="pill-badge bg-white text-black mb-2">
            // MODULE 03
          </span>
          <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white leading-none">
            Karya / Portfolio
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
              {seeding ? "MEMUAT..." : "MUAT PORTFOLIO DEFAULT"}
            </button>
          )}
          <button
            onClick={openAdd}
            className="btn-brutalist-white text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> TAMBAH KARYA
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
            className="w-full max-w-2xl bg-[#0e0e0e] border border-neutral-800 rounded-3xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h2 className="font-display text-xl uppercase tracking-wide text-white">
                {editId ? "EDIT KARYA PORTFOLIO" : "TAMBAH KARYA BARU"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-neutral-500 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Judul Proyek *
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className={inputClass}
                    placeholder="E-Commerce Platform / Mobile App"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Kategori
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0e0e0e] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Deskripsi Proyek
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className={`${inputClass} resize-none font-sans`}
                  placeholder="Ceritakan fitur utama, tantangan, atau solusi teknis pada proyek ini..."
                />
              </div>

              {/* Gallery & Screenshots Section */}
              <div className="p-5 rounded-2xl bg-[#080808] border border-neutral-850 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-white" />
                    <label className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Foto & Galeri Screenshot Proyek
                    </label>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {(form.images || []).length} Foto
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Tempel URL Gambar (https://...)"
                    className="flex-1 bg-[#121212] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={!newImageUrl.trim()}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 disabled:opacity-40 transition cursor-pointer"
                  >
                    + URL
                  </button>

                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="portfolio-file-upload"
                    />
                    <label
                      htmlFor="portfolio-file-upload"
                      className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-black" />
                      )}
                      Upload Foto
                    </label>
                  </div>
                </div>

                {/* Thumbnails */}
                {(form.images || []).length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                    {form.images?.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden aspect-video bg-neutral-900 border border-neutral-800 group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/80 text-red-400 hover:text-white transition opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* URL & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Link Demo / Live URL (Opsional)
                  </label>
                  <input
                    value={form.projectUrl}
                    onChange={(e) => setForm((p) => ({ ...p, projectUrl: e.target.value }))}
                    className={inputClass}
                    placeholder="https://client-project.com"
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

              {/* Tech stack tags */}
              <div className="pt-2 border-t border-neutral-850">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Teknologi / Tech Stack
                  </label>
                  <button
                    type="button"
                    onClick={addTech}
                    className="text-xs text-white hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Stack
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tech.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-[#141414] border border-neutral-800 rounded-xl px-2.5 py-1">
                      <input
                        value={t}
                        onChange={(e) => updateTech(idx, e.target.value)}
                        className="bg-transparent text-xs font-mono text-white outline-none w-24"
                        placeholder="Next.js"
                      />
                      <button
                        type="button"
                        onClick={() => removeTech(idx)}
                        className="text-neutral-500 hover:text-red-400 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
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
                disabled={saving || uploadingImage}
                className="btn-brutalist-white flex-1 justify-center py-3 text-xs disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? "MENYIMPAN..." : "SIMPAN PROYEK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cards List */}
      {loading ? (
        <div className="flex items-center gap-2 text-neutral-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" /> MEMUAT KARYA DARI FIRESTORE...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
          <p className="text-neutral-400 text-sm">
            Belum ada karya portfolio di database Firestore (masih menggunakan fallback default di landing page).
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="btn-secondary text-xs"
            >
              <Database className="w-3.5 h-3.5 text-yellow-400" />
              {seeding ? "MEMUAT..." : "SINKRONKAN PORTFOLIO DEFAULT"}
            </button>
            <button onClick={openAdd} className="btn-brutalist-white text-xs">
              <Plus className="w-3.5 h-3.5" /> TAMBAH KARYA PERTAMA
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item, idx) => {
            const coverImg = item.imageUrl || (item.images && item.images[0]);
            const photoCount = (item.images || []).length || (item.imageUrl ? 1 : 0);
            const IconComponent = ICON_MAP[item.iconName] || Globe;

            return (
              <div
                key={item.id}
                className="bg-[#141414] border border-neutral-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-white transition-all duration-300 shadow-lg group"
              >
                {/* Visual Cover */}
                <div className="h-44 relative bg-black/40 flex items-center justify-center overflow-hidden">
                  {coverImg ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverImg}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white border border-neutral-800">
                      {item.category}
                    </span>
                    {photoCount > 1 && (
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-neutral-300 border border-neutral-800">
                        📷 {photoCount} Foto
                      </span>
                    )}
                  </div>

                  <span className="absolute top-3 right-3 text-[10px] font-mono text-neutral-400 bg-black/80 px-2 py-0.5 rounded border border-neutral-800">
                    ORDER: {item.order ?? idx}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-display text-2xl uppercase tracking-wide text-white mb-2">
                      {item.title}
                    </h2>
                    <p className="text-xs text-neutral-400 line-clamp-2 font-sans leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {item.tech?.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono uppercase bg-neutral-900 border border-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-4 border-t border-neutral-850">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex-1 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-bold uppercase text-neutral-300 hover:text-white hover:bg-neutral-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" /> EDIT
                    </button>
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
                        title="Lihat Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setDeleteTarget(item.id)}
                      className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-red-950/40 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Karya Portfolio"
        message="Apakah Anda yakin ingin menghapus karya portfolio ini secara permanen dari Firestore?"
        confirmLabel="HAPUS SEKARANG"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
