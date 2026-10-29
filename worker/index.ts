/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

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

let registrationTableReady: Promise<unknown> | null = null;

function ensureRegistrationTable(env: Env) {
  registrationTableReady ??= env.DB.prepare(createRegistrationsTableSql)
    .run()
    .catch((error) => {
      registrationTableReady = null;
      throw error;
    });

  return registrationTableReady;
}

function cleanField(payload: Record<string, unknown>, key: string) {
  const raw = typeof payload[key] === "string" ? payload[key].trim() : "";
  return raw.slice(0, fieldLimits[key] ?? 3000);
}

async function handleRegistration(request: Request, env: Env) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
  }

  try {
    const payload = await request.json() as Record<string, unknown>;
    const type = payload.type === "talent" ? "talent" : payload.type === "project" ? "project" : null;
    const name = cleanField(payload, "name");
    const email = cleanField(payload, "email").toLowerCase();
    const message = cleanField(payload, "message");

    if (typeof payload.website === "string" && payload.website.trim()) {
      return Response.json({ message: "Thank you. Your submission has been received." }, { status: 201 });
    }
    if (!type || !name || !emailPattern.test(email) || !message || payload.consent !== "yes") {
      return Response.json({ error: "Please complete all required fields and confirm consent." }, { status: 400 });
    }

    await ensureRegistrationTable(env);

    await env.DB.prepare(`
      INSERT INTO registrations (
        id, type, name, email, organization, role, country, phone,
        linkedin, portfolio, availability, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `).bind(
      crypto.randomUUID(), type, name, email,
      cleanField(payload, "organization") || null,
      cleanField(payload, "role") || null,
      cleanField(payload, "country") || null,
      cleanField(payload, "phone") || null,
      cleanField(payload, "linkedin") || null,
      cleanField(payload, "portfolio") || null,
      cleanField(payload, "availability") || null,
      message,
    ).run();

    return Response.json({ message: type === "talent" ? "Your talent registration has been received." : "Your project brief has been received." }, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    const unavailable = detail.includes("no such table") || detail.includes("registrations");
    return Response.json({ error: unavailable ? "Registration is being prepared. Please try again shortly." : "We could not submit your details. Please try again." }, { status: 500 });
  }
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/registrations") {
      return handleRegistration(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
