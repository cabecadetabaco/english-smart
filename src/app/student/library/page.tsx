"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";

interface LibraryItem {
  id: string;
  title: string;
  type: "pdf" | "link" | "audio" | "video";
  url: string;
  module_id: string | null;
  tags: string[] | null;
  created_at: string;
}

interface Module {
  id: string;
  title: string;
}

const typeIcons: Record<string, string> = {
  pdf: "📄",
  link: "🔗",
  audio: "🎧",
  video: "🎬",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 20,
  padding: 24,
};

export default function LibraryPage() {
  const supabase = createClient();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const [itemsRes, modulesRes] = await Promise.all([
        supabase
          .from("library_items")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
        supabase.from("modules").select("id, title").eq("is_active", true).order("order_index"),
      ]);
      setItems((itemsRes.data as LibraryItem[]) ?? []);
      setModules(modulesRes.data ?? []);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (moduleFilter !== "all" && item.module_id !== moduleFilter) return false;
      if (
        search &&
        !item.title.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [items, search, typeFilter, moduleFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, LibraryItem[]> = {
      pdf: [],
      link: [],
      audio: [],
      video: [],
    };
    for (const item of filtered) {
      groups[item.type]?.push(item);
    }
    return groups;
  }, [filtered]);

  const types = ["all", "pdf", "link", "audio", "video"];

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
        Library
      </h1>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: "8px 14px",
            color: "#F0F6FF",
            fontFamily: "var(--font-dm-sans)",
            fontSize: 14,
            outline: "none",
            minWidth: 220,
          }}
        />

        <div style={{ display: "flex", gap: 6 }}>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: "6px 14px",
                borderRadius: 9999,
                border: "1px solid",
                borderColor:
                  typeFilter === t
                    ? "#00D4FF"
                    : "rgba(255,255,255,0.1)",
                background:
                  typeFilter === t
                    ? "rgba(0,212,255,0.15)"
                    : "transparent",
                color: typeFilter === t ? "#00D4FF" : "#8BA0BF",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-dm-sans)",
                textTransform: "capitalize",
              }}
            >
              {t === "all" ? "All" : `${typeIcons[t]} ${t}`}
            </button>
          ))}
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: "8px 14px",
            color: "#F0F6FF",
            fontFamily: "var(--font-dm-sans)",
            fontSize: 14,
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

      {/* Grouped items */}
      {(typeFilter === "all" ? ["pdf", "link", "audio", "video"] : [typeFilter]).map(
        (type) => {
          const group = grouped[type] ?? [];
          if (group.length === 0) return null;
          return (
            <div key={type}>
              <h2
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  fontSize: 20,
                  margin: "0 0 12px",
                  textTransform: "capitalize",
                }}
              >
                {typeIcons[type]} {type}s
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 12,
                }}
              >
                {group.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...cardStyle,
                      padding: "16px 20px",
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 24, flexShrink: 0 }}>
                      {typeIcons[item.type]}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          fontSize: 14,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: 12,
                          color: "#4A6080",
                        }}
                      >
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{ color: "#00D4FF", fontSize: 14 }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          );
        }
      )}

      {filtered.length === 0 && (
        <p
          style={{
            color: "#4A6080",
            fontSize: 14,
            textAlign: "center",
            padding: 40,
          }}
        >
          No resources found.
        </p>
      )}
    </div>
  );
}
