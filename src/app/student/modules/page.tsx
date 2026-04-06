import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modules | English Smart",
};

export default async function ModulesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("is_active", true)
    .order("order_index");

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, module_id")
    .eq("is_published", true);

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completion_percentage")
    .eq("student_id", user.id);

  /* Compute per-module stats & sequential unlock */
  const moduleStats = (modules ?? []).map((m, idx) => {
    const modLessons = lessons?.filter((l) => l.module_id === m.id) ?? [];
    const completed = modLessons.filter((l) =>
      progress?.some(
        (p) => p.lesson_id === l.id && p.completion_percentage >= 100
      )
    ).length;
    const pct =
      modLessons.length > 0
        ? Math.round((completed / modLessons.length) * 100)
        : 0;

    let status: "locked" | "in-progress" | "completed" = "locked";
    if (idx === 0) {
      status = pct >= 100 ? "completed" : "in-progress";
    } else {
      /* check if previous module completed */
      const prevMod = modules![idx - 1];
      const prevLessons =
        lessons?.filter((l) => l.module_id === prevMod.id) ?? [];
      const prevCompleted = prevLessons.filter((l) =>
        progress?.some(
          (p) => p.lesson_id === l.id && p.completion_percentage >= 100
        )
      ).length;
      const prevPct =
        prevLessons.length > 0
          ? Math.round((prevCompleted / prevLessons.length) * 100)
          : 0;
      if (prevPct >= 100) {
        status = pct >= 100 ? "completed" : "in-progress";
      }
    }

    return { ...m, lessonCount: modLessons.length, pct, completed, status };
  });

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: 24,
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    transition: "border-color 0.2s ease, transform 0.2s ease",
  };

  const statusColors: Record<string, string> = {
    locked: "#4A6080",
    "in-progress": "#00D4FF",
    completed: "#22c55e",
  };

  const statusLabels: Record<string, string> = {
    locked: "Locked",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-dm-sans)",
        color: "#F0F6FF",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px 16px",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: 28,
          margin: "0 0 24px",
        }}
      >
        Modules
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {moduleStats.map((m) => {
          const isLocked = m.status === "locked";
          return (
            <a
              key={m.id}
              href={isLocked ? undefined : `/student/modules/${m.id}`}
              style={{
                ...cardStyle,
                opacity: isLocked ? 0.5 : 1,
                cursor: isLocked ? "not-allowed" : "pointer",
                pointerEvents: isLocked ? "none" : "auto",
              }}
            >
              {m.cover_image_url && (
                <img
                  src={m.cover_image_url}
                  alt={m.title}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              )}
              {!m.cover_image_url && (
                <div
                  style={{
                    width: "100%",
                    height: 120,
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,102,255,0.15))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 40,
                  }}
                >
                  📘
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: 18,
                    margin: 0,
                  }}
                >
                  {m.title}
                </h2>
                <Badge
                  variant={
                    m.status === "completed"
                      ? "success"
                      : m.status === "in-progress"
                        ? "info"
                        : "default"
                  }
                  size="sm"
                >
                  {statusLabels[m.status]}
                </Badge>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "#8BA0BF",
                    marginBottom: 6,
                  }}
                >
                  <span>
                    {m.completed}/{m.lessonCount} lessons
                  </span>
                  <span style={{ color: statusColors[m.status] }}>
                    {m.pct}%
                  </span>
                </div>
                <ProgressBar value={m.pct} size="sm" />
              </div>

              {isLocked && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#4A6080",
                    textAlign: "center",
                  }}
                >
                  🔒 Complete the previous module to unlock
                </p>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
