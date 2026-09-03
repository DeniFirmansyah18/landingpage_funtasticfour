"use client";
import { useState, useMemo } from "react";
import {
  useCollection,
  updateItem,
  deleteItem,
  addItem,
} from "@/lib/hooks/useFirestore";
import type { InvoiceDocument, InvoiceStatus } from "@/lib/cms-types";
import { formatRupiah } from "@/lib/invoice-utils";
import { toast } from "@/components/admin/Toast";
import ConfirmModal from "@/components/admin/ConfirmModal";
import InvoiceFormModal from "@/components/admin/invoice/InvoiceFormModal";
import InvoicePrintView from "@/components/admin/invoice/InvoicePrintView";
import {
  FileText,
  Plus,
  Search,
  Printer,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  User,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function AdminInvoicePage() {
  const { data: invoices, loading } = useCollection<InvoiceDocument>("invoices");

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceDocument | null>(null);

  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [printInvoice, setPrintInvoice] = useState<InvoiceDocument | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [seedingSample, setSeedingSample] = useState(false);

  // Financial calculations
  const stats = useMemo(() => {
    const totalCount = invoices.length;
    let unpaidCount = 0;
    let unpaidAmount = 0;
    let paidCount = 0;
    let paidAmount = 0;
    let draftOrCancelledCount = 0;

    invoices.forEach((inv) => {
      const amount = Number(inv.grandTotal) || 0;
      if (inv.status === "paid") {
        paidCount++;
        paidAmount += amount;
      } else if (inv.status === "unpaid") {
        unpaidCount++;
        unpaidAmount += amount;
      } else {
        draftOrCancelledCount++;
      }
    });

    return {
      totalCount,
      unpaidCount,
      unpaidAmount,
      paidCount,
      paidAmount,
      draftOrCancelledCount,
    };
  }, [invoices]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchStatus =
        selectedStatus === "all" ? true : inv.status === selectedStatus;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchStatus;

      const matchQuery =
        (inv.invoiceNumber || "").toLowerCase().includes(q) ||
        (inv.client?.name || "").toLowerCase().includes(q) ||
        (inv.client?.company || "").toLowerCase().includes(q) ||
        (inv.client?.email || "").toLowerCase().includes(q);

      return matchStatus && matchQuery;
    });
  }, [invoices, selectedStatus, searchQuery]);

  // Actions
  const handleOpenCreate = () => {
    setEditingInvoice(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (inv: InvoiceDocument) => {
    setEditingInvoice(inv);
    setIsFormOpen(true);
  };

  const handleOpenPrint = (inv: InvoiceDocument) => {
    setPrintInvoice(inv);
    setIsPrintOpen(true);
  };

  const handleToggleStatus = async (inv: InvoiceDocument) => {
    const nextStatus: InvoiceStatus = inv.status === "paid" ? "unpaid" : "paid";
    try {
      await updateItem("invoices", inv.id, { status: nextStatus });
      toast(
        `Status invoice #${inv.invoiceNumber} diubah menjadi: ${
          nextStatus === "paid" ? "LUNAS" : "BELUM BAYAR"
        }`,
        "success"
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast(`Gagal mengubah status: ${msg}`, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteItem("invoices", deleteTargetId);
      toast("Invoice berhasil dihapus.", "success");
      setDeleteTargetId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast(`Gagal menghapus: ${msg}`, "error");
    }
  };

  // Seed sample invoice for initial test convenience
  const handleCreateSampleInvoice = async () => {
    setSeedingSample(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

      const sample: Omit<InvoiceDocument, "id"> = {
        invoiceNumber: "INV/202609/001",
        issueDate: today,
        dueDate: dueDate,
        status: "unpaid",
        client: {
          name: "Budi Santoso",
          company: "PT Nusantara Media Digital",
          phone: "+62 812-3456-7890",
          email: "budi@nusantaradigital.id",
          address: "Menara Mandiri Lt. 14, Jl. Jend. Sudirman, Jakarta Selatan",
        },
        items: [
          {
            id: "sample-item-1",
            name: "Paket Professional - Website Development",
            description: "Pengembangan web application & CMS admin modern lengkap responsif, integrasi payment gateway dan SEO lanjutan.",
            type: "pricing",
            quantity: 1,
            unitPrice: 2999000,
            total: 2999000,
          },
          {
            id: "sample-item-2",
            name: "Layanan Desain Kreatif - Brand Identity",
            description: "Desain logo korporat, brand kit lengkap, dan aset social media pack.",
            type: "service",
            quantity: 1,
            unitPrice: 750000,
            total: 750000,
          },
        ],
        subtotal: 3749000,
        discountType: "percentage",
        discountValue: 10,
        discountAmount: 374900,
        taxRate: 11,
        taxAmount: 371151,
        grandTotal: 3745251,
        paymentInfo: {
          bankName: "Bank Central Asia (BCA)",
          accountNumber: "8410928312",
          accountHolder: "Funtastic Four Studio",
          notes: "Sertakan nomor invoice INV/202609/001 pada berita transfer.",
        },
        notes:
          "1. Pembayaran dilakukan secara transfer ke rekening BCA tertera.\n2. Garansi perbaikan bug & maintenance berlaku 6 bulan setelah serah terima proyek.\n3. Harap kirimkan bukti transfer melalui WhatsApp resmi Funtastic Four.",
      };

      await addItem("invoices", sample);
      toast("Contoh invoice penagihan berhasil ditambahkan!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast(`Gagal menambahkan contoh: ${msg}`, "error");
    } finally {
      setSeedingSample(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
              {"// MANAGEMENT"}
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-white mt-1">
            Invoice & Tagihan Klien
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Buat invoice manual produk & jasa, pantau status pembayaran, dan cetak dokumen resmi A4.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {invoices.length === 0 && (
            <button
              onClick={handleCreateSampleInvoice}
              disabled={seedingSample}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-xs font-mono text-neutral-300 hover:text-white hover:border-white transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{seedingSample ? "Membuat Contoh..." : "+ Contoh Invoice"}</span>
            </button>
          )}

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-neutral-200 transition cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Invoice Baru</span>
          </button>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoices */}
        <div className="p-5 bg-[#141414] border border-neutral-800 rounded-2xl flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
              Total Invoice
            </div>
            <div className="text-2xl font-black font-display text-white mt-1">
              {stats.totalCount}
            </div>
            <div className="text-[10px] font-mono text-neutral-500 mt-1">
              Seluruh transaksi tercatat
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
            <FileText className="w-5 h-5 text-neutral-300" />
          </div>
        </div>

        {/* Belum Bayar (Unpaid) */}
        <div className="p-5 bg-[#141414] border border-amber-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] text-amber-400 uppercase tracking-wider">
              Belum Lunas ({stats.unpaidCount})
            </div>
            <div className="text-lg font-black font-mono text-amber-300 mt-1 truncate max-w-[170px]">
              {formatRupiah(stats.unpaidAmount)}
            </div>
            <div className="text-[10px] font-mono text-neutral-500 mt-1">
              Menunggu pembayaran
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Lunas (Paid) */}
        <div className="p-5 bg-[#141414] border border-emerald-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] text-emerald-400 uppercase tracking-wider">
              Lunas / Paid ({stats.paidCount})
            </div>
            <div className="text-lg font-black font-mono text-emerald-300 mt-1 truncate max-w-[170px]">
              {formatRupiah(stats.paidAmount)}
            </div>
            <div className="text-[10px] font-mono text-neutral-500 mt-1">
              Kas masuk terealisasi
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Draft / Batal */}
        <div className="p-5 bg-[#141414] border border-neutral-800 rounded-2xl flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
              Draft / Batal
            </div>
            <div className="text-2xl font-black font-display text-neutral-300 mt-1">
              {stats.draftOrCancelledCount}
            </div>
            <div className="text-[10px] font-mono text-neutral-500 mt-1">
              Arsip & perencanaan
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toolbar: Filter & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-[#141414] border border-neutral-800 rounded-2xl">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor invoice, nama klien, perusahaan..."
            className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-white rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none transition"
          />
        </div>

        {/* Filter Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 font-mono text-xs">
          {[
            { id: "all", label: "Semua" },
            { id: "unpaid", label: "Belum Bayar" },
            { id: "paid", label: "Lunas" },
            { id: "draft", label: "Draft" },
            { id: "cancelled", label: "Batal" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                selectedStatus === tab.id
                  ? "bg-white text-black font-bold shadow"
                  : "bg-[#0a0a0a] text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List / Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 font-mono text-xs text-neutral-400">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
          <span>MEMUAT DATA INVOICE...</span>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="p-12 text-center bg-[#141414] border border-neutral-800 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              {searchQuery || selectedStatus !== "all"
                ? "Tidak Ada Invoice Yang Cocok"
                : "Belum Ada Data Invoice"}
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-1 max-w-sm mx-auto">
              {searchQuery || selectedStatus !== "all"
                ? "Silakan coba ubah kata kunci pencarian atau tab filter status Anda."
                : "Mulai buat tagihan invoice baru untuk klien Anda dengan memilih layanan atau produk."}
            </p>
          </div>
          <div>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-neutral-200 transition cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Invoice Pertama</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#141414] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/60 text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">No. Invoice & Tanggal</th>
                  <th className="py-3.5 px-4">Klien & Perusahaan</th>
                  <th className="py-3.5 px-4">Rincian Item</th>
                  <th className="py-3.5 px-4 text-right">Total Tagihan</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 font-mono text-xs text-neutral-200">
                {filteredInvoices.map((inv) => {
                  const isPaid = inv.status === "paid";
                  const isUnpaid = inv.status === "unpaid";
                  const isDraft = inv.status === "draft";
                  const isCancelled = inv.status === "cancelled";

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-neutral-900/40 transition group"
                    >
                      {/* No Invoice & Tanggal */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white font-mono">
                          {inv.invoiceNumber}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                          <span>Terbit: {inv.issueDate}</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          Tempo: {inv.dueDate}
                        </div>
                      </td>

                      {/* Klien & Perusahaan */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-neutral-100 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                          <span>{inv.client?.name || "Klien Anonim"}</span>
                        </div>
                        {inv.client?.company && (
                          <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3 text-neutral-500 flex-shrink-0" />
                            <span className="truncate max-w-[180px]">
                              {inv.client.company}
                            </span>
                          </div>
                        )}
                        {inv.client?.phone && (
                          <div className="text-[10px] text-neutral-500 mt-0.5">
                            WA: {inv.client.phone}
                          </div>
                        )}
                      </td>

                      {/* Item Preview */}
                      <td className="py-4 px-4">
                        <div className="text-neutral-300 font-semibold truncate max-w-[200px]">
                          {inv.items?.[0]?.name || "Item Layanan"}
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {inv.items?.length || 0} baris produk/jasa
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-bold text-white text-sm">
                          {formatRupiah(inv.grandTotal)}
                        </div>
                        {inv.discountAmount > 0 && (
                          <div className="text-[10px] text-emerald-400 mt-0.5">
                            Diskon: -{formatRupiah(inv.discountAmount)}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(inv)}
                          title="Klik untuk ubah status Belum Bayar <-> Lunas"
                          className="inline-block cursor-pointer transition transform active:scale-95"
                        >
                          {isPaid && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              Lunas
                            </span>
                          )}
                          {isUnpaid && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20">
                              <Clock className="w-3 h-3" />
                              Belum Bayar
                            </span>
                          )}
                          {isDraft && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-800 border border-neutral-700 text-neutral-400">
                              Draft
                            </span>
                          )}
                          {isCancelled && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400">
                              Batal
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Cetak */}
                          <button
                            onClick={() => handleOpenPrint(inv)}
                            className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white transition cursor-pointer"
                            title="Cetak / Pratinjau PDF A4"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(inv)}
                            className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white transition cursor-pointer"
                            title="Edit Data Invoice"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Hapus */}
                          <button
                            onClick={() => setDeleteTargetId(inv.id)}
                            className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-red-500 text-neutral-400 hover:text-red-400 transition cursor-pointer"
                            title="Hapus Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      {isFormOpen && (
        <InvoiceFormModal
          key={editingInvoice?.id || "create-invoice"}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {
            // Real-time listener updates table
          }}
          initialData={editingInvoice}
          existingCount={invoices.length}
        />
      )}

      {/* Print View Modal (A4 Print Preview) */}
      {isPrintOpen && printInvoice && (
        <InvoicePrintView
          isOpen={isPrintOpen}
          onClose={() => {
            setIsPrintOpen(false);
            setPrintInvoice(null);
          }}
          invoice={printInvoice}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!deleteTargetId}
        title="Hapus Dokumen Invoice"
        message="Apakah Anda yakin ingin menghapus invoice ini secara permanen dari database? Dokumen yang sudah dihapus tidak dapat dipulihkan."
        confirmLabel="Hapus Sekarang"
        danger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
