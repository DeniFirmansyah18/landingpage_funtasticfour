# Fitur Cetak Invoice Manual CMS Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun fitur pembuatan tagihan manual, integrasi data produk/layanan CMS, manajemen riwayat status di Firestore, dan pencetakan invoice A4 / ekspor PDF pada CMS Admin Funtastic Four.

**Architecture:** Modul terintegrasi di `/admin/invoice` yang memanfaatkan hook Firestore (`useCollection`, `addItem`, `updateItem`, `deleteItem`), komponen form interaktif dengan pemilih cepat Layanan & Paket Harga CMS, serta komponen preview dokumen siap cetak A4 dengan styling `@media print` native berstandar korporat.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React, Firebase Firestore.

**Spec:** [docs/superpowers/specs/2026-09-03-manual-invoice-generator-design.md](file:///e:/PROJECT%20REACT/landingpage_funtasticfour/docs/superpowers/specs/2026-09-03-manual-invoice-generator-design.md)

## Global Constraints
- Framework: Next.js 16 (App Router) dengan Tailwind CSS v4 dan TypeScript strictly typed.
- Gunakan komponen dan utilitas yang sudah ada (`useFirestore`, `Toast`, `ConfirmModal`, `AdminSidebar`).
- Tanpa dependensi pihak ketiga berat untuk PDF; gunakan arsitektur native browser `@media print` dan `window.print()` untuk ketajaman vector PDF dan performa maksimal.
- Desain antarmuka konsisten dengan styling dark CMS console (`#0a0a0a`, `#0e0e0e`, `#141414`, font-mono badge & label).

---

### Task 1: Type Definitions & Invoice Utilities

**Files:**
- Modify: `lib/cms-types.ts`
- Create: `lib/invoice-utils.ts`

**Interfaces:**
- Consumes: CMS types existing definitions
- Produces: `InvoiceStatus`, `InvoiceItemType`, `InvoiceItem`, `InvoiceClient`, `InvoicePaymentInfo`, `InvoiceDocument` in `lib/cms-types.ts`
- Produces: `formatRupiah`, `generateInvoiceNumber`, `parsePriceStringToNumber`, `calculateInvoiceTotals` in `lib/invoice-utils.ts`

- [ ] **Step 1: Menambahkan tipe data Invoice ke `lib/cms-types.ts`**

Tambahkan deklarasi tipe data invoice:
```typescript
export type InvoiceStatus = "unpaid" | "paid" | "draft" | "cancelled";
export type InvoiceItemType = "service" | "pricing" | "custom";

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  type: InvoiceItemType;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceClient {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface InvoicePaymentInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  notes?: string;
}

export interface InvoiceDocument {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  client: InvoiceClient;
  items: InvoiceItem[];
  subtotal: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  notes?: string;
  paymentInfo: InvoicePaymentInfo;
  createdAt?: any;
  updatedAt?: any;
}
```

- [ ] **Step 2: Membuat file utilitas kalkulasi & format mata uang di `lib/invoice-utils.ts`**

Buat utilitas untuk:
1. `formatRupiah(amount: number): string` - Format angka ke format mata uang `Rp 2.500.000`.
2. `generateInvoiceNumber(count: number, date?: Date): string` - Membuat format `INV/YYYYMM/001`.
3. `parsePriceStringToNumber(priceStr: string): number` - Mengubah string harga CMS seperti `"2.999"` atau `"999"` menjadi angka `2999000` atau `999000`.
4. `calculateInvoiceTotals(items: InvoiceItem[], discountType: "percentage" | "fixed", discountValue: number, taxRate: number)` - Menghitung subtotal, diskon, pajak, dan grand total.

- [ ] **Step 3: Verifikasi utilitas dan komit**

```powershell
git add lib/cms-types.ts lib/invoice-utils.ts; git commit -m "feat(invoice): add types and calculation utilities"
```

---

### Task 2: Print Template & Print View Component

**Files:**
- Create: `components/admin/invoice/InvoicePrintView.tsx`

**Interfaces:**
- Consumes: `InvoiceDocument` from `lib/cms-types.ts`, `formatRupiah` from `lib/invoice-utils.ts`
- Produces: `InvoicePrintView` React Component with modal preview & `@media print` layout

- [ ] **Step 1: Membuat komponen `InvoicePrintView.tsx`**

Komponen ini menerima props:
- `invoice: InvoiceDocument`
- `isOpen: boolean`
- `onClose: () => void`

Fitur komponen:
- Lembar A4 berwarna putih bersih dengan shadow di layar admin.
- Header Funtastic Four: Logo hitam-putih `F4`, alamat `Jakarta, Indonesia`, email `hello@funtasticfour.id`, website resmi.
- Nomor invoice, tanggal terbit, jatuh tempo, serta stempel status (`LUNAS` / `MENUNGGU PEMBAYARAN`).
- Bagian *Bill To* data penerima invoice.
- Tabel rincian item dengan zebra row halus dan kolom harga terformat rapi.
- Kotak kalkulasi: Subtotal, Diskon (jika ada), PPN (jika ada), dan Grand Total berukuran besar.
- Kotak info rekening pembayaran (BCA / Mandiri / lainnya) dan instruksi konfirmasi WA.
- Bagian tanda tangan manajemen Funtastic Four.
- Tombol aksi: **"Cetak / Simpan PDF"** (`window.print()`), **"Salin Pesan WhatsApp"**, dan **"Tutup"**.
- Menanamkan CSS `@media print` scoped:
  - Menyembunyikan sidebar admin, navigation, dan modal backdrop saat dialog print terbuka.
  - Menetapkan ukuran cetak: `@page { size: A4 portrait; margin: 10mm 15mm; }`.
  - Menerapkan `-webkit-print-color-adjust: exact` dan `print-color-adjust: exact`.

- [ ] **Step 2: Verifikasi komponen dan komit**

```powershell
git add components/admin/invoice/InvoicePrintView.tsx; git commit -m "feat(invoice): create print view and A4 document template"
```

---

### Task 3: Interactive Invoice Form Drawer / Modal

**Files:**
- Create: `components/admin/invoice/InvoiceFormModal.tsx`

**Interfaces:**
- Consumes: `useCollection` from `lib/hooks/useFirestore`, `ServiceItem`, `PricingPlan`, `InvoiceDocument` from `lib/cms-types.ts`, `calculateInvoiceTotals`, `formatRupiah` from `lib/invoice-utils.ts`
- Produces: `InvoiceFormModal` React Component for creating & updating invoices

- [ ] **Step 1: Membuat komponen `InvoiceFormModal.tsx`**

Komponen ini mendukung:
1. Mode Tambah Baru (*Create*) & Mode Edit (*Update*).
2. Memuat data real-time dari koleksi `services` dan `pricing` untuk pemilihan instan:
   - Tombol **"+ Ambil dari Layanan"**: Memilih salah satu pilar layanan (Pembuatan Website, Pengembangan Aplikasi, Desain Kreatif, Reparasi Perangkat).
   - Tombol **"+ Ambil dari Paket Harga"**: Memilih salah satu paket (Starter, Professional, Enterprise) dan otomatis mengonversi harga ke nominal Rupiah.
   - Tombol **"+ Tambah Item Manual"**: Menambah baris kosong untuk produk fisik, domain/hosting, spare part, atau penyesuaian kustom.
3. Form interaktif dinamis baris item: input nama item, deskripsi opsional, kuantitas, harga satuan, dan kalkulasi otomatis.
4. Input Diskon (bisa persen atau nominal) dan PPN (pilihan 0% atau tombol cepat 11%).
5. Form data klien lengkap: Nama, Perusahaan, WhatsApp, Email, Alamat.
6. Rekening pembayaran default Funtastic Four dengan input yang dapat disesuaikan.
7. Validasi form & simpan ke Firestore menggunakan `addItem("invoices", payload)` atau `updateItem("invoices", id, payload)`.

- [ ] **Step 2: Verifikasi komponen dan komit**

```powershell
git add components/admin/invoice/InvoiceFormModal.tsx; git commit -m "feat(invoice): create interactive invoice form modal"
```

---

### Task 4: Admin Invoice Page & Management Dashboard

**Files:**
- Create: `app/admin/invoice/page.tsx`

**Interfaces:**
- Consumes: `useCollection` from `lib/hooks/useFirestore`, `InvoiceDocument` from `lib/cms-types.ts`, `InvoiceFormModal`, `InvoicePrintView`, `ConfirmModal`, `toast`
- Produces: Full admin page for invoices with metric cards, search, status filters, and table actions

- [ ] **Step 1: Membuat halaman `app/admin/invoice/page.tsx`**

Fitur halaman:
1. **Header & Metric Cards**:
   - Total Invoices
   - Belum Lunas (Unpaid) + Akumulasi Nominal Tagihan Belum Diterima
   - Lunas (Paid) + Akumulasi Penerimaan Kas
   - Draft / Batal
2. **Toolbar Pencarian & Filter**:
   - Input search instan (mencari nomor invoice, nama klien, atau nama perusahaan).
   - Tab filter status: *Semua*, *Belum Bayar*, *Lunas*, *Draft*, *Batal*.
   - Tombol utama **"+ Buat Invoice Baru"**.
3. **Tabel Data Invoice**:
   - Menampilkan No. Invoice, Tanggal & Jatuh Tempo, Klien & Perusahaan, Jumlah Item, Total (Rp), dan Status Badge berwarna.
   - Aksi:
     - **Cetak (Printer)**: Membuka modal `InvoicePrintView`.
     - **Toggle Status**: 1-klik mengubah status invoice dari Belum Bayar $\leftrightarrow$ Lunas.
     - **Edit (Pencil)**: Membuka modal `InvoiceFormModal`.
     - **Hapus (Trash)**: Dialog konfirmasi aman via `ConfirmModal`.
4. **State Kosong (Empty State)**:
   - Tampilan grafis informatif jika belum ada invoice atau hasil pencarian tidak ditemukan, disertai tombol CTA "+ Buat Invoice Baru".

- [ ] **Step 2: Verifikasi halaman dan komit**

```powershell
git add app/admin/invoice/page.tsx; git commit -m "feat(invoice): create admin invoice management page"
```

---

### Task 5: Sidebar Navigation, Main Admin Dashboard Integration & Verification

**Files:**
- Modify: `components/admin/AdminSidebar.tsx`
- Modify: `app/admin/page.tsx`

**Interfaces:**
- Consumes: `app/admin/invoice` route
- Produces: Updated sidebar with Invoice link and updated Dashboard with Invoice counter card

- [ ] **Step 1: Menambahkan menu Invoice di `AdminSidebar.tsx`**

Tambahkan item navigasi:
```typescript
import { FileText } from "lucide-react";
// ...
{ label: "Invoice", href: "/admin/invoice", icon: FileText }
```

- [ ] **Step 2: Menambahkan kartu counter di `app/admin/page.tsx`**

Tambahkan ke array `sections`:
```typescript
{ label: "Invoice Tagihan", href: "/admin/invoice", icon: FileText, collection: "invoices", code: "08" }
```

- [ ] **Step 3: Menjalankan type-check dan linting**

Jalankan perintah build/typecheck:
```powershell
npx tsc --noEmit
```
Pastikan 0 error TypeScript.

- [ ] **Step 4: Komit perubahan akhir**

```powershell
git add components/admin/AdminSidebar.tsx app/admin/page.tsx; git commit -m "feat(invoice): integrate invoice into admin sidebar and dashboard"
```
