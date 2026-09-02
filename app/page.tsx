import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeTicker from "@/components/MarqueeTicker";
import AboutStudio from "@/components/AboutStudio";
import Services from "@/components/Services";
import WorkflowPipeline from "@/components/WorkflowPipeline";
import Portfolio from "@/components/Portfolio";
import TechArchitecture from "@/components/TechArchitecture";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StickySystemLog from "@/components/StickySystemLog";

export default function Home() {
  return (
    <main className="relative bg-[#f4f4f4] min-h-screen text-[#111111]">
      {/* Top-Right Sticky System Status Log */}
      <StickySystemLog />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Marquee Ticker 1 */}
      <MarqueeTicker />

      {/* /ABOUT Dark Editorial Section */}
      <AboutStudio />

      {/* Services & Core Pillars */}
      <Services />

      {/* Marquee Ticker 2 (Reverse) */}
      <MarqueeTicker reverse />

      {/* Interactive Workflow Pipeline */}
      <WorkflowPipeline />

      {/* Selected Works (Dotted Row List + Hover Rich Cards + Lightbox) */}
      <Portfolio />

      {/* Tech Stack & Architecture Blueprint */}
      <TechArchitecture />

      {/* Pricing Plans */}
      <Pricing />

      {/* FAQ Accordion */}
      <FAQ />

      {/* Contact Section */}
      <Contact />

      {/* Typographic Footer */}
      <Footer />
    </main>
  );
}
