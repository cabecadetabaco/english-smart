import React from "react";

interface ProgressBarProps {
  value: number;
  size?: "sm" | "md";
}

export default function ProgressBar({ value, size = "md" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const color =
    clamped < 30 ? "#ef4444" : clamped <= 70 ? "#f59e0b" : "#22c55e";

  const trackHeight = size === "sm" ? 6 : 10;

  return (
    <div
      style={{
        width: "100%",
        height: trackHeight,
        backgroundColor: "#1a2436",
        borderRadius: trackHeight / 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          backgroundColor: color,
          borderRadius: trackHeight / 2,
          transition: "width 0.4s ease, background-color 0.4s ease",
        }}
      />
    </div>
  );
}
