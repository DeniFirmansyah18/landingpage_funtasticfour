<div align="center">

# ⚡ FUNTASTICFOUR — Full-Stack Digital Startup & Engineering

**High-Performance Web, Mobile Applications, UI/UX Craft & Device Repair Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-ffca28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 📖 Ringkasan Proyek (Overview)

**FuntasticFour** adalah platform *landing page* dan *CMS Content Management System* berarsitektur modern dengan tema desain **High-End Brutalist Editorial & Tech Startup**. 

Dibangun dengan performa tinggi, animasi kinetik halus, tipografi berkarakter tajam (**Anton**, **Inter**, dan **JetBrains Mono**), serta terintegrasi penuh secara *real-time* dengan Firebase Firestore dan Google Analytics 4 (GA4).

---

## ✨ Fitur Utama (Core Features)

### 🚀 Public Landing Page
- **Hero Display Kinetik**: Marquee ticker teks masif berlatar belakang Anton display typography dengan status live dan tombol aksi cepat.
- **Top-Right Live System Telemetry**: Log terminal melayang yang menampilkan status sistem, latensi, dan kapabilitas teknis secara berkala.
- **/ABOUT Dark Editorial Section**: Pernyataan visi dan pilar keunggulan dengan tata letak editorial asimetris modern.
- **Interactive Workflow Engine**: Pipeline 3-fase (*01 Discovery $\rightarrow$ 02 Rapid Sprint $\rightarrow$ 03 Enterprise QA*) yang dilengkapi simulasi terminal *real-time*.
- **Interactive Tech Architecture Blueprint**: Inspektur stack backend, frontend, database, dan cloud infrastructure dengan *specification inspector*.
- **Selected Works / Portfolio Gallery**: Daftar proyek baris bertitik (*dotted rows*) dengan *floating rich inspector card* interaktif saat kursor diarahkan, serta *lightbox gallery* untuk multi-screenshot.
- **Pricing & Investment Plans**: Kartu paket harga transparan dengan status tier dan fitur siap pakai.
- **Accordion FAQ & Contact Hub**: Pertanyaan umum interaktif dan formulir konsultasi dengan sanitasi input serta integrasi direct WhatsApp/Email.
- **Typographic Footer**: Tipografi brand raksasa dengan jam waktu lokal Jakarta (WIB) live.

### 🛡️ CMS Admin Control Console (`/admin`)
- **Dashboard Modular**: Status modul real-time (`/01` - `/07`) dengan tombol inisialisasi awal Firestore (*one-click seed*).
- **Hero & Badge Editor**: Pengaturan headline, aksen, deskripsi, dan strip metrik statistik di tengah (*centered stats*).
- **Pilar Layanan**: Tambah, edit, dan atur urutan (*order*) kartu layanan serta daftar fiturnya.
- **Portfolio & Multi-Image Gallery**: Dukungan upload multi-foto dengan kompresi otomatis di browser (*client-side canvas compression*) dan tautan live demo.
- **Paket & Harga**: Manajemen paket investasi dan daftar fitur terperinci.
- **Pertanyaan FAQ**: Kelola pertanyaan dan jawaban yang sering diajukan.
- **Kontak & Media Sosial**: Sinkronisasi nomor WhatsApp, email, kantor, dan tautan sosial media resmi.
- **Google Analytics (GA4) Telemetry Hub**: Monitoring status stream ID dan daftar event yang dilacak secara otomatis.

---

## 🔒 Keamanan & Optimasi SEO (Enterprise Grade)

- **Content Security Policy (CSP)**: Mengunci eksekusi script, style, font, dan koneksi API secara ketat pada domain terpercaya.
- **HSTS (HTTP Strict Transport Security)**: Proteksi koneksi HTTPS permanen (`max-age=63072000; includeSubDomains; preload`).
- **Anti-XSS Input Sanitization**: Sanitasi menyeluruh untuk memfilter script dan tag HTML berbahaya sebelum data diproses.
- **Robots & Sitemap Otomatis**: Generator dinamis `/sitemap.xml` dan `/robots.txt` dengan proteksi area admin.
- **JSON-LD Structured Data Schema**: Skema *Organization*, *WebSite*, dan *ProfessionalService* untuk memaksimalkan *Google Rich Snippets*.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [Next.js 16.3.2](https://nextjs.org/) (App Router, Turbopack, React Compiler)
- **Library UI**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan CSS Custom Properties & Brutalist Design Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore Real-time DB & Firebase Auth)
- **Telemetry**: [Google Analytics 4](https://analytics.google.com/)

---

## 🚀 Panduan Instalasi Lokal (Getting Started)

### 1. Kloning Repositori
```bash
git clone https://github.com/your-username/landingpage_funtasticfour.git
cd landingpage_funtasticfour
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel kredensial Firebase dan Google Analytics Anda:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 5. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 📂 Struktur Direktori (Project Structure)

```
landingpage_funtasticfour/
├── app/
│   ├── admin/               # Modul CMS Admin Console (Hero, Layanan, Portfolio, dll.)
│   ├── admin-login/         # Halaman otentikasi login admin
│   ├── layout.tsx           # Layout root, metadata SEO, JSON-LD Schema & Google Fonts
│   ├── page.tsx             # Halaman utama landing page
│   ├── globals.css          # Design system, CSS variables, dan kinetic animations
│   ├── robots.ts            # Next.js dynamic robots.txt generator
│   └── sitemap.ts           # Next.js dynamic sitemap.xml generator
├── components/
│   ├── admin/               # Komponen sidebar admin, modal konfirmasi, dan toast
│   ├── AboutStudio.tsx      # Seksi /ABOUT dark editorial
│   ├── Contact.tsx          # Form kontak & channel komunikasi
│   ├── FAQ.tsx              # Accordion FAQ
│   ├── Footer.tsx           # Footer dengan tipografi masif & WIB clock
│   ├── Hero.tsx             # Hero section dengan kinetic marquee background
│   ├── MarqueeTicker.tsx    # Divider animasi marquee tak terbatas
│   ├── Navbar.tsx           # Header navigasi minimalis & mobile drawer
│   ├── Portfolio.tsx        # Galeri portfolio, hover cards, dan lightbox
│   ├── Pricing.tsx          # Paket harga & investasi
│   ├── Services.tsx         # Pilar layanan dan kapabilitas
│   ├── StickySystemLog.tsx  # Telemetri live system log melayang
│   ├── TechArchitecture.tsx # Blueprints arsitektur stack & inspector
│   └── WorkflowPipeline.tsx # Pipeline alur kerja 3-fase & live terminal
├── lib/
│   ├── cms-defaults.ts      # Data cadangan (fallback) konten awal
│   ├── cms-types.ts         # TypeScript interface & data contracts
│   ├── firebase.ts          # Inisialisasi Firebase Client SDK
│   ├── gtag.ts              # Utilitas Google Analytics 4 event tracking
│   ├── sanitize.ts          # Fungsi sanitasi input & perlindungan XSS
│   └── hooks/
│       ├── useAuth.ts       # Hook otentikasi Firebase Auth
│       └── useFirestore.ts  # Hook real-time Firestore CRUD & sorting
├── public/                  # Aset statis (ikon, gambar, logo)
├── .env.example             # Template konfigurasi environment
├── next.config.ts           # Konfigurasi Next.js, CSP Headers & Image optimization
└── README.md                # Dokumentasi proyek
```

---

## 📄 Lisensi (License)

Hak Cipta © 2026 **FuntasticFour Startup**. Seluruh hak cipta dilindungi undang-undang.
