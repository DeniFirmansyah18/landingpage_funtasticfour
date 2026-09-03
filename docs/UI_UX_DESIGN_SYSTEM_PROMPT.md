# Funtastic Four Design System & AI Prompt Template
> **Format:** Master Style Guide & Ready-to-Use System Prompt  
> **Tema Desain:** *Neo-Brutalist High-Performance Studio & Cyber-Minimalist Dark Console*  
> **Target Penggunaan:** Salin dokumen atau bagian prompt di bawah untuk menginstruksikan AI membangun project baru dengan estetika serupa.

---

## 1. Ringkasan Filosofi Desain (Design DNA)

Desain ini menggabungkan dua dunia yang harmonis:
1. **Landing Page (Neo-Brutalist & High-Tech Creative Studio)**:
   - Tipografi editorial tebal, kontras tinggi (Hitam pekat, Putih gading `#f4f4f4`, Abu-abu netral).
   - Elemen interaktif seperti *ticker marquee* berjalan, grid garis tipis (*blueprint grid*), border titik-titik (*dotted border*), dan *hover preview card* melayang.
2. **Admin CMS (Cyber-Minimalist Dark Console)**:
   - Nuansa *hacker terminal / high-tech console* yang sangat bersih dan teratur.
   - Latar belakang bertingkat (*layered dark surfaces*): `#0a0a0a` (dasar), `#0e0e0e` (main content), `#141414` (kartu/kontainer), `#1a1a1a` (hover/dropdown).
   - Aksen status fungsional berpendar (*glowing dots*): Hijau Emerald untuk aktif/lunas, Kuning Amber untuk pending, Merah untuk alert.
   - Tipografi monospace (`font-mono`) untuk label teknis, nomor kode (`/01`, `/02`), dan komentar gaya kode (`// NAVIGATION`, `// MANAGEMENT`).

---

## 2. Palet Warna (Color Palette & Tokens)

### A. Dark Console Palette (CMS Admin)
```css
/* Background Surfaces */
--bg-deep-black:   #0a0a0a; /* Body background, input fields, inner containers */
--bg-console:      #0e0e0e; /* Main page background */
--bg-card:         #141414; /* Cards, metric boxes, table containers */
--bg-card-hover:   #1a1a1a; /* Hover states, dropdown menus */

/* Borders */
--border-subtle:   #262626; /* border-neutral-800 - garis pemisah standar */
--border-active:   #404040; /* border-neutral-700 - border saat hover */
--border-focus:    #ffffff; /* border-white - fokus input / state aktif */

/* Typography Colors */
--text-primary:    #ffffff; /* Judul utama, angka metrik */
--text-secondary:  #a3a3a3; /* neutral-400 - deskripsi, teks bacaan */
--text-muted:      #737373; /* neutral-500 - label teknis, metadata, timestamp */

/* Functional Accents */
--accent-green:    #10b981; /* Emerald 500 - status Lunas, Firebase Live, Success */
--accent-amber:    #f59e0b; /* Amber 500 - status Belum Bayar, Perhatian */
--accent-indigo:   #6366f1; /* Indigo 500 - fitur utama, paket harga, website */
--accent-cyan:     #06b6d4; /* Cyan 500 - pilar layanan, creative design */
--accent-red:      #ef4444; /* Red 500 - hapus, status batal, error */
```

### B. Print-Ready A4 Document Palette (Untuk Invoice / Dokumen Resmi)
```css
--print-bg:        #ffffff; /* Latar kertas putih bersih */
--print-text:      #111827; /* Teks hitam pekat korporat */
--print-muted:     #6b7280; /* Teks abu-abu untuk deskripsi sekunder */
--print-border:    #e5e7eb; /* Garis tabel dan pemisah halus */
--print-header-bg: #f3f4f6; /* Latar abu-abu terang untuk header tabel */
```

---

## 3. Tipografi & Hirarki Font

Gunakan kombinasi **3 font** dari Google Fonts berikut:

| Peran | Nama Font | Kegunaan | Karakteristik Styling |
| :--- | :--- | :--- | :--- |
| **Display / Hero** | **Anton** | Judul besar, angka metrik dashboard, badge brand `F4` | `font-display uppercase tracking-tight font-black leading-none` |
| **Body / Konten** | **Inter** | Paragraf, deskripsi konten, form input, modal | `font-sans leading-relaxed tracking-normal font-normal` |
| **Technical / Meta**| **JetBrains Mono** | Navigasi menu, kode section (`/01`), nomor invoice, harga, badge status | `font-mono text-xs uppercase tracking-wider font-semibold` |

### Aturan Tipografi:
* Setiap judul section atau kartu statistik selalu didahului dengan label monospace bergaya komentar kode:
  ```html
  <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">// MANAGEMENT</span>
  <h1 className="font-display text-3xl text-white mt-1">Invoice & Tagihan</h1>
  ```
* Angka metrik atau KPI menggunakan font besar berbobot kuat (`font-display text-3xl md:text-4xl text-white` atau `font-mono font-black text-2xl`).

---

## 4. Komponen & Pola UI Khas

### A. Metric Stat Card
Kartu metrik di beranda admin dengan nomor urut teknis di pojok kanan atas:
```tsx
<div className="p-5 bg-[#141414] border border-neutral-800 rounded-2xl flex items-center justify-between group hover:border-white transition-all duration-300">
  <div>
    <div className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
      TOTAL INVOICE
    </div>
    <div className="text-3xl font-black font-display text-white mt-1">
      24
    </div>
    <div className="text-[10px] font-mono text-neutral-500 mt-1">
      Seluruh transaksi tercatat
    </div>
  </div>
  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition">
    <Icon className="w-5 h-5" />
  </div>
</div>
```

### B. Input Field & Form Control
Input form dengan kontras tajam, latar belakang hitam pekat, dan border putih saat fokus:
```tsx
<div className="space-y-1.5">
  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400">
    Nama Klien *
  </label>
  <input
    type="text"
    placeholder="e.g. PT Nusantara Media"
    className="w-full rounded-xl px-4 py-2.5 text-xs font-mono text-white bg-[#0a0a0a] border border-neutral-800 focus:border-white focus:outline-none transition shadow-inner"
  />
</div>
```

### C. Status Badge Berpendar (Pill Indicator)
Badge status dengan nuansa translucent dan border pudar:
```tsx
{/* Status Lunas / Active */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
  Lunas
</span>

{/* Status Pending / Warning */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400">
  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
  Belum Bayar
</span>
```

### D. Tombol Aksi Utama (High-Contrast Buttons)
* **Primary**: Putih solid dengan teks hitam tajam (`bg-white text-black font-bold font-mono hover:bg-neutral-200 rounded-xl shadow-lg active:scale-95 transition`).
* **Secondary / Ghost**: Latar gelap dengan border halus (`bg-neutral-900 border border-neutral-700 hover:border-white text-neutral-200 hover:text-white rounded-xl font-mono text-xs transition`).
* **Danger**: Merah halus (`bg-red-950/40 border border-red-800/60 text-red-400 hover:bg-red-900/60 rounded-xl transition`).

### E. Sidebar Console
Sidebar vertikal dengan header logo brand badge hitam-putih `F4`:
* Badge Brand: Kotak persegi hitam/putih dengan font tebal (`bg-white text-black font-mono font-black text-sm px-2.5 py-1`).
* Item Aktif: Latar putih teks hitam dengan shadow tajam.
* Item Inaktif: Teks abu-abu `neutral-400` dengan hover latar `neutral-900` dan border `neutral-800`.

---

## 5. Master Prompt Siap Pakai (Copy-Paste untuk AI)

Salin seluruh teks di dalam blok di bawah ini saat memulai project baru dengan AI (ChatGPT, Claude, Cursor, Antigravity):

```text
Saya ingin kamu membuat antarmuka web modern dengan sistem desain khusus yang menggabungkan estetika "Neo-Brutalist High-Tech Studio" dan "Cyber-Minimalist Dark Console".

PANDUAN SISTEM DESAIN WAJIB DIIKUTI:

1. PALET WARNA (DARK CONSOLE THEME):
- Latar Belakang Terluar: #0a0a0a (deep black)
- Latar Belakang Konten Utama: #0e0e0e (console surface)
- Latar Belakang Kartu / Box / Tabel: #141414 (card surface)
- Latar Belakang Input / Form: #0a0a0a dengan border border-neutral-800 dan focus:border-white
- Border Garis Pemisah: #262626 (neutral-800) untuk batas normal, dan #404040 (neutral-700) saat hover
- Warna Teks: Putih bersih (#ffffff) untuk judul/angka utama, Abu-abu (#a3a3a3) untuk deskripsi, Abu-abu redup (#737373) untuk label teknis
- Aksen Status (Translucent Glow):
  * Sukses / Lunas / Online: bg-emerald-500/10 border-emerald-500/30 text-emerald-400 dengan lampu indikator pulse
  * Pending / Menunggu: bg-amber-500/10 border-amber-500/30 text-amber-400
  * Alert / Batal: bg-red-500/10 border-red-500/30 text-red-400

2. TIPOGRAFI & HIERARKI:
- Display / Headline: Gunakan font bergaya display tebal tegas (seperti Anton / Bebas Neue) dengan uppercase dan tracking rapat.
- Body / Reading Text: Gunakan font sans-serif modern (seperti Inter / Plus Jakarta Sans) yang sangat mudah dibaca.
- Metadata & Komentar Teknis: Gunakan font monospace (seperti JetBrains Mono / Fira Code) dengan ukuran kecil (text-xs / text-[11px]), uppercase, tracking-wider, dan diawali sintaks komentar kode seperti "// NAVIGATION", "// OVERVIEW", atau kode urutan seperti "/01", "/02".

3. TOMBOL & INTERAKSI:
- Tombol Utama (Primary): Latar belakang putih solid, teks hitam pekat font-mono font-bold, rounded-xl, hover:bg-neutral-200, efek active:scale-95.
- Tombol Sekunder: Latar neutral-900 border border-neutral-700 hover:border-white teks neutral-200 font-mono text-xs rounded-xl.
- Micro-interactions: Transisi mulus (transition-all duration-200), efek hover kartu yang memutihkan border (hover:border-white), dan floating modal dengan backdrop-blur-sm bg-black/80.

4. DOKUMEN CETAK & PDF:
- Jika terdapat fitur cetak / invoice, isolasi elemen CMS dengan utility print:hidden pada sidebar dan toolbar.
- Lembar dokumen cetak harus berlatar putih bersih (#ffffff), teks hitam pekat (#111827), format presisi A4 portrait (@page { size: A4 portrait; margin: 10mm 15mm; }), dan print-color-adjust: exact agar stempel dan header tabel tercetak tajam tanpa terpotong.

Terapkan seluruh aturan estetika di atas pada komponen dan halaman yang akan dibuat. Jangan buat tampilan yang flat, abu-abu polos, atau terkesan template biasa!
```
