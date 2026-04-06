import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Detail | English Smart Admin",
};

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (adminProfile?.role !== "admin") redirect("/student/dashboard");

  const { data: student } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (!student) redirect("/admin/students");

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("is_active", true)
    .order("order_index");

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, module_id, title")
    .eq("is_published", true);

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("student_id", id);

  const { data: schedules } = await supabase
    .from("class_schedules")
    .select("*")
    .eq("student_id", id)
    .order("scheduled_date", { ascending: false })
    .limit(10);

  const totalLessons = lessons?.length ?? 0;
  const completedLessons =
    progress?.filter((p) => p.completion_percentage >= 100).length ?? 0;
  const overallPct =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  const graded = progress?.filter((p) => p.mission_grade != null) ?? [];
  const avgGrade =
    graded.length > 0
      ? Math.round(
          (graded.reduce((s, p) => s + (p.mission_grade ?? 0), 0) /
            graded.length) *
            10
        ) / 10
      : 0;

  const moduleStats = (modules ?? []).map((m) => {
    const modLessons = lessons?.filter((l) => l.module_id === m.id) ?? [];
    const modCompleted = modLessons.filter((l) =>
      progress?.some(
        (p) => p.lesson_id === l.id && p.completion_percentage >= 100
      )
    ).length;
    const pct =
      modLessons.length > 0
        ? Math.round((modCompleted / modLessons.length) * 100)
        : 0;
    return { ...m, pct, modCompleted, modTotal: modLessons.length };
  });

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: 24,
  };

  const statusVariant: Record<string, "default" | "info" | "success" | "warning"> = {
    pending: "warning",
    confirmed: "info",
    cancelled: "default",
    completed: "success",
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-dm-sans)",
        color: "#F0F6FF",
        maxWidth: 900,
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
          href="/admin/students"
          style={{ color: "#00D4FF", textDecoration: "none" }}
        >
          Students
        </a>
        <span>/</span>
        <span>{student.full_name ?? "Student"}</span>
      </div>

      {/* Header */}
      <div
        style={{
          ...cardStyle,
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <Avatar name={student.full_name} src={student.avatar_url} size={72} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: 24,
              margin: 0,
            }}
          >
            {student.full_name ?? "No Name"}
          </h1>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            <Badge
              variant={
                student.level === "advanced"
                  ? "success"
                  : student.level === "intermediate"
                    ? "warning"
                    : "info"
              }
            >
              {student.level}
            </Badge>
            <Badge variant="default">
              🔥 {student.streak_days} day streak
            </Badge>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#4A6080" }}>
            Member since {new Date(student.created_at).toLocaleDateString()}
          </p>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Progress", value: `${overallPct}%`, color: "#00D4FF" },
            { label: "Completed", value: `${completedLessons}/${totalLessons}`, color: "#22c55e" },
            { label: "Avg Grade", value: avgGrade.toString(), color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#8BA0BF" }}>
                {s.label}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontFamily: "var(--font-syne)",
                  fontWeight: 800,
                  fontSize: 22,
                  color: s.color,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Module progress */}
      <div style={cardStyle}>
        <h2
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 18,
            margin: "0 0 16px",
          }}
        >
          Progress by Module
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {moduleStats.map((m) => (
            <div key={m.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  marginBottom: 6,
                }}
              >
                <span>{m.title}</span>
                <span style={{ color: "#8BA0BF", fontSize: 13 }}>
                  {m.modCompleted}/{m.modTotal} lessons ·{" "}
                  <span style={{ color: "#00D4FF", fontWeight: 600 }}>
                    {m.pct}%
                  </span>
                </span>
              </div>
              <ProgressBar value={m.pct} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Mission grades */}
      {graded.length > 0 && (
        <div style={cardStyle}>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 18,
              margin: "0 0 16px",
            }}
          >
            Mission Grades
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr>
                  {["Lesson", "Grade", "Date"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        color: "#8BA0BF",
                        fontWeight: 600,
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {graded.map((g) => {
                  const lesson = lessons?.find((l) => l.id === g.lesson_id);
                  return (
                    <tr key={g.id}>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        {lesson?.title ?? "Lesson"}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          color:
                            (g.mission_grade ?? 0) >= 7
                              ? "#22c55e"
                              : "#f59e0b",
                          fontWeight: 700,
                        }}
                      >
                        {g.mission_grade}/10
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          color: "#4A6080",
                        }}
                      >
                        {g.mission_graded_at
                          ? new Date(
                              g.mission_graded_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedules */}
      {schedules && schedules.length > 0 && (
        <div style={cardStyle}>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 18,
              margin: "0 0 16px",
            }}
          >
            Recent Schedules
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {schedules.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span style={{ fontSize: 16 }}>📅</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13 }}>
                    {new Date(s.scheduled_date).toLocaleString()}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 11,
                      color: "#4A6080",
                    }}
                  >
                    {s.type === "live" ? "Live" : "Makeup"}
                    {s.notes ? ` — ${s.notes}` : ""}
                  </p>
                </div>
                <Badge variant={statusVariant[s.status]} size="sm">
                  {s.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
