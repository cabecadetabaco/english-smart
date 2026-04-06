import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("es-access-token")?.value;
  const refreshToken = cookieStore.get("es-refresh-token")?.value;

  // Create client with auth header so RLS queries work
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    accessToken
      ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
      : undefined
  );

  // Override getUser so it uses our token directly
  // (setSession doesn't work reliably in serverless)
  const originalGetUser = supabase.auth.getUser.bind(supabase.auth);
  supabase.auth.getUser = (jwt?: string) => {
    return originalGetUser(jwt || accessToken);
  };

  return supabase;
}

export async function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
