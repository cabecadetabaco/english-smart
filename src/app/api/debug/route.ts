import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("es-access-token")?.value;
  const allCookies = cookieStore.getAll().map((c) => c.name);

  let decoded = null;
  if (token) {
    try {
      const payload = Buffer.from(token.split(".")[1], "base64url").toString("utf8");
      decoded = JSON.parse(payload);
    } catch (e: any) {
      decoded = { error: e.message };
    }
  }

  return NextResponse.json({
    hasCookie: !!token,
    tokenLength: token?.length ?? 0,
    allCookieNames: allCookies,
    decodedSub: decoded?.sub ?? null,
    decodedEmail: decoded?.email ?? null,
    decodedExp: decoded?.exp ?? null,
    now: Math.floor(Date.now() / 1000),
    expired: decoded?.exp ? decoded.exp < Math.floor(Date.now() / 1000) : null,
  });
}
