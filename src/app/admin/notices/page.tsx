"use client";

import React, { useEffect, useState } from "react";
import { createClient, getClientUser } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";

interface Notice {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "grade";
  is_active: boolean;
  created_at: string;
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 20,
  padding: 24,
};

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#F0F6FF",
  fontFamily: "var(--font-dm-sans)",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box" as const,
};

export default function AdminNoticesPage() {
  const supabase = createClient();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"info" | "warning" | "success" | "grade">("info");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const user = getClientUser();
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
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });
      setNotices(data ?? []);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createNotice() {
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    const user = getClientUser();

    const { data } = await supabase
      .from("notices")
      .insert({
        title: title.trim(),
        content: content.trim(),
        type,
        created_by: user?.id,
      })
      .select()
      .single();

    if (data) setNotices((prev) => [data as Notice, ...prev]);
    setTitle("");
    setContent("");
    setType("info");
    setSubmitting(false);
  }

  async function toggleActive(notice: Notice) {
    await supabase
      .from("notices")
      .update({ is_active: !notice.is_active })
      .eq("id", notice.id);
    setNotices((prev) =>
      prev.map((n) =>
        n.id === notice.id ? { ...n, is_active: !n.is_active } : n
      )
    );
  }

  const typeIcons: Record<string, string> = {
    info: "ℹ️",
    warning: "⚠️",
    success: "✅",
    grade: "📝",
  };

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
        Manage Notices
      </h1>

      {/* Create form */}
      <div style={cardStyle}>
        <h2
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 18,
            margin: "0 0 16px",
          }}
        >
          Create Notice
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 200 }}>
              <label
                style={{
                  fontSize: 12,
                  color: "#8BA0BF",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notice title"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label
                style={{
                  fontSize: 12,
                  color: "#8BA0BF",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Type
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as "info" | "warning" | "success" | "grade"
                  )
                }
                style={inputStyle}
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="grade">Grade</option>
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                fontSize: 12,
                color: "#8BA0BF",
                display: "block",
                marginBottom: 4,
              }}
            >
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Notice content..."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <button
            onClick={createNotice}
            disabled={submitting || !title.trim() || !content.trim()}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background:
                !title.trim() || !content.trim() ? "#4A6080" : "#00D4FF",
              color: "#0a0f1a",
              fontWeight: 700,
              fontFamily: "var(--font-syne)",
              cursor:
                !title.trim() || !content.trim() ? "not-allowed" : "pointer",
              fontSize: 14,
              alignSelf: "flex-start",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Publishing..." : "Publish Notice"}
          </button>
        </div>
      </div>

      {/* Notice list */}
      <div>
        <h2
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 20,
            margin: "0 0 12px",
          }}
        >
          Published Notices
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notices.length === 0 && (
            <p style={{ color: "#4A6080", fontSize: 14 }}>
              No notices created yet.
            </p>
          )}
          {notices.map((n) => (
            <div key={n.id} style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>{typeIcons[n.type]}</span>
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: 16,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {n.title}
                </h3>
                <Badge
                  variant={
                    n.type === "success"
                      ? "success"
                      : n.type === "warning"
                        ? "warning"
                        : "info"
                  }
                  size="sm"
                >
                  {n.type}
                </Badge>
                <button
                  onClick={() => toggleActive(n)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: n.is_active
                      ? "rgba(34,197,94,0.3)"
                      : "rgba(239,68,68,0.3)",
                    background: n.is_active
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(239,68,68,0.1)",
                    color: n.is_active ? "#22c55e" : "#ef4444",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {n.is_active ? "Active" : "Inactive"}
                </button>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#8BA0BF",
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {n.content}
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 11,
                  color: "#4A6080",
                }}
              >
                {new Date(n.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
