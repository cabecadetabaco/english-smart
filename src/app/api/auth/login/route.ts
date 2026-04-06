import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Preencha email e senha." }, { status: 400 });
  }

  // Use anon client for auth
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return NextResponse.json({ error: "Email ou senha incorretos." }, { status: 401 });
  }

  // Use service role to get profile (bypasses RLS)
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const destination = profile?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  const response = NextResponse.json({ redirect: destination });

  // Manually set Supabase auth cookies
  // The @supabase/ssr client expects cookies in this format
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL!.match(/\/\/([^.]+)/)?.[1] || "";
  const cookieBase = `sb-${projectRef}-auth-token`;

  // Supabase SSR stores the session as a base64 JSON string, potentially chunked
  const sessionStr = JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + data.session.expires_in,
    expires_in: data.session.expires_in,
    token_type: "bearer",
    user: data.user,
  });

  const encoded = Buffer.from(sessionStr).toString("base64url");

  // Supabase SSR chunks cookies at ~3180 chars
  const CHUNK_SIZE = 3180;
  const chunks = [];
  for (let i = 0; i < encoded.length; i += CHUNK_SIZE) {
    chunks.push(encoded.substring(i, i + CHUNK_SIZE));
  }

  const cookieOptions = {
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: data.session.expires_in,
  };

  if (chunks.length === 1) {
    response.cookies.set(cookieBase, `base64-${encoded}`, cookieOptions);
  } else {
    for (let i = 0; i < chunks.length; i++) {
      response.cookies.set(`${cookieBase}.${i}`, `base64-${chunks[i]}`, cookieOptions);
    }
  }

  return response;
}
