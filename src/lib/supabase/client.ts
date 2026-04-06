import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  const token = getTokenFromCookie();

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    token
      ? { global: { headers: { Authorization: `Bearer ${token}` } } }
      : undefined
  );
}

// Read the JWT from our simple cookie
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)es-access-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Get user info by decoding the JWT payload (no network call)
export function getClientUser(): { id: string; email: string } | null {
  const token = getTokenFromCookie();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.sub, email: payload.email ?? "" };
  } catch {
    return null;
  }
}
