"use client";

import { useState } from "react";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true); // 존재여부와 상관없이 완료 표시
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Forgot password</h1>
      {done ? (
        <p>If an account with that email exists, we sent a reset link.</p>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: 8 }}
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
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </main>
  );
}

"use client";
import { useState } from "react";
export default function ForgotPage() {
  const [email, setEmail] = useState(""); const [done, setDone] = useState(false); const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await fetch("/api/auth/request-reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); setDone(true); }
    finally { setLoading(false); }
  };
  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Forgot password</h1>
      {done ? <p>If an account with that email exists, we sent a reset link.</p> : (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label>Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8 }} />
          </label>
          <button type="submit" disabled={loading} style={{ padding: 10, fontWeight: 600, background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </main>
  );
}
