"use client";

import React, { useState, useCallback } from "react";
import Badge from "@/components/ui/Badge";
import CheckboxProgress from "@/components/student/CheckboxProgress";
import CelebrationPopup from "@/components/student/CelebrationPopup";
import AudioPlayer from "@/components/student/AudioPlayer";
import type { ProgressFlags } from "@/lib/actions/progress";

interface AudioItem {
  label: string;
  url: string;
}

interface LessonData {
  title: string;
  description: string | null;
  video_url: string | null;
  canva_embed_url: string | null;
  audio_urls: (AudioItem | string)[];
  exercise_links: { label: string; url: string }[];
  pdf_urls: string[];
  google_form_url: string | null;
  task_description: string | null;
  complementary_video_urls: { label: string; url: string }[];
}

interface Props {
  moduleId: string;
  lessonId: string;
  userId: string;
  lesson: LessonData;
  moduleTitle: string;
  initialFlags: ProgressFlags;
  missionGrade: number | null;
  missionGradedAt: string | null;
  nextLessonUrl: string | null;
}

function getYouTubeEmbedUrl(url: string): string {
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  if (url.includes("youtube.com/embed/")) return url;
  return url;
}

export default function LessonContent({
  moduleId,
  lessonId,
  userId,
  lesson,
  moduleTitle,
  initialFlags,
  missionGrade,
  missionGradedAt,
  nextLessonUrl,
}: Props) {
  const [showCelebration, setShowCelebration] = useState(false);

  const handleComplete = useCallback(() => {
    setTimeout(() => setShowCelebration(true), 500);
  }, []);

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: 24,
  };

  const sectionTitle: React.CSSProperties = {
    fontFamily: "var(--font-syne)",
    fontWeight: 700,
    fontSize: 18,
    margin: "0 0 16px",
    color: "#F0F6FF",
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-dm-sans)",
        color: "#F0F6FF",
        maxWidth: 800,
        margin: "0 auto",
        padding: "32px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Celebration popup */}
      <CelebrationPopup
        show={showCelebration}
        nextLessonUrl={nextLessonUrl}
        moduleUrl={`/student/modules/${moduleId}`}
      />

      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#8BA0BF", flexWrap: "wrap" }}>
        <a href="/student/modules" style={{ color: "#00D4FF", textDecoration: "none" }}>
          Módulos
        </a>
        <span>/</span>
        <a href={`/student/modules/${moduleId}`} style={{ color: "#00D4FF", textDecoration: "none" }}>
          {moduleTitle}
        </a>
        <span>/</span>
        <span>{lesson.title}</span>
      </div>

      {/* Lesson header */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: 26,
              margin: 0,
            }}
          >
            {lesson.title}
          </h1>
          {missionGrade != null && (
            <Badge variant={missionGrade >= 7 ? "success" : "warning"}>
              Nota: {missionGrade}/10
            </Badge>
          )}
        </div>
        {lesson.description && (
          <p style={{ margin: "8px 0 0", color: "#8BA0BF", fontSize: 14 }}>
            {lesson.description}
          </p>
        )}
      </div>

      {/* Video - YouTube Player */}
      {lesson.video_url && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Aula em Vídeo</h2>
          <div
            style={{
              position: "relative",
              paddingTop: "56.25%",
              borderRadius: 12,
              overflow: "hidden",
              background: "#0a0f1a",
            }}
          >
            <iframe
              src={getYouTubeEmbedUrl(lesson.video_url)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Canva slides */}
      {lesson.canva_embed_url && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Slides</h2>
          <div
            style={{
              position: "relative",
              paddingTop: "56.25%",
              borderRadius: 12,
              overflow: "hidden",
              background: "#0a0f1a",
            }}
          >
            <iframe
              src={lesson.canva_embed_url}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Audio player */}
      {lesson.audio_urls.length > 0 && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Ouvir & Repetir</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {lesson.audio_urls.map((item, i) => {
              const url = typeof item === "string" ? item : item.url;
              const label = typeof item === "string" ? undefined : item.label || undefined;
              return (
                <AudioPlayer
                  key={i}
                  src={url}
                  title={label || `Áudio ${i + 1}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Exercise links */}
      {lesson.exercise_links.length > 0 && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Exercícios</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lesson.exercise_links.map((ex, i) => (
              <a
                key={i}
                href={ex.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(0,212,255,0.05)",
                  border: "1px solid rgba(0,212,255,0.1)",
                  color: "#00D4FF",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <span>🔗</span>
                {ex.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Complementary videos */}
      {lesson.complementary_video_urls.length > 0 && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Vídeos Complementares</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {lesson.complementary_video_urls.map((v, i) => (
              <div key={i}>
                {v.label && (
                  <p style={{ margin: "0 0 8px", fontSize: 13, color: "#8BA0BF", fontWeight: 600 }}>
                    {v.label}
                  </p>
                )}
                <div
                  style={{
                    position: "relative",
                    paddingTop: "56.25%",
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "#0a0f1a",
                  }}
                >
                  <iframe
                    src={getYouTubeEmbedUrl(v.url)}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDFs */}
      {lesson.pdf_urls.length > 0 && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Material da Aula</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lesson.pdf_urls.map((url, i) => {
              const parts = url.split("/");
              const filename = parts[parts.length - 1];
              const cleanName = decodeURIComponent(filename.replace(/^\d+_/, ""));
              return (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: "rgba(34,197,94,0.05)",
                    border: "1px solid rgba(34,197,94,0.1)",
                    color: "#22c55e",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <span>📄</span>
                  {cleanName}
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#8BA0BF" }}>
                    Abrir PDF ↗
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Google Form */}
      {lesson.google_form_url && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Formulário de Avaliação</h2>
          <a
            href={lesson.google_form_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #00D4FF, #0066FF)",
              color: "#F0F6FF",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-syne)",
            }}
          >
            📝 Abrir Formulário
          </a>
        </div>
      )}

      {/* Mission / Task */}
      {lesson.task_description && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Missão / Tarefa</h2>
          <p
            style={{
              margin: 0,
              color: "#8BA0BF",
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {lesson.task_description}
          </p>
        </div>
      )}

      {/* Grade display */}
      {missionGrade != null && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Sua Nota</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background:
                  missionGrade >= 7
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(245,158,11,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: 24,
                color: missionGrade >= 7 ? "#22c55e" : "#f59e0b",
              }}
            >
              {missionGrade}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, color: "#8BA0BF" }}>de 10</p>
              {missionGradedAt && (
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#4A6080" }}>
                  Corrigido em {new Date(missionGradedAt).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress checkboxes */}
      <div style={cardStyle}>
        <CheckboxProgress
          lessonId={lessonId}
          studentId={userId}
          initial={initialFlags}
          onComplete={handleComplete}
        />
      </div>

      {/* Back to module link */}
      <a
        href={`/student/modules/${moduleId}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 20px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          color: "#8BA0BF",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 600,
          alignSelf: "flex-start",
        }}
      >
        ← Voltar ao Módulo
      </a>
    </div>
  );
}
