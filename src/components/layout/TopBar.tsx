"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  level: string;
  streak_days: number;
};

interface TopBarProps {
  profile: Profile;
  onMenuToggle?: () => void;
}

interface Notification {
  id: string;
  title: string;
  read: boolean;
  created_at: string;
}

const pageNames: Record<string, string> = {
  "/student/dashboard": "Dashboard",
  "/student/notices": "Avisos",
  "/student/modules": "Modulos",
  "/student/library": "Biblioteca",
  "/student/tasks": "Tarefas",
  "/student/calendar": "Calendario",
  "/student/achievements": "Conquistas",
  "/student/profile": "Perfil",
  "/admin/dashboard": "Dashboard",
  "/admin/students": "Alunos",
  "/admin/grades": "Notas",
  "/admin/content": "Conteudo",
  "/admin/notices": "Avisos",
  "/admin/scheduling": "Agendamentos",
};

export default function TopBar({ profile, onMenuToggle }: TopBarProps) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);

  const currentPage = pageNames[pathname ?? ""] ?? "Dashboard";
  const areaLabel =
    profile.role === "admin" ? "Painel do Professor" : "Area do Aluno";

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("notifications")
      .select("id, title, read, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setNotifications(data);
      });

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${profile.id}`,
        },
        (payload) => {
          setNotifications((prev) =>
            [payload.new as Notification, ...prev].slice(0, 5)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      style={{
        height: 64,
        position: "fixed",
        top: 0,
        right: 0,
        left: 260,
        backgroundColor: "#0D1526",
        borderBottom: "1px solid #1e2d42",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 99,
      }}
    >
      {/* Left: hamburger + breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Hamburger - mobile only */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "#F0F6FF",
              fontSize: 22,
              cursor: "pointer",
              padding: 4,
            }}
            className="topbar-hamburger"
          >
            &#9776;
          </button>
        )}

        <div
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 14,
            color: "#8BA0BF",
          }}
        >
          <span>{areaLabel}</span>
          <span style={{ margin: "0 6px", color: "#4A6080" }}>/</span>
          <span style={{ color: "#F0F6FF", fontWeight: 600 }}>
            {currentPage}
          </span>
        </div>
      </div>

      {/* Right: notifications + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowAvatar(false);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#8BA0BF",
              fontSize: 20,
              cursor: "pointer",
              position: "relative",
              padding: 4,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                  color: "#F0F6FF",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 300,
                backgroundColor: "#0D1526",
                border: "1px solid #1e2d42",
                borderRadius: 10,
                padding: 8,
                zIndex: 200,
              }}
            >
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: 16,
                    textAlign: "center",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 13,
                    color: "#4A6080",
                  }}
                >
                  Sem notificacoes
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 6,
                      backgroundColor: n.read
                        ? "transparent"
                        : "rgba(0,212,255,0.05)",
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 13,
                      color: "#F0F6FF",
                      borderBottom: "1px solid #1e2d42",
                    }}
                  >
                    <div style={{ fontWeight: n.read ? 400 : 600 }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#4A6080", marginTop: 2 }}>
                      {new Date(n.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Avatar dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowAvatar(!showAvatar);
              setShowNotifs(false);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Avatar
              name={profile.full_name}
              src={profile.avatar_url}
              size={32}
            />
          </button>

          {showAvatar && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                backgroundColor: "#0D1526",
                border: "1px solid #1e2d42",
                borderRadius: 10,
                padding: 8,
                minWidth: 160,
                zIndex: 200,
              }}
            >
              <Link
                href={
                  profile.role === "admin"
                    ? "/admin/dashboard"
                    : "/student/profile"
                }
                style={{
                  display: "block",
                  padding: "10px 12px",
                  borderRadius: 6,
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 13,
                  color: "#F0F6FF",
                  textDecoration: "none",
                }}
              >
                Meu Perfil
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Responsive style for hamburger */}
      <style>{`
        @media (max-width: 768px) {
          .topbar-hamburger { display: block !important; }
        }
      `}</style>
    </header>
  );
}
