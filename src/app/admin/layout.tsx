import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLayoutWrapper from "@/components/layout/AdminLayoutWrapper";

export default async function AdminLayout({
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

  if (profile.role !== "admin") {
    redirect("/student/dashboard");
  }

  return (
    <AdminLayoutWrapper profile={profile}>{children}</AdminLayoutWrapper>
  );
}
