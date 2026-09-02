"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ArrowUpRight,
  ImageIcon,
} from "lucide-react";
import { useCollection } from "@/lib/hooks/useFirestore";
import { defaultPortfolio } from "@/lib/cms-defaults";
import type { PortfolioItem } from "@/lib/cms-types";

// Enhanced project metadata fallback for rich cards
const richProjectMeta: Record<
  string,
  { challenge: string; solution: string; result: string }
> = {
  default: {
    challenge: "Kebutuhan sistem dengan throughput tinggi dan pengalaman UI instan tanpa jeda muat.",
    solution: "Arsitektur serverless, database real-time terdistribusi, dan optimalisasi asset.",
    result: "Peningkatan efisiensi operasional 40% dan loading speed di bawah 0.8s.",
  },
};

export default function Portfolio() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data: firestoreProjects } = useCollection<PortfolioItem>("portfolio");
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Mouse position tracking for floating card effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const projects = firestoreProjects.length > 0 ? firestoreProjects : defaultPortfolio;

  const handleOpenDetail = (project: PortfolioItem) => {
    setSelectedProject(project);
    setActivePhotoIndex(0);
  };

  const handleCloseDetail = () => {
    setSelectedProject(null);
  };

  const projectPhotos = selectedProject
    ? selectedProject.images && selectedProject.images.length > 0
      ? selectedProject.images
      : selectedProject.imageUrl
        ? [selectedProject.imageUrl]
        : []
    : [];

  const handleNextPhoto = useCallback(() => {
    if (projectPhotos.length <= 1) return;
    setActivePhotoIndex((prev) => (prev + 1) % projectPhotos.length);
  }, [projectPhotos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (projectPhotos.length <= 1) return;
    setActivePhotoIndex((prev) => (prev - 1 + projectPhotos.length) % projectPhotos.length);
  }, [projectPhotos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "Escape") handleCloseDetail();
      if (e.key === "ArrowRight") handleNextPhoto();
      if (e.key === "ArrowLeft") handlePrevPhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, handleNextPhoto, handlePrevPhoto]);

  return (
    <section id="portfolio" className="py-28 px-6 md:px-12 bg-white text-black relative">
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-neutral-200 pb-8">
          <div>
            <span className="pill-badge bg-black text-white mb-3">
              04/05 // KARYA TERPILIH
            </span>
            <h2 className="font-display text-4xl md:text-7xl uppercase tracking-tight leading-none">
              Selected Works
            </h2>
          </div>
          <p className="text-neutral-600 text-sm md:text-base max-w-md mt-4 md:mt-0 font-light">
            Arahkan kursor untuk melihat preview spesifikasi cepat atau klik untuk membuka galeri & detail lengkap.
          </p>
        </div>

        {/* Interactive Project Rows (Signature octopus.my.id Brutalist Architecture) */}
        <div className="flex flex-col w-full">
          {projects.map((project, index) => {
            const coverImage =
              project.imageUrl ||
              (project.images && project.images[0]) ||
              "https://placehold.co/600x400/111/fff?text=FuntasticFour+Project";
            const isHovered = hoveredProjectId === (project.id || String(index));
            const meta = richProjectMeta[project.id] || richProjectMeta.default;

            return (
              <div
                key={project.id || index}
                onMouseEnter={(e) => {
                  setHoveredProjectId(project.id || String(index));
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                }}
                onMouseLeave={() => setHoveredProjectId(null)}
                onClick={() => handleOpenDetail(project)}
                className="project-row flex flex-col md:flex-row justify-between md:items-end py-10 cursor-pointer group relative select-none"
              >
                <div className="flex items-baseline gap-4 md:gap-8">
                  <span className="font-mono text-sm text-neutral-400 font-semibold">
                    /{String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-3xl sm:text-5xl md:text-6xl transition-transform origin-left group-hover:scale-95 group-hover:text-neutral-500 uppercase">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center gap-6 mt-4 md:mt-0">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest block text-black">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {(project.tech || []).slice(0, 3).join(" · ")}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center group-hover:bg-black group-hover:text-white transition duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Floating Rich Inspector Card (Desktop Hover) */}
                <div
                  className="project-hover-card hidden lg:flex bg-[#0d0d0d] text-white border border-neutral-800 rounded-xl overflow-hidden pointer-events-none"
                  style={{
                    left: `${Math.min(Math.max(mousePos.x, 280), 800)}px`,
                    top: `10px`,
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered
                      ? "translate(-50%, -50%) scale(1)"
                      : "translate(-50%, -50%) scale(0.85)",
                  }}
                >
                  {/* Left Half: Image */}
                  <div className="w-1/2 h-full relative overflow-hidden bg-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-3 text-[10px] font-mono uppercase bg-black/70 px-2 py-0.5 rounded text-neutral-300 border border-neutral-800">
                      KLIK UNTUK GALERI
                    </div>
                  </div>

                  {/* Right Half: Technical Specification */}
                  <div className="w-1/2 p-5 flex flex-col justify-between font-mono text-[10px] text-neutral-300 leading-normal border-l border-neutral-800 bg-[#070707]">
                    <div>
                      <p className="text-[11px] text-white font-bold tracking-wider mb-2 font-display uppercase">
                        // SPECIFICATIONS
                      </p>
                      <div className="mb-2.5">
                        <span className="text-green-400 block font-bold">// TECH STACK:</span>
                        <span className="text-white truncate block">
                          {(project.tech || []).join(", ") || "Next.js, TypeScript, Tailwind"}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-red-400 block font-bold">// TANTANGAN:</span>
                        <span className="text-neutral-400 line-clamp-2">
                          {project.description || meta.challenge}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-neutral-800 pt-2">
                      <div className="mb-1.5">
                        <span className="text-yellow-400 block font-bold">// SOLUSI:</span>
                        <span className="text-neutral-400 line-clamp-2">{meta.solution}</span>
                      </div>
                      <div>
                        <span className="text-blue-400 block font-bold">// HASIL:</span>
                        <span className="text-white font-semibold">{meta.result}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All / Direct Contact Link */}
        <div className="mt-16 text-center">
          <a
            href="#kontak"
            className="inline-block text-xs font-mono font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-neutral-500 transition"
          >
            DISCOVERY LEBIH BANYAK PROYEK BERSAMA KAMI &rarr;
          </a>
        </div>
      </div>

      {/* DETAIL MODAL / LIGHTBOX WITH PHOTO GALLERY (PRESERVED & STYLED) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetail}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl rounded-3xl overflow-hidden z-10 my-auto shadow-2xl border border-neutral-800 bg-[#0d0d0d] text-white"
              style={{ maxHeight: "92vh" }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseDetail}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/80 hover:bg-white hover:text-black text-white flex items-center justify-center border border-neutral-700 transition cursor-pointer"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col overflow-y-auto max-h-[90vh]">
                {/* Photo Carousel Area */}
                {projectPhotos.length > 0 ? (
                  <div className="relative bg-black flex flex-col items-center justify-center">
                    <div className="relative w-full h-[280px] sm:h-[400px] md:h-[480px] overflow-hidden flex items-center justify-center bg-[#070707]">
                      <AnimatePresence mode="wait">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <motion.img
                          key={activePhotoIndex}
                          src={projectPhotos[activePhotoIndex]}
                          alt={`${selectedProject.title} Screenshot ${activePhotoIndex + 1}`}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.02 }}
                          transition={{ duration: 0.25 }}
                          className="w-full h-full object-contain"
                        />
                      </AnimatePresence>

                      {projectPhotos.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevPhoto}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-white hover:text-black text-white flex items-center justify-center border border-neutral-700 transition cursor-pointer"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleNextPhoto}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-white hover:text-black text-white flex items-center justify-center border border-neutral-700 transition cursor-pointer"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>

                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 font-mono text-white text-xs border border-neutral-700">
                            {activePhotoIndex + 1} / {projectPhotos.length}
                          </div>
                        </>
                      )}
                    </div>

                    {projectPhotos.length > 1 && (
                      <div className="w-full bg-[#0a0a0a] px-4 py-3 border-t border-neutral-800 flex items-center justify-center gap-2.5 overflow-x-auto">
                        {projectPhotos.map((photo, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActivePhotoIndex(idx)}
                            className="relative rounded-lg overflow-hidden flex-shrink-0 transition-all cursor-pointer border-2"
                            style={{
                              width: "70px",
                              height: "44px",
                              borderColor: activePhotoIndex === idx ? "#ffffff" : "transparent",
                              opacity: activePhotoIndex === idx ? 1 : 0.5,
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo}
                              alt={`Thumb ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-48 bg-neutral-900 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-neutral-600" />
                  </div>
                )}

                {/* Details Content */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="pill-badge bg-white text-black mb-3">
                      {selectedProject.category}
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl uppercase text-white mt-2">
                      {selectedProject.title}
                    </h2>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      // TENTANG PROYEK
                    </h4>
                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
                      {selectedProject.description}
                    </p>
                  </div>

                  {selectedProject.tech && selectedProject.tech.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
                        // TEKNOLOGI & STACK
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech.map((t) => (
                          <span
                            key={t}
                            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800">
                    <div className="text-xs font-mono text-neutral-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      ENGINEERED BY FUNTASTICFOUR
                    </div>

                    <div className="flex items-center gap-3">
                      {selectedProject.projectUrl && (
                        <a
                          href={selectedProject.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-brutalist-white text-xs py-2.5 px-5 flex items-center gap-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> LIVE DEMO
                        </a>
                      )}
                      <button
                        onClick={handleCloseDetail}
                        className="btn-outline-dark bg-neutral-900 text-white border-neutral-700 text-xs py-2.5 px-5"
                      >
                        TUTUP
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
