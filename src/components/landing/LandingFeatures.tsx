"use client";

const features = [
  {
    icon: "\uD83C\uDF0D",
    title: "Professores Nativos",
    desc: "Aprenda com professores nativos e experientes que entendem suas dificuldades e aceleram seu aprendizado.",
  },
  {
    icon: "\u23F0",
    title: "Horarios Flexiveis",
    desc: "Escolha os melhores horarios para suas aulas. Manha, tarde ou noite, voce decide.",
  },
  {
    icon: "\uD83D\uDDE3\uFE0F",
    title: "Foco em Conversacao",
    desc: "Nossa metodologia prioriza a pratica oral desde a primeira aula para voce falar com confianca.",
  },
  {
    icon: "\uD83C\uDFC6",
    title: "Certificado Reconhecido",
    desc: "Receba certificado ao concluir cada modulo, valido para curriculo e processos seletivos.",
  },
  {
    icon: "\uD83E\uDD16",
    title: "Suporte com IA",
    desc: "Tecnologia de inteligencia artificial para tirar duvidas, praticar e revisar conteudo 24 horas.",
  },
  {
    icon: "\uD83D\uDCB0",
    title: "Melhor Custo-Beneficio",
    desc: "Investimento acessivel com parcelamento facilitado e resultados comprovados.",
  },
];

export default function LandingFeatures() {
  return (
    <section
      id="features"
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
            Por que nos escolher
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
            Tudo que voce precisa para ser fluente
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="features-grid"
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 20,
                padding: "36px 28px",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 0 40px rgba(0,212,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  marginBottom: 20,
                }}
              >
                {f.icon}
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
                {f.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
