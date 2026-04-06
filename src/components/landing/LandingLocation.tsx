"use client";

import Link from "next/link";

const contactInfo = [
  { icon: "\uD83D\uDCCD", label: "Endereco", value: "Rua das Flores, 123 - Centro, Sao Paulo - SP" },
  { icon: "\uD83D\uDCDE", label: "Telefone", value: "(11) 3456-7890" },
  { icon: "\uD83D\uDCF1", label: "WhatsApp", value: "(11) 99999-9999" },
  { icon: "\u2709\uFE0F", label: "Email", value: "contato@englishsmart.com.br" },
];

const socialLinks = [
  { name: "Instagram", url: "https://instagram.com/englishsmart" },
  { name: "Facebook", url: "https://facebook.com/englishsmart" },
  { name: "YouTube", url: "https://youtube.com/@englishsmart" },
  { name: "LinkedIn", url: "https://linkedin.com/company/englishsmart" },
];

export default function LandingLocation() {
  return (
    <section
      id="location"
      style={{
        padding: "100px 24px",
        background: "#050A18",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 13,
              fontWeight: 600,
              color: "#00D4FF",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Localizacao
          </span>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              color: "#fff",
              marginTop: 12,
            }}
          >
            Onde nos encontrar
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
          className="location-grid"
        >
          {/* Left - contact info */}
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                marginBottom: 36,
              }}
            >
              {contactInfo.map((c) => (
                <div
                  key={c.label}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>
                    {c.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: 4,
                      }}
                    >
                      {c.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 15,
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {c.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 12,
                }}
              >
                Redes Sociais
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {socialLinks.map((s) => (
                  <Link
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.6)",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)";
                      e.currentTarget.style.color = "#00D4FF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    }}
                  >
                    {s.name.slice(0, 2)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right - map */}
          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.09)",
              position: "relative",
              aspectRatio: "16/10",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975835430996!2d-46.65342!3d-23.56168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzQyLjEiUyA0NsKwMzknMTIuMyJX!5e0!3m2!1spt-BR!2sbr!4v1"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: "invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localizacao English Smart"
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .location-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
