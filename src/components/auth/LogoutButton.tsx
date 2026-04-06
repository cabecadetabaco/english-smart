"use client";

import React from "react";
import { logout } from "@/lib/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "10px 16px",
          background: "none",
          border: "none",
          color: "#ef4444",
          fontFamily: "var(--font-dm-sans)",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          borderRadius: 8,
          transition: "background-color 0.2s ease",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sair
      </button>
    </form>
  );
}
