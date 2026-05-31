import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import LockedLessonCard from "./LockedLessonCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module Detail | English Smart",
};

function getYouTubeEmbedUrl(url: string): string {
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  if (url.includes("youtube.com/embed/")) return url;
  return url;
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const user = await getUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: mod } = await supabase
    .from("modules")
    .select("*")
    .eq("id", moduleId)
    .single();

  if (!mod) redirect("/student/modules");

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", moduleId)
    .eq("is_published", true)
    .order("order_index");

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("student_id", user.id)
    .in(
      "lesson_id",
      (lessons ?? []).map((l) => l.id)
    );

  const totalLessons = lessons?.length ?? 0;
  const completedCount =
    progress?.filter((p) => p.completion_percentage >= 100).length ?? 0;
  const modulePct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  type LessonStatus = "locked" | "available" | "in-progress" | "completed";
  const lessonStatuses: LessonStatus[] = (lessons ?? []).map((lesson, idx) => {
    const lp = progress?.find((p) => p.lesson_id === lesson.id);
    if (lp && lp.completion_percentage >= 100) return "completed";
    if (lp && lp.completion_percentage > 0) return "in-progress";
    if (idx === 0) return "available";
    const prevLesson = lessons![idx - 1];
    const prevLp = progress?.find((p) => p.lesson_id === prevLesson.id);
    if (prevLp && prevLp.completion_percentage >= 100) return "available";
    return "locked";
  });

  const statusColors: Record<LessonStatus, string> = {
    locked: "#4A6080",
    available: "#00D4FF",
    "in-progress": "#f59e0b",
    completed: "#22c55e",
  };

  const statusLabels: Record<LessonStatus, string> = {
    locked: "Bloqueada",
    available: "Iniciar",
    "in-progress": "Continuar",
    completed: "Concluída",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: 24,
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
      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#8BA0BF" }}>
        <a
          href="/student/modules"
          style={{ color: "#00D4FF", textDecoration: "none" }}
        >
          Módulos
        </a>
        <span>/</span>
        <span>{mod.title}</span>
      </div>

      {/* Header */}
      <div style={cardStyle}>
        <h1
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: 28,
            margin: "0 0 8px",
          }}
        >
          {mod.title}
        </h1>
        {mod.description && (
          <p style={{ margin: "0 0 16px", color: "#8BA0BF", fontSize: 14 }}>
            {mod.description}
          </p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            color: "#8BA0BF",
            marginBottom: 8,
          }}
        >
          <span>
            {completedCount}/{totalLessons} lições concluídas
          </span>
          <span style={{ color: "#00D4FF", fontWeight: 600 }}>{modulePct}%</span>
        </div>
        <ProgressBar value={modulePct} />
      </div>

      {/* Lesson list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(lessons ?? []).map((lesson, idx) => {
          const status = lessonStatuses[idx];
          const isLocked = status === "locked";
          const lp = progress?.find((p) => p.lesson_id === lesson.id);
          const lessonPct = lp?.completion_percentage ?? 0;

          const exerciseLinks =
            (lesson.exercise_links as { label: string; url: string }[] | null) ?? [];
          const pdfUrls = (lesson.pdf_urls as string[] | null) ?? [];
          const hasContent = lesson.video_url || exerciseLinks.length > 0 || pdfUrls.length > 0;

          return isLocked ? (
            <LockedLessonCard
              key={lesson.id}
              lessonTitle={lesson.title}
              lessonDescription={lesson.description}
              idx={idx}
              statusColor={statusColors[status]}
              statusLabel={statusLabels[status]}
            />
          ) : (
            <div
              key={lesson.id}
              style={{
                ...cardStyle,
                padding: 0,
                overflow: "hidden",
              }}
            >
              {/* Lesson header - clickable link */}
              <a
                href={`/student/modules/${moduleId}/${lesson.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: `2px solid ${statusColors[status]}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: statusColors[status],
                    flexShrink: 0,
                    background:
                      status === "completed"
                        ? "rgba(34,197,94,0.15)"
                        : "transparent",
                  }}
                >
                  {status === "completed" ? "✓" : idx + 1}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#F0F6FF",
                    }}
                  >
                    {lesson.title}
                  </p>
                  {lesson.description && (
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 12,
                        color: "#4A6080",
                      }}
                    >
                      {lesson.description}
                    </p>
                  )}
                  {status !== "completed" && (
                    <div style={{ marginTop: 6, maxWidth: 200 }}>
                      <ProgressBar value={lessonPct} size="sm" />
                    </div>
                  )}
                </div>

                <Badge
                  variant={
                    status === "completed"
                      ? "success"
                      : status === "in-progress"
                        ? "warning"
                        : status === "available"
                          ? "info"
                          : "default"
                  }
                  size="sm"
                >
                  {statusLabels[status]}
                </Badge>
              </a>

              {/* Content preview - video, PDFs, exercises */}
              {hasContent && (
                <div
                  style={{
                    padding: "0 20px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    paddingTop: 16,
                  }}
                >
                  {/* YouTube video */}
                  {lesson.video_url && (
                    <div>
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: 12,
                          color: "#8BA0BF",
                          fontWeight: 600,
                        }}
                      >
                        Aula em Vídeo
                      </p>
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

                  {/* PDFs */}
                  {pdfUrls.length > 0 && (
                    <div>
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: 12,
                          color: "#8BA0BF",
                          fontWeight: 600,
                        }}
                      >
                        Material de Estudo
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {pdfUrls.map((url, i) => {
                          const parts = url.split("/");
                          const filename = parts[parts.length - 1];
                          const cleanName = decodeURIComponent(
                            filename.replace(/^\d+_/, "")
                          );
                          return (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 12px",
                                borderRadius: 10,
                                background: "rgba(34,197,94,0.05)",
                                border: "1px solid rgba(34,197,94,0.1)",
                                color: "#22c55e",
                                textDecoration: "none",
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                            >
                              <span>📄</span>
                              <span style={{ flex: 1 }}>{cleanName}</span>
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "#8BA0BF",
                                }}
                              >
                                Abrir ↗
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Exercise links */}
                  {exerciseLinks.length > 0 && (
                    <div>
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: 12,
                          color: "#8BA0BF",
                          fontWeight: 600,
                        }}
                      >
                        Exercícios
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {exerciseLinks.map((ex, i) => (
                          <a
                            key={i}
                            href={ex.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 12px",
                              borderRadius: 10,
                              background: "rgba(0,212,255,0.05)",
                              border: "1px solid rgba(0,212,255,0.1)",
                              color: "#00D4FF",
                              textDecoration: "none",
                              fontSize: 13,
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
