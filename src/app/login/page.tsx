"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      // Login via browser client - sets cookies automatically
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !data.user) {
        setError("Email ou senha incorretos.");
        setLoading(false);
        return;
      }

      // Query profile for role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const destination = profile?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

      // Full page redirect
      window.location.href = destination;
    } catch {
      setError("Erro de conexao. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "#050A18", position: "relative", overflow: "hidden" }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(0,212,255,0.06)", filter: "blur(100px)", top: "-100px", left: "-100px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(0,102,255,0.08)", filter: "blur(80px)", bottom: "-50px", right: "-50px", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px" }}>
          <Image src="/assets/logos/logo-badge-color.jpg" alt="English Smart" width={72} height={72} style={{ borderRadius: "50%", marginBottom: "16px" }} />
          <h1 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#F0F6FF", margin: 0 }}>English Smart</h1>
          <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: "0.9rem", color: "#4A6080", margin: "6px 0 0" }}>Acesse sua area do aluno</p>
        </div>

        {/* Form card */}
        <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "40px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", fontFamily: "var(--font-dm-sans)", fontSize: "0.875rem", color: "#FCA5A5" }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", fontWeight: 500, color: "#8BA0BF", marginBottom: "8px" }}>Email</label>
              <input type="email" required placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#F0F6FF", fontFamily: "var(--font-dm-sans)", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ display: "block", fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", fontWeight: 500, color: "#8BA0BF", marginBottom: "8px" }}>Senha</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "12px 16px", paddingRight: "48px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#F0F6FF", fontFamily: "var(--font-dm-sans)", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#4A6080", fontSize: "1.1rem" }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "14px", background: loading ? "rgba(0,212,255,0.4)" : "linear-gradient(135deg, #00D4FF, #0066FF)", color: "#fff", border: "none", borderRadius: "12px", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 0 20px rgba(0,212,255,0.2)" }}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p style={{ fontFamily: "var(--font-dm-sans)", textAlign: "center", marginTop: "24px", fontSize: "0.875rem" }}>
          <Link href="/" style={{ color: "#8BA0BF", textDecoration: "none" }}>← Voltar ao site</Link>
        </p>
      </div>
    </div>
  );
}
