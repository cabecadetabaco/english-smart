"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import LogoutButton from "@/components/auth/LogoutButton";
import TopBar from "@/components/layout/TopBar";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  level: string;
  streak_days: number;
};

interface AdminLayoutWrapperProps {
  profile: Profile;
  children: React.ReactNode;
}

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "\u{1F4CA}" },
  { href: "/admin/alunos", label: "Alunos", icon: "\u{1F465}" },
  { href: "/admin/notas", label: "Notas", icon: "\u{1F4DD}" },
  { href: "/admin/conteudo", label: "Conteudo", icon: "\u{1F4DA}" },
  { href: "/admin/avisos", label: "Avisos", icon: "\u{1F4E2}" },
  { href: "/admin/agendamentos", label: "Agendamentos", icon: "\u{1F4C5}" },
];

function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();

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

      {/* Teacher badge */}
      <div style={{ padding: "0 16px", marginBottom: 8 }}>
        <Badge variant="info" size="sm">
          Painel do Professor
        </Badge>
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
            {profile.full_name ?? "Professor"}
          </div>
          <div
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 11,
              color: "#8BA0BF",
            }}
          >
            Administrador
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 12px" }}>
        {adminNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
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

function AdminMobileNav({
  profile,
  open,
  onClose,
}: {
  profile: Profile;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(5,10,24,0.7)",
          zIndex: 199,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          backgroundColor: "#0D1526",
          borderRight: "1px solid #1e2d42",
          zIndex: 200,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.25s ease",
        }}
      >
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

        <div style={{ padding: "0 16px", marginBottom: 8 }}>
          <Badge variant="info" size="sm">
            Painel do Professor
          </Badge>
        </div>

        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {adminNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 12px 20px" }}>
          <LogoutButton />
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

export default function AdminLayoutWrapper({
  profile,
  children,
}: AdminLayoutWrapperProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050A18",
        color: "#F0F6FF",
        fontFamily: "var(--font-dm-sans)",
      }}
    >
      <div className="sidebar-desktop">
        <AdminSidebar profile={profile} />
      </div>

      <TopBar
        profile={profile}
        onMenuToggle={() => setMobileOpen(true)}
      />

      <AdminMobileNav
        profile={profile}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main
        style={{
          marginLeft: 260,
          paddingTop: 64,
          minHeight: "100vh",
        }}
        className="main-content"
      >
        <div style={{ padding: 24 }}>{children}</div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .main-content { margin-left: 0 !important; }
          header { left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
