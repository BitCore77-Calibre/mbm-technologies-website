/** Project-brief and talent-network form API: POST /api/registrations */
import type { Env, ExecutionContext } from "./env";
import { isSameOriginPost, sha256Hex } from "./security";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fieldLimits: Record<string, number> = {
  name: 100,
  email: 160,
  organization: 140,
  role: 140,
  country: 100,
  phone: 40,
  linkedin: 300,
  portfolio: 300,
  availability: 80,
  message: 3000,
};

/** Submissions allowed per visitor (hashed IP) per hour. */
export const RATE_LIMIT_PER_HOUR = 5;
const HOUR_MS = 60 * 60 * 1000;
const MAX_BODY_BYTES = 32 * 1024;

const createRegistrationsTableSql = `
  CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    organization TEXT,
    role TEXT,
    country TEXT,
    phone TEXT,
    linkedin TEXT,
    portfolio TEXT,
    availability TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
  )
`;

const createRateLimitsTableSql = `
  CREATE TABLE IF NOT EXISTS rate_limits (
    bucket TEXT PRIMARY KEY NOT NULL,
    hits INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  )
`;

let tablesReady: Promise<unknown> | null = null;

/** Creates the tables on first use, so a fresh database works without manual steps. */
export function ensureTables(env: Env) {
  tablesReady ??= (async () => {
    await env.DB.prepare(createRegistrationsTableSql).run();
    await env.DB.prepare(createRateLimitsTableSql).run();
  })().catch((error) => {
    tablesReady = null;
    throw error;
  });
  return tablesReady;
}

function cleanField(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  const raw = typeof value === "string" ? value.trim() : "";
  return raw.slice(0, fieldLimits[key] ?? 3000);
}

function cleanUrlField(payload: Record<string, unknown>, key: string) {
  const value = cleanField(payload, key);
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString().slice(0, fieldLimits[key]) : "";
  } catch {
    return "";
  }
}

function json(body: unknown, status: number, extraHeaders: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extraHeaders } });
}

async function verifyTurnstile(env: Env, token: string, ip: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  try {
    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET_KEY);
    form.append("response", token);
    if (ip) form.append("remoteip", ip);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const result = await response.json() as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

/** Counts this visitor's submissions in the current hour. Fails open if the database is busy. */
async function isRateLimited(env: Env, ip: string, ctx: ExecutionContext): Promise<boolean> {
  try {
    const now = Date.now();
    const window = Math.floor(now / HOUR_MS);
    const bucket = await sha256Hex(`${env.RATE_LIMIT_SALT ?? "mbm-technologies"}|${ip}|${window}`);
    const row = await env.DB.prepare(`
      INSERT INTO rate_limits (bucket, hits, expires_at) VALUES (?, 1, ?)
      ON CONFLICT(bucket) DO UPDATE SET hits = hits + 1
      RETURNING hits
    `).bind(bucket, (window + 1) * HOUR_MS + 24 * HOUR_MS).first<{ hits: number }>();
    ctx.waitUntil(env.DB.prepare("DELETE FROM rate_limits WHERE expires_at < ?").bind(now).run().catch(() => undefined));
    return Number(row?.hits ?? 0) > RATE_LIMIT_PER_HOUR;
  } catch (error) {
    console.error("rate limit check failed", error);
    return false;
  }
}

/** Sends a short alert without personal data (no name, email or message). */
async function notifyTelegram(env: Env, origin: string, type: "project" | "talent", topic: string) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const label = type === "project" ? "project brief" : "talent registration";
  const text = [
    `New ${label} on the MBM Technologies website`,
    topic ? `Topic: ${topic.slice(0, 80)}` : "",
    `Inbox: ${origin}/admin`,
  ].filter(Boolean).join("\n");
  try {
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true }),
    });
    if (!response.ok) console.error("telegram alert failed", response.status);
  } catch (error) {
    console.error("telegram alert failed", error);
  }
}

export async function handleRegistration(request: Request, env: Env, ctx: ExecutionContext) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405, { Allow: "POST" });
  }
  if (!isSameOriginPost(request)) {
    return json({ error: "Please submit the form from the MBM Technologies website." }, 403);
  }
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) {
    return json({ error: "Your submission is too large." }, 413);
  }

  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(await request.text());
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    payload = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "We could not read your submission. Please try again." }, 400);
  }

  const type = payload.type === "talent" ? "talent" : payload.type === "project" ? "project" : null;
  const name = cleanField(payload, "name");
  const email = cleanField(payload, "email").toLowerCase();
  const message = cleanField(payload, "message");

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  if (typeof payload.website === "string" && payload.website.trim()) {
    return json({ message: "Thank you. Your submission has been received." }, 201);
  }
  if (!type || !name || !emailPattern.test(email) || !message || payload.consent !== "yes") {
    return json({ error: "Please complete all required fields and confirm consent." }, 400);
  }

  const ip = request.headers.get("cf-connecting-ip");
  const token = typeof payload["cf-turnstile-response"] === "string" ? payload["cf-turnstile-response"] : "";
  if (!(await verifyTurnstile(env, token, ip))) {
    return json({ error: "The spam check did not complete. Please wait a moment and try again." }, 400);
  }

  try {
    await ensureTables(env);

    if (await isRateLimited(env, ip ?? "unknown", ctx)) {
      return json({ error: "Too many submissions from your connection. Please try again in an hour." }, 429, { "Retry-After": "3600" });
    }

    const role = cleanField(payload, "role");
    await env.DB.prepare(`
      INSERT INTO registrations (
        id, type, name, email, organization, role, country, phone,
        linkedin, portfolio, availability, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `).bind(
      crypto.randomUUID(), type, name, email,
      cleanField(payload, "organization") || null,
      role || null,
      cleanField(payload, "country") || null,
      cleanField(payload, "phone") || null,
      cleanUrlField(payload, "linkedin") || null,
      cleanUrlField(payload, "portfolio") || null,
      cleanField(payload, "availability") || null,
      message,
    ).run();

    ctx.waitUntil(notifyTelegram(env, new URL(request.url).origin, type, role));

    return json({ message: type === "talent" ? "Your talent registration has been received." : "Your project brief has been received." }, 201);
  } catch (error) {
    console.error("registration failed", error);
    return json({ error: "We could not submit your details. Please try again." }, 500);
  }
}
