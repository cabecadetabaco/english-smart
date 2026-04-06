"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "O Curso", href: "#features" },
  { label: "Como Funciona", href: "#how-it-works" },
  { label: "Depoimentos", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 24px",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        background: scrolled
          ? "rgba(5,10,24,0.85)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.09)"
          : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <Image
          src="/assets/logos/logo-badge-color.jpg"
          alt="English Smart"
          width={40}
          height={40}
          style={{ borderRadius: 8 }}
        />
        <span
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 20,
            color: "#fff",
          }}
        >
          English Smart
        </span>
      </Link>

      {/* Desktop links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 28,
            alignItems: "center",
          }}
          className="desktop-nav-links"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00D4FF")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          href="/login"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          className="desktop-nav-links"
          onMouseEnter={(e) => (e.currentTarget.style.color = "#00D4FF")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
          }
        >
          Area do Aluno
        </Link>

        <a
          href="#cta"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: "#FF6B35",
            padding: "10px 24px",
            borderRadius: 50,
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 0 20px rgba(255,107,53,0.3)",
          }}
          className="desktop-nav-links"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(255,107,53,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(255,107,53,0.3)";
          }}
        >
          Aula Gratis
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          className="mobile-menu-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
          }}
        >
          <div style={{ width: 24, height: 18, position: "relative" }}>
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "#fff",
                borderRadius: 2,
                position: "absolute",
                top: menuOpen ? 8 : 0,
                transform: menuOpen ? "rotate(45deg)" : "none",
                transition: "all 0.3s",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "#fff",
                borderRadius: 2,
                position: "absolute",
                top: 8,
                opacity: menuOpen ? 0 : 1,
                transition: "all 0.3s",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "#fff",
                borderRadius: 2,
                position: "absolute",
                top: menuOpen ? 8 : 16,
                transform: menuOpen ? "rotate(-45deg)" : "none",
                transition: "all 0.3s",
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: 72,
            left: 0,
            right: 0,
            background: "rgba(5,10,24,0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.09)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 16,
                fontWeight: 500,
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 16,
              fontWeight: 500,
              color: "rgba(255,255,255,0.8)",
              textDecoration: "none",
            }}
          >
            Area do Aluno
          </Link>
          <a
            href="#cta"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: "#FF6B35",
              padding: "12px 24px",
              borderRadius: 50,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Aula Gratis
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav-links { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
