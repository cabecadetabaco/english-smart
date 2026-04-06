import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export default function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 6,
}: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background:
          "linear-gradient(90deg, #1a2436 25%, #243044 50%, #1a2436 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite ease-in-out",
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
