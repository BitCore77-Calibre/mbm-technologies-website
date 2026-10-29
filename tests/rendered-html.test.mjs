import assert from "node:assert/strict";
import test from "node:test";

test("renders the MBM Technologies homepage and production metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>MBM Technologies — Secure\. Intelligent\. Decentralized\.<\/title>/i);
  assert.match(html, /Global deep-tech engineering/i);
  assert.match(html, /Calibre Distributed Systems Test Lab/i);
  assert.doesNotMatch(html, /Starter Project/i);
});

test("accepts a valid project registration through the Worker API", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("api-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const statements = [];
  const database = {
    prepare(sql) {
      statements.push(sql);
      return {
        bind() {
          return { run: async () => ({ success: true }) };
        },
        run: async () => ({ success: true }),
      };
    },
  };

  const response = await worker.fetch(
    new Request("http://localhost/api/registrations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "project",
        name: "Test Project",
        email: "project@example.com",
        message: "A complete automated test submission.",
        consent: "yes",
      }),
    }),
    { DB: database },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 201);
  assert.equal(statements.length, 2);
  assert.match(await response.text(), /project brief has been received/i);
});
