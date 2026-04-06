"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  level: string;
  streak_days: number;
};

interface StudentLayoutWrapperProps {
  profile: Profile;
  moduleProgress: { id: string; title: string; percent: number }[];
  children: React.ReactNode;
}

const SIDEBAR_WIDTH = 260;
const TOPBAR_HEIGHT = 64;

export default function StudentLayoutWrapper({
  profile,
  moduleProgress,
  children,
}: StudentLayoutWrapperProps) {
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
      {/* Desktop sidebar */}
      <div
        style={{
          display: "block",
        }}
        className="sidebar-desktop"
      >
        <Sidebar profile={profile} moduleProgress={moduleProgress} />
      </div>

      <TopBar
        profile={profile}
        onMenuToggle={() => setMobileOpen(true)}
      />

      <MobileNav
        profile={profile}
        moduleProgress={moduleProgress}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main
        style={{
          marginLeft: SIDEBAR_WIDTH,
          paddingTop: TOPBAR_HEIGHT,
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
