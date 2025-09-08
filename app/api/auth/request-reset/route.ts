import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs"; // nodemailer 사용시 node 런타임

export async function POST(req: Request) {
  const { email } = await req.json();

  if (typeof email !== "string" || email.length < 3) {
    return NextResponse.json({ ok: true }); // 정보 노출 방지
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // 존재 여부 노출 방지: 항상 동일 응답
  if (!user) return NextResponse.json({ ok: true });

  // 기존 미사용 토큰 무효화
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, used: false, expiresAt: { gt: new Date() } },
    data: { used: true },
  });

  // 새 토큰 생성
  const raw = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(raw).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1시간

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/admin/reset?token=${raw}`;

  // 이메일 본문
  const html = `
    <div style="font-family:system-ui">
      <h2>Reset your password</h2>
      <p>Click the button below to set a new password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="display:inline-block;background:#0ea5e9;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a></p>
      <p>If you didn’t request this, you can ignore this email.</p>
    </div>
  `;

  try {
    await sendEmail({
      to: email,
      subject: "Reset your WonderChain admin password",
      html,
    });
  } catch (e) {
    // 메일 실패해도 토큰은 생성됨. 보안상 ok 처리
    console.error("sendEmail error", e);
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const { email } = await req.json();
  if (typeof email !== "string" || email.length < 3) return NextResponse.json({ ok: true });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: true });
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, used: false, expiresAt: { gt: new Date() } },
    data: { used: true },
  });
  const raw = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(raw).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/admin/reset?token=${raw}`;
  const html = `<div style="font-family:system-ui"><h2>Reset your password</h2><p><a href="${resetUrl}" style="display:inline-block;background:#0ea5e9;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a></p></div>`;
  try { await sendEmail({ to: email, subject: "Reset your WonderChain admin password", html }); } catch {}
  return NextResponse.json({ ok: true });
}

