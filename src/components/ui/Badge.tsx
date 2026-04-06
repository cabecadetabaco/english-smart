import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "info" | "success" | "warning";
  size?: "sm" | "md";
}

const variantStyles: Record<
  string,
  { backgroundColor: string; color: string }
> = {
  default: { backgroundColor: "#1a2436", color: "#8BA0BF" },
  info: { backgroundColor: "rgba(0,212,255,0.15)", color: "#00D4FF" },
  success: { backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" },
  warning: { backgroundColor: "rgba(245,158,11,0.15)", color: "#f59e0b" },
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
}: BadgeProps) {
  const vs = variantStyles[variant];
  const padding = size === "sm" ? "2px 8px" : "4px 12px";
  const fontSize = size === "sm" ? 11 : 13;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding,
        fontSize,
        fontFamily: "var(--font-dm-sans)",
        fontWeight: 600,
        borderRadius: 9999,
        backgroundColor: vs.backgroundColor,
        color: vs.color,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
