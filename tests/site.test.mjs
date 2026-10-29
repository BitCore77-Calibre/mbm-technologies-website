// Tests run against the built Worker in dist/ (run `npm test`, which builds first).
import assert from "node:assert/strict";
import test from "node:test";

async function loadWorker() {
  const url = new URL("../dist/server/index.js", import.meta.url);
  url.searchParams.set("t", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(url.href)).default;
}

function makeCtx() {
  const pending = [];
  return { pending, waitUntil(p) { pending.push(p); }, passThroughOnException() {} };
}

const assets = { fetch: async () => new Response("Not found", { status: 404 }) };

/** Minimal stand-in for a Cloudflare D1 database. */
function makeDb({ hits = 1, rows = [] } = {}) {
  const statements = [];
  const prepare = (sql) => {
    const statement = {
      sql,
      args: [],
      bind(...args) { statement.args = args; return statement; },
      async run() { statements.push(statement); return { success: true }; },
      async first() { statements.push(statement); return /RETURNING hits/.test(sql) ? { hits } : null; },
      async all() {
        statements.push(statement);
        if (/GROUP BY status/.test(sql)) return { results: [{ status: "new", n: rows.length }] };
        return { results: rows };
      },
    };
    return statement;
  };
  return { statements, prepare };
}

function registration(body, headers = {}) {
  return new Request("https://mbm.test/api/registrations", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const validProject = {
  type: "project",
  name: "Test Person",
  email: "Person@Example.com",
  role: "Blockchain protocol",
  message: "A complete automated test submission.",
  consent: "yes",
};

test("homepage renders with title, CALIBRE programme and no localhost links", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("https://mbm.test/", { headers: { accept: "text/html" } }), { ASSETS: assets }, makeCtx());
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>MBM Technologies — Secure\. Intelligent\. Decentralized\.<\/title>/i);
  assert.match(html, /Global deep-tech engineering/i);
  assert.match(html, /CALIBRE Network/);
  assert.match(html, /Calibre Distributed Systems Test Lab/i);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /localhost:30(01|30)/, "public build must not link to localhost services");
  assert.doesNotMatch(html, /chatgpt\.site/i);
});

test("pages send security headers", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("https://mbm.test/company"), { ASSETS: assets }, makeCtx());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.match(response.headers.get("strict-transport-security") ?? "", /max-age=/);
});

test("every project page renders", async () => {
  const worker = await loadWorker();
  for (const slug of ["calibre-blockchain", "calibre-exchange", "nucleus-protocol", "calibre-tests", "cyprus-blockchain-association"]) {
    const response = await worker.fetch(new Request(`https://mbm.test/projects/${slug}`), { ASSETS: assets }, makeCtx());
    assert.equal(response.status, 200, slug);
  }
});

test("unknown pages return 404", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("https://mbm.test/does-not-exist"), { ASSETS: assets }, makeCtx());
  assert.equal(response.status, 404);
});

test("robots.txt and sitemap.xml", async () => {
  const worker = await loadWorker();
  const robots = await worker.fetch(new Request("https://mbm-technologies.com/robots.txt"), { ASSETS: assets }, makeCtx());
  assert.equal(robots.status, 200);
  const robotsText = await robots.text();
  assert.match(robotsText, /Disallow: \/admin/);
  assert.match(robotsText, /Sitemap: https?:\/\/.+\/sitemap\.xml/);

  const preview = await worker.fetch(new Request("https://mbm.example.workers.dev/robots.txt"), { ASSETS: assets }, makeCtx());
  assert.match(await preview.text(), /Disallow: \/\s*$/m);

  const sitemap = await worker.fetch(new Request("https://mbm-technologies.com/sitemap.xml"), { ASSETS: assets }, makeCtx());
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.match(xml, /<urlset/);
  assert.match(xml, /\/projects\/calibre-blockchain<\/loc>/);
});

test("accepts a valid project brief and stores it", async () => {
  const worker = await loadWorker();
  const db = makeDb();
  const response = await worker.fetch(registration(validProject), { ASSETS: assets, DB: db }, makeCtx());
  assert.equal(response.status, 201);
  assert.match(await response.text(), /project brief has been received/i);
  const insert = db.statements.find(s => /INSERT INTO registrations/.test(s.sql));
  assert.ok(insert, "registration insert ran");
  assert.equal(insert.args[3], "person@example.com");
});

test("rejects missing consent and bad email", async () => {
  const worker = await loadWorker();
  for (const body of [{ ...validProject, consent: "no" }, { ...validProject, email: "not-an-email" }]) {
    const response = await worker.fetch(registration(body), { ASSETS: assets, DB: makeDb() }, makeCtx());
    assert.equal(response.status, 400);
  }
});

test("honeypot submissions are accepted silently but not stored", async () => {
  const worker = await loadWorker();
  const db = makeDb();
  const response = await worker.fetch(registration({ ...validProject, website: "spam" }), { ASSETS: assets, DB: db }, makeCtx());
  assert.equal(response.status, 201);
  assert.equal(db.statements.length, 0);
});

test("cross-site form posts are blocked", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(registration(validProject, { origin: "https://evil.example" }), { ASSETS: assets, DB: makeDb() }, makeCtx());
  assert.equal(response.status, 403);
});

test("rate limit returns 429 after too many submissions", async () => {
  const worker = await loadWorker();
  const db = makeDb({ hits: 6 });
  const response = await worker.fetch(registration(validProject), { ASSETS: assets, DB: db }, makeCtx());
  assert.equal(response.status, 429);
  assert.ok(!db.statements.some(s => /INSERT INTO registrations/.test(s.sql)));
});

test("Turnstile is required when its secret is configured", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(registration(validProject), { ASSETS: assets, DB: makeDb(), TURNSTILE_SECRET_KEY: "secret" }, makeCtx());
  assert.equal(response.status, 400);
  assert.match(await response.text(), /spam check/i);
});

test("Telegram alert contains no personal data", async () => {
  const worker = await loadWorker();
  const sent = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => { sent.push({ url: String(url), body: init?.body }); return new Response("{}", { status: 200 }); };
  try {
    const ctx = makeCtx();
    const response = await worker.fetch(registration(validProject), { ASSETS: assets, DB: makeDb(), TELEGRAM_BOT_TOKEN: "123:abc", TELEGRAM_CHAT_ID: "42" }, ctx);
    assert.equal(response.status, 201);
    await Promise.all(ctx.pending);
  } finally {
    globalThis.fetch = realFetch;
  }
  const alert = sent.find(item => item.url.includes("api.telegram.org"));
  assert.ok(alert, "telegram alert sent");
  assert.doesNotMatch(String(alert.body), /person@example\.com|Test Person|automated test submission/i);
});

test("admin inbox is off without a password and protected with one", async () => {
  const worker = await loadWorker();
  const off = await worker.fetch(new Request("https://mbm.test/admin"), { ASSETS: assets, DB: makeDb() }, makeCtx());
  assert.equal(off.status, 404);

  const env = { ASSETS: assets, DB: makeDb({ rows: [{ id: "1", type: "project", name: "<b>Ann</b>", email: "ann@example.com", message: "Hello", status: "new", created_at: "2026-10-29 10:00:00" }] }), ADMIN_PASSWORD: "correct horse battery" };
  const noAuth = await worker.fetch(new Request("https://mbm.test/admin"), env, makeCtx());
  assert.equal(noAuth.status, 401);
  assert.match(noAuth.headers.get("www-authenticate") ?? "", /Basic/);

  const wrong = await worker.fetch(new Request("https://mbm.test/admin", { headers: { authorization: `Basic ${btoa("admin:wrong password!")}` } }), env, makeCtx());
  assert.equal(wrong.status, 401);

  const ok = await worker.fetch(new Request("https://mbm.test/admin", { headers: { authorization: `Basic ${btoa("admin:correct horse battery")}` } }), env, makeCtx());
  assert.equal(ok.status, 200);
  assert.equal(ok.headers.get("x-robots-tag"), "noindex, nofollow");
  const html = await ok.text();
  assert.match(html, /&lt;b&gt;Ann&lt;\/b&gt;/, "names are HTML-escaped");
  assert.match(html, /ann@example\.com/);

  const csv = await worker.fetch(new Request("https://mbm.test/admin/export.csv", { headers: { authorization: `Basic ${btoa("admin:correct horse battery")}` } }), env, makeCtx());
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get("content-type") ?? "", /text\/csv/);
});
