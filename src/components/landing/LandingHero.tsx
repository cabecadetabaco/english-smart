"use client";

import Image from "next/image";

export default function LandingHero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "120px 24px 80px",
        background: "#050A18",
        overflow: "hidden",
      }}
    >
      {/* Animated orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)",
          animation: "float 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 70%)",
          animation: "float 10s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)",
          animation: "float 12s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* Left column - text */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 50,
              background: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.2)",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00D4FF",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 13,
                fontWeight: 600,
                color: "#00D4FF",
                letterSpacing: 0.5,
              }}
            >
              #1 Escola de Ingles da Regiao
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 1.05,
              color: "#fff",
              marginBottom: 24,
            }}
          >
            Sua fluencia{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D4FF, #0066FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              comeca aqui.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 18,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.65)",
              maxWidth: 480,
              marginBottom: 32,
            }}
          >
            Metodologia comprovada com aulas ao vivo, suporte com IA e
            acompanhamento personalizado. Do basico a fluencia, no seu ritmo.
          </p>

          {/* Social proof */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 40,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>&#11088;</span>
              <span
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <strong style={{ color: "#fff" }}>1.200+</strong> alunos formados
              </span>
            </div>
            <div
              style={{
                width: 1,
                height: 20,
                background: "rgba(255,255,255,0.15)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>&#9733;</span>
              <span
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <strong style={{ color: "#fff" }}>4.9/5</strong> no Google
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="#cta"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                background: "#FF6B35",
                padding: "16px 36px",
                borderRadius: 50,
                textDecoration: "none",
                boxShadow: "0 0 30px rgba(255,107,53,0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 0 40px rgba(255,107,53,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(255,107,53,0.4)";
              }}
            >
              Quero minha Aula Gratis
            </a>
            <a
              href="#how-it-works"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 16,
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                padding: "16px 36px",
                borderRadius: 50,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.15)",
                transition: "all 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)";
                e.currentTarget.style.color = "#00D4FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "rgba(255,255,255,0.8)";
              }}
            >
              Ver como funciona
            </a>
          </div>
        </div>

        {/* Right column - visual */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="hero-visual"
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 440,
              aspectRatio: "3/4",
              borderRadius: 24,
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.09)",
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
            }}
          >
            <Image
              src="/assets/images/professor.png"
              alt="Professor English Smart"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-visual { display: none !important; }
        }
      `}</style>
    </section>
  );
}
