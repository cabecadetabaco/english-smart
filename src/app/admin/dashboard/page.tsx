import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Avatar from "@/components/ui/Avatar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | English Smart",
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/student/dashboard");

  /* KPIs */
  const { count: totalStudents } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "student");

  const { count: pendingSchedules } = await supabase
    .from("class_schedules")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: missionsToGrade } = await supabase
    .from("lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("mission_submitted", true)
    .is("mission_grade", null);

  const today = new Date().toISOString().split("T")[0];
  const { count: leadsToday } = await supabase
    .from("landing_leads")
    .select("id", { count: "exact", head: true })
    .gte("created_at", today);

  /* Top students by streak */
  const { data: topStudents } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, streak_days")
    .eq("role", "student")
    .order("streak_days", { ascending: false })
    .limit(5);

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: 24,
  };

  const quickLinks = [
    { label: "Grade Missions", href: "/admin/grades", icon: "📝" },
    { label: "Manage Content", href: "/admin/content", icon: "📚" },
    { label: "Scheduling", href: "/admin/scheduling", icon: "📅" },
    { label: "Notices", href: "/admin/notices", icon: "📢" },
    { label: "Students", href: "/admin/students", icon: "👥" },
  ];

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
      <h1
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: 28,
          margin: 0,
        }}
      >
        Admin Dashboard
      </h1>

      {/* KPI cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {[
          { label: "Total Students", value: totalStudents ?? 0, color: "#00D4FF", icon: "👥" },
          { label: "Pending Schedules", value: pendingSchedules ?? 0, color: "#f59e0b", icon: "📅" },
          { label: "Missions to Grade", value: missionsToGrade ?? 0, color: "#ef4444", icon: "📝" },
          { label: "Leads Today", value: leadsToday ?? 0, color: "#22c55e", icon: "🎯" },
        ].map((kpi) => (
          <div key={kpi.label} style={cardStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 20 }}>{kpi.icon}</span>
              <span style={{ fontSize: 13, color: "#8BA0BF" }}>
                {kpi.label}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: 32,
                color: kpi.color,
              }}
            >
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {/* Top students */}
        <div style={cardStyle}>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 18,
              margin: "0 0 16px",
            }}
          >
            Top Students by Streak
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(topStudents ?? []).map((s, i) => (
              <a
                key={s.id}
                href={`/admin/students/${s.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#4A6080",
                    width: 20,
                  }}
                >
                  {i + 1}
                </span>
                <Avatar
                  name={s.full_name}
                  src={s.avatar_url}
                  size={32}
                />
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>
                  {s.full_name ?? "Student"}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#f59e0b",
                  }}
                >
                  🔥 {s.streak_days}
                </span>
              </a>
            ))}
            {(!topStudents || topStudents.length === 0) && (
              <p style={{ color: "#4A6080", fontSize: 14, margin: 0 }}>
                No students yet.
              </p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div style={cardStyle}>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 18,
              margin: "0 0 16px",
            }}
          >
            Quick Actions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(0,212,255,0.05)",
                  border: "1px solid rgba(0,212,255,0.1)",
                  textDecoration: "none",
                  color: "#F0F6FF",
                  fontSize: 14,
                  fontWeight: 600,
                  transition: "background 0.2s ease",
                }}
              >
                <span style={{ fontSize: 18 }}>{link.icon}</span>
                {link.label}
                <span
                  style={{
                    marginLeft: "auto",
                    color: "#00D4FF",
                    fontSize: 16,
                  }}
                >
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
