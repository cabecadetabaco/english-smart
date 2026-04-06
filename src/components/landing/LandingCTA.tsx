"use client";

import { useState } from "react";

const timeOptions = [
  "Manha (8h - 12h)",
  "Tarde (13h - 17h)",
  "Noite (18h - 21h)",
  "Sabado (9h - 12h)",
];

const benefits = [
  "Aula experimental 100% gratuita",
  "Teste de nivelamento incluso",
  "Sem compromisso ou cobranca",
  "Horario flexivel",
];

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export default function LandingCTA() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp: whatsapp.replace(/\D/g, ""),
          preferred_time: time,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setWhatsapp("");
        setTime("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontFamily: "var(--font-dm-sans)",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <section
      id="cta"
      style={{
        padding: "100px 24px",
        background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,102,255,0.08))",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
        className="cta-grid"
      >
        {/* Left - benefits */}
        <div>
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
            Comece agora
          </span>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              color: "#fff",
              marginTop: 12,
              marginBottom: 28,
            }}
          >
            Agende sua aula gratis
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {benefits.map((b) => (
              <li
                key={b}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 15,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(0,212,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    color: "#00D4FF",
                    flexShrink: 0,
                  }}
                >
                  &#10003;
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Right - form */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 20,
            padding: "36px 32px",
          }}
        >
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>&#127881;</div>
              <h3
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                Inscricao recebida!
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 15,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Entraremos em contato pelo WhatsApp em breve.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Seu nome
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00D4FF")}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")
                  }
                />
              </div>
              <div>
                <label
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(maskPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  maxLength={16}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00D4FF")}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")
                  }
                />
              </div>
              <div>
                <label
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Horario de preferencia
                </label>
                <select
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: "none",
                    cursor: "pointer",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00D4FF")}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")
                  }
                >
                  <option value="" disabled style={{ color: "#999" }}>
                    Selecione um horario
                  </option>
                  {timeOptions.map((opt) => (
                    <option key={opt} value={opt} style={{ color: "#000" }}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  background: "#FF6B35",
                  border: "none",
                  padding: "16px 24px",
                  borderRadius: 12,
                  cursor: status === "loading" ? "wait" : "pointer",
                  marginTop: 8,
                  boxShadow: "0 0 30px rgba(255,107,53,0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  opacity: status === "loading" ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (status !== "loading") {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 0 40px rgba(255,107,53,0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(255,107,53,0.3)";
                }}
              >
                {status === "loading" ? "Enviando..." : "Quero minha Aula Gratis"}
              </button>
              {status === "error" && (
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 13,
                    color: "#FF6B6B",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  Ocorreu um erro. Tente novamente.
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
