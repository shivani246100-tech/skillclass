import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./prisma";
import type { Role, User } from "@prisma/client";

const COOKIE_NAME = "skillclass_session";
const SESSION_DAYS = 7;

function secret() {
  return process.env.NEXTAUTH_SECRET || "dev-only-change-this-secret";
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(key, "hex");
  return expected.length === derived.length && crypto.timingSafeEqual(expected, derived);
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionToken(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 24 * 60 * 60;
  const payload = `${userId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token?: string) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expText, signature] = parts;
  const exp = Number(expText);
  if (!userId || !Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  const payload = `${userId}.${exp}`;
  const expected = sign(payload);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return userId;
}

export async function setSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const store = await cookies();
  const userId = readSessionToken(store.get(COOKIE_NAME)?.value);
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, mobile: true, role: true, active: true },
  });
}

export async function requireUser(roles?: Role[]) {
  const user = await getCurrentUser();
  if (!user || !user.active || (roles && !roles.includes(user.role))) return null;
  return user;
}

export function dashboardPath(role: Role) {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "TEACHER") return "/dashboard/teacher";
  if (role === "SELLER") return "/dashboard/seller";
  return "/dashboard/student";
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
