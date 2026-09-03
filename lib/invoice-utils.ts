import type { InvoiceItem, InvoicePaymentInfo } from "./cms-types";

/**
 * Format number into Indonesian Rupiah currency format.
 * Example: 2500000 -> "Rp 2.500.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "Rp 0";
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${formatted}`;
}

/**
 * Generate sequential invoice number.
 * Format: INV/YYYYMM/001
 */
export function generateInvoiceNumber(existingCount = 0, date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const sequence = String(existingCount + 1).padStart(3, "0");
  return `INV/${year}${month}/${sequence}`;
}

/**
 * Safely parse price string from CMS pricing plans (e.g. "999", "2.999", "Custom", "Rp 1.500.000") into a raw numeric value.
 */
export function parsePriceStringToNumber(priceStr: string | number): number {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;

  const cleaned = priceStr
    .toString()
    .replace(/Rp/gi, "")
    .trim();

  if (cleaned.toLowerCase() === "custom") {
    return 0;
  }

  // Handle formats like "2.999" (meaning 2.999.000 in Indonesian pricing cards)
  if (/^\d{1,3}\.\d{3}$/.test(cleaned)) {
    const rawDigits = cleaned.replace(/\./g, "");
    return parseInt(rawDigits, 10) * 1000;
  }

  // Handle format like "999" (meaning 999.000 in Indonesian pricing cards)
  if (/^\d{1,3}$/.test(cleaned)) {
    const num = parseInt(cleaned, 10);
    // If under 1000, assume it's in thousands (e.g. 999 = 999,000)
    return num < 1000 ? num * 1000 : num;
  }

  // Handle regular dotted numbers e.g. "2.500.000"
  const digitsOnly = cleaned.replace(/[^0-9]/g, "");
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
}

/**
 * Calculate totals (subtotal, discount, tax, grand total)
 */
export function calculateInvoiceTotals(
  items: InvoiceItem[],
  discountType: "percentage" | "fixed" = "percentage",
  discountValue = 0,
  taxRate = 0
) {
  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  let discountAmount = 0;
  if (discountType === "percentage") {
    const pct = Math.max(0, Math.min(100, Number(discountValue) || 0));
    discountAmount = Math.round((subtotal * pct) / 100);
  } else {
    discountAmount = Math.min(subtotal, Math.max(0, Number(discountValue) || 0));
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxPct = Math.max(0, Number(taxRate) || 0);
  const taxAmount = Math.round((taxableAmount * taxPct) / 100);
  const grandTotal = taxableAmount + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
  };
}

export const defaultInvoicePaymentInfo: InvoicePaymentInfo = {
  bankName: "Bank Central Asia (BCA)",
  accountNumber: "8410928312",
  accountHolder: "Funtastic Four Studio",
  notes: "Sertakan nomor invoice pada berita transfer dan kirimkan bukti pembayaran ke WhatsApp resmi.",
};

export const defaultInvoiceNotes =
  "1. Pembayaran dilakukan secara transfer ke rekening resmi yang tertera di atas.\n2. Untuk paket pengembangan website/aplikasi, garansi perbaikan berlaku terhitung setelah serah terima proyek.\n3. Harap konfirmasikan bukti pembayaran melalui WhatsApp resmi Funtastic Four.";
