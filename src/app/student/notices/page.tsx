"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";

interface Notice {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "grade";
  is_active: boolean;
  created_at: string;
}

interface Notification {
  id: string;
  type: "grade" | "class" | "notice" | "achievement";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const typeColors: Record<string, string> = {
  info: "#00D4FF",
  warning: "#f59e0b",
  success: "#22c55e",
  grade: "#00D4FF",
  class: "#f59e0b",
  notice: "#00D4FF",
  achievement: "#22c55e",
};

const typeIcons: Record<string, string> = {
  info: "ℹ️",
  warning: "⚠️",
  success: "✅",
  grade: "📝",
  class: "📅",
  notice: "📢",
  achievement: "🏆",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 20,
  padding: 24,
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUserId(user.id);

      const [noticesRes, notifsRes] = await Promise.all([
        supabase
          .from("notices")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("notifications")
          .select("*")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      setNotices(noticesRes.data ?? []);
      setNotifications(notifsRes.data ?? []);

      /* Mark unread as read */
      const unreadIds = (notifsRes.data ?? [])
        .filter((n) => !n.is_read)
        .map((n) => n.id);
      if (unreadIds.length > 0) {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .in("id", unreadIds);
      }

      /* Realtime subscription for new notifications */
      const channel = supabase
        .channel("notifications-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `student_id=eq.${user.id}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        fontFamily: "var(--font-dm-sans)",
        color: "#F0F6FF",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px 16px",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: 28,
          margin: "0 0 24px",
        }}
      >
        Notices & Notifications
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Teacher Notices */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 20,
              margin: "0 0 16px",
            }}
          >
            Teacher Notices
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {notices.length === 0 && (
              <p style={{ color: "#4A6080", fontSize: 14 }}>No notices yet.</p>
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

        {/* Personal Notifications */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 20,
              margin: "0 0 16px",
            }}
          >
            Your Notifications
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {notifications.length === 0 && (
              <p style={{ color: "#4A6080", fontSize: 14 }}>
                No notifications yet.
              </p>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  ...cardStyle,
                  padding: "14px 18px",
                  borderLeftWidth: 3,
                  borderLeftColor: n.is_read
                    ? "rgba(255,255,255,0.07)"
                    : typeColors[n.type],
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{typeIcons[n.type]}</span>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {n.title}
                  </span>
                  {!n.is_read && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#00D4FF",
                        marginLeft: "auto",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#8BA0BF",
                  }}
                >
                  {n.message}
                </p>
                <p
                  style={{
                    margin: "6px 0 0",
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
    </div>
  );
}
