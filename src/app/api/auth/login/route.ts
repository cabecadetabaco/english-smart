import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Preencha email e senha." },
      { status: 400 }
    );
  }

  // Simple Supabase client - just authenticate, no SSR complexity
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      { error: "Email ou senha incorretos." },
      { status: 401 }
    );
  }

  // Get user role
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const destination =
    profile?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  const response = NextResponse.json({ redirect: destination });

  // Manually set cookies in the EXACT format @supabase/ssr expects:
  // key = sb-{projectRef}-auth-token
  // value = "base64-" + base64url(JSON.stringify(session))
  const projectRef =
    process.env.NEXT_PUBLIC_SUPABASE_URL!.match(/\/\/([^.]+)/)?.[1] || "";
  const cookieName = `sb-${projectRef}-auth-token`;

  const sessionJson = JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + data.session.expires_in,
    expires_in: data.session.expires_in,
    token_type: "bearer",
    user: data.user,
  });

  const encoded = "base64-" + Buffer.from(sessionJson).toString("base64url");

  const cookieOptions = {
    path: "/",
    httpOnly: false,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 400 * 24 * 60 * 60,
  };

  // Check if we need to chunk (encodeURIComponent length > 3180)
  if (encodeURIComponent(encoded).length <= 3180) {
    response.cookies.set(cookieName, encoded, cookieOptions);
  } else {
    // Chunk the value
    const CHUNK_SIZE = 3180;
    let remaining = encodeURIComponent(encoded);
    let chunkIndex = 0;
    while (remaining.length > 0) {
      let head = remaining.slice(0, CHUNK_SIZE);
      // Don't split in middle of a percent-encoded sequence
      const lastPct = head.lastIndexOf("%");
      if (lastPct > CHUNK_SIZE - 3) {
        head = head.slice(0, lastPct);
      }
      const decoded = decodeURIComponent(head);
      response.cookies.set(
        `${cookieName}.${chunkIndex}`,
        decoded,
        cookieOptions
      );
      remaining = remaining.slice(head.length);
      chunkIndex++;
    }
  }

  return response;
}
