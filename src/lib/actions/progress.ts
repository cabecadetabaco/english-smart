"use server";
import { createClient } from "@/lib/supabase/server";

export type ProgressFlags = {
  video_done: boolean;
  slides_done: boolean;
  listen_repeat_done: boolean;
  exercises_done: boolean;
  live_class_done: boolean;
  task_done: boolean;
  mission_submitted: boolean;
};

const weights: Record<keyof ProgressFlags, number> = {
  video_done: 15,
  slides_done: 15,
  listen_repeat_done: 15,
  exercises_done: 15,
  live_class_done: 15,
  task_done: 15,
  mission_submitted: 10,
};

export async function updateLessonProgressFlags(
  studentId: string,
  lessonId: string,
  flags: Partial<ProgressFlags>
) {
  const supabase = await createClient();

  /* Fetch current row so we can compute completion_percentage */
  const { data: current } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("student_id", studentId)
    .eq("lesson_id", lessonId)
    .single();

  const merged = {
    video_done: false,
    slides_done: false,
    listen_repeat_done: false,
    exercises_done: false,
    live_class_done: false,
    task_done: false,
    mission_submitted: false,
    ...(current ?? {}),
    ...flags,
  };

  let pct = 0;
  for (const key of Object.keys(weights) as (keyof ProgressFlags)[]) {
    if (merged[key]) pct += weights[key];
  }

  const completedAt = pct >= 100 ? new Date().toISOString() : null;

  await supabase.from("lesson_progress").upsert(
    {
      student_id: studentId,
      lesson_id: lessonId,
      ...flags,
      completion_percentage: pct,
      completed_at: completedAt,
    },
    { onConflict: "student_id,lesson_id" }
  );
}
