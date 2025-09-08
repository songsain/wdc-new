"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";

export default function ResetPage() {
  const search = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => search.get("token") || "", [search]);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!token) { setMsg("Reset token missing."); return; }
    if (pw !== pw2) { setMsg("Passwords do not match."); return; }
    if (pw.length < 8) { setMsg("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: pw }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data?.message || "Failed to reset."); return; }
      setOk(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Set new password</h1>
      {ok ? (
        <>
          <p style={{ marginBottom: 16 }}>Password changed successfully.</p>
          <button
            onClick={() => router.push("/admin/login")}
            style={{ padding: 10, background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}
          >
            Go to login
          </button>
        </>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          {msg && <p style={{ color: "crimson" }}>{msg}</p>}
          <label>
            New password
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              style={{ width: "100%", padding: 8 }}
              required
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              style={{ width: "100%", padding: 8 }}
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 10,
              fontWeight: 600,
              background: "#0ea5e9",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : "Save new password"}
          </button>
        </form>
      )}
    </main>
  );
}



"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
export default function ResetPage() {
  const search = useSearchParams(); const router = useRouter();
  const token = useMemo(() => search.get("token") || "", [search]);
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState<string | null>(null); const [ok, setOk] = useState(false); const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);
    if (!token) { setMsg("Reset token missing."); return; }
    if (pw !== pw2) { setMsg("Passwords do not match."); return; }
    if (pw.length < 8) { setMsg("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password: pw }) });
      const data = await res.json();
      if (!res.ok) { setMsg(data?.message || "Failed to reset."); return; }
      setOk(true);
    } finally { setLoading(false); }
  };
  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Set new password</h1>
      {ok ? (<>
        <p style={{ marginBottom: 16 }}>Password changed successfully.</p>
        <button onClick={() => router.push("/admin/login")} style={{ padding: 10, background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Go to login</button>
      </>) : (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          {msg && <p style={{ color: "crimson" }}>{msg}</p>}
          <label>New password
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} style={{ width: "100%", padding: 8 }} required />
          </label>
          <label>Confirm password
            <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} style={{ width: "100%", padding: 8 }} required />
          </label>
          <button type="submit" disabled={loading} style={{ padding: 10, fontWeight: 600, background: "#0ea5e9", color: "white", border: "none", borderRadius: 8, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving..." : "Save new password"}
          </button>
        </form>
      )}
    </main>
  );
}
