import type { Metadata, Viewport } from "next";
import { Inter, Anton, JetBrains_Mono } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://funtasticfour.id"),
  title: {
    default: "FuntasticFour | Digital Startup & High-Performance Engineering",
    template: "%s | FuntasticFour",
  },
  description:
    "Startup rekayasa digital end-to-end: Pembuatan Website Modern, Aplikasi Mobile, UI/UX Design Berkelas, dan Reparasi Perangkat Berstandar Tinggi.",
  applicationName: "FuntasticFour",
  authors: [{ name: "FuntasticFour Team", url: "https://funtasticfour.id" }],
  generator: "Next.js",
  keywords: [
    "jasa website jakarta",
    "pembuatan aplikasi mobile",
    "software house indonesia",
    "desain UI/UX",
    "jasa landing page cepat",
    "reparasi perangkat",
    "web developer indonesia",
    "mobile app developer",
    "FuntasticFour",
    "digital startup indonesia",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FuntasticFour | Digital Startup & High-Performance Engineering",
    description:
      "Startup rekayasa digital end-to-end: Pembuatan Website Modern, Aplikasi Mobile, UI/UX Design Berkelas, dan Reparasi Perangkat Berstandar Tinggi.",
    url: "https://funtasticfour.id",
    siteName: "FuntasticFour",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "FuntasticFour Digital Startup & High-Performance Engineering",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FuntasticFour | Digital Startup & High-Performance Engineering",
    description:
      "Startup rekayasa digital end-to-end: Pembuatan Website Modern, Aplikasi Mobile, UI/UX Design Berkelas, dan Reparasi Perangkat Berstandar Tinggi.",
    creator: "@funtasticfour",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data for Search Engines
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://funtasticfour.id/#organization",
      name: "FuntasticFour",
      url: "https://funtasticfour.id",
      logo: "https://funtasticfour.id/logo.png",
      sameAs: [
        "https://www.instagram.com/",
        "https://twitter.com/",
        "https://www.linkedin.com/",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+62-812-3456-7890",
        contactType: "Customer Support",
        areaServed: "ID",
        availableLanguage: ["Indonesian", "English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://funtasticfour.id/#website",
      url: "https://funtasticfour.id",
      name: "FuntasticFour",
      description: "Digital Startup & High-Performance Engineering",
      publisher: {
        "@id": "https://funtasticfour.id/#organization",
      },
      inLanguage: "id-ID",
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://funtasticfour.id/#service",
      name: "FuntasticFour Digital Startup",
      image: "https://funtasticfour.id/og-preview.png",
      url: "https://funtasticfour.id",
      telephone: "+62-812-3456-7890",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jakarta",
        addressCountry: "ID",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "20:00",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${anton.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-black selection:text-white bg-[var(--bg-color)] text-[var(--text-main)]">
        <GoogleAnalytics />
        <div className="noise-texture" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
