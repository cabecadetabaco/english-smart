import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import LessonContent from "@/components/student/LessonContent";
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

  const currentIdx = allLessons?.findIndex((l) => l.id === lessonId) ?? 0;
  const nextLesson =
    allLessons && currentIdx < allLessons.length - 1
      ? allLessons[currentIdx + 1]
      : null;

  const nextLessonUrl = nextLesson
    ? `/student/modules/${moduleId}/${nextLesson.id}`
    : null;

  return (
    <LessonContent
      moduleId={moduleId}
      lessonId={lessonId}
      userId={user.id}
      lesson={{
        title: lesson.title,
        description: lesson.description,
        video_url: lesson.video_url,
        canva_embed_url: lesson.canva_embed_url,
        audio_urls: (lesson.audio_urls as ({ label: string; url: string } | string)[] | null) ?? [],
        exercise_links:
          (lesson.exercise_links as { label: string; url: string }[] | null) ?? [],
        pdf_urls: (lesson.pdf_urls as string[] | null) ?? [],
        google_form_url: lesson.google_form_url,
        task_description: lesson.task_description,
        complementary_video_urls:
          (lesson.complementary_video_urls as { label: string; url: string }[] | null) ?? [],
      }}
      moduleTitle={mod?.title ?? "Módulo"}
      initialFlags={{
        video_done: progressRow?.video_done ?? false,
        slides_done: progressRow?.slides_done ?? false,
        listen_repeat_done: progressRow?.listen_repeat_done ?? false,
        exercises_done: progressRow?.exercises_done ?? false,
        live_class_done: progressRow?.live_class_done ?? false,
        task_done: progressRow?.task_done ?? false,
        mission_submitted: progressRow?.mission_submitted ?? false,
      }}
      missionGrade={progressRow?.mission_grade ?? null}
      missionGradedAt={progressRow?.mission_graded_at ?? null}
      nextLessonUrl={nextLessonUrl}
    />
  );
}
