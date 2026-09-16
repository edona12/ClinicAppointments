import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getUserById } from "@/lib/db";
import type { PublicUser, Role, User } from "@/lib/types";

export { hashPassword, verifyPassword } from "@/lib/password";

const SESSION_COOKIE = "klinika_session";
const SECRET = process.env.SESSION_SECRET || "klinika-vita-dev-secret";

function sign(value: string): string {
  const hmac = createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function unsign(token: string): string | null {
  const index = token.lastIndexOf(".");
  if (index === -1) return null;
  const value = token.slice(0, index);
  const hmac = token.slice(index + 1);
  const expected = createHmac("sha256", SECRET).update(value).digest("hex");
  const a = Buffer.from(hmac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return value;
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export async function createSession(userId: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, sign(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<PublicUser | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = unsign(token);
  if (!userId) return null;
  const user = getUserById(userId);
  return user ? toPublicUser(user) : null;
});

export async function requireUser(roles?: Role[]): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (roles && !roles.includes(user.role)) {
    if (user.role === "doctor") redirect("/doctor");
    if (user.role === "admin") redirect("/admin");
    redirect("/dashboard");
  }
  return user;
}
