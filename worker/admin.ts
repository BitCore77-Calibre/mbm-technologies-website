/**
 * Private inbox for form submissions: /admin
 *
 * Protected by a password (ADMIN_PASSWORD secret). In production, also put
 * /admin behind Cloudflare Access for a second layer (see docs/DEPLOYMENT.md).
 */
import type { Env } from "./env";
import { ensureTables } from "./registrations";
import { ADMIN_CSP, escapeHtml, isSameOriginPost, safeEqual } from "./security";

const STATUSES = ["new", "reviewed", "contacted", "archived"] as const;
type Status = (typeof STATUSES)[number];
const TYPES = ["project", "talent"] as const;
const MIN_PASSWORD_LENGTH = 12;

type Registration = {
  id: string;
  type: string;
  name: string;
  email: string;
  organization: string | null;
  role: string | null;
  country: string | null;
  phone: string | null;
  linkedin: string | null;
  portfolio: string | null;
  availability: string | null;
  message: string;
  status: string;
  created_at: string;
};

const baseHeaders = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "Content-Security-Policy": ADMIN_CSP,
};

function notFound() {
  return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", ...baseHeaders } });
}

function unauthorized() {
  return new Response("Sign-in required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="MBM inbox", charset="UTF-8"', "content-type": "text/plain; charset=utf-8", ...baseHeaders },
  });
}

async function isAuthorized(request: Request, password: string): Promise<boolean> {
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  let decoded = "";
  try {
    decoded = new TextDecoder().decode(Uint8Array.from(atob(header.slice(6)), c => c.charCodeAt(0)));
  } catch {
    return false;
  }
  const separator = decoded.indexOf(":");
  if (separator < 0) return false;
  return safeEqual(decoded.slice(separator + 1), password);
}

function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

function redirectBack(request: Request) {
  const referer = request.headers.get("referer");
  const url = new URL(request.url);
  let target = "/admin";
  if (referer) {
    try {
      const ref = new URL(referer);
      if (ref.origin === url.origin && ref.pathname === "/admin") target = `/admin${ref.search}`;
    } catch { /* keep default */ }
  }
  return new Response(null, { status: 303, headers: { Location: target, ...baseHeaders } });
}

function csvCell(value: unknown) {
  let text = String(value ?? "");
  // Stop spreadsheet programs from treating a cell as a formula.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function link(value: string | null) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return escapeHtml(value);
    return `<a href="${escapeHtml(url.toString())}" target="_blank" rel="noopener noreferrer nofollow">${escapeHtml(url.host + url.pathname)}</a>`;
  } catch {
    return escapeHtml(value);
  }
}

function page(rows: Registration[], counts: Record<string, number>, filters: { type: string; status: string }) {
  const option = (value: string, label: string, current: string) =>
    `<option value="${value}"${value === current ? " selected" : ""}>${label}</option>`;
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const body = rows.map(row => `
    <article class="row status-${escapeHtml(row.status)}">
      <header>
        <span class="tag">${row.type === "talent" ? "TALENT" : "PROJECT"}</span>
        <strong>${escapeHtml(row.name)}</strong>
        <a href="mailto:${escapeHtml(row.email)}">${escapeHtml(row.email)}</a>
        <time>${escapeHtml(row.created_at)} UTC</time>
      </header>
      <dl>
        ${row.organization ? `<dt>Organization</dt><dd>${escapeHtml(row.organization)}</dd>` : ""}
        ${row.role ? `<dt>${row.type === "talent" ? "Specialism" : "Area"}</dt><dd>${escapeHtml(row.role)}</dd>` : ""}
        ${row.country ? `<dt>Location</dt><dd>${escapeHtml(row.country)}</dd>` : ""}
        ${row.phone ? `<dt>Telephone</dt><dd>${escapeHtml(row.phone)}</dd>` : ""}
        ${row.linkedin ? `<dt>LinkedIn</dt><dd>${link(row.linkedin)}</dd>` : ""}
        ${row.portfolio ? `<dt>Portfolio</dt><dd>${link(row.portfolio)}</dd>` : ""}
        ${row.availability ? `<dt>Availability</dt><dd>${escapeHtml(row.availability)}</dd>` : ""}
      </dl>
      <p class="message">${escapeHtml(row.message)}</p>
      <footer>
        <form method="post" action="/admin/status">
          <input type="hidden" name="id" value="${escapeHtml(row.id)}">
          <label>Status <select name="status">${STATUSES.map(s => option(s, s, row.status)).join("")}</select></label>
          <button type="submit">Save</button>
        </form>
        <form method="post" action="/admin/delete">
          <input type="hidden" name="id" value="${escapeHtml(row.id)}">
          <label><input type="checkbox" name="confirm" value="yes" required> confirm</label>
          <button type="submit" class="danger">Delete permanently</button>
        </form>
      </footer>
    </article>`).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Inbox · MBM Technologies</title>
<style>
  :root { color-scheme: dark; --ink:#f4f7ff; --muted:#98a3bb; --line:rgba(161,180,218,.18); --panel:#0d1527; --base:#060a13; --blue:#2a7fff; --red:#ff3d57; --green:#27db8d; --gold:#f1b84b; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--base); color:var(--ink); font:15px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  main { width:min(1100px, calc(100% - 32px)); margin:0 auto; padding:32px 0 64px; }
  h1 { font-size:26px; margin:0 0 4px; } .sub { color:var(--muted); margin:0 0 20px; }
  .bar { display:flex; flex-wrap:wrap; gap:12px; align-items:end; padding:14px; border:1px solid var(--line); background:var(--panel); margin-bottom:18px; }
  .counts { display:flex; gap:14px; flex-wrap:wrap; color:var(--muted); font-size:13px; margin-bottom:14px; }
  .counts b { color:var(--ink); }
  label { display:flex; gap:6px; align-items:center; color:var(--muted); font-size:13px; }
  select, button, a.button { font:inherit; font-size:13px; padding:7px 12px; border-radius:6px; border:1px solid var(--line); background:#111b31; color:var(--ink); text-decoration:none; cursor:pointer; }
  button { background:var(--blue); border-color:var(--blue); } button.danger { background:transparent; border-color:var(--red); color:var(--red); }
  .row { border:1px solid var(--line); border-left:3px solid var(--blue); background:var(--panel); padding:16px; margin-bottom:12px; }
  .row.status-new { border-left-color:var(--gold); } .row.status-contacted { border-left-color:var(--green); } .row.status-archived { opacity:.6; }
  .row header { display:flex; flex-wrap:wrap; gap:10px 16px; align-items:baseline; }
  .row header a { color:#7bb1ff; } time { color:var(--muted); font-size:12px; margin-left:auto; }
  .tag { font:600 11px/1 ui-monospace, monospace; letter-spacing:.12em; padding:4px 6px; border:1px solid var(--line); }
  dl { display:grid; grid-template-columns:max-content 1fr; gap:2px 14px; margin:12px 0; font-size:14px; } dt { color:var(--muted); } dd { margin:0; } dd a { color:#7bb1ff; }
  .message { white-space:pre-wrap; background:rgba(0,0,0,.25); padding:12px; margin:0 0 12px; border:1px solid var(--line); }
  .row footer { display:flex; flex-wrap:wrap; gap:12px 24px; justify-content:space-between; }
  .row footer form { display:flex; gap:8px; align-items:center; }
  .empty { padding:40px; text-align:center; color:var(--muted); border:1px dashed var(--line); }
  @media (max-width:640px) { dl { grid-template-columns:1fr; } time { margin-left:0; } }
</style></head>
<body><main>
  <h1>Website inbox</h1>
  <p class="sub">Project briefs and talent registrations sent through the MBM Technologies website.</p>
  <div class="counts">${STATUSES.map(s => `<span>${s}: <b>${counts[s] ?? 0}</b></span>`).join("")}<span>total: <b>${total}</b></span></div>
  <form class="bar" method="get" action="/admin">
    <label>Type <select name="type">${option("", "all", filters.type)}${TYPES.map(t => option(t, t, filters.type)).join("")}</select></label>
    <label>Status <select name="status">${option("", "all except archived", filters.status)}${STATUSES.map(s => option(s, s, filters.status)).join("")}${option("any", "any", filters.status)}</select></label>
    <button type="submit">Filter</button>
    <a class="button" href="/admin/export.csv">Download all as CSV</a>
  </form>
  ${body || '<div class="empty">Nothing here yet.</div>'}
</main></body></html>`;
}

export async function handleAdmin(request: Request, env: Env): Promise<Response> {
  const password = env.ADMIN_PASSWORD ?? "";
  if (password.length < MIN_PASSWORD_LENGTH) return notFound();
  if (!(await isAuthorized(request, password))) return unauthorized();

  const url = new URL(request.url);
  await ensureTables(env);

  if (request.method === "POST") {
    if (!isSameOriginPost(request)) return new Response("Cross-site request blocked", { status: 403, headers: baseHeaders });
    const form = await request.formData();
    const id = String(form.get("id") ?? "");
    if (!id) return redirectBack(request);

    if (url.pathname === "/admin/status") {
      const status = form.get("status");
      if (isStatus(status)) {
        await env.DB.prepare("UPDATE registrations SET status = ? WHERE id = ?").bind(status, id).run();
      }
      return redirectBack(request);
    }
    if (url.pathname === "/admin/delete" && form.get("confirm") === "yes") {
      await env.DB.prepare("DELETE FROM registrations WHERE id = ?").bind(id).run();
      return redirectBack(request);
    }
    return redirectBack(request);
  }

  if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, POST", ...baseHeaders } });

  if (url.pathname === "/admin/export.csv") {
    const { results } = await env.DB.prepare("SELECT * FROM registrations ORDER BY created_at DESC").all<Registration>();
    const columns: (keyof Registration)[] = ["created_at", "type", "status", "name", "email", "organization", "role", "country", "phone", "linkedin", "portfolio", "availability", "message", "id"];
    const csv = [columns.join(","), ...(results ?? []).map(row => columns.map(col => csvCell(row[col])).join(","))].join("\r\n");
    const stamp = new Date().toISOString().slice(0, 10);
    return new Response(`﻿${csv}`, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="mbm-website-submissions-${stamp}.csv"`,
        ...baseHeaders,
      },
    });
  }

  if (url.pathname !== "/admin" && url.pathname !== "/admin/") return notFound();

  const type = url.searchParams.get("type") ?? "";
  const status = url.searchParams.get("status") ?? "";
  const where: string[] = [];
  const params: string[] = [];
  if ((TYPES as readonly string[]).includes(type)) { where.push("type = ?"); params.push(type); }
  if (isStatus(status)) { where.push("status = ?"); params.push(status); }
  else if (status !== "any") where.push("status != 'archived'");

  const sql = `SELECT * FROM registrations ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY created_at DESC LIMIT 500`;
  const statement = env.DB.prepare(sql);
  const { results } = await (params.length ? statement.bind(...params) : statement).all<Registration>();
  const countRows = await env.DB.prepare("SELECT status, COUNT(*) AS n FROM registrations GROUP BY status").all<{ status: string; n: number }>();
  const counts: Record<string, number> = {};
  for (const row of countRows.results ?? []) counts[row.status] = Number(row.n);

  return new Response(page(results ?? [], counts, { type: (TYPES as readonly string[]).includes(type) ? type : "", status: isStatus(status) || status === "any" ? status : "" }), {
    headers: { "content-type": "text/html; charset=utf-8", ...baseHeaders },
  });
}
