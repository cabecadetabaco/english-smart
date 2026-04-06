import React from "react";

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: number;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function Avatar({ name, src, size = 40 }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "Avatar"}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    );
  }

  const initials = name ? getInitials(name) : "?";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #00D4FF, #0066FF)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#F0F6FF",
        fontSize: size * 0.4,
        fontFamily: "var(--font-syne)",
        fontWeight: 700,
        userSelect: "none",
      }}
    >
      {initials}
    </div>
  );
}
