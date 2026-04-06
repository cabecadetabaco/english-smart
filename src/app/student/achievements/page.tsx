import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements | English Smart",
};

export default async function AchievementsPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: allAchievements } = await supabase
    .from("achievements")
    .select("*")
    .order("points");

  const { data: earned } = await supabase
    .from("student_achievements")
    .select("achievement_id, earned_at")
    .eq("student_id", user.id);

  const earnedMap = new Map(
    (earned ?? []).map((e) => [e.achievement_id, e.earned_at])
  );

  const earnedCount = earnedMap.size;
  const totalPoints = (allAchievements ?? [])
    .filter((a) => earnedMap.has(a.id))
    .reduce((s, a) => s + a.points, 0);
  const remaining = (allAchievements?.length ?? 0) - earnedCount;

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
      <h1
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: 28,
          margin: 0,
        }}
      >
        Achievements
      </h1>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {[
          { label: "Earned", value: earnedCount, color: "#22c55e" },
          { label: "Total Points", value: totalPoints, color: "#00D4FF" },
          { label: "Remaining", value: remaining, color: "#8BA0BF" },
        ].map((s) => (
          <div key={s.label} style={cardStyle}>
            <p style={{ margin: 0, fontSize: 12, color: "#8BA0BF" }}>
              {s.label}
            </p>
            <p
              style={{
                margin: "6px 0 0",
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: 28,
                color: s.color,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Achievement grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {(allAchievements ?? []).map((ach) => {
          const isEarned = earnedMap.has(ach.id);
          const earnedAt = earnedMap.get(ach.id);

          return (
            <div
              key={ach.id}
              style={{
                ...cardStyle,
                textAlign: "center",
                opacity: isEarned ? 1 : 0.45,
                filter: isEarned ? "none" : "grayscale(100%)",
                transition: "opacity 0.2s ease",
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  marginBottom: 12,
                }}
              >
                {ach.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  fontSize: 16,
                  margin: "0 0 6px",
                }}
              >
                {ach.title}
              </h3>
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: 13,
                  color: "#8BA0BF",
                  lineHeight: 1.4,
                }}
              >
                {ach.description}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Badge variant={isEarned ? "success" : "default"} size="sm">
                  {ach.points} pts
                </Badge>
                {isEarned && earnedAt && (
                  <span style={{ fontSize: 11, color: "#4A6080" }}>
                    {new Date(earnedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {!isEarned && (
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: 11,
                    color: "#4A6080",
                  }}
                >
                  🔒 Locked
                </p>
              )}
            </div>
          );
        })}
      </div>

      {(!allAchievements || allAchievements.length === 0) && (
        <p
          style={{
            color: "#4A6080",
            fontSize: 14,
            textAlign: "center",
            padding: 40,
          }}
        >
          No achievements available yet.
        </p>
      )}
    </div>
  );
}
