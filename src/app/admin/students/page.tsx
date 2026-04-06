import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Students | English Smart Admin",
};

export default async function StudentsPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (adminProfile?.role !== "admin") redirect("/student/dashboard");

  const { data: students } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("full_name");

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("is_published", true);

  const { data: allProgress } = await supabase
    .from("lesson_progress")
    .select("student_id, completion_percentage");

  const totalLessons = lessons?.length ?? 0;

  const studentStats = (students ?? []).map((s) => {
    const studentProgress =
      allProgress?.filter((p) => p.student_id === s.id) ?? [];
    const completed = studentProgress.filter(
      (p) => p.completion_percentage >= 100
    ).length;
    const pct =
      totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    return { ...s, pct };
  });

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
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: 28,
            margin: 0,
          }}
        >
          Students
        </h1>
        <Badge variant="info">{studentStats.length} total</Badge>
      </div>

      {/* Table */}
      <div style={{ ...cardStyle, overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr>
              {["Student", "Level", "Progress", "Streak", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    color: "#8BA0BF",
                    fontWeight: 600,
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentStats.map((s) => (
              <tr key={s.id}>
                <td
                  style={{
                    padding: "12px 14px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Avatar
                      name={s.full_name}
                      src={s.avatar_url}
                      size={32}
                    />
                    <span style={{ fontWeight: 600 }}>
                      {s.full_name ?? "No name"}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <Badge
                    variant={
                      s.level === "advanced"
                        ? "success"
                        : s.level === "intermediate"
                          ? "warning"
                          : "info"
                    }
                    size="sm"
                  >
                    {s.level}
                  </Badge>
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    minWidth: 140,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <ProgressBar value={s.pct} size="sm" />
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#8BA0BF",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.pct}%
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    color: "#f59e0b",
                    fontWeight: 700,
                  }}
                >
                  🔥 {s.streak_days}
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <a
                    href={`/admin/students/${s.id}`}
                    style={{
                      color: "#00D4FF",
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    View →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {studentStats.length === 0 && (
          <p
            style={{
              color: "#4A6080",
              fontSize: 14,
              textAlign: "center",
              padding: 24,
              margin: 0,
            }}
          >
            No students registered yet.
          </p>
        )}
      </div>
    </div>
  );
}
