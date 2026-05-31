"use client";

import React, { useState } from "react";
import Badge from "@/components/ui/Badge";

interface Props {
  lessonTitle: string;
  lessonDescription: string | null;
  idx: number;
  statusColor: string;
  statusLabel: string;
}

export default function LockedLessonCard({
  lessonTitle,
  lessonDescription,
  idx,
  statusColor,
  statusLabel,
}: Props) {
  const [showPopup, setShowPopup] = useState(false);

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: 0,
    opacity: 0.5,
    overflow: "hidden",
  };

  return (
    <>
      <div style={cardStyle}>
        <div
          onClick={() => setShowPopup(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 20px",
            cursor: "pointer",
            color: "#F0F6FF",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `2px solid ${statusColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 14,
              color: statusColor,
              flexShrink: 0,
            }}
          >
            {idx + 1}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: "#F0F6FF" }}>
              {lessonTitle}
            </p>
            {lessonDescription && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#4A6080" }}>
                {lessonDescription}
              </p>
            )}
          </div>

          <Badge variant="default" size="sm">
            {"🔒 "}{statusLabel}
          </Badge>
        </div>
      </div>

      {/* Popup overlay */}
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1a2236",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: 32,
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 40 }}>🔒</div>
            <h3
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 700,
                fontSize: 18,
                margin: 0,
                color: "#F0F6FF",
              }}
            >
              Aula Bloqueada
            </h3>
            <p style={{ margin: 0, color: "#8BA0BF", fontSize: 14, lineHeight: 1.6 }}>
              Você precisa concluir as aulas anteriores antes de avançar para esta lição.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                padding: "10px 24px",
                borderRadius: 10,
                border: "none",
                background: "#00D4FF",
                color: "#0a0f1a",
                fontWeight: 700,
                fontFamily: "var(--font-syne)",
                cursor: "pointer",
                fontSize: 14,
                marginTop: 8,
              }}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
