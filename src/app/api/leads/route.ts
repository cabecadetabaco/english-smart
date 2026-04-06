import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, whatsapp, preferred_time } = body;

  if (!name || !whatsapp || whatsapp.length < 10) {
    return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase
    .from("landing_leads")
    .insert({ name, whatsapp, preferred_time: preferred_time || null });

  const whatsappLink = `https://wa.me/5548999999999?text=${encodeURIComponent(
    `Ola! Meu nome e ${name} e quero agendar minha aula gratuita!`
  )}`;

  return NextResponse.json({ success: true, whatsapp_link: whatsappLink });
}
