// ─── Hero ─────────────────────────────────────────────────────────────────
export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroData {
  badge: string;
  headline: string;
  headlineAccent: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: HeroStat[];
}

// ─── Service ──────────────────────────────────────────────────────────────
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  color: string;
  bgGlow: string;
  iconName: string; // "Globe" | "Smartphone" | "Palette" | "Wrench" | "Code2" | etc.
  badge: string;
  order: number;
}

// ─── Portfolio ────────────────────────────────────────────────────────────
export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  color: string;
  bg: string;
  iconName: string;
  cols: number; // 1 or 2
  order: number;
  imageUrl?: string;     // Cover image URL
  images?: string[];     // Gallery / screenshot example images
  projectUrl?: string; // Optional live link / demo website URL
}

// ─── Testimonial ──────────────────────────────────────────────────────────
export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string; // initials e.g. "BS"
  color: string;
  order: number;
}

// ─── Pricing ──────────────────────────────────────────────────────────────
export interface PricingPlan {
  id: string;
  name: string;
  iconName: string;
  priceMonthly: string;
  priceYearly: string;
  color: string;
  bgGlow: string;
  description: string;
  features: string[];
  notIncluded: string[];
  cta: string;
  popular: boolean;
  order: number;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

// ─── Contact ──────────────────────────────────────────────────────────────
export interface ContactData {
  email: string;
  phone: string;
  whatsapp: string; // full URL
  location: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

// ─── CMS Store ────────────────────────────────────────────────────────────
export interface CMSData {
  hero: HeroData;
  contact: ContactData;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  pricing: PricingPlan[];
  faq: FAQItem[];
}
