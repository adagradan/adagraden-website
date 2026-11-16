import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { siteUrl } from "@/lib/site";
import { adminTokens, dbConfigured } from "./db";
import { optionalEnv } from "./env";
import { mailConfigured, sendAdminSignInLink } from "./mail";

/**
 * Admin access: passwordless, by one-time email link.
 * - Only addresses listed in ADMIN_EMAILS (comma-separated) can sign in.
 * - Links are single-use, expire in 15 minutes and are stored only as a hash.
 * - The session is an HMAC-signed, httpOnly cookie (ADMIN_SESSION_SECRET),
 *   valid for 12 hours, re-checked against ADMIN_EMAILS on every request.
 */

const COOKIE = "agf_admin";
const SESSION_HOURS = 12;
const LINK_MINUTES = 15;

export type Admin = { email: string };

const allowedEmails = () =>
  (optionalEnv("ADMIN_EMAILS") ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

const secret = () => {
  const s = optionalEnv("ADMIN_SESSION_SECRET");
  return s && s.length >= 32 ? s : undefined;
};

/** What is missing before the dashboard can be used (empty = ready). */
export function adminSetupProblems(): string[] {
  const missing: string[] = [];
  if (!dbConfigured()) missing.push("MONGODB_URI (the database that stores donations)");
  if (!allowedEmails().length) missing.push("ADMIN_EMAILS (who may sign in)");
  if (!secret()) missing.push("ADMIN_SESSION_SECRET (at least 32 random characters)");
  if (!mailConfigured()) missing.push("RESEND_API_KEY and MAIL_FROM (to email sign-in links)");
  return missing;
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const sign = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("base64url");

/* --------------------------------------------------------------- sign-in */

/**
 * Emails a sign-in link if the address is allowed. Always resolves the same
 * way for allowed and unknown addresses, so it reveals nothing.
 */
export async function requestSignInLink(rawEmail: string): Promise<void> {
  const email = rawEmail.trim().toLowerCase();
  if (adminSetupProblems().length || !allowedEmails().includes(email)) return;
  const col = await adminTokens();
  const recent = await col.countDocuments({ email, createdAt: { $gt: new Date(Date.now() - LINK_MINUTES * 60_000) } });
  if (recent >= 3) return; // quietly rate-limited
  const token = randomBytes(32).toString("base64url");
  await col.insertOne({
    tokenHash: sha256(token),
    email,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + LINK_MINUTES * 60_000),
  });
  await sendAdminSignInLink(email, `${siteUrl}/admin/auth?token=${encodeURIComponent(token)}`);
}

/** Consumes a link token (single use) and starts a session. */
export async function signInWithToken(token: string): Promise<boolean> {
  const key = secret();
  if (!key || !token) return false;
  const doc = await (await adminTokens()).findOneAndDelete({ tokenHash: sha256(token), expiresAt: { $gt: new Date() } });
  if (!doc || !allowedEmails().includes(doc.email)) return false;
  const payload = Buffer.from(JSON.stringify({ e: doc.email, x: Date.now() + SESSION_HOURS * 3_600_000 })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
  return true;
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
}

/* --------------------------------------------------------------- session */

/** The signed-in admin, or null. Reads cookies: call inside <Suspense>. */
export async function getAdmin(): Promise<Admin | null> {
  const key = secret();
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!key || !raw) return null;
  const [payload, mac] = raw.split(".");
  if (!payload || !mac) return null;
  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { e: string; x: number };
    if (typeof x !== "number" || x < Date.now() || !allowedEmails().includes(e)) return null;
    return { email: e };
  } catch {
    return null;
  }
}

/** Data Access Layer guard for pages and server actions. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
