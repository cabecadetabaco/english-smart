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

export async function updateLessonProgressFlags(
  studentId: string,
  lessonId: string,
  flags: Partial<ProgressFlags>
) {
  const supabase = await createClient();

  // Only send the boolean flags — the DB trigger calculates
  // completion_percentage and completed_at automatically.
  const { error } = await supabase.from("lesson_progress").upsert(
    {
      student_id: studentId,
      lesson_id: lessonId,
      ...flags,
    },
    { onConflict: "student_id,lesson_id" }
  );

  if (error) {
    console.error("Failed to update lesson progress:", error);
    throw new Error("Failed to update progress");
  }
}
