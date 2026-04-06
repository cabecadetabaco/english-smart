import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: "#00D4FF",
    color: "#050A18",
    border: "none",
  },
  secondary: {
    backgroundColor: "transparent",
    color: "#F0F6FF",
    border: "1px solid #1e2d42",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#8BA0BF",
    border: "none",
  },
  danger: {
    backgroundColor: "#ef4444",
    color: "#F0F6FF",
    border: "none",
  },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: "6px 14px", fontSize: 13 },
  md: { padding: "10px 20px", fontSize: 14 },
  lg: { padding: "14px 28px", fontSize: 16 },
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled,
  onClick,
  type = "button",
  style: customStyle,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 8,
        fontFamily: "var(--font-dm-sans)",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.2s ease, transform 0.1s ease",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...customStyle,
      }}
    >
      {children}
    </button>
  );
}
