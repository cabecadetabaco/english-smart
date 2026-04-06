"use client";

import React, { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(5,10,24,0.8)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#0D1526",
          border: "1px solid #1e2d42",
          borderRadius: 12,
          padding: 24,
          width: "90%",
          maxWidth: 520,
          maxHeight: "85vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "#8BA0BF",
            fontSize: 20,
            cursor: "pointer",
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          &#x2715;
        </button>

        {title && (
          <h2
            style={{
              margin: "0 0 16px 0",
              fontFamily: "var(--font-syne)",
              fontSize: 20,
              fontWeight: 700,
              color: "#F0F6FF",
            }}
          >
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
}
