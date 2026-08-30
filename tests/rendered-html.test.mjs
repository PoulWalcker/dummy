import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
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
}

test("server-renders the public Shady Jobs job board", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Shady Jobs/);
  assert.match(html, /Hustle Operations Lead/);
  assert.match(html, /NFT Enterprise Sales Executive/);
  assert.match(html, /Search by title or company/);
  assert.match(html, /Salary range/);
  assert.match(html, /Location/);
  assert.match(html, /Role/);
  assert.match(html, /Employment/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("server-renders the public job manager", async () => {
  const response = await render("/admin");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Manage jobs/);
  assert.match(html, /Publish this job/);
  assert.match(html, /Published jobs/);
});

test("includes finished social metadata and removes the disposable preview", async () => {
  const [layout, jobBoard] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/JobBoard.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /SHADY JOBS DOT COM/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(layout, /codex-preview|_sites-preview/);
  assert.match(jobBoard, /salary_from/);
  assert.match(jobBoard, /salary_to/);
  assert.match(jobBoard, /params\.get\("location"\)/);
  assert.match(jobBoard, /params\.get\("role"\)/);
  assert.match(jobBoard, /params\.get\("type"\)/);
  await access(new URL("../public/og.png", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
