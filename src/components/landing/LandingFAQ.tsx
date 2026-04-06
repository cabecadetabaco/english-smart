"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Preciso ter algum conhecimento previo de ingles?",
    a: "Nao! Temos turmas do nivel basico ao avancado. O teste de nivelamento gratuito vai determinar o melhor ponto de partida para voce.",
  },
  {
    q: "Como funcionam as aulas ao vivo?",
    a: "As aulas acontecem por videoconferencia com professor dedicado. Voce pode interagir em tempo real, tirar duvidas e praticar conversacao.",
  },
  {
    q: "Qual a duracao do curso completo?",
    a: "O curso completo tem 4 modulos. A maioria dos alunos completa em 12 a 18 meses, mas voce segue no seu proprio ritmo.",
  },
  {
    q: "Posso reagendar uma aula?",
    a: "Sim! Voce pode reagendar aulas com ate 24 horas de antecedencia diretamente pela plataforma, sem custo adicional.",
  },
  {
    q: "O certificado e reconhecido?",
    a: "Sim, nosso certificado e reconhecido e pode ser usado em curriculos, processos seletivos e como comprovante de proficiencia.",
  },
  {
    q: "Como funciona o suporte com IA?",
    a: "Nossa plataforma conta com assistente de inteligencia artificial disponivel 24h para tirar duvidas de gramatica, vocabulario e ajudar na pratica.",
  },
  {
    q: "Quais as formas de pagamento?",
    a: "Aceitamos cartao de credito (ate 12x), boleto bancario, PIX e transferencia. Consulte condicoes especiais para pagamento a vista.",
  },
  {
    q: "Existe garantia de satisfacao?",
    a: "Sim! Oferecemos 7 dias de garantia incondicional. Se nao gostar, devolvemos 100% do seu investimento.",
  },
];

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section
      id="faq"
      style={{
        padding: "100px 24px",
        background: "#050A18",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
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
            Perguntas frequentes
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
            Tire suas duvidas
          </h2>
        </div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 16,
                overflow: "hidden",
                transition: "border-color 0.3s",
                borderColor:
                  openIndex === i
                    ? "rgba(0,212,255,0.3)"
                    : "rgba(255,255,255,0.09)",
              }}
            >
              <button
                onClick={() => toggle(i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#fff",
                    paddingRight: 16,
                  }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    color: "#00D4FF",
                    transition: "transform 0.3s",
                    transform:
                      openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </button>
              <div
                style={{
                  maxHeight: openIndex === i ? 200 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <p
                  style={{
                    padding: "0 24px 20px",
                    margin: 0,
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
