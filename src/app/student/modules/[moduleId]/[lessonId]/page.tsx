import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import Badge from "@/components/ui/Badge";
import CheckboxProgress from "@/components/student/CheckboxProgress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesson | English Smart",
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;
  const user = await getUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) redirect(`/student/modules/${moduleId}`);

  const { data: mod } = await supabase
    .from("modules")
    .select("title")
    .eq("id", moduleId)
    .single();

  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id, title, order_index")
    .eq("module_id", moduleId)
    .eq("is_published", true)
    .order("order_index");

  const { data: progressRow } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("student_id", user.id)
    .eq("lesson_id", lessonId)
    .single();

  const currentIdx =
    allLessons?.findIndex((l) => l.id === lessonId) ?? 0;
  const prevLesson = currentIdx > 0 ? allLessons![currentIdx - 1] : null;
  const nextLesson =
    allLessons && currentIdx < allLessons.length - 1
      ? allLessons[currentIdx + 1]
      : null;

  const audioUrls = (lesson.audio_urls as string[] | null) ?? [];
  const exerciseLinks =
    (lesson.exercise_links as { label: string; url: string }[] | null) ?? [];

  const initialFlags = {
    video_done: progressRow?.video_done ?? false,
    slides_done: progressRow?.slides_done ?? false,
    listen_repeat_done: progressRow?.listen_repeat_done ?? false,
    exercises_done: progressRow?.exercises_done ?? false,
    live_class_done: progressRow?.live_class_done ?? false,
    task_done: progressRow?.task_done ?? false,
    mission_submitted: progressRow?.mission_submitted ?? false,
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: 24,
  };

  const sectionTitle: React.CSSProperties = {
    fontFamily: "var(--font-syne)",
    fontWeight: 700,
    fontSize: 18,
    margin: "0 0 16px",
    color: "#F0F6FF",
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
      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#8BA0BF", flexWrap: "wrap" }}>
        <a
          href="/student/modules"
          style={{ color: "#00D4FF", textDecoration: "none" }}
        >
          Modules
        </a>
        <span>/</span>
        <a
          href={`/student/modules/${moduleId}`}
          style={{ color: "#00D4FF", textDecoration: "none" }}
        >
          {mod?.title ?? "Module"}
        </a>
        <span>/</span>
        <span>{lesson.title}</span>
      </div>

      {/* Lesson header */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: 26,
              margin: 0,
            }}
          >
            {lesson.title}
          </h1>
          {progressRow?.mission_grade != null && (
            <Badge
              variant={progressRow.mission_grade >= 7 ? "success" : "warning"}
            >
              Grade: {progressRow.mission_grade}/10
            </Badge>
          )}
        </div>
        {lesson.description && (
          <p style={{ margin: "8px 0 0", color: "#8BA0BF", fontSize: 14 }}>
            {lesson.description}
          </p>
        )}
      </div>

      {/* Video */}
      {lesson.video_url && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Video Lesson</h2>
          <div
            style={{
              position: "relative",
              paddingTop: "56.25%",
              borderRadius: 12,
              overflow: "hidden",
              background: "#0a0f1a",
            }}
          >
            <iframe
              src={lesson.video_url}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Canva slides */}
      {lesson.canva_embed_url && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Slides</h2>
          <div
            style={{
              position: "relative",
              paddingTop: "56.25%",
              borderRadius: 12,
              overflow: "hidden",
              background: "#0a0f1a",
            }}
          >
            <iframe
              src={lesson.canva_embed_url}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Audio player */}
      {audioUrls.length > 0 && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Listen & Repeat</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {audioUrls.map((url, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: 13,
                    color: "#8BA0BF",
                  }}
                >
                  Audio {i + 1}
                </p>
                <audio
                  controls
                  src={url}
                  style={{ width: "100%", height: 36 }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise links */}
      {exerciseLinks.length > 0 && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Exercises</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {exerciseLinks.map((ex, i) => (
              <a
                key={i}
                href={ex.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(0,212,255,0.05)",
                  border: "1px solid rgba(0,212,255,0.1)",
                  color: "#00D4FF",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <span>🔗</span>
                {ex.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Google Form */}
      {lesson.google_form_url && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Assessment Form</h2>
          <a
            href={lesson.google_form_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #00D4FF, #0066FF)",
              color: "#F0F6FF",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-syne)",
            }}
          >
            📝 Open Google Form
          </a>
        </div>
      )}

      {/* Mission / Task */}
      {lesson.task_description && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Mission / Task</h2>
          <p
            style={{
              margin: 0,
              color: "#8BA0BF",
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {lesson.task_description}
          </p>
        </div>
      )}

      {/* Grade display */}
      {progressRow?.mission_grade != null && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Your Grade</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background:
                  progressRow.mission_grade >= 7
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(245,158,11,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: 24,
                color:
                  progressRow.mission_grade >= 7 ? "#22c55e" : "#f59e0b",
              }}
            >
              {progressRow.mission_grade}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, color: "#8BA0BF" }}>
                out of 10
              </p>
              {progressRow.mission_graded_at && (
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#4A6080" }}>
                  Graded on{" "}
                  {new Date(progressRow.mission_graded_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress checkboxes */}
      <div style={cardStyle}>
        <CheckboxProgress
          lessonId={lessonId}
          studentId={user.id}
          initial={initialFlags}
        />
      </div>

      {/* Prev / Next navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {prevLesson ? (
          <a
            href={`/student/modules/${moduleId}/${prevLesson.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#8BA0BF",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            ← {prevLesson.title}
          </a>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <a
            href={`/student/modules/${moduleId}/${nextLesson.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              borderRadius: 12,
              background: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "#00D4FF",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {nextLesson.title} →
          </a>
        ) : (
          <a
            href={`/student/modules/${moduleId}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              borderRadius: 12,
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "#22c55e",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Back to Module ✓
          </a>
        )}
      </div>
    </div>
  );
}
