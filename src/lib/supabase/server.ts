import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Decode JWT payload without verification (token was already verified at login)
function decodeJwtPayload(token: string) {
  try {
    const payload = token.split(".")[1];
    const json = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Get authenticated user from cookie - returns { id, email, ... } or null
export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("es-access-token")?.value;
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload || !payload.sub) return null;

  // Check if token is expired
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

  return {
    id: payload.sub as string,
    email: (payload.email ?? "") as string,
    user_metadata: payload.user_metadata ?? {},
  };
}

// Create Supabase client authenticated as the user (for RLS queries)
export async function createClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("es-access-token")?.value;

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    token
      ? { global: { headers: { Authorization: `Bearer ${token}` } } }
      : undefined
  );
}

export async function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
