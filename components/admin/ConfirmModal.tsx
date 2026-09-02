"use client";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmModal({
  open,
  title = "Konfirmasi",
  message,
  confirmLabel = "Hapus",
  onConfirm,
  onCancel,
  danger = true,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="rounded-3xl p-7 w-full max-w-sm bg-[#0e0e0e] text-white border border-neutral-800 shadow-2xl font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5 mb-6">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              danger ? "bg-red-950/60 text-red-400 border border-red-800/60" : "bg-yellow-950/60 text-yellow-400 border border-yellow-800/60"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm uppercase text-white mb-1">{title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            BATAL
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer ${
              danger
                ? "bg-red-600 hover:bg-red-500"
                : "bg-black border border-white hover:bg-white hover:text-black"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
