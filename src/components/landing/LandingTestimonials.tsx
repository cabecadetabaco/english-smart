"use client";

import { useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    name: "Ana Paula Silva",
    city: "Sao Paulo, SP",
    stars: 5,
    quote:
      "Em 6 meses consegui minha certificacao e uma promocao no trabalho. A metodologia e incrivel!",
    result: "Certificada em 6 meses",
    photo: null,
  },
  {
    name: "Carlos Eduardo",
    city: "Campinas, SP",
    stars: 5,
    quote:
      "Os professores sao muito atenciosos. Finalmente perdi o medo de falar ingles em reunioes.",
    result: "Fluente em 1 ano",
    photo: null,
  },
  {
    name: "Mariana Costa",
    city: "Belo Horizonte, MG",
    stars: 5,
    quote:
      "O suporte com IA e um diferencial enorme. Posso praticar a qualquer hora do dia.",
    result: "Aprovada no TOEFL",
    photo: null,
  },
  {
    name: "Rafael Oliveira",
    city: "Rio de Janeiro, RJ",
    stars: 5,
    quote:
      "Melhor investimento que fiz. O acompanhamento personalizado faz toda a diferenca.",
    result: "Promovido no emprego",
    photo: null,
  },
];

export default function LandingTestimonials() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section
      id="testimonials"
      style={{
        padding: "100px 24px",
        background: "#050A18",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
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
            Depoimentos
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
            O que nossos alunos dizem
          </h2>
        </div>

        {/* Carousel */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              transition: "transform 0.5s ease",
              transform: `translateX(-${active * 100}%)`,
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                style={{
                  minWidth: "100%",
                  padding: "0 12px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 20,
                    padding: "40px 36px",
                    textAlign: "center",
                  }}
                >
                  {/* Photo placeholder */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #00D4FF, #0066FF)",
                      margin: "0 auto 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-syne)",
                      fontWeight: 700,
                      fontSize: 22,
                      color: "#fff",
                    }}
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  {/* Stars */}
                  <div style={{ marginBottom: 20 }}>
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          color: "#FFD700",
                          fontSize: 18,
                          marginRight: 2,
                        }}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 18,
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.8)",
                      fontStyle: "italic",
                      marginBottom: 24,
                      maxWidth: 560,
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Name & city */}
                  <div
                    style={{
                      fontFamily: "var(--font-syne)",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#fff",
                      marginBottom: 4,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 16,
                    }}
                  >
                    {t.city}
                  </div>

                  {/* Result tag */}
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 16px",
                      borderRadius: 50,
                      background: "rgba(0,212,255,0.1)",
                      border: "1px solid rgba(0,212,255,0.2)",
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#00D4FF",
                    }}
                  >
                    {t.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 32,
          }}
        >
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Depoimento ${i + 1}`}
              style={{
                width: active === i ? 28 : 10,
                height: 10,
                borderRadius: 5,
                border: "none",
                cursor: "pointer",
                background:
                  active === i
                    ? "linear-gradient(135deg, #00D4FF, #0066FF)"
                    : "rgba(255,255,255,0.2)",
                transition: "all 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
