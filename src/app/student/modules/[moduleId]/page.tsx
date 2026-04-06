import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module Detail | English Smart",
};

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

  /* lesson status: first lesson always available, rest sequential */
  type LessonStatus = "locked" | "available" | "in-progress" | "completed";
  const lessonStatuses: LessonStatus[] = (lessons ?? []).map((lesson, idx) => {
    const lp = progress?.find((p) => p.lesson_id === lesson.id);
    if (lp && lp.completion_percentage >= 100) return "completed";
    if (lp && lp.completion_percentage > 0) return "in-progress";
    if (idx === 0) return "available";
    /* check previous lesson */
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
    locked: "Locked",
    available: "Start",
    "in-progress": "Continue",
    completed: "Completed",
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
          Modules
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
            {completedCount}/{totalLessons} lessons completed
          </span>
          <span style={{ color: "#00D4FF", fontWeight: 600 }}>{modulePct}%</span>
        </div>
        <ProgressBar value={modulePct} />
      </div>

      {/* Lesson list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(lessons ?? []).map((lesson, idx) => {
          const status = lessonStatuses[idx];
          const isLocked = status === "locked";
          const lp = progress?.find((p) => p.lesson_id === lesson.id);
          const lessonPct = lp?.completion_percentage ?? 0;

          return (
            <a
              key={lesson.id}
              href={
                isLocked
                  ? undefined
                  : `/student/modules/${moduleId}/${lesson.id}`
              }
              style={{
                ...cardStyle,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 20px",
                opacity: isLocked ? 0.5 : 1,
                cursor: isLocked ? "not-allowed" : "pointer",
                pointerEvents: isLocked ? "none" : "auto",
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
                {status !== "locked" && status !== "completed" && (
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
                {isLocked ? "🔒 " : ""}
                {statusLabels[status]}
              </Badge>
            </a>
          );
        })}
      </div>
    </div>
  );
}
