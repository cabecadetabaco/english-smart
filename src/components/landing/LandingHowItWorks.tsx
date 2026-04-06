"use client";

import React from "react";

const steps = [
  {
    number: "01",
    title: "Teste de nivelamento",
    desc: "Faca um teste rapido e gratuito para descobrirmos seu nivel atual de ingles.",
    icon: "\uD83D\uDCCB",
  },
  {
    number: "02",
    title: "Escolha seu horario",
    desc: "Selecione os melhores dias e horarios para suas aulas ao vivo com professor.",
    icon: "\uD83D\uDCC5",
  },
  {
    number: "03",
    title: "Conquiste a fluencia",
    desc: "Acompanhe seu progresso, pratique diariamente e alcance seus objetivos.",
    icon: "\uD83D\uDE80",
  },
];

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
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
            Como funciona
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
            3 passos para sua fluencia
          </h2>
        </div>

        {/* Timeline */}
        <div
          style={{
            display: "flex",
            gap: 32,
            position: "relative",
            justifyContent: "center",
          }}
          className="hiw-timeline"
        >
          {steps.map((step, i) => (
            <React.Fragment key={step.number}>
              <div
                style={{
                  flex: "1",
                  maxWidth: 320,
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 20,
                  padding: "36px 28px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #00D4FF, #0066FF)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-syne)",
                    fontWeight: 800,
                    fontSize: 13,
                    color: "#fff",
                  }}
                >
                  {step.number}
                </div>

                <div style={{ fontSize: 40, marginBottom: 20, marginTop: 8 }}>
                  {step.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#fff",
                    marginBottom: 12,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  {step.desc}
                </p>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="hiw-connector"
                  style={{
                    alignSelf: "center",
                    width: 60,
                    height: 2,
                    background:
                      "linear-gradient(90deg, #00D4FF, #0066FF)",
                    borderRadius: 2,
                    flexShrink: 0,
                    opacity: 0.4,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hiw-timeline {
            flex-direction: column !important;
            align-items: center !important;
          }
          .hiw-connector {
            width: 2px !important;
            height: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
