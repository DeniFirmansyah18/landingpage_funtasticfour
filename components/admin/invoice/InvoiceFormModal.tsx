"use client";
import { useState, useEffect } from "react";
import type {
  InvoiceDocument,
  InvoiceItem,
  InvoiceStatus,
  ServiceItem,
  PricingPlan,
} from "@/lib/cms-types";
import {
  formatRupiah,
  generateInvoiceNumber,
  parsePriceStringToNumber,
  calculateInvoiceTotals,
  defaultInvoicePaymentInfo,
  defaultInvoiceNotes,
} from "@/lib/invoice-utils";
import {
  useCollection,
  addItem,
  updateItem,
} from "@/lib/hooks/useFirestore";
import { defaultServices, defaultPricing } from "@/lib/cms-defaults";
import { toast } from "@/components/admin/Toast";
import {
  X,
  Plus,
  Trash2,
  Save,
  Loader2,
  Package,
  Wrench,
  Percent,
  Banknote,
  ChevronDown,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (invoice: InvoiceDocument) => void;
  initialData?: InvoiceDocument | null;
  existingCount?: number;
}

const inputClass =
  "w-full rounded-xl px-4 py-2.5 text-xs font-mono text-white bg-[#0a0a0a] border border-neutral-800 focus:border-white focus:outline-none transition";

export default function InvoiceFormModal({
  isOpen,
  onClose,
  onSaved,
  initialData,
  existingCount = 0,
}: InvoiceFormModalProps) {
  const { data: dbServices } = useCollection<ServiceItem>("services");
  const { data: dbPricing } = useCollection<PricingPlan>("pricing");

  const availableServices = dbServices.length > 0 ? dbServices : defaultServices;
  const availablePricing = dbPricing.length > 0 ? dbPricing : defaultPricing;

  // Form states
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<InvoiceStatus>("unpaid");

  // Client states
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  // Items state
  const [items, setItems] = useState<InvoiceItem[]>([]);

  // Calculation states
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);

  // Payment info & notes
  const [paymentInfo, setPaymentInfo] = useState(defaultInvoicePaymentInfo);
  const [notes, setNotes] = useState(defaultInvoiceNotes);

  const [saving, setSaving] = useState(false);
  const [showPricingPicker, setShowPricingPicker] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);

  // Initialize or reset form
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setInvoiceNumber(initialData.invoiceNumber || "");
      setIssueDate(initialData.issueDate || "");
      setDueDate(initialData.dueDate || "");
      setStatus(initialData.status || "unpaid");

      setClientName(initialData.client?.name || "");
      setClientCompany(initialData.client?.company || "");
      setClientPhone(initialData.client?.phone || "");
      setClientEmail(initialData.client?.email || "");
      setClientAddress(initialData.client?.address || "");

      setItems(initialData.items && initialData.items.length > 0 ? [...initialData.items] : []);
      setDiscountType(initialData.discountType || "percentage");
      setDiscountValue(initialData.discountValue || 0);
      setTaxRate(initialData.taxRate || 0);

      setPaymentInfo(initialData.paymentInfo || defaultInvoicePaymentInfo);
      setNotes(initialData.notes || defaultInvoiceNotes);
    } else {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      setInvoiceNumber(generateInvoiceNumber(existingCount, today));
      setIssueDate(today.toISOString().split("T")[0]);
      setDueDate(nextWeek.toISOString().split("T")[0]);
      setStatus("unpaid");

      setClientName("");
      setClientCompany("");
      setClientPhone("");
      setClientEmail("");
      setClientAddress("");

      setItems([
        {
          id: "item-1",
          name: "",
          description: "",
          type: "custom",
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ]);

      setDiscountType("percentage");
      setDiscountValue(0);
      setTaxRate(0);
      setPaymentInfo(defaultInvoicePaymentInfo);
      setNotes(defaultInvoiceNotes);
    }
  }, [isOpen, initialData, existingCount]);

  if (!isOpen) return null;

  // Real-time calculation
  const totals = calculateInvoiceTotals(items, discountType, discountValue, taxRate);

  // Handlers for Items
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      const target = { ...next[index], [field]: value };

      if (field === "quantity" || field === "unitPrice") {
        const qty = field === "quantity" ? Number(value) || 0 : target.quantity;
        const price = field === "unitPrice" ? Number(value) || 0 : target.unitPrice;
        target.total = qty * price;
      }

      next[index] = target;
      return next;
    });
  };

  const handleAddItem = (type: "custom" = "custom") => {
    const newItem: InvoiceItem = {
      id: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      name: "",
      description: "",
      type,
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleAddFromPricing = (plan: PricingPlan) => {
    const priceNum = parsePriceStringToNumber(plan.priceMonthly);
    const newItem: InvoiceItem = {
      id: "prc-" + plan.id + "-" + Date.now(),
      name: `Paket ${plan.name}`,
      description: `${plan.description}\nTermasuk: ${plan.features.slice(0, 3).join(", ")}`,
      type: "pricing",
      quantity: 1,
      unitPrice: priceNum,
      total: priceNum,
    };
    setItems((prev) => [...prev, newItem]);
    setShowPricingPicker(false);
    toast(`Paket "${plan.name}" berhasil ditambahkan ke rincian invoice.`, "success");
  };

  const handleAddFromService = (svc: ServiceItem) => {
    const newItem: InvoiceItem = {
      id: "svc-" + svc.id + "-" + Date.now(),
      name: `Layanan ${svc.title}`,
      description: svc.description,
      type: "service",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems((prev) => [...prev, newItem]);
    setShowServicePicker(false);
    toast(`Layanan "${svc.title}" berhasil ditambahkan. Silakan atur nominal biaya.`, "success");
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      toast("Invoice minimal harus memiliki 1 baris item.", "warning");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceNumber.trim()) {
      toast("Nomor Invoice wajib diisi.", "error");
      return;
    }
    if (!clientName.trim()) {
      toast("Nama Klien wajib diisi.", "error");
      return;
    }
    if (items.length === 0 || !items.some((it) => it.name.trim())) {
      toast("Harap isi setidaknya satu item produk/jasa.", "error");
      return;
    }

    setSaving(true);
    try {
      const cleanItems = items.map((it) => ({
        id: it.id,
        name: it.name.trim() || "Item Layanan",
        description: it.description?.trim() || "",
        type: it.type,
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
      }));

      const finalTotals = calculateInvoiceTotals(cleanItems, discountType, discountValue, taxRate);

      const payload: Omit<InvoiceDocument, "id"> = {
        invoiceNumber: invoiceNumber.trim(),
        issueDate: issueDate || new Date().toISOString().split("T")[0],
        dueDate: dueDate || new Date().toISOString().split("T")[0],
        status,
        client: {
          name: clientName.trim(),
          company: clientCompany.trim(),
          phone: clientPhone.trim(),
          email: clientEmail.trim(),
          address: clientAddress.trim(),
        },
        items: cleanItems,
        subtotal: finalTotals.subtotal,
        discountType,
        discountValue: Number(discountValue) || 0,
        discountAmount: finalTotals.discountAmount,
        taxRate: Number(taxRate) || 0,
        taxAmount: finalTotals.taxAmount,
        grandTotal: finalTotals.grandTotal,
        notes: notes.trim(),
        paymentInfo: {
          bankName: paymentInfo.bankName.trim(),
          accountNumber: paymentInfo.accountNumber.trim(),
          accountHolder: paymentInfo.accountHolder.trim(),
          notes: paymentInfo.notes?.trim() || "",
        },
      };

      if (initialData?.id) {
        await updateItem("invoices", initialData.id, payload);
        toast("Invoice berhasil diperbarui!", "success");
        onSaved({ ...payload, id: initialData.id });
      } else {
        const newId = await addItem("invoices", payload);
        toast("Invoice baru berhasil dibuat & disimpan ke database!", "success");
        onSaved({ ...payload, id: newId });
      }

      onClose();
    } catch (err: any) {
      console.error("Error saving invoice:", err);
      toast(`Gagal menyimpan invoice: ${err.message || "Terjadi kesalahan"}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#141414] border border-neutral-800 text-white rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center font-mono font-bold text-xs text-white">
              INV
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                {initialData ? "Edit Invoice Tagihan" : "Buat Invoice Manual Baru"}
              </h2>
              <p className="text-[11px] font-mono text-neutral-400">
                Pilih paket/layanan CMS atau masukkan item produk & jasa custom
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 font-mono text-xs">
          {/* Section 1: Dokumen & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5">
                Nomor Invoice *
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV/202609/001"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5">
                Tanggal Terbit
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5">
                Jatuh Tempo
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5">
                Status Pembayaran
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className={inputClass}
              >
                <option value="unpaid">Menunggu Pembayaran (Unpaid)</option>
                <option value="paid">Lunas (Paid)</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>

          {/* Section 2: Data Klien (Bill To) */}
          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-neutral-800/80 space-y-4">
            <div className="flex items-center gap-2 text-neutral-300 font-bold uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-2">
              <User className="w-4 h-4 text-white" />
              INFORMASI KLIEN / PENERIMA TAGIHAN
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  Nama Klien / PIC *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Budi Santoso"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  Perusahaan / Instansi (Opsional)
                </label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="e.g. PT Maju Bersama Digital"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  WhatsApp / No. Telepon
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="e.g. 08123456789"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  Email Klien
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="e.g. client@example.com"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  Alamat Penagihan
                </label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="e.g. Jl. Sudirman No. 45, Jakarta Selatan"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Rincian Produk & Jasa */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                RINCIAN ITEM PRODUK & JASA ({items.length})
              </div>

              {/* Quick Pickers Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Dropdown Dari Paket Harga */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPricingPicker(!showPricingPicker);
                      setShowServicePicker(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-white text-neutral-200 hover:text-white transition cursor-pointer text-[11px]"
                  >
                    <Package className="w-3.5 h-3.5 text-indigo-400" />
                    <span>+ Dari Paket Harga</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </button>

                  {showPricingPicker && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-neutral-700 rounded-xl shadow-2xl p-2 z-30 space-y-1">
                      <div className="text-[10px] text-neutral-400 uppercase tracking-widest px-2 py-1">
                        PILIH PAKET CMS
                      </div>
                      {availablePricing.map((plan) => (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => handleAddFromPricing(plan)}
                          className="w-full text-left p-2 rounded-lg hover:bg-neutral-800 flex items-center justify-between transition cursor-pointer text-xs"
                        >
                          <div>
                            <div className="font-bold text-white">{plan.name}</div>
                            <div className="text-[10px] text-neutral-400 truncate max-w-[150px]">
                              {plan.description}
                            </div>
                          </div>
                          <span className="font-mono text-xs text-indigo-400 font-bold">
                            {formatRupiah(parsePriceStringToNumber(plan.priceMonthly))}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dropdown Dari Layanan */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowServicePicker(!showServicePicker);
                      setShowPricingPicker(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-white text-neutral-200 hover:text-white transition cursor-pointer text-[11px]"
                  >
                    <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                    <span>+ Dari Layanan</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </button>

                  {showServicePicker && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-neutral-700 rounded-xl shadow-2xl p-2 z-30 space-y-1">
                      <div className="text-[10px] text-neutral-400 uppercase tracking-widest px-2 py-1">
                        PILIH PILAR LAYANAN
                      </div>
                      {availableServices.map((svc) => (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => handleAddFromService(svc)}
                          className="w-full text-left p-2 rounded-lg hover:bg-neutral-800 flex items-center justify-between transition cursor-pointer text-xs"
                        >
                          <div>
                            <div className="font-bold text-white">{svc.title}</div>
                            <div className="text-[10px] text-neutral-400 truncate max-w-[180px]">
                              {svc.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Button Custom Item */}
                <button
                  type="button"
                  onClick={() => handleAddItem("custom")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition cursor-pointer text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Item Bebas</span>
                </button>
              </div>
            </div>

            {/* Item Rows */}
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-3.5 bg-[#0a0a0a] border border-neutral-800 rounded-xl space-y-3 hover:border-neutral-700 transition"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                    {/* Index & Type badge */}
                    <div className="sm:col-span-1 flex sm:flex-col items-center sm:items-start justify-between gap-1 pt-2">
                      <span className="text-neutral-500 font-bold">#{index + 1}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 capitalize">
                        {item.type}
                      </span>
                    </div>

                    {/* Name & Description */}
                    <div className="sm:col-span-6 space-y-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        placeholder="Nama Produk atau Jasa *"
                        className={inputClass}
                        required
                      />
                      <textarea
                        value={item.description || ""}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        placeholder="Deskripsi / Catatan spesifikasi lingkup kerja (opsional)"
                        rows={2}
                        className="w-full rounded-xl px-4 py-2 text-xs font-mono text-white bg-[#0e0e0e] border border-neutral-800 focus:border-white focus:outline-none transition resize-none"
                      />
                    </div>

                    {/* Qty */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-neutral-400 mb-1">Qty</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className={inputClass}
                        required
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-neutral-400 mb-1">
                        Harga Satuan (Rp)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, "unitPrice", Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className={inputClass}
                        required
                      />
                      <div className="text-[10px] text-neutral-500 mt-1 truncate">
                        {formatRupiah(item.unitPrice)}
                      </div>
                    </div>

                    {/* Remove Action */}
                    <div className="sm:col-span-1 flex justify-end pt-5">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition cursor-pointer"
                        title="Hapus baris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal preview for this item */}
                  <div className="flex justify-end items-center gap-2 pt-1 border-t border-neutral-900 text-[11px]">
                    <span className="text-neutral-500">Sub-total Item:</span>
                    <span className="font-bold text-white">{formatRupiah(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Diskon, Pajak & Kalkulasi Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-[#0a0a0a] border border-neutral-800">
            {/* Setting Diskon & PPN */}
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                PENGATURAN POTONGAN & PAJAK
              </div>

              {/* Discount Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-neutral-400">Diskon:</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setDiscountType("percentage")}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        discountType === "percentage"
                          ? "bg-white text-black font-bold"
                          : "bg-neutral-900 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Persen (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType("fixed")}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        discountType === "fixed"
                          ? "bg-white text-black font-bold"
                          : "bg-neutral-900 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Nominal (Rp)
                    </button>
                  </div>
                </div>

                <input
                  type="number"
                  min={0}
                  max={discountType === "percentage" ? 100 : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={inputClass}
                  placeholder={discountType === "percentage" ? "10%" : "Rp 250.000"}
                />
              </div>

              {/* Tax / PPN Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-neutral-400">Pajak / PPN (%):</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setTaxRate(0)}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        taxRate === 0
                          ? "bg-white text-black font-bold"
                          : "bg-neutral-900 text-neutral-400 hover:text-white"
                      }`}
                    >
                      0%
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaxRate(11)}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        taxRate === 11
                          ? "bg-white text-black font-bold"
                          : "bg-neutral-900 text-neutral-400 hover:text-white"
                      }`}
                    >
                      11% (PPN)
                    </button>
                  </div>
                </div>

                <input
                  type="number"
                  min={0}
                  max={100}
                  value={taxRate}
                  onChange={(e) => setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Calculations Summary Box */}
            <div className="p-4 bg-[#141414] border border-neutral-800 rounded-xl flex flex-col justify-between space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-2">
                RINGKASAN TOTAL AKHIR
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white">{formatRupiah(totals.subtotal)}</span>
                </div>

                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>
                      Potongan Diskon{" "}
                      {discountType === "percentage" ? `(${discountValue}%)` : ""}:
                    </span>
                    <span className="font-bold">- {formatRupiah(totals.discountAmount)}</span>
                  </div>
                )}

                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-neutral-300">
                    <span>PPN ({taxRate}%):</span>
                    <span className="font-bold">+ {formatRupiah(totals.taxAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
                  <span className="font-bold text-white text-xs">GRAND TOTAL:</span>
                  <span className="text-xl font-bold font-mono text-white">
                    {formatRupiah(totals.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Info Rekening & Catatan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rekening Pembayaran */}
            <div className="space-y-3 p-4 rounded-xl bg-[#0a0a0a] border border-neutral-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                INFO REKENING PEMBAYARAN
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 mb-1">Nama Bank</label>
                <input
                  type="text"
                  value={paymentInfo.bankName}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  value={paymentInfo.accountNumber}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 mb-1">Atas Nama Rekening</label>
                <input
                  type="text"
                  value={paymentInfo.accountHolder}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, accountHolder: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Catatan & Ketentuan */}
            <div className="space-y-3 p-4 rounded-xl bg-[#0a0a0a] border border-neutral-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                SYARAT, KETENTUAN & GARANSI
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="w-full rounded-xl p-3 text-xs font-mono text-white bg-[#0e0e0e] border border-neutral-800 focus:border-white focus:outline-none transition leading-relaxed resize-none"
                placeholder="Tuliskan syarat ketentuan pembayaran, waktu pengerjaan, garansi..."
              />
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800 sticky bottom-0 bg-[#141414]/95 backdrop-blur-md py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition disabled:opacity-50 cursor-pointer shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Firestore...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{initialData ? "Simpan Perubahan" : "Buat & Simpan Invoice"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
