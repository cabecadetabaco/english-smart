import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StudentLayoutWrapper from "@/components/layout/StudentLayoutWrapper";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role, level, streak_days")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role === "admin") {
    redirect("/admin/dashboard");
  }

  // Fetch modules and calculate progress
  const { data: modules } = await supabase
    .from("modules")
    .select("id, title")
    .order("order_index", { ascending: true });

  const { data: lessonProgress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed, lessons(module_id)")
    .eq("user_id", user.id);

  const moduleProgress = (modules ?? []).map((mod) => {
    const moduleLessons = (lessonProgress ?? []).filter(
      (lp: Record<string, unknown>) =>
        lp.lessons && (lp.lessons as Record<string, unknown>).module_id === mod.id
    );
    const total = moduleLessons.length;
    const completed = moduleLessons.filter(
      (lp: Record<string, unknown>) => lp.completed
    ).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { id: mod.id, title: mod.title, percent };
  });

  return (
    <StudentLayoutWrapper profile={profile} moduleProgress={moduleProgress}>
      {children}
    </StudentLayoutWrapper>
  );
}
