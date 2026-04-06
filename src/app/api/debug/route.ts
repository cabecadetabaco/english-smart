import { NextResponse } from "next/server";
import { createClient, getUser } from "@/lib/supabase/server";

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ step: "getUser", result: "null - would redirect to login" });
  }

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    step: "all",
    user: { id: user.id, email: user.email },
    profile: profile,
    profileError: profileError?.message ?? null,
    wouldRedirect: !profile ? "/login (no profile)" : profile.role !== "admin" ? "/student/dashboard" : "none - would show admin dashboard",
  });
}
