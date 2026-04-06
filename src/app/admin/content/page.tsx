"use client";

import React, { useEffect, useState } from "react";
import { createClient, getClientUser } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_active: boolean;
  total_lessons: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  order_index: number;
  is_published: boolean;
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
  padding: "8px 14px",
  color: "#F0F6FF",
  fontFamily: "var(--font-dm-sans)",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box" as const,
};

export default function ContentPage() {
  const supabase = createClient();
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  /* Module form */
  const [newModTitle, setNewModTitle] = useState("");
  const [newModDesc, setNewModDesc] = useState("");
  const [creatingMod, setCreatingMod] = useState(false);

  /* Lesson form */
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonModId, setNewLessonModId] = useState("");
  const [creatingLesson, setCreatingLesson] = useState(false);

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

      const [modRes, lesRes] = await Promise.all([
        supabase.from("modules").select("*").order("order_index"),
        supabase.from("lessons").select("id, module_id, title, order_index, is_published").order("order_index"),
      ]);
      setModules(modRes.data ?? []);
      setLessons(lesRes.data ?? []);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createModule() {
    if (!newModTitle.trim()) return;
    setCreatingMod(true);
    const order = modules.length > 0 ? Math.max(...modules.map((m) => m.order_index)) + 1 : 0;
    const { data } = await supabase
      .from("modules")
      .insert({
        title: newModTitle.trim(),
        description: newModDesc.trim() || null,
        order_index: order,
      })
      .select()
      .single();
    if (data) setModules((prev) => [...prev, data as Module]);
    setNewModTitle("");
    setNewModDesc("");
    setCreatingMod(false);
  }

  async function toggleModuleActive(mod: Module) {
    await supabase
      .from("modules")
      .update({ is_active: !mod.is_active })
      .eq("id", mod.id);
    setModules((prev) =>
      prev.map((m) =>
        m.id === mod.id ? { ...m, is_active: !m.is_active } : m
      )
    );
  }

  async function createLesson(moduleId: string) {
    if (!newLessonTitle.trim()) return;
    setCreatingLesson(true);
    const modLessons = lessons.filter((l) => l.module_id === moduleId);
    const order = modLessons.length > 0 ? Math.max(...modLessons.map((l) => l.order_index)) + 1 : 0;
    const { data } = await supabase
      .from("lessons")
      .insert({
        module_id: moduleId,
        title: newLessonTitle.trim(),
        order_index: order,
      })
      .select("id, module_id, title, order_index, is_published")
      .single();
    if (data) setLessons((prev) => [...prev, data as Lesson]);
    setNewLessonTitle("");
    setNewLessonModId("");
    setCreatingLesson(false);
  }

  async function toggleLessonPublished(lesson: Lesson) {
    await supabase
      .from("lessons")
      .update({ is_published: !lesson.is_published })
      .eq("id", lesson.id);
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lesson.id ? { ...l, is_published: !l.is_published } : l
      )
    );
  }

  async function deleteLesson(lessonId: string) {
    if (!confirm("Delete this lesson?")) return;
    await supabase.from("lessons").delete().eq("id", lessonId);
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
  }

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
        Content Management
      </h1>

      {/* Create module */}
      <div style={cardStyle}>
        <h2
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 18,
            margin: "0 0 16px",
          }}
        >
          Create Module
        </h2>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 12, color: "#8BA0BF", display: "block", marginBottom: 4 }}>
              Title
            </label>
            <input
              value={newModTitle}
              onChange={(e) => setNewModTitle(e.target.value)}
              placeholder="Module title"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 12, color: "#8BA0BF", display: "block", marginBottom: 4 }}>
              Description
            </label>
            <input
              value={newModDesc}
              onChange={(e) => setNewModDesc(e.target.value)}
              placeholder="Optional description"
              style={inputStyle}
            />
          </div>
          <button
            onClick={createModule}
            disabled={creatingMod || !newModTitle.trim()}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "none",
              background: "#00D4FF",
              color: "#0a0f1a",
              fontWeight: 700,
              fontFamily: "var(--font-syne)",
              cursor: creatingMod ? "wait" : "pointer",
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            {creatingMod ? "Creating..." : "+ Module"}
          </button>
        </div>
      </div>

      {/* Module list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {modules.map((mod) => {
          const modLessons = lessons
            .filter((l) => l.module_id === mod.id)
            .sort((a, b) => a.order_index - b.order_index);
          const isExpanded = expanded === mod.id;

          return (
            <div key={mod.id} style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                }}
                onClick={() => setExpanded(isExpanded ? null : mod.id)}
              >
                <span
                  style={{
                    fontSize: 14,
                    color: "#8BA0BF",
                    transition: "transform 0.2s",
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                >
                  ▶
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: 16,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {mod.title}
                </h3>
                <Badge variant="default" size="sm">
                  {modLessons.length} lessons
                </Badge>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModuleActive(mod);
                  }}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: mod.is_active
                      ? "rgba(34,197,94,0.3)"
                      : "rgba(239,68,68,0.3)",
                    background: mod.is_active
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(239,68,68,0.1)",
                    color: mod.is_active ? "#22c55e" : "#ef4444",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {mod.is_active ? "Active" : "Inactive"}
                </button>
              </div>

              {isExpanded && (
                <div style={{ marginTop: 16, paddingLeft: 24 }}>
                  {/* Lessons */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    {modLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 12px",
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color: "#4A6080",
                            width: 24,
                            fontWeight: 600,
                          }}
                        >
                          {lesson.order_index + 1}.
                        </span>
                        <span style={{ flex: 1, fontSize: 14 }}>
                          {lesson.title}
                        </span>
                        <button
                          onClick={() => toggleLessonPublished(lesson)}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 6,
                            border: "1px solid",
                            borderColor: lesson.is_published
                              ? "rgba(34,197,94,0.3)"
                              : "rgba(245,158,11,0.3)",
                            background: lesson.is_published
                              ? "rgba(34,197,94,0.1)"
                              : "rgba(245,158,11,0.1)",
                            color: lesson.is_published
                              ? "#22c55e"
                              : "#f59e0b",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          {lesson.is_published ? "Published" : "Draft"}
                        </button>
                        <button
                          onClick={() => deleteLesson(lesson.id)}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 6,
                            border: "1px solid rgba(239,68,68,0.3)",
                            background: "rgba(239,68,68,0.1)",
                            color: "#ef4444",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {modLessons.length === 0 && (
                      <p
                        style={{
                          color: "#4A6080",
                          fontSize: 13,
                          margin: 0,
                        }}
                      >
                        No lessons yet.
                      </p>
                    )}
                  </div>

                  {/* Add lesson */}
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <input
                      value={newLessonModId === mod.id ? newLessonTitle : ""}
                      onChange={(e) => {
                        setNewLessonModId(mod.id);
                        setNewLessonTitle(e.target.value);
                      }}
                      onFocus={() => setNewLessonModId(mod.id)}
                      placeholder="New lesson title"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      onClick={() => createLesson(mod.id)}
                      disabled={
                        creatingLesson ||
                        newLessonModId !== mod.id ||
                        !newLessonTitle.trim()
                      }
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: "#22c55e",
                        color: "#0a0f1a",
                        fontWeight: 700,
                        fontFamily: "var(--font-syne)",
                        cursor: "pointer",
                        fontSize: 13,
                        whiteSpace: "nowrap",
                      }}
                    >
                      + Lesson
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modules.length === 0 && (
        <p
          style={{
            color: "#4A6080",
            fontSize: 14,
            textAlign: "center",
            padding: 20,
          }}
        >
          No modules created yet.
        </p>
      )}
    </div>
  );
}
