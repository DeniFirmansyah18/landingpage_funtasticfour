# Spesifikasi Desain: Fitur Cetak Invoice Manual CMS Admin Funtastic Four

**Tanggal:** 2026-09-03  
**Status:** Disetujui (Approved)  
**Author:** Pair Programming Antigravity & User  
**Target:** CMS Admin Funtastic Four (`landingpage_funtasticfour`)

---

## 1. Latar Belakang & Tujuan

CMS Admin Funtastic Four telah memiliki manajemen konten untuk Hero, Layanan (`services`), Portfolio (`portfolio`), Paket Harga (`pricing`), FAQ (`faq`), Kontak, dan Analytics. Namun, belum terdapat fasilitas pencatatan penagihan transaksi maupun pencetakan dokumen invoice resmi bagi klien yang memesan layanan pembuatan website, pengembangan aplikasi mobile, desain kreatif, reparasi perangkat, ataupun paket harga khusus.

Tujuan dari fitur ini adalah:
1. Memberikan antarmuka intuitif bagi admin untuk membuat tagihan manual (*manual invoice generator*).
2. Memungkinkan pemilihan cepat produk dan jasa dari database CMS (koleksi `services` & `pricing`), serta input bebas item produk/jasa custom.
3. Menyimpan riwayat invoice ke basis data Firebase Firestore (`invoices`) untuk pelacakan status pembayaran (*unpaid*, *paid*, *draft*, *cancelled*).
4. Menyediakan template dokumen invoice standar korporat siap cetak lembar A4 melalui fungsi `window.print()` (Cetak ke printer fisik atau Ekspor ke file PDF berkualitas tinggi).

---

## 2. Arsitektur & Model Data

### 2.1 Lokasi Penyimpanan (Firestore)
- Dokumen invoice disimpan pada koleksi Firestore bernama `invoices`.
- Setiap dokumen memiliki ID unik yang digenerate oleh Firestore atau ID kustom.
- Pengambilan data menggunakan hook real-time `useCollection<InvoiceDocument>("invoices", "createdAt")`.

### 2.2 Skema Data TypeScript (`lib/cms-types.ts`)

```typescript
export type InvoiceStatus = "unpaid" | "paid" | "draft" | "cancelled";
export type InvoiceItemType = "service" | "pricing" | "custom";

export interface InvoiceItem {
  id: string;
  name: string;               // Contoh: "Pembuatan Website - Landing Page"
  description?: string;       // Deskripsi / spesifikasi lingkup kerja
  type: InvoiceItemType;      // "service" | "pricing" | "custom"
  quantity: number;           // Jumlah unit
  unitPrice: number;          // Harga satuan dalam angka Rupiah murni
  total: number;              // quantity * unitPrice
}

export interface InvoiceClient {
  name: string;               // Nama PIC / Klien
  company?: string;           // Nama Perusahaan / Instansi (opsional)
  email?: string;             // Email Klien
  phone?: string;             // Nomor WhatsApp / Telepon
  address?: string;           // Alamat penagihan
}

export interface InvoicePaymentInfo {
  bankName: string;           // Contoh: "Bank Central Asia (BCA)"
  accountNumber: string;      // Contoh: "8410928312"
  accountHolder: string;      // Contoh: "Deni Firmansyah"
  notes?: string;             // Catatan pembayaran tambahan
}

export interface InvoiceDocument {
  id: string;
  invoiceNumber: string;      // Format: "INV/YYYYMM/001"
  issueDate: string;          // Format: "YYYY-MM-DD"
  dueDate: string;            // Format: "YYYY-MM-DD"
  status: InvoiceStatus;      // "unpaid" | "paid" | "draft" | "cancelled"
  client: InvoiceClient;
  items: InvoiceItem[];
  subtotal: number;           // Total harga sebelum diskon & pajak
  discountType: "percentage" | "fixed";
  discountValue: number;      // Nilai potongan (persen atau nominal)
  discountAmount: number;     // Hasil kalkulasi nominal diskon
  taxRate: number;            // Persentase PPN (0% atau 11%)
  taxAmount: number;          // Nominal PPN
  grandTotal: number;         // (subtotal - discountAmount) + taxAmount
  notes?: string;             // Syarat & Ketentuan, Garansi, dll.
  paymentInfo: InvoicePaymentInfo;
  createdAt?: any;
  updatedAt?: any;
}
```

---

## 3. Desain Antarmuka & Alur Kerja CMS

### 3.1 Navigasi Admin (`components/admin/AdminSidebar.tsx`)
- Menambahkan item navigasi baru:
  ```typescript
  { label: "Invoice", href: "/admin/invoice", icon: FileText }
  ```
- Di halaman utama `/admin/page.tsx`, menambahkan kartu statistik koleksi `invoices` (`code: "08"`).

### 3.2 Halaman Manajemen Invoice (`app/admin/invoice/page.tsx`)
- **Metric Cards (Ringkasan Finansial)**:
  - Total Invoice yang tercatat.
  - Tagihan Belum Lunas (Unpaid) beserta total nominal Rupiah yang belum diterima.
  - Tagihan Lunas (Paid) beserta total penerimaan kas masuk.
  - Tagihan Batal / Draft.
- **Filter & Pencarian**:
  - Input pencarian langsung mencocokkan nomor invoice, nama klien, atau nama perusahaan.
  - Tab filter status: `Semua`, `Belum Bayar`, `Lunas`, `Draft`, `Batal`.
- **Tabel Riwayat Tagihan**:
  - Kolom: Nomor Invoice, Tanggal & Jatuh Tempo, Klien & Instansi, Jumlah Item, Total Tagihan (Rp), Status Badge.
  - **Aksi Cepat per Baris**:
    - **Cetak (Printer Icon)**: Membuka modal pratinjau dokumen A4 siap cetak.
    - **Toggle Status**: 1-klik mengubah status invoice (misal dari Belum Bayar menjadi Lunas setelah dana diterima).
    - **Edit (Pencil Icon)**: Membuka drawer/modal edit data invoice.
    - **Hapus (Trash Icon)**: Menghapus invoice dengan dialog konfirmasi aman.

### 3.3 Formulir Pembuatan & Edit Invoice (`components/admin/invoice/InvoiceFormModal.tsx`)
- **Nomor Invoice Otomatis**:
  - Mengambil format standar `INV/YYYYMM/XXX` berdasarkan tahun-bulan berjalan dan nomor urut. Admin tetap dapat mengubah nomor ini secara manual.
- **Picker Data Produk & Jasa Terintegrasi**:
  - Tombol **"+ Dari Paket Harga"**: Mengambil data paket `pricing` (Starter, Professional, Enterprise) dan mengubah format harga menjadi angka murni.
  - Tombol **"+ Dari Layanan"**: Memilih dari daftar pilar `services` (Website, Mobile App, Desain Grafis, Reparasi) untuk mengisi deskripsi secara instan.
  - Tombol **"+ Tambah Item Bebas"**: Membuka baris kosong untuk memasukkan produk fisik, spare part, biaya server/domain, atau jasa kustom.
- **Kalkulasi Real-Time**:
  - Subtotal terhitung otomatis berdasarkan perkalian `quantity * unitPrice`.
  - Diskon dapat dipilih format nominal (Rp) atau persentase (%).
  - PPN dapat diisi fleksibel (0% atau tombol cepat 11%).
  - Grand total dihitung seketika dan ditampilkan dalam format Rupiah (`Rp X.XXX.XXX`).
- **Data Rekening & Catatan**:
  - Memuat data default rekening bank Funtastic Four dengan opsi penyesuaian.
  - Catatan standar ketentuan pembayaran, garansi pengerjaan, dan batas revisi.

---

## 4. Desain & Engine Cetak Dokumen A4 / PDF

### 4.1 Komponen Pratinjau & Cetak (`components/admin/invoice/InvoicePrintView.tsx`)
- Menyajikan pratinjau lembar kertas A4 putih bersih di dalam modal yang responsif.
- Tombol **"Cetak / Simpan PDF"** memicu perintah `window.print()`.
- Tombol **"Salin Ringkasan Tagihan"** untuk menyalin pesan teks formal ke clipboard (siap kirim via WhatsApp ke klien).

### 4.2 Styling `@media print`
- CSS khusus cetak dimasukkan secara modular atau pada layout:
  - Menyembunyikan seluruh sidebar admin, navbar, header, tombol aksi, dan backdrop modal (`display: none !important`).
  - Mengatur ukuran cetak resmi: `@page { size: A4 portrait; margin: 12mm 15mm; }`.
  - Mengaktifkan `-webkit-print-color-adjust: exact` dan `print-color-adjust: exact` agar badge warna (misal stempel hijau LUNAS) tercetak presisi.
  - Menggunakan `page-break-inside: avoid` pada baris item dan kotak total tagihan agar tidak terpotong ganjil antar halaman.

### 4.3 Struktur Tata Letak Dokumen Resmi
1. **Header Dokumen**:
   - Logo Funtastic Four + Tagline *"Digital Agency & Technology Solutions"*.
   - Data kontak resmi: Alamat, Telepon/WhatsApp, Email, Website.
   - Kotak Info Dokumen: Kata "INVOICE", Nomor Invoice, Tanggal Terbit, Jatuh Tempo.
2. **Status Stamp**:
   - Stempel resmi visual: `LUNAS / PAID` (border hijau) atau `BELUM LUNAS` (border amber).
3. **Bill To (Informasi Penerima)**:
   - Nama Klien / Perusahaan, Kontak, dan Alamat.
4. **Tabel Rincian Biaya**:
   - Header tabel dengan latar abu-abu terang bersih.
   - Kolom: No, Deskripsi Layanan/Produk, Tipe, Qty, Harga Satuan, Total.
5. **Rangkuman Pembayaran**:
   - Subtotal, Diskon, PPN, dan Grand Total besar.
6. **Instruksi Pembayaran & Rekening**:
   - Kotak informasi transfer bank (Bank, No Rekening, Atas Nama).
7. **Catatan & Otorisasi**:
   - Ketentuan pengerjaan & garansi.
   - Area tanda tangan resmi manajemen Funtastic Four.

---

## 5. Rencana Pengujian & Validasi

1. **Pengujian Fungsionalitas CRUD**:
   - Membuat invoice baru dengan item dari Layanan, Paket Harga, dan item manual bebas.
   - Memastikan data tersimpan dengan benar di Firestore dan muncul di daftar riwayat.
   - Mengubah status pembayaran (Unpaid $\rightarrow$ Paid) dan memverifikasi perubahan status secara real-time.
   - Mengedit invoice dan menghapus invoice.
2. **Pengujian Kalkulasi Finansial**:
   - Memverifikasi keakuratan kalkulasi subtotal, diskon persentase, diskon nominal, dan PPN.
   - Memastikan tidak ada nilai NaN atau error pembulatan nominal Rupiah.
3. **Pengujian Cetak & Ekspor PDF**:
   - Menguji tombol cetak via browser print preview (`Ctrl+P` / `window.print()`).
   - Memastikan hanya dokumen invoice yang muncul di pratinjau cetak (sidebar dan elemen CMS tersembunyi).
   - Memastikan hasil cetak atau simpan ke PDF berukuran A4 rapi, tanpa elemen terpotong.
4. **Pengujian Responsivitas UI**:
   - Menguji tampilan pada layar desktop, tablet, dan mobile.
