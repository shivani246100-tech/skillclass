import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dashboardPath, setSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    await setSession(user.id);
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role }, redirect: dashboardPath(user.role) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to login. Check your database configuration." }, { status: 500 });
  }
}
