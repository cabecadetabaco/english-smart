import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | English Smart",
};

export default async function StudentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("is_active", true)
    .order("order_index");

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("student_id", user.id);

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, module_id, title")
    .eq("is_published", true);

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("student_id", user.id)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: earnedAchievements } = await supabase
    .from("student_achievements")
    .select("*, achievements(*)")
    .eq("student_id", user.id)
    .order("earned_at", { ascending: false })
    .limit(3);

  const totalLessons = lessons?.length ?? 0;
  const completedLessons =
    progress?.filter((p) => p.completion_percentage >= 100).length ?? 0;
  const overallPct =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const totalPoints =
    earnedAchievements?.reduce(
      (s, ea) => s + ((ea.achievements as any)?.points ?? 0),
      0
    ) ?? 0;

  /* find current module (first not fully completed) */
  const currentModule = modules?.find((m) => {
    const modLessons = lessons?.filter((l) => l.module_id === m.id) ?? [];
    const modCompleted = modLessons.filter((l) =>
      progress?.some(
        (p) => p.lesson_id === l.id && p.completion_percentage >= 100
      )
    ).length;
    return modCompleted < modLessons.length;
  });

  const currentModLessons =
    lessons?.filter((l) => l.module_id === currentModule?.id) ?? [];
  const currentModCompleted = currentModLessons.filter((l) =>
    progress?.some(
      (p) => p.lesson_id === l.id && p.completion_percentage >= 100
    )
  ).length;
  const currentModPct =
    currentModLessons.length > 0
      ? Math.round((currentModCompleted / currentModLessons.length) * 100)
      : 0;

  const firstName = profile?.full_name?.split(" ")[0] ?? "Student";

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: 24,
  };

  const notifIcon: Record<string, string> = {
    grade: "📝",
    class: "📅",
    notice: "📢",
    achievement: "🏆",
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
        gap: 28,
      }}
    >
      {/* Welcome */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Avatar name={profile?.full_name} src={profile?.avatar_url} size={56} />
        <div>
          <h1
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: 28,
              margin: 0,
            }}
          >
            Welcome back, {firstName}!
          </h1>
          <p style={{ margin: 0, color: "#8BA0BF", fontSize: 14 }}>
            {profile?.streak_days
              ? `🔥 ${profile.streak_days} day streak — keep it up!`
              : "Start your streak today!"}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {[
          {
            label: "Overall Progress",
            value: `${overallPct}%`,
            color: "#00D4FF",
          },
          {
            label: "Lessons Completed",
            value: `${completedLessons}/${totalLessons}`,
            color: "#22c55e",
          },
          {
            label: "Day Streak",
            value: `🔥 ${profile?.streak_days ?? 0}`,
            color: "#f59e0b",
          },
          {
            label: "Total Points",
            value: totalPoints.toString(),
            color: "#00D4FF",
          },
        ].map((stat) => (
          <div key={stat.label} style={cardStyle}>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#8BA0BF",
                marginBottom: 8,
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: 28,
                color: stat.color,
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Current module progress */}
      {currentModule && (
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  fontSize: 18,
                  margin: 0,
                }}
              >
                {currentModule.title}
              </h2>
              <p style={{ margin: 0, color: "#8BA0BF", fontSize: 13 }}>
                {currentModCompleted}/{currentModLessons.length} lessons
                completed
              </p>
            </div>
            <Badge variant="info">{currentModPct}%</Badge>
          </div>
          <ProgressBar value={currentModPct} />
          <a
            href={`/student/modules/${currentModule.id}`}
            style={{
              display: "inline-block",
              marginTop: 16,
              color: "#00D4FF",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Continue Learning →
          </a>
        </div>
      )}

      {/* Bottom row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {/* Notifications */}
        <div style={cardStyle}>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 18,
              margin: "0 0 16px",
            }}
          >
            Recent Notifications
          </h2>
          {notifications && notifications.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "rgba(0,212,255,0.05)",
                    border: "1px solid rgba(0,212,255,0.1)",
                  }}
                >
                  <span style={{ fontSize: 18 }}>
                    {notifIcon[n.type] ?? "📢"}
                  </span>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#F0F6FF",
                      }}
                    >
                      {n.title}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#8BA0BF",
                        marginTop: 2,
                      }}
                    >
                      {n.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#4A6080", fontSize: 14, margin: 0 }}>
              No new notifications
            </p>
          )}
          <a
            href="/student/notices"
            style={{
              display: "inline-block",
              marginTop: 14,
              color: "#00D4FF",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View All →
          </a>
        </div>

        {/* Recent Achievements */}
        <div style={cardStyle}>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 18,
              margin: "0 0 16px",
            }}
          >
            Recent Achievements
          </h2>
          {earnedAchievements && earnedAchievements.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {earnedAchievements.map((ea) => {
                const ach = ea.achievements as any;
                return (
                  <div
                    key={ea.id}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "rgba(34,197,94,0.06)",
                      border: "1px solid rgba(34,197,94,0.12)",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{ach?.icon ?? "🏆"}</span>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#F0F6FF",
                        }}
                      >
                        {ach?.title}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: "#8BA0BF",
                          marginTop: 2,
                        }}
                      >
                        +{ach?.points} pts
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "#4A6080", fontSize: 14, margin: 0 }}>
              No achievements yet. Keep learning!
            </p>
          )}
          <a
            href="/student/achievements"
            style={{
              display: "inline-block",
              marginTop: 14,
              color: "#00D4FF",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View All →
          </a>
        </div>
      </div>
    </div>
  );
}
