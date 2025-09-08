import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  // 필요하면 더 강한 규칙 추가
  return null;
}

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (typeof token !== "string" || typeof password !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const err = validatePassword(password);
  if (err) return NextResponse.json({ ok: false, message: err }, { status: 400 });

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const rec = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!rec) {
    return NextResponse.json({ ok: false, message: "Invalid or expired token." }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: rec.userId },
      data: { passwordHash: hash },
    }),
    prisma.passwordResetToken.update({
      where: { id: rec.id },
      data: { used: true },
    }),
  ]);

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";
export const runtime = "nodejs";
function validatePassword(pw: string) {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  return null;
}
export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (typeof token !== "string" || typeof password !== "string") return NextResponse.json({ ok: false }, { status: 400 });
  const err = validatePassword(password); if (err) return NextResponse.json({ ok: false, message: err }, { status: 400 });
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const rec = await prisma.passwordResetToken.findFirst({
    where: { tokenHash, used: false, expiresAt: { gt: new Date() } },
  });
  if (!rec) return NextResponse.json({ ok: false, message: "Invalid or expired token." }, { status: 400 });
  const hash = await bcrypt.hash(password, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { id: rec.userId }, data: { passwordHash: hash } }),
    prisma.passwordResetToken.update({ where: { id: rec.id }, data: { used: true } }),
  ]);
  return NextResponse.json({ ok: true });
}
