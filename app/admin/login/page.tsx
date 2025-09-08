// app/admin/login/page.tsx
"use client"; // 폼에서 상태를 다루려면 클라이언트 컴포넌트 필요

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 실제 로그인 로직(API 요청 등)을 처리하면 됨
    console.log("로그인 시도:", { email, password });
    alert(`로그인 시도: ${email}`);
  };

  return (
    <main style={{ padding: "40px", maxWidth: "400px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Login</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          로그인
        </button>
      </form>
    <p style={{ marginTop: 12 }}>
     <a href="/admin/forgot">Forgot your password?</a>
    </p>

    
    </main>
  );
}
