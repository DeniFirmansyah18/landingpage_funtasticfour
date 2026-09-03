"use client";
import { useState } from "react";
import type { InvoiceDocument } from "@/lib/cms-types";
import { formatRupiah } from "@/lib/invoice-utils";
import { toast } from "@/components/admin/Toast";
import {
  Printer,
  X,
  Copy,
  Check,
  CreditCard,
  FileCheck,
} from "lucide-react";

interface InvoicePrintViewProps {
  invoice: InvoiceDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoicePrintView({
  invoice,
  isOpen,
  onClose,
}: InvoicePrintViewProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsAppMessage = () => {
    const text = `Halo Kak ${invoice.client.name}, berikut adalah rincian invoice tagihan dari Funtastic Four:

📄 *No. Invoice:* ${invoice.invoiceNumber}
📅 *Tanggal Terbit:* ${invoice.issueDate}
⏳ *Jatuh Tempo:* ${invoice.dueDate}
💰 *Total Tagihan:* ${formatRupiah(invoice.grandTotal)}
📌 *Status:* ${invoice.status.toUpperCase()}

*Rincian Item:*
${invoice.items.map((it, idx) => `${idx + 1}. ${it.name} (${it.quantity}x) - ${formatRupiah(it.total)}`).join("\n")}

*Pembayaran dapat ditransfer ke:*
Bank: ${invoice.paymentInfo.bankName}
No. Rekening: ${invoice.paymentInfo.accountNumber}
A/N: ${invoice.paymentInfo.accountHolder}

Terima kasih atas kerja samanya!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast("Ringkasan invoice berhasil disalin ke clipboard!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const isPaid = invoice.status === "paid";
  const isUnpaid = invoice.status === "unpaid";
  const isDraft = invoice.status === "draft";
  const isCancelled = invoice.status === "cancelled";

  return (
    <>
      {/* Scoped print CSS to ensure clean A4 output without admin UI chrome */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page {
              size: A4 portrait;
              margin: 10mm 15mm;
            }
            @media print {
              html, body {
                background: #ffffff !important;
                color: #111827 !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              #print-invoice-sheet {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                page-break-inside: avoid !important;
              }
            }
          `,
        }}
      />

      {/* Modal Wrapper */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex flex-col items-center p-3 sm:p-6 print:static print:inset-auto print:p-0 print:m-0 print:bg-white print:overflow-visible print:block">
        {/* Floating Top Toolbar */}
        <div className="sticky top-2 z-20 w-full max-w-4xl bg-[#141414]/90 backdrop-blur-md border border-neutral-800 text-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xl mb-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                PRATINJAU DOKUMEN INVOICE
              </div>
              <div className="text-[11px] font-mono text-neutral-400">
                {invoice.invoiceNumber} • {invoice.client.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWhatsAppMessage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-neutral-900 border border-neutral-700 hover:border-white text-neutral-200 hover:text-white transition cursor-pointer"
              title="Salin rincian ringkas untuk chat WhatsApp"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salin Teks WA</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-mono font-bold bg-white text-black hover:bg-neutral-200 transition shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas (A4 simulation) */}
        <div
          id="print-invoice-sheet"
          className="w-full max-w-4xl bg-white text-[#111827] shadow-2xl rounded-xl p-8 sm:p-12 font-sans border border-neutral-200 transition-all print:p-0 print:m-0 print:max-w-none print:shadow-none print:border-none print:rounded-none print:w-full print:text-black print:bg-white"
        >
          {/* Top Brand Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b-2 border-neutral-200">
            {/* Company Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="bg-black text-white font-mono font-black text-base px-2.5 py-1 tracking-wider rounded">
                  F4
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-black uppercase">
                    FUNTASTIC FOUR
                  </h1>
                  <p className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
                    Digital Agency & Technology Solutions
                  </p>
                </div>
              </div>

              <div className="text-xs text-neutral-600 leading-relaxed font-sans pt-1">
                <p>Jakarta, Indonesia</p>
                <p>Email: hello@funtasticfour.id • WhatsApp: +62 812-3456-7890</p>
                <p>Website: funtasticfour.id</p>
              </div>
            </div>

            {/* Document Title & Meta Box */}
            <div className="sm:text-right space-y-1.5 min-w-[200px]">
              <div className="text-3xl font-black uppercase tracking-tight text-neutral-900 font-mono">
                INVOICE
              </div>
              <div className="text-xs font-mono font-bold text-neutral-800">
                #{invoice.invoiceNumber}
              </div>

              {/* Status Stamp */}
              <div className="pt-2">
                {isPaid && (
                  <span className="inline-block px-3 py-1 rounded border-2 border-emerald-600 bg-emerald-50 text-emerald-700 font-mono text-xs font-extrabold tracking-widest uppercase">
                    ✓ LUNAS / PAID
                  </span>
                )}
                {isUnpaid && (
                  <span className="inline-block px-3 py-1 rounded border-2 border-amber-600 bg-amber-50 text-amber-800 font-mono text-xs font-extrabold tracking-widest uppercase">
                    MENUNGGU PEMBAYARAN
                  </span>
                )}
                {isDraft && (
                  <span className="inline-block px-3 py-1 rounded border-2 border-neutral-400 bg-neutral-100 text-neutral-600 font-mono text-xs font-extrabold tracking-widest uppercase">
                    DRAFT
                  </span>
                )}
                {isCancelled && (
                  <span className="inline-block px-3 py-1 rounded border-2 border-red-500 bg-red-50 text-red-700 font-mono text-xs font-extrabold tracking-widest uppercase">
                    DIBATALKAN
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Dates & Bill To Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-neutral-200 text-xs">
            {/* Bill To */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                DITAGIHKAN KEPADA:
              </div>
              <div className="space-y-1 text-neutral-800">
                <div className="font-bold text-sm text-neutral-900">
                  {invoice.client.name}
                </div>
                {invoice.client.company && (
                  <div className="font-semibold text-neutral-700">
                    {invoice.client.company}
                  </div>
                )}
                {invoice.client.phone && (
                  <div>WhatsApp / Telp: {invoice.client.phone}</div>
                )}
                {invoice.client.email && (
                  <div>Email: {invoice.client.email}</div>
                )}
                {invoice.client.address && (
                  <div className="text-neutral-600 whitespace-pre-line pt-0.5">
                    {invoice.client.address}
                  </div>
                )}
              </div>
            </div>

            {/* Dates & Highlight Summary */}
            <div className="sm:text-right flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex sm:justify-end gap-2 font-mono">
                  <span className="text-neutral-500">Tanggal Terbit:</span>
                  <span className="font-bold text-neutral-900">
                    {invoice.issueDate}
                  </span>
                </div>
                <div className="flex sm:justify-end gap-2 font-mono">
                  <span className="text-neutral-500">Jatuh Tempo:</span>
                  <span className="font-bold text-red-600">
                    {invoice.dueDate}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg sm:text-right">
                <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                  TOTAL TAGIHAN
                </div>
                <div className="text-xl font-mono font-black text-neutral-900 mt-0.5">
                  {formatRupiah(invoice.grandTotal)}
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-900 bg-neutral-100 text-neutral-700 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 w-12 text-center">#</th>
                  <th className="py-3 px-3">Deskripsi Produk / Jasa</th>
                  <th className="py-3 px-3 w-28 text-center">Kategori</th>
                  <th className="py-3 px-3 w-16 text-center">Qty</th>
                  <th className="py-3 px-3 w-36 text-right">Harga Satuan</th>
                  <th className="py-3 px-3 w-36 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-xs text-neutral-800">
                {invoice.items.map((item, index) => (
                  <tr key={item.id || index} className="align-top hover:bg-neutral-50/50">
                    <td className="py-3.5 px-3 text-center font-mono text-neutral-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-neutral-900">{item.name}</div>
                      {item.description && (
                        <div className="text-[11px] text-neutral-500 whitespace-pre-line mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-[11px] text-neutral-500 capitalize">
                      {item.type === "pricing"
                        ? "Paket Harga"
                        : item.type === "service"
                        ? "Pilar Layanan"
                        : "Kustom / Produk"}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-neutral-700">
                      {formatRupiah(item.unitPrice)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-neutral-900">
                      {formatRupiah(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Calculations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 pb-6 border-t border-neutral-200">
            {/* Payment Method Details */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 font-mono font-bold uppercase tracking-wider text-neutral-700 text-[11px]">
                <CreditCard className="w-4 h-4 text-neutral-600" />
                METODE TRANSFER PEMBAYARAN:
              </div>
              <div className="font-mono space-y-1 text-neutral-800 pt-1">
                <div>
                  <span className="text-neutral-500">Bank:</span>{" "}
                  <span className="font-bold">{invoice.paymentInfo.bankName}</span>
                </div>
                <div>
                  <span className="text-neutral-500">No. Rekening:</span>{" "}
                  <span className="font-bold text-sm tracking-wider bg-white px-2 py-0.5 border border-neutral-200 rounded">
                    {invoice.paymentInfo.accountNumber}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">Atas Nama:</span>{" "}
                  <span className="font-bold">{invoice.paymentInfo.accountHolder}</span>
                </div>
                {invoice.paymentInfo.notes && (
                  <div className="text-[11px] text-neutral-600 italic pt-1 border-t border-neutral-200">
                    {invoice.paymentInfo.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Calculations Column */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-bold text-neutral-900">
                  {formatRupiah(invoice.subtotal)}
                </span>
              </div>

              {invoice.discountAmount > 0 && (
                <div className="flex justify-between py-1 border-b border-neutral-100 text-emerald-700">
                  <span>
                    Diskon{" "}
                    {invoice.discountType === "percentage"
                      ? `(${invoice.discountValue}%)`
                      : ""}:
                  </span>
                  <span className="font-bold">
                    - {formatRupiah(invoice.discountAmount)}
                  </span>
                </div>
              )}

              {invoice.taxAmount > 0 && (
                <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
                  <span>PPN ({invoice.taxRate}%):</span>
                  <span className="font-bold text-neutral-900">
                    + {formatRupiah(invoice.taxAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-2.5 px-3 bg-neutral-900 text-white rounded-lg mt-2">
                <span className="font-bold tracking-wider text-xs">
                  GRAND TOTAL:
                </span>
                <span className="text-base font-black tracking-tight">
                  {formatRupiah(invoice.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Terms + Signature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-neutral-200 text-xs">
            {/* Terms & Conditions */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                SYARAT & KETENTUAN:
              </div>
              <div className="text-[11px] text-neutral-600 whitespace-pre-line leading-relaxed">
                {invoice.notes || "Terima kasih atas kepercayaan Anda bermitra bersama Funtastic Four."}
              </div>
            </div>

            {/* Official Signature */}
            <div className="sm:text-right flex flex-col items-start sm:items-end justify-between min-h-[110px]">
              <div className="font-mono text-[11px] text-neutral-500">
                Jakarta, {invoice.issueDate}
              </div>
              <div className="pt-8">
                <div className="border-b border-neutral-800 w-48 mb-1"></div>
                <div className="font-bold text-xs text-neutral-900">
                  Funtastic Four Management
                </div>
                <div className="text-[10px] font-mono text-neutral-500">
                  Authorized Digital Invoice
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
