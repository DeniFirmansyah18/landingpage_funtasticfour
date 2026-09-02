import type {
  HeroData,
  ContactData,
  ServiceItem,
  PortfolioItem,
  PricingPlan,
  FAQItem,
} from "./cms-types";

export const defaultHero: HeroData = {
  badge: "",
  headline: "Wujudkan Impian Digital Anda",
  headlineAccent: "Bersama Kami",
  subtitle:
    "Dari website profesional, aplikasi mobile canggih, hingga desain yang memukau dan reparasi perangkat semua ada di satu tempat.",
  ctaPrimary: "Mulai Proyek Anda",
  ctaSecondary: "Lihat Layanan",
  stats: [
    { value: "200+", label: "Proyek Selesai" },
    { value: "98%", label: "Klien Puas" },
    { value: "5+", label: "Tahun Pengalaman" },
    { value: "24/7", label: "Fast Respon Support" },
  ],
};

export const defaultContact: ContactData = {
  email: "hello@funtasticfour.id",
  phone: "+62 812 3456 7890",
  whatsapp: "https://wa.me/6281234567890",
  location: "Jakarta, Indonesia",
  instagram: "#",
  twitter: "#",
  linkedin: "#",
  youtube: "#",
};

export const defaultServices: ServiceItem[] = [
  {
    id: "def-srv-1",
    title: "Pembuatan Website",
    description:
      "Website profesional yang cepat, responsif, dan dioptimalkan untuk SEO. Dari landing page hingga platform e-commerce yang kompleks.",
    features: [
      "Landing Page & Company Profile",
      "E-Commerce & Toko Online",
      "Web Application (CMS, Dashboard)",
      "Optimasi SEO & Performa",
    ],
    color: "#6366f1",
    bgGlow: "rgba(99,102,241,0.15)",
    iconName: "Globe",
    badge: "",
    order: 0,
  },
  {
    id: "def-srv-2",
    title: "Pengembangan Aplikasi",
    description:
      "Aplikasi mobile native dan cross-platform yang intuitif dan scalable. Android & iOS dengan pengalaman pengguna yang luar biasa.",
    features: [
      "Android & iOS Native App",
      "Cross-Platform (Flutter/React Native)",
      "Backend API & Database",
      "Integrasi Payment & Third-party API",
    ],
    color: "#8b5cf6",
    bgGlow: "rgba(139,92,246,0.15)",
    iconName: "Smartphone",
    badge: "",
    order: 1,
  },
  {
    id: "def-srv-3",
    title: "Desain Kreatif",
    description:
      "Desain UI/UX yang memukau dan branding yang kuat untuk meningkatkan kepercayaan pengguna dan nilai bisnis Anda.",
    features: [
      "UI/UX Design (Figma)",
      "Brand Identity & Logo",
      "Social Media Design",
      "Ilustrasi & Motion Graphics",
    ],
    color: "#06b6d4",
    bgGlow: "rgba(6,182,212,0.15)",
    iconName: "Palette",
    badge: "",
    order: 2,
  },
  {
    id: "def-srv-4",
    title: "Reparasi Perangkat",
    description:
      "Servis cepat dan terpercaya untuk smartphone, laptop, komputer, dan perangkat elektronik lainnya oleh teknisi berpengalaman.",
    features: [
      "Perbaikan Smartphone & Tablet",
      "Service Laptop & Komputer",
      "Recovery Data",
      "Instalasi Software & OS",
    ],
    color: "#f59e0b",
    bgGlow: "rgba(245,158,11,0.12)",
    iconName: "Wrench",
    badge: "",
    order: 3,
  },
];

export const defaultPortfolio: PortfolioItem[] = [
  {
    id: "def-port-1",
    title: "SiapBeli E-Commerce",
    category: "Website",
    description:
      "Platform e-commerce lengkap dengan sistem manajemen stok, payment gateway, dan dashboard analitik real-time.",
    tech: ["Next.js", "Node.js", "PostgreSQL"],
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
    iconName: "Globe",
    cols: 2,
    order: 0,
    imageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
    ],
    projectUrl: "https://example.com/siapbeli",
  },
  {
    id: "def-port-2",
    title: "HealthTrack App",
    category: "Aplikasi",
    description:
      "Aplikasi kesehatan personal untuk tracking aktivitas, diet, dan konsultasi dokter online.",
    tech: ["Flutter", "Firebase", "REST API"],
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    iconName: "Smartphone",
    cols: 1,
    order: 1,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1200&auto=format&fit=crop"
    ],
    projectUrl: "https://example.com/healthtrack",
  },
  {
    id: "def-port-3",
    title: "Nusantara Brand Kit",
    category: "Desain",
    description:
      "Identitas visual lengkap: logo, palet warna, tipografi, dan panduan brand untuk startup kuliner.",
    tech: ["Figma", "Illustrator", "Photoshop"],
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    iconName: "Palette",
    cols: 1,
    order: 2,
    imageUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop"
    ],
    projectUrl: "https://example.com/nusantara",
  },
  {
    id: "def-port-4",
    title: "KoperasiKu Dashboard",
    category: "Website",
    description:
      "Sistem manajemen koperasi digital dengan fitur simpan-pinjam, laporan keuangan, dan notifikasi otomatis.",
    tech: ["React", "Laravel", "MySQL"],
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    iconName: "Globe",
    cols: 1,
    order: 3,
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop"
    ],
    projectUrl: "https://example.com/koperasiku",
  },
  {
    id: "def-port-5",
    title: "TokoKita POS System",
    category: "Aplikasi",
    description:
      "Sistem kasir digital terintegrasi dengan inventory management dan laporan penjualan harian.",
    tech: ["React Native", "Node.js", "MongoDB"],
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    iconName: "Smartphone",
    cols: 1,
    order: 4,
    imageUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop"
    ],
    projectUrl: "https://example.com/tokokita",
  },
  {
    id: "def-port-6",
    title: "EduLearn Platform",
    category: "Website",
    description:
      "Platform edukasi online dengan fitur video streaming, kuis interaktif, dan sertifikasi digital.",
    tech: ["Next.js", "Prisma", "AWS S3"],
    color: "#ec4899",
    bg: "rgba(236,72,153,0.08)",
    iconName: "Globe",
    cols: 2,
    order: 5,
    imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
    ],
    projectUrl: "https://example.com/edulearn",
  },
];

export const defaultPricing: PricingPlan[] = [
  {
    id: "def-prc-1",
    name: "Starter",
    iconName: "Zap",
    priceMonthly: "999",
    priceYearly: "799",
    color: "#6366f1",
    bgGlow: "rgba(99,102,241,0.1)",
    description: "Sempurna untuk bisnis kecil dan startup yang baru memulai perjalanan digital.",
    features: [
      "Landing Page / Company Profile",
      "Desain responsif mobile-friendly",
      "Optimasi SEO dasar",
      "Domain & Hosting 1 tahun",
      "3x revisi desain",
      "Support via WhatsApp",
      "Garansi 3 bulan",
    ],
    notIncluded: ["CMS / Dashboard Admin", "Integrasi Payment Gateway"],
    cta: "Mulai Sekarang",
    popular: false,
    order: 0,
  },
  {
    id: "def-prc-2",
    name: "Professional",
    iconName: "Star",
    priceMonthly: "2.999",
    priceYearly: "2.499",
    color: "#8b5cf6",
    bgGlow: "rgba(139,92,246,0.15)",
    description: "Pilihan terbaik untuk bisnis yang ingin tampil profesional dengan fitur lengkap.",
    features: [
      "Website / App custom penuh",
      "CMS / Dashboard Admin",
      "Integrasi Payment Gateway",
      "Optimasi SEO lanjutan",
      "Domain & Hosting 1 tahun",
      "Unlimited revisi desain",
      "Support prioritas 24/7",
      "Garansi 6 bulan",
      "Google Analytics setup",
    ],
    notIncluded: [],
    cta: "Pilih Professional",
    popular: false,
    order: 1,
  },
  {
    id: "def-prc-3",
    name: "Enterprise",
    iconName: "Building2",
    priceMonthly: "Custom",
    priceYearly: "Custom",
    color: "#06b6d4",
    bgGlow: "rgba(6,182,212,0.1)",
    description: "Solusi skala besar untuk perusahaan dengan kebutuhan yang kompleks dan spesifik.",
    features: [
      "Semua fitur Professional",
      "Arsitektur custom & scalable",
      "Dedicated project manager",
      "Tim developer dedicated",
      "SLA 99.9% uptime",
      "Keamanan enterprise-grade",
      "Onboarding & training tim",
      "Garansi 12 bulan",
      "Integrasi ERP/CRM",
    ],
    notIncluded: [],
    cta: "Hubungi Sales",
    popular: false,
    order: 2,
  },
];

export const defaultFAQ: FAQItem[] = [
  {
    id: "def-faq-1",
    question: "Berapa lama waktu yang dibutuhkan untuk membuat website?",
    answer:
      "Waktu pengerjaan tergantung pada kompleksitas proyek. Landing page sederhana bisa selesai dalam 3-7 hari kerja. Website e-commerce atau web application biasanya membutuhkan 2-6 minggu.",
    order: 0,
  },
  {
    id: "def-faq-2",
    question: "Apakah saya bisa meminta revisi desain?",
    answer:
      "Tentu saja! Paket Starter mendapatkan 3x revisi, sedangkan paket Professional dan Enterprise mendapatkan unlimited revisi. Kepuasan Anda adalah prioritas utama kami.",
    order: 1,
  },
  {
    id: "def-faq-3",
    question: "Teknologi apa yang digunakan untuk pengembangan?",
    answer:
      "Kami menggunakan teknologi modern: React, Next.js, Node.js, Laravel, Flutter, React Native, PostgreSQL, MySQL, dan MongoDB. Pemilihan disesuaikan dengan kebutuhan proyek Anda.",
    order: 2,
  },
  {
    id: "def-faq-4",
    question: "Apakah ada biaya maintenance setelah proyek selesai?",
    answer:
      "Semua paket sudah termasuk garansi maintenance (3-12 bulan) yang mencakup perbaikan bug dan update keamanan. Setelah itu, kami menawarkan paket maintenance bulanan yang terjangkau.",
    order: 3,
  },
  {
    id: "def-faq-5",
    question: "Bagaimana proses pembayaran dilakukan?",
    answer:
      "Sistem pembayaran kami: 50% DP di awal, 50% pelunasan setelah proyek selesai. Kami menerima transfer bank, QRIS, dan berbagai metode pembayaran digital.",
    order: 4,
  },
  {
    id: "def-faq-6",
    question: "Apakah layanan reparasi tersedia untuk semua merek?",
    answer:
      "Ya! Tim kami berpengalaman menangani berbagai merek smartphone (Apple, Samsung, Xiaomi, OPPO), laptop (Asus, Lenovo, Dell, HP, MacBook), dan perangkat elektronik lainnya.",
    order: 5,
  },
];
