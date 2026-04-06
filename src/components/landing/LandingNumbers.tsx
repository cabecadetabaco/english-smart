"use client";

import { useEffect, useRef, useState } from "react";

const metrics = [
  { end: 1200, suffix: "+", label: "Alunos formados" },
  { end: 4.9, suffix: "/5", label: "Avaliacao Google", decimals: 1 },
  { end: 8, suffix: "+", label: "Anos experiencia" },
  { end: 98, suffix: "%", label: "Taxa aprovacao" },
];

function CountUp({
  end,
  suffix,
  decimals = 0,
}: {
  end: number;
  suffix: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * end);
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export default function LandingNumbers() {
  return (
    <section
      style={{
        padding: "0 24px",
        marginTop: -40,
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 20,
          padding: "40px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }}
        className="numbers-grid"
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: "clamp(28px, 3vw, 42px)",
                background: "linear-gradient(135deg, #00D4FF, #0066FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 8,
              }}
            >
              <CountUp end={m.end} suffix={m.suffix} decimals={m.decimals} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .numbers-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .numbers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
