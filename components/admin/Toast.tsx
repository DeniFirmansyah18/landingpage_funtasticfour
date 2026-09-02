"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

let listeners: ((toasts: ToastItem[]) => void)[] = [];
let toasts: ToastItem[] = [];

function notify(toastList: ToastItem[]) {
  toasts = toastList;
  listeners.forEach((l) => l(toasts));
}

export function toast(message: string, type: ToastType = "success") {
  const id = Math.random().toString(36).slice(2);
  notify([...toasts, { id, message, type }]);
  setTimeout(() => {
    notify(toasts.filter((t) => t.id !== id));
  }, 3500);
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: { border: "#22c55e", icon: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  error: { border: "#ef4444", icon: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  warning: { border: "#eab308", icon: "#eab308", bg: "rgba(234,179,8,0.15)" },
  info: { border: "#3b82f6", icon: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
};

export default function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((l) => l !== setItems);
    };
  }, []);

  const dismiss = (id: string) => notify(toasts.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none font-mono">
      {items.map((item) => {
        const Icon = icons[item.type];
        const s = styles[item.type];
        return (
          <div
            key={item.id}
            className="flex items-start gap-3 p-4 rounded-xl pointer-events-auto bg-[#0d0d0d] text-white border border-neutral-850 shadow-2xl"
            style={{
              borderColor: s.border,
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg }}
            >
              <Icon className="w-4 h-4" style={{ color: s.icon }} />
            </div>
            <p className="text-xs text-neutral-200 flex-1 pt-1 leading-snug font-sans">{item.message}</p>
            <button
              onClick={() => dismiss(item.id)}
              className="text-neutral-500 hover:text-white transition-colors flex-shrink-0 cursor-pointer pt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
