"use client";

import React, { useEffect, useState, useRef } from "react";
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

interface ExerciseLink {
  label: string;
  url: string;
}

interface AudioItem {
  label: string;
  url: string;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  video_url: string | null;
  exercise_links: ExerciseLink[] | null;
  pdf_urls: string[] | null;
  audio_urls: AudioItem[] | null;
  complementary_video_urls: ExerciseLink[] | null;
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

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#8BA0BF",
  display: "block",
  marginBottom: 4,
};

const smallBtnStyle = (color: string): React.CSSProperties => ({
  padding: "3px 10px",
  borderRadius: 6,
  border: `1px solid ${color}33`,
  background: `${color}1a`,
  color,
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "var(--font-dm-sans)",
});

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

  /* Editing lesson */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editExercises, setEditExercises] = useState<ExerciseLink[]>([]);
  const [editPdfUrls, setEditPdfUrls] = useState<string[]>([]);
  const [editAudioUrls, setEditAudioUrls] = useState<ExerciseLink[]>([]);
  const [editCompVideos, setEditCompVideos] = useState<ExerciseLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        supabase
          .from("lessons")
          .select("id, module_id, title, description, order_index, is_published, video_url, exercise_links, pdf_urls, audio_urls, complementary_video_urls")
          .order("order_index"),
      ]);
      setModules(modRes.data ?? []);
      setLessons(
        (lesRes.data ?? []).map((l) => ({
          ...l,
          exercise_links: (l.exercise_links as ExerciseLink[] | null) ?? null,
          pdf_urls: (l.pdf_urls as string[] | null) ?? null,
          audio_urls: (l.audio_urls as AudioItem[] | null) ?? null,
          complementary_video_urls: (l.complementary_video_urls as ExerciseLink[] | null) ?? null,
        })) as Lesson[]
      );
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showFeedback(type: "success" | "error", message: string) {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  }

  async function createModule() {
    if (!newModTitle.trim()) return;
    setCreatingMod(true);
    const order =
      modules.length > 0
        ? Math.max(...modules.map((m) => m.order_index)) + 1
        : 0;
    const { data, error } = await supabase
      .from("modules")
      .insert({
        title: newModTitle.trim(),
        description: newModDesc.trim() || null,
        order_index: order,
      })
      .select()
      .single();
    if (error) {
      showFeedback("error", "Erro ao criar módulo: " + error.message);
    } else if (data) {
      setModules((prev) => [...prev, data as Module]);
      showFeedback("success", "Módulo criado com sucesso!");
    }
    setNewModTitle("");
    setNewModDesc("");
    setCreatingMod(false);
  }

  async function toggleModuleActive(mod: Module) {
    const { error } = await supabase
      .from("modules")
      .update({ is_active: !mod.is_active })
      .eq("id", mod.id);
    if (error) {
      showFeedback("error", "Erro ao alterar módulo: " + error.message);
      return;
    }
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
    const order =
      modLessons.length > 0
        ? Math.max(...modLessons.map((l) => l.order_index)) + 1
        : 0;
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        module_id: moduleId,
        title: newLessonTitle.trim(),
        order_index: order,
      })
      .select("id, module_id, title, description, order_index, is_published, video_url, exercise_links, pdf_urls, audio_urls, complementary_video_urls")
      .single();
    if (error) {
      showFeedback("error", "Erro ao criar lição: " + error.message);
    } else if (data) {
      setLessons((prev) => [
        ...prev,
        {
          ...data,
          exercise_links: null,
          pdf_urls: null,
          audio_urls: null,
          complementary_video_urls: null,
        } as Lesson,
      ]);
      showFeedback("success", "Lição criada com sucesso!");
    }
    setNewLessonTitle("");
    setNewLessonModId("");
    setCreatingLesson(false);
  }

  async function toggleLessonPublished(lesson: Lesson) {
    const { error } = await supabase
      .from("lessons")
      .update({ is_published: !lesson.is_published })
      .eq("id", lesson.id);
    if (error) {
      showFeedback("error", "Erro ao alterar publicação: " + error.message);
      return;
    }
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lesson.id ? { ...l, is_published: !l.is_published } : l
      )
    );
  }

  async function deleteLesson(lessonId: string) {
    if (!confirm("Deletar esta lição?")) return;
    const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
    if (error) {
      showFeedback("error", "Erro ao deletar lição: " + error.message);
      return;
    }
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    if (editingId === lessonId) setEditingId(null);
  }

  function openEditor(lesson: Lesson) {
    if (editingId === lesson.id) {
      setEditingId(null);
      return;
    }
    setEditingId(lesson.id);
    setEditTitle(lesson.title);
    setEditDesc(lesson.description ?? "");
    setEditVideoUrl(lesson.video_url ?? "");
    setEditExercises(lesson.exercise_links ?? []);
    setEditPdfUrls(lesson.pdf_urls ?? []);
    // Support both old string[] format and new {label,url}[] format
    const audioArr = lesson.audio_urls ?? [];
    setEditAudioUrls(
      audioArr.map((item) =>
        typeof item === "string" ? { label: "", url: item } : item
      ) as ExerciseLink[]
    );
    setEditCompVideos(lesson.complementary_video_urls ?? []);
  }

  async function saveLesson() {
    if (!editingId) return;
    setSaving(true);
    const payload = {
      title: editTitle.trim(),
      description: editDesc.trim() || null,
      video_url: editVideoUrl.trim() || null,
      exercise_links: editExercises.length > 0 ? editExercises : null,
      pdf_urls: editPdfUrls.length > 0 ? editPdfUrls : null,
      audio_urls: editAudioUrls.length > 0 ? editAudioUrls : null,
      complementary_video_urls: editCompVideos.length > 0 ? editCompVideos : null,
    };
    const { error } = await supabase.from("lessons").update(payload).eq("id", editingId);
    if (error) {
      showFeedback("error", "Erro ao salvar lição: " + error.message);
      setSaving(false);
      return;
    }
    setLessons((prev) =>
      prev.map((l) =>
        l.id === editingId ? { ...l, ...payload } : l
      )
    );
    showFeedback("success", "Lição salva com sucesso!");
    setSaving(false);
    setEditingId(null);
  }

  function addExercise() {
    setEditExercises((prev) => [...prev, { label: "", url: "" }]);
  }

  function updateExercise(idx: number, field: "label" | "url", value: string) {
    setEditExercises((prev) =>
      prev.map((ex, i) => (i === idx ? { ...ex, [field]: value } : ex))
    );
  }

  function removeExercise(idx: number) {
    setEditExercises((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length || !editingId) return;
    setUploading(true);
    const file = e.target.files[0];
    const ext = file.name.split(".").pop();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${editingId}/${Date.now()}_${safeName}`;

    const { error } = await supabase.storage
      .from("lesson-pdfs")
      .upload(path, file, { upsert: true });

    if (!error) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("lesson-pdfs").getPublicUrl(path);
      setEditPdfUrls((prev) => [...prev, publicUrl]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploading(false);
  }

  function removePdf(idx: number) {
    setEditPdfUrls((prev) => prev.filter((_, i) => i !== idx));
  }

  function getPdfName(url: string) {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    // Remove timestamp prefix
    const clean = filename.replace(/^\d+_/, "");
    return decodeURIComponent(clean);
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
      {/* Feedback toast */}
      {feedback && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "12px 20px",
            borderRadius: 12,
            background: feedback.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
            border: `1px solid ${feedback.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            color: feedback.type === "success" ? "#22c55e" : "#ef4444",
            fontSize: 14,
            fontWeight: 600,
            zIndex: 9999,
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          {feedback.message}
        </div>
      )}

      <h1
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: 28,
          margin: 0,
        }}
      >
        Gerenciamento de Conteúdo
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
          Criar Módulo
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
            <label style={labelStyle}>Título</label>
            <input
              value={newModTitle}
              onChange={(e) => setNewModTitle(e.target.value)}
              placeholder="Título do módulo"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={labelStyle}>Descrição</label>
            <input
              value={newModDesc}
              onChange={(e) => setNewModDesc(e.target.value)}
              placeholder="Descrição (opcional)"
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
            {creatingMod ? "Criando..." : "+ Módulo"}
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
                  {modLessons.length} lições
                </Badge>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModuleActive(mod);
                  }}
                  style={smallBtnStyle(mod.is_active ? "#22c55e" : "#ef4444")}
                >
                  {mod.is_active ? "Ativo" : "Inativo"}
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
                      <div key={lesson.id}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 12px",
                            borderRadius: editingId === lesson.id ? "10px 10px 0 0" : 10,
                            background: editingId === lesson.id
                              ? "rgba(0,212,255,0.05)"
                              : "rgba(255,255,255,0.02)",
                            border: editingId === lesson.id
                              ? "1px solid rgba(0,212,255,0.15)"
                              : "1px solid rgba(255,255,255,0.05)",
                            cursor: "pointer",
                          }}
                          onClick={() => openEditor(lesson)}
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
                          {/* Content indicators */}
                          {lesson.video_url && (
                            <span style={{ fontSize: 11, color: "#8BA0BF" }} title="Vídeo">▶️</span>
                          )}
                          {lesson.exercise_links && lesson.exercise_links.length > 0 && (
                            <span style={{ fontSize: 11, color: "#8BA0BF" }} title="Exercícios">📝</span>
                          )}
                          {lesson.audio_urls && lesson.audio_urls.length > 0 && (
                            <span style={{ fontSize: 11, color: "#8BA0BF" }} title="Áudios">🎧</span>
                          )}
                          {lesson.complementary_video_urls && lesson.complementary_video_urls.length > 0 && (
                            <span style={{ fontSize: 11, color: "#8BA0BF" }} title="Vídeos Complementares">🎬</span>
                          )}
                          {lesson.pdf_urls && lesson.pdf_urls.length > 0 && (
                            <span style={{ fontSize: 11, color: "#8BA0BF" }} title="PDFs">📄</span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLessonPublished(lesson);
                            }}
                            style={smallBtnStyle(
                              lesson.is_published ? "#22c55e" : "#f59e0b"
                            )}
                          >
                            {lesson.is_published ? "Publicada" : "Rascunho"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLesson(lesson.id);
                            }}
                            style={smallBtnStyle("#ef4444")}
                          >
                            Deletar
                          </button>
                        </div>

                        {/* Editor panel */}
                        {editingId === lesson.id && (
                          <div
                            style={{
                              padding: 20,
                              background: "rgba(0,212,255,0.03)",
                              border: "1px solid rgba(0,212,255,0.15)",
                              borderTop: "none",
                              borderRadius: "0 0 10px 10px",
                              display: "flex",
                              flexDirection: "column",
                              gap: 16,
                            }}
                          >
                            {/* Title + Description */}
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                              <div style={{ flex: 1, minWidth: 200 }}>
                                <label style={labelStyle}>Título da Lição</label>
                                <input
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  style={inputStyle}
                                />
                              </div>
                              <div style={{ flex: 1, minWidth: 200 }}>
                                <label style={labelStyle}>Descrição</label>
                                <input
                                  value={editDesc}
                                  onChange={(e) => setEditDesc(e.target.value)}
                                  placeholder="Descrição da lição"
                                  style={inputStyle}
                                />
                              </div>
                            </div>

                            {/* YouTube URL */}
                            <div>
                              <label style={labelStyle}>Link do YouTube</label>
                              <input
                                value={editVideoUrl}
                                onChange={(e) => setEditVideoUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                style={inputStyle}
                              />
                              {editVideoUrl && (
                                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#4A6080" }}>
                                  O vídeo será exibido como player embutido para o aluno
                                </p>
                              )}
                            </div>

                            {/* Exercise links */}
                            <div>
                              <label style={labelStyle}>Links de Exercício</label>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {editExercises.map((ex, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      display: "flex",
                                      gap: 8,
                                      alignItems: "center",
                                    }}
                                  >
                                    <input
                                      value={ex.label}
                                      onChange={(e) =>
                                        updateExercise(i, "label", e.target.value)
                                      }
                                      placeholder="Nome do exercício"
                                      style={{ ...inputStyle, flex: 1 }}
                                    />
                                    <input
                                      value={ex.url}
                                      onChange={(e) =>
                                        updateExercise(i, "url", e.target.value)
                                      }
                                      placeholder="https://..."
                                      style={{ ...inputStyle, flex: 2 }}
                                    />
                                    <button
                                      onClick={() => removeExercise(i)}
                                      style={smallBtnStyle("#ef4444")}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={addExercise}
                                  style={{
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    border: "1px dashed rgba(0,212,255,0.3)",
                                    background: "transparent",
                                    color: "#00D4FF",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "var(--font-dm-sans)",
                                    alignSelf: "flex-start",
                                  }}
                                >
                                  + Adicionar exercício
                                </button>
                              </div>
                            </div>

                            {/* Audio links */}
                            <div>
                              <label style={labelStyle}>Links de Áudio</label>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {editAudioUrls.map((a, i) => (
                                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <input
                                      value={a.label}
                                      onChange={(e) =>
                                        setEditAudioUrls((prev) =>
                                          prev.map((item, idx) =>
                                            idx === i ? { ...item, label: e.target.value } : item
                                          )
                                        )
                                      }
                                      placeholder="Nome do áudio (ex: Dialogue 1)"
                                      style={{ ...inputStyle, flex: 1 }}
                                    />
                                    <input
                                      value={a.url}
                                      onChange={(e) =>
                                        setEditAudioUrls((prev) =>
                                          prev.map((item, idx) =>
                                            idx === i ? { ...item, url: e.target.value } : item
                                          )
                                        )
                                      }
                                      placeholder="https://... (link do áudio)"
                                      style={{ ...inputStyle, flex: 2 }}
                                    />
                                    <button
                                      onClick={() =>
                                        setEditAudioUrls((prev) => prev.filter((_, idx) => idx !== i))
                                      }
                                      style={smallBtnStyle("#ef4444")}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() =>
                                    setEditAudioUrls((prev) => [...prev, { label: "", url: "" }])
                                  }
                                  style={{
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    border: "1px dashed rgba(0,212,255,0.3)",
                                    background: "transparent",
                                    color: "#00D4FF",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "var(--font-dm-sans)",
                                    alignSelf: "flex-start",
                                  }}
                                >
                                  + Adicionar áudio
                                </button>
                              </div>
                            </div>

                            {/* Complementary video links */}
                            <div>
                              <label style={labelStyle}>Vídeos Complementares</label>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {editCompVideos.map((v, i) => (
                                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <input
                                      value={v.label}
                                      onChange={(e) =>
                                        setEditCompVideos((prev) =>
                                          prev.map((item, idx) =>
                                            idx === i ? { ...item, label: e.target.value } : item
                                          )
                                        )
                                      }
                                      placeholder="Nome do vídeo"
                                      style={{ ...inputStyle, flex: 1 }}
                                    />
                                    <input
                                      value={v.url}
                                      onChange={(e) =>
                                        setEditCompVideos((prev) =>
                                          prev.map((item, idx) =>
                                            idx === i ? { ...item, url: e.target.value } : item
                                          )
                                        )
                                      }
                                      placeholder="https://youtube.com/..."
                                      style={{ ...inputStyle, flex: 2 }}
                                    />
                                    <button
                                      onClick={() =>
                                        setEditCompVideos((prev) => prev.filter((_, idx) => idx !== i))
                                      }
                                      style={smallBtnStyle("#ef4444")}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() =>
                                    setEditCompVideos((prev) => [...prev, { label: "", url: "" }])
                                  }
                                  style={{
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    border: "1px dashed rgba(0,212,255,0.3)",
                                    background: "transparent",
                                    color: "#00D4FF",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "var(--font-dm-sans)",
                                    alignSelf: "flex-start",
                                  }}
                                >
                                  + Adicionar vídeo complementar
                                </button>
                              </div>
                            </div>

                            {/* PDF upload */}
                            <div>
                              <label style={labelStyle}>PDFs da Aula</label>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {editPdfUrls.map((url, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                      padding: "6px 12px",
                                      borderRadius: 8,
                                      background: "rgba(34,197,94,0.05)",
                                      border: "1px solid rgba(34,197,94,0.15)",
                                    }}
                                  >
                                    <span style={{ fontSize: 14 }}>📄</span>
                                    <span
                                      style={{
                                        flex: 1,
                                        fontSize: 13,
                                        color: "#22c55e",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {getPdfName(url)}
                                    </span>
                                    <button
                                      onClick={() => removePdf(i)}
                                      style={smallBtnStyle("#ef4444")}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={handlePdfUpload}
                                    style={{ display: "none" }}
                                  />
                                  <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    style={{
                                      padding: "6px 14px",
                                      borderRadius: 8,
                                      border: "1px dashed rgba(0,212,255,0.3)",
                                      background: "transparent",
                                      color: uploading ? "#4A6080" : "#00D4FF",
                                      fontSize: 12,
                                      fontWeight: 600,
                                      cursor: uploading ? "wait" : "pointer",
                                      fontFamily: "var(--font-dm-sans)",
                                    }}
                                  >
                                    {uploading ? "Enviando..." : "+ Upload PDF"}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Save / Cancel */}
                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                                justifyContent: "flex-end",
                                borderTop: "1px solid rgba(255,255,255,0.06)",
                                paddingTop: 16,
                              }}
                            >
                              <button
                                onClick={() => setEditingId(null)}
                                style={{
                                  padding: "8px 20px",
                                  borderRadius: 10,
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  background: "transparent",
                                  color: "#8BA0BF",
                                  fontWeight: 600,
                                  fontFamily: "var(--font-syne)",
                                  cursor: "pointer",
                                  fontSize: 13,
                                }}
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={saveLesson}
                                disabled={saving || !editTitle.trim()}
                                style={{
                                  padding: "8px 20px",
                                  borderRadius: 10,
                                  border: "none",
                                  background: "#22c55e",
                                  color: "#0a0f1a",
                                  fontWeight: 700,
                                  fontFamily: "var(--font-syne)",
                                  cursor: saving ? "wait" : "pointer",
                                  fontSize: 13,
                                }}
                              >
                                {saving ? "Salvando..." : "Salvar Lição"}
                              </button>
                            </div>
                          </div>
                        )}
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
                        Nenhuma lição ainda.
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
                      placeholder="Título da nova lição"
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
                      + Lição
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
          Nenhum módulo criado ainda.
        </p>
      )}
    </div>
  );
}
