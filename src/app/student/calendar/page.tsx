"use client";

import React, { useEffect, useState } from "react";
import { createClient, getClientUser } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";

interface Schedule {
  id: string;
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

export default function CalendarPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string>("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [date, setDate] = useState("");
  const [type, setType] = useState<"live" | "makeup">("live");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const user = getClientUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUserId(user.id);

      const { data } = await supabase
        .from("class_schedules")
        .select("*")
        .eq("student_id", user.id)
        .order("scheduled_date", { ascending: false });
      setSchedules(data ?? []);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleBook() {
    if (!date || !userId) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from("class_schedules")
      .insert({
        student_id: userId,
        scheduled_date: date,
        type,
        notes: notes || null,
      })
      .select()
      .single();
    if (!error && data) {
      setSchedules((prev) => [data as Schedule, ...prev]);
      setDate("");
      setNotes("");
    }
    setSubmitting(false);
  }

  async function handleCancel(id: string) {
    await supabase
      .from("class_schedules")
      .update({ status: "cancelled" })
      .eq("id", id);
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "cancelled" } : s))
    );
  }

  const now = new Date().toISOString();
  const upcoming = schedules.filter(
    (s) => s.scheduled_date >= now && s.status !== "cancelled" && s.status !== "completed"
  );
  const past = schedules.filter(
    (s) => s.scheduled_date < now || s.status === "cancelled" || s.status === "completed"
  );

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
        Class Schedule
      </h1>

      {/* Booking form */}
      <div style={cardStyle}>
        <h2
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 18,
            margin: "0 0 16px",
          }}
        >
          Book a Class
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 400,
          }}
        >
          <label style={{ fontSize: 13, color: "#8BA0BF" }}>
            Date & Time
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#F0F6FF",
                fontFamily: "var(--font-dm-sans)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label style={{ fontSize: 13, color: "#8BA0BF" }}>
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "live" | "makeup")}
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#F0F6FF",
                fontFamily: "var(--font-dm-sans)",
                fontSize: 14,
                outline: "none",
              }}
            >
              <option value="live">Live Class</option>
              <option value="makeup">Makeup Class</option>
            </select>
          </label>

          <label style={{ fontSize: 13, color: "#8BA0BF" }}>
            Notes (optional)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#F0F6FF",
                fontFamily: "var(--font-dm-sans)",
                fontSize: 14,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </label>

          <button
            onClick={handleBook}
            disabled={submitting || !date}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: !date ? "#4A6080" : "#00D4FF",
              color: "#0a0f1a",
              fontWeight: 700,
              fontFamily: "var(--font-syne)",
              cursor: !date ? "not-allowed" : "pointer",
              fontSize: 14,
              alignSelf: "flex-start",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Booking..." : "Book Class"}
          </button>
        </div>
      </div>

      {/* Upcoming */}
      <div>
        <h2
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 20,
            margin: "0 0 12px",
          }}
        >
          Upcoming Classes
        </h2>
        {upcoming.length === 0 && (
          <p style={{ color: "#4A6080", fontSize: 14 }}>
            No upcoming classes scheduled.
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {upcoming.map((s) => (
            <div
              key={s.id}
              style={{
                ...cardStyle,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(0,212,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                📅
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                  {new Date(s.scheduled_date).toLocaleString()}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8BA0BF" }}>
                  {s.type === "live" ? "Live Class" : "Makeup Class"}
                  {s.notes ? ` — ${s.notes}` : ""}
                </p>
              </div>
              <Badge variant={statusVariant[s.status]} size="sm">
                {s.status}
              </Badge>
              {(s.status === "pending" || s.status === "confirmed") && (
                <button
                  onClick={() => handleCancel(s.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "1px solid rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.1)",
                    color: "#ef4444",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Past */}
      {past.length > 0 && (
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
            {past.map((s) => (
              <div
                key={s.id}
                style={{
                  ...cardStyle,
                  padding: "12px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: 0.7,
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
