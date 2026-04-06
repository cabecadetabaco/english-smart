"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

interface PendingMission {
  id: string;
  student_id: string;
  lesson_id: string;
  student_name: string;
  student_avatar: string | null;
  lesson_title: string;
  mission_submitted: boolean;
  mission_grade: number | null;
  mission_graded_at: string | null;
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 20,
  padding: 24,
};

export default function GradesPage() {
  const supabase = createClient();
  const [pending, setPending] = useState<PendingMission[]>([]);
  const [graded, setGraded] = useState<PendingMission[]>([]);
  const [gradeInputs, setGradeInputs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role !== "admin") {
        window.location.href = "/student/dashboard";
        return;
      }

      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("*, profiles!lesson_progress_student_id_fkey(full_name, avatar_url), lessons!lesson_progress_lesson_id_fkey(title)")
        .eq("mission_submitted", true)
        .order("completed_at", { ascending: false });

      const mapped: PendingMission[] = (progress ?? []).map((p: any) => ({
        id: p.id,
        student_id: p.student_id,
        lesson_id: p.lesson_id,
        student_name: p.profiles?.full_name ?? "Student",
        student_avatar: p.profiles?.avatar_url ?? null,
        lesson_title: p.lessons?.title ?? "Lesson",
        mission_submitted: p.mission_submitted,
        mission_grade: p.mission_grade,
        mission_graded_at: p.mission_graded_at,
      }));

      setPending(mapped.filter((m) => m.mission_grade == null));
      setGraded(mapped.filter((m) => m.mission_grade != null));
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitGrade(mission: PendingMission) {
    const val = parseFloat(gradeInputs[mission.id] ?? "");
    if (isNaN(val) || val < 0 || val > 10) return;

    setSubmitting(mission.id);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("lesson_progress")
      .update({
        mission_grade: val,
        mission_graded_at: new Date().toISOString(),
        mission_graded_by: user?.id,
      })
      .eq("id", mission.id);

    const updated = { ...mission, mission_grade: val, mission_graded_at: new Date().toISOString() };
    setPending((prev) => prev.filter((m) => m.id !== mission.id));
    setGraded((prev) => [updated, ...prev]);
    setSubmitting(null);
  }

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
      <h1
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: 28,
          margin: 0,
        }}
      >
        Grade Missions
      </h1>

      {/* Pending */}
      <div>
        <h2
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 20,
            margin: "0 0 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Pending
          <Badge variant="warning" size="sm">
            {pending.length}
          </Badge>
        </h2>
        {pending.length === 0 && (
          <p style={{ color: "#4A6080", fontSize: 14 }}>
            No missions pending review.
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pending.map((m) => (
            <div
              key={m.id}
              style={{
                ...cardStyle,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 20px",
                flexWrap: "wrap",
              }}
            >
              <Avatar name={m.student_name} src={m.student_avatar} size={36} />
              <div style={{ flex: 1, minWidth: 160 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                  {m.student_name}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 12,
                    color: "#8BA0BF",
                  }}
                >
                  {m.lesson_title}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  placeholder="0-10"
                  value={gradeInputs[m.id] ?? ""}
                  onChange={(e) =>
                    setGradeInputs((prev) => ({
                      ...prev,
                      [m.id]: e.target.value,
                    }))
                  }
                  style={{
                    width: 70,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    padding: "6px 10px",
                    color: "#F0F6FF",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 14,
                    outline: "none",
                    textAlign: "center",
                  }}
                />
                <button
                  onClick={() => submitGrade(m)}
                  disabled={submitting === m.id}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#22c55e",
                    color: "#0a0f1a",
                    fontWeight: 700,
                    fontFamily: "var(--font-syne)",
                    cursor: submitting === m.id ? "wait" : "pointer",
                    fontSize: 13,
                    opacity: submitting === m.id ? 0.6 : 1,
                  }}
                >
                  Grade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graded */}
      {graded.length > 0 && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 20,
              margin: "0 0 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Graded
            <Badge variant="success" size="sm">
              {graded.length}
            </Badge>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {graded.map((m) => (
              <div
                key={m.id}
                style={{
                  ...cardStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 18px",
                }}
              >
                <Avatar
                  name={m.student_name}
                  src={m.student_avatar}
                  size={32}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>
                    {m.student_name}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      color: "#8BA0BF",
                    }}
                  >
                    {m.lesson_title}
                  </p>
                </div>
                <Badge
                  variant={
                    (m.mission_grade ?? 0) >= 7 ? "success" : "warning"
                  }
                >
                  {m.mission_grade}/10
                </Badge>
                <span style={{ fontSize: 11, color: "#4A6080" }}>
                  {m.mission_graded_at
                    ? new Date(m.mission_graded_at).toLocaleDateString()
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
