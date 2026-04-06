"use client";

import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { label: "Curso", href: "#features" },
  { label: "Metodologia", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#location" },
  { label: "Login", href: "/login" },
];

export default function LandingFooter() {
  return (
    <footer
      style={{
        padding: "48px 24px 24px",
        background: "#0D1526",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <Image
            src="/assets/logos/logo-badge-color.jpg"
            alt="English Smart"
            width={36}
            height={36}
            style={{ borderRadius: 8 }}
          />
          <span
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 18,
              color: "#fff",
            }}
          >
            English Smart
          </span>
        </Link>

        {/* Links */}
        <nav
          style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {footerLinks.map((link) => {
            const isInternal = link.href.startsWith("/");
            const style: React.CSSProperties = {
              fontFamily: "var(--font-dm-sans)",
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
              transition: "color 0.2s",
            };

            if (isInternal) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  style={style}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00D4FF")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                  }
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <a
                key={link.label}
                href={link.href}
                style={style}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00D4FF")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                }
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Copyright */}
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 13,
            color: "rgba(255,255,255,0.35)",
            margin: 0,
            textAlign: "center",
          }}
        >
          &copy; {new Date().getFullYear()} English Smart. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
