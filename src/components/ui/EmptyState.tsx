import React from "react";

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: 48, marginBottom: 16 }}>{icon}</span>
      <h3
        style={{
          margin: "0 0 8px 0",
          fontFamily: "var(--font-syne)",
          fontSize: 18,
          fontWeight: 700,
          color: "#F0F6FF",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-dm-sans)",
          fontSize: 14,
          color: "#8BA0BF",
          maxWidth: 320,
        }}
      >
        {message}
      </p>
    </div>
  );
}
