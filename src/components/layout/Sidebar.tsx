"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import LogoutButton from "@/components/auth/LogoutButton";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  level: string;
  streak_days: number;
};

interface SidebarProps {
  profile: Profile;
  moduleProgress?: { id: string; title: string; percent: number }[];
}

const navItems = [
  { href: "/student/dashboard", label: "Dashboard", icon: "\u{1F4CA}" },
  { href: "/student/avisos", label: "Avisos", icon: "\u{1F4E2}" },
  { href: "/student/modulos", label: "Modulos", icon: "\u{1F4DA}" },
  { href: "/student/biblioteca", label: "Biblioteca", icon: "\u{1F4D6}" },
  { href: "/student/tarefas", label: "Tarefas", icon: "\u2705" },
  { href: "/student/calendario", label: "Calendario", icon: "\u{1F4C5}" },
  { href: "/student/conquistas", label: "Conquistas", icon: "\u{1F3C6}" },
  { href: "/student/perfil", label: "Perfil", icon: "\u{1F464}" },
];

export default function Sidebar({ profile, moduleProgress }: SidebarProps) {
  const pathname = usePathname();
  const [modulesOpen, setModulesOpen] = useState(false);

  return (
    <aside
      style={{
        width: 260,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "#0D1526",
        borderRight: "1px solid #1e2d42",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Image
          src="/assets/logos/logo-badge-color.jpg"
          alt="English Smart"
          width={36}
          height={36}
          style={{ borderRadius: 8 }}
        />
        <span
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 18,
            color: "#F0F6FF",
          }}
        >
          English Smart
        </span>
      </div>

      {/* Profile card */}
      <div
        style={{
          margin: "8px 16px",
          padding: 14,
          backgroundColor: "rgba(0,212,255,0.05)",
          borderRadius: 10,
          border: "1px solid #1e2d42",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Avatar
          name={profile.full_name}
          src={profile.avatar_url}
          size={36}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 13,
              fontWeight: 600,
              color: "#F0F6FF",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {profile.full_name ?? "Aluno"}
          </div>
          <div
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 11,
              color: "#8BA0BF",
            }}
          >
            {profile.level}
          </div>
        </div>
      </div>

      {/* Streak */}
      {profile.streak_days > 0 && (
        <div style={{ padding: "0 16px", marginBottom: 8 }}>
          <Badge variant="warning" size="sm">
            {"\uD83D\uDD25"} {profile.streak_days} dia{profile.streak_days !== 1 ? "s" : ""} de streak
          </Badge>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 12px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const isModulos = item.label === "Modulos";

          return (
            <div key={item.href}>
              {isModulos ? (
                <>
                  <button
                    onClick={() => setModulesOpen(!modulesOpen)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: isActive
                        ? "rgba(0,212,255,0.1)"
                        : "transparent",
                      color: isActive ? "#00D4FF" : "#8BA0BF",
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <span
                      style={{
                        fontSize: 10,
                        transition: "transform 0.2s ease",
                        transform: modulesOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      &#x25BC;
                    </span>
                  </button>
                  {modulesOpen && moduleProgress && moduleProgress.length > 0 && (
                    <div style={{ padding: "4px 12px 4px 38px" }}>
                      {moduleProgress.map((mod) => (
                        <Link
                          key={mod.id}
                          href={`/student/modulos/${mod.id}`}
                          style={{
                            display: "block",
                            padding: "6px 0",
                            textDecoration: "none",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              fontSize: 12,
                              color: "#8BA0BF",
                              marginBottom: 4,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {mod.title}
                          </div>
                          <ProgressBar value={mod.percent} size="sm" />
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 8,
                    backgroundColor: isActive
                      ? "rgba(0,212,255,0.1)"
                      : "transparent",
                    color: isActive ? "#00D4FF" : "#8BA0BF",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: "none",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 12px 20px" }}>
        <LogoutButton />
      </div>
    </aside>
  );
}
