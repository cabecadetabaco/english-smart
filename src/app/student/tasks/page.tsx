"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient, getClientUser } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";

interface Task {
  id: string;
  lesson_id: string;
  lesson_title: string;
  module_id: string;
  module_title: string;
  task_description: string;
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

export default function TasksPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [modules, setModules] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    async function load() {
      const user = getClientUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title, module_id, task_description, modules(title)")
        .eq("is_published", true)
        .not("task_description", "is", null);

      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("lesson_id, mission_submitted, mission_grade, mission_graded_at")
        .eq("student_id", user.id);

      const { data: mods } = await supabase
        .from("modules")
        .select("id, title")
        .eq("is_active", true)
        .order("order_index");

      setModules(mods ?? []);

      const taskList: Task[] = (lessons ?? []).map((l: any) => {
        const p = (progress ?? []).find((p: any) => p.lesson_id === l.id);
        return {
          id: l.id,
          lesson_id: l.id,
          lesson_title: l.title,
          module_id: l.module_id,
          module_title: l.modules?.title ?? "Module",
          task_description: l.task_description,
          mission_submitted: p?.mission_submitted ?? false,
          mission_grade: p?.mission_grade ?? null,
          mission_graded_at: p?.mission_graded_at ?? null,
        };
      });
      setTasks(taskList);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(
      (t) => !t.mission_submitted && t.mission_grade == null
    ).length;
    const submitted = tasks.filter(
      (t) => t.mission_submitted && t.mission_grade == null
    ).length;
    const graded = tasks.filter((t) => t.mission_grade != null).length;
    return { total, pending, submitted, graded };
  }, [tasks]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (moduleFilter !== "all" && t.module_id !== moduleFilter) return false;
      if (statusFilter === "pending")
        return !t.mission_submitted && t.mission_grade == null;
      if (statusFilter === "submitted")
        return t.mission_submitted && t.mission_grade == null;
      if (statusFilter === "graded") return t.mission_grade != null;
      return true;
    });
  }, [tasks, statusFilter, moduleFilter]);

  function getStatus(t: Task): string {
    if (t.mission_grade != null) return "graded";
    if (t.mission_submitted) return "submitted";
    return "pending";
  }

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
        Tasks & Missions
      </h1>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        {[
          { label: "Total", value: stats.total, color: "#00D4FF" },
          { label: "Pending", value: stats.pending, color: "#8BA0BF" },
          { label: "Submitted", value: stats.submitted, color: "#f59e0b" },
          { label: "Graded", value: stats.graded, color: "#22c55e" },
        ].map((s) => (
          <div key={s.label} style={cardStyle}>
            <p style={{ margin: 0, fontSize: 12, color: "#8BA0BF" }}>
              {s.label}
            </p>
            <p
              style={{
                margin: "4px 0 0",
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

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {["all", "pending", "submitted", "graded"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: "6px 16px",
              borderRadius: 9999,
              border: "1px solid",
              borderColor:
                statusFilter === s ? "#00D4FF" : "rgba(255,255,255,0.1)",
              background:
                statusFilter === s ? "rgba(0,212,255,0.15)" : "transparent",
              color: statusFilter === s ? "#00D4FF" : "#8BA0BF",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-dm-sans)",
              textTransform: "capitalize",
            }}
          >
            {s}
          </button>
        ))}

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: "6px 12px",
            color: "#F0F6FF",
            fontFamily: "var(--font-dm-sans)",
            fontSize: 13,
            outline: "none",
          }}
        >
          <option value="all">All Modules</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 && (
          <p style={{ color: "#4A6080", fontSize: 14, textAlign: "center" }}>
            No tasks found.
          </p>
        )}
        {filtered.map((t) => {
          const status = getStatus(t);
          return (
            <div key={t.id} style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-syne)",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {t.lesson_title}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      color: "#4A6080",
                    }}
                  >
                    {t.module_title}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {t.mission_grade != null && (
                    <Badge
                      variant={t.mission_grade >= 7 ? "success" : "warning"}
                    >
                      {t.mission_grade}/10
                    </Badge>
                  )}
                  <Badge
                    variant={
                      status === "graded"
                        ? "success"
                        : status === "submitted"
                          ? "warning"
                          : "default"
                    }
                    size="sm"
                  >
                    {status}
                  </Badge>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#8BA0BF",
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {t.task_description}
              </p>
              <a
                href={`/student/modules/${t.module_id}/${t.lesson_id}`}
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  color: "#00D4FF",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Go to Lesson →
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
