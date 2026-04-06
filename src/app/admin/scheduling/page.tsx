"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

interface Schedule {
  id: string;
  student_id: string;
  student_name: string;
  student_avatar: string | null;
  scheduled_date: string;
  type: "live" | "makeup";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes: string | null;
  created_at: string;
}

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

export default function AdminSchedulingPage() {
  const supabase = createClient();
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: p } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (p?.role !== "admin") {
        window.location.href = "/student/dashboard";
        return;
      }

      const { data } = await supabase
        .from("class_schedules")
        .select("*, profiles!class_schedules_student_id_fkey(full_name, avatar_url)")
        .order("scheduled_date", { ascending: false });

      const mapped: Schedule[] = (data ?? []).map((s: any) => ({
        id: s.id,
        student_id: s.student_id,
        student_name: s.profiles?.full_name ?? "Student",
        student_avatar: s.profiles?.avatar_url ?? null,
        scheduled_date: s.scheduled_date,
        type: s.type,
        status: s.status,
        notes: s.notes,
        created_at: s.created_at,
      }));
      setSchedules(mapped);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(
    id: string,
    status: "confirmed" | "cancelled" | "completed"
  ) {
    await supabase.from("class_schedules").update({ status }).eq("id", id);
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }

  const pending = schedules.filter((s) => s.status === "pending");
  const confirmed = schedules.filter((s) => s.status === "confirmed");
  const history = schedules.filter(
    (s) => s.status === "completed" || s.status === "cancelled"
  );

  function renderScheduleCard(s: Schedule, actions?: React.ReactNode) {
    return (
      <div
        key={s.id}
        style={{
          ...cardStyle,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Avatar name={s.student_name} src={s.student_avatar} size={36} />
        <div style={{ flex: 1, minWidth: 160 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
            {s.student_name}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8BA0BF" }}>
            {new Date(s.scheduled_date).toLocaleString()} ·{" "}
            {s.type === "live" ? "Live" : "Makeup"}
            {s.notes ? ` — ${s.notes}` : ""}
          </p>
        </div>
        <Badge variant={statusVariant[s.status]} size="sm">
          {s.status}
        </Badge>
        {actions}
      </div>
    );
  }

  const btnStyle = (
    color: string,
    bg: string,
    border: string
  ): React.CSSProperties => ({
    padding: "5px 14px",
    borderRadius: 8,
    border: `1px solid ${border}`,
    background: bg,
    color,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans)",
    whiteSpace: "nowrap",
  });

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
        Scheduling
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
          Pending Requests
          <Badge variant="warning" size="sm">
            {pending.length}
          </Badge>
        </h2>
        {pending.length === 0 && (
          <p style={{ color: "#4A6080", fontSize: 14 }}>No pending requests.</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pending.map((s) =>
            renderScheduleCard(
              s,
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => updateStatus(s.id, "confirmed")}
                  style={btnStyle(
                    "#22c55e",
                    "rgba(34,197,94,0.1)",
                    "rgba(34,197,94,0.3)"
                  )}
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateStatus(s.id, "cancelled")}
                  style={btnStyle(
                    "#ef4444",
                    "rgba(239,68,68,0.1)",
                    "rgba(239,68,68,0.3)"
                  )}
                >
                  Cancel
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Confirmed */}
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
          Confirmed
          <Badge variant="info" size="sm">
            {confirmed.length}
          </Badge>
        </h2>
        {confirmed.length === 0 && (
          <p style={{ color: "#4A6080", fontSize: 14 }}>
            No confirmed classes.
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {confirmed.map((s) =>
            renderScheduleCard(
              s,
              <button
                onClick={() => updateStatus(s.id, "completed")}
                style={btnStyle(
                  "#00D4FF",
                  "rgba(0,212,255,0.1)",
                  "rgba(0,212,255,0.2)"
                )}
              >
                Mark Completed
              </button>
            )
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 20,
              margin: "0 0 12px",
            }}
          >
            History
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((s) => (
              <div
                key={s.id}
                style={{
                  ...cardStyle,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: 0.7,
                }}
              >
                <Avatar
                  name={s.student_name}
                  src={s.student_avatar}
                  size={28}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13 }}>
                    {s.student_name} —{" "}
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
                    {s.notes ? ` · ${s.notes}` : ""}
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
