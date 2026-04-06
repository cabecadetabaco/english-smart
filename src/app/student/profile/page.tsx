"use client";

import React, { useEffect, useState } from "react";
import { createClient, getClientUser } from "@/lib/supabase/client";
import ProgressBar from "@/components/ui/ProgressBar";
import Avatar from "@/components/ui/Avatar";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  level: string;
  streak_days: number;
  created_at: string;
}

interface ModuleStat {
  id: string;
  title: string;
  pct: number;
}

interface GradeRow {
  lesson_title: string;
  grade: number | null;
  graded_at: string | null;
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 20,
  padding: 24,
};

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [avgGrade, setAvgGrade] = useState(0);
  const [moduleStats, setModuleStats] = useState<ModuleStat[]>([]);
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => {
    async function load() {
      const user = getClientUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (p) {
        setProfile(p as Profile);
        setName(p.full_name ?? "");
      }

      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("*, lessons(title, module_id)")
        .eq("student_id", user.id);

      const completed = (progress ?? []).filter(
        (p: any) => p.completion_percentage >= 100
      );
      setCompletedLessons(completed.length);

      const graded = (progress ?? []).filter(
        (p: any) => p.mission_grade != null
      );
      const avg =
        graded.length > 0
          ? graded.reduce((s: number, p: any) => s + p.mission_grade, 0) /
            graded.length
          : 0;
      setAvgGrade(Math.round(avg * 10) / 10);

      setGrades(
        graded.map((g: any) => ({
          lesson_title: (g.lessons as any)?.title ?? "Lesson",
          grade: g.mission_grade,
          graded_at: g.mission_graded_at,
        }))
      );

      const { data: modules } = await supabase
        .from("modules")
        .select("id, title, total_lessons")
        .eq("is_active", true)
        .order("order_index");

      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, module_id")
        .eq("is_published", true);

      const stats: ModuleStat[] = (modules ?? []).map((m: any) => {
        const modLessons = (lessons ?? []).filter(
          (l: any) => l.module_id === m.id
        );
        const modCompleted = modLessons.filter((l: any) =>
          (progress ?? []).some(
            (p: any) =>
              p.lesson_id === l.id && p.completion_percentage >= 100
          )
        ).length;
        return {
          id: m.id,
          title: m.title,
          pct:
            modLessons.length > 0
              ? Math.round((modCompleted / modLessons.length) * 100)
              : 0,
        };
      });
      setModuleStats(stats);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveName() {
    if (!profile) return;
    setSaving(true);
    await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", profile.id);
    setProfile({ ...profile, full_name: name });
    setSaving(false);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!profile || !e.target.files?.[0]) return;
    setUploading(true);
    const file = e.target.files[0];
    const ext = file.name.split(".").pop();
    const path = `avatars/${profile.id}.${ext}`;

    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", profile.id);
    setProfile({ ...profile, avatar_url: publicUrl });
    setUploading(false);
  }

  async function changePassword() {
    setPwMsg("");
    if (newPw.length < 6) {
      setPwMsg("Password must be at least 6 characters.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) {
      setPwMsg(error.message);
    } else {
      setPwMsg("Password updated successfully!");
      setOldPw("");
      setNewPw("");
    }
  }

  if (!profile) {
    return (
      <div
        style={{
          fontFamily: "var(--font-dm-sans)",
          color: "#8BA0BF",
          padding: 48,
          textAlign: "center",
        }}
      >
        Loading...
      </div>
    );
  }

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
      <h1
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: 28,
          margin: 0,
        }}
      >
        Profile
      </h1>

      {/* Avatar + name */}
      <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative" }}>
          <Avatar name={profile.full_name} src={profile.avatar_url} size={80} />
          <label
            style={{
              position: "absolute",
              bottom: -4,
              right: -4,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#00D4FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: uploading ? "wait" : "pointer",
              fontSize: 14,
            }}
          >
            📷
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "8px 14px",
                color: "#F0F6FF",
                fontFamily: "var(--font-dm-sans)",
                fontSize: 16,
                outline: "none",
              }}
            />
            <button
              onClick={saveName}
              disabled={saving}
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                border: "none",
                background: "#00D4FF",
                color: "#0a0f1a",
                fontWeight: 700,
                fontFamily: "var(--font-syne)",
                cursor: saving ? "wait" : "pointer",
                fontSize: 14,
              }}
            >
              {saving ? "..." : "Save"}
            </button>
          </div>
          <p style={{ margin: "6px 0 0", color: "#4A6080", fontSize: 12 }}>
            Member since {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {[
          { label: "Lessons Completed", value: completedLessons, color: "#22c55e" },
          { label: "Avg Grade", value: avgGrade, color: "#00D4FF" },
          { label: "Day Streak", value: `🔥 ${profile.streak_days}`, color: "#f59e0b" },
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
                fontSize: 24,
                color: s.color,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
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
                <span style={{ color: "#00D4FF", fontWeight: 600 }}>
                  {m.pct}%
                </span>
              </div>
              <ProgressBar value={m.pct} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Grades table */}
      {grades.length > 0 && (
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
                {grades.map((g, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        padding: "8px 12px",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {g.lesson_title}
                    </td>
                    <td
                      style={{
                        padding: "8px 12px",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        color:
                          (g.grade ?? 0) >= 7 ? "#22c55e" : "#f59e0b",
                        fontWeight: 700,
                      }}
                    >
                      {g.grade}/10
                    </td>
                    <td
                      style={{
                        padding: "8px 12px",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        color: "#4A6080",
                      }}
                    >
                      {g.graded_at
                        ? new Date(g.graded_at).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Password change */}
      <div style={cardStyle}>
        <h2
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 18,
            margin: "0 0 16px",
          }}
        >
          Change Password
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}>
          <input
            type="password"
            placeholder="Current password"
            value={oldPw}
            onChange={(e) => setOldPw(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#F0F6FF",
              fontFamily: "var(--font-dm-sans)",
              fontSize: 14,
              outline: "none",
            }}
          />
          <input
            type="password"
            placeholder="New password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#F0F6FF",
              fontFamily: "var(--font-dm-sans)",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            onClick={changePassword}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "#00D4FF",
              color: "#0a0f1a",
              fontWeight: 700,
              fontFamily: "var(--font-syne)",
              cursor: "pointer",
              fontSize: 14,
              alignSelf: "flex-start",
            }}
          >
            Update Password
          </button>
          {pwMsg && (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: pwMsg.includes("success") ? "#22c55e" : "#ef4444",
              }}
            >
              {pwMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
