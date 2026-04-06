"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const typeStyles: Record<ToastType, { bg: string; border: string; color: string }> = {
  success: { bg: "rgba(34,197,94,0.15)", border: "#22c55e", color: "#22c55e" },
  error: { bg: "rgba(239,68,68,0.15)", border: "#ef4444", color: "#ef4444" },
  info: { bg: "rgba(0,212,255,0.15)", border: "#00D4FF", color: "#00D4FF" },
};

const typeIcons: Record<ToastType, string> = {
  success: "\u2713",
  error: "\u2717",
  info: "\u24D8",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => {
          const s = typeStyles[t.type];
          return (
            <div
              key={t.id}
              style={{
                pointerEvents: "auto",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                backgroundColor: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: 8,
                color: s.color,
                fontFamily: "var(--font-dm-sans)",
                fontSize: 14,
                fontWeight: 500,
                backdropFilter: "blur(8px)",
                animation: "toastIn 0.3s ease",
                minWidth: 260,
              }}
            >
              <span style={{ fontSize: 16 }}>{typeIcons[t.type]}</span>
              <span style={{ flex: 1 }}>{t.message}</span>
              <button
                onClick={() => remove(t.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: s.color,
                  cursor: "pointer",
                  fontSize: 14,
                  opacity: 0.7,
                  padding: 0,
                }}
              >
                &#x2715;
              </button>
            </div>
          );
        })}
        <style>{`
          @keyframes toastIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </ToastContext.Provider>
  );
}
