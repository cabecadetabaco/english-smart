"use client";

import React from "react";

interface CheckboxActivityProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  weight?: number;
}

export default function CheckboxActivity({
  label,
  checked,
  onChange,
  weight,
}: CheckboxActivityProps) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        fontFamily: "var(--font-dm-sans)",
        fontSize: 14,
        color: "#F0F6FF",
        padding: "8px 0",
      }}
    >
      <span
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: 4,
          border: checked ? "none" : "2px solid #4A6080",
          backgroundColor: checked ? "#22c55e" : "transparent",
          transition: "background-color 0.2s ease, border-color 0.2s ease",
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{ transition: "opacity 0.2s ease" }}
          >
            <path
              d="M2 6L5 9L10 3"
              stroke="#050A18"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        style={{
          flex: 1,
          textDecoration: checked ? "line-through" : "none",
          opacity: checked ? 0.6 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        {label}
      </span>
      {weight !== undefined && (
        <span
          style={{
            fontSize: 12,
            color: "#4A6080",
            fontWeight: 600,
          }}
        >
          {weight}pts
        </span>
      )}
    </label>
  );
}
