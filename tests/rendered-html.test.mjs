import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const readProjectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("contains the public Shady Jobs experience", async () => {
  const [board, jobs] = await Promise.all([
    readProjectFile("app/JobBoard.tsx"),
    readProjectFile("app/data/jobs.ts"),
  ]);

  assert.match(board, /SHADY JOBS/);
  assert.match(board, /Find something legal/);
  assert.match(board, /Salary range/);
  assert.match(board, /Employment/);
  assert.match(jobs, /Hustle Operations Lead/);
  assert.match(jobs, /NFT Enterprise Sales Executive/);
});

test("keeps all filters synchronized with query parameters", async () => {
  const [board, page] = await Promise.all([
    readProjectFile("app/JobBoard.tsx"),
    readProjectFile("app/page.tsx"),
  ]);

  for (const parameter of ["q", "salary_from", "salary_to", "location", "role", "type"]) {
    assert.match(board, new RegExp(`params\\.get\\(\\"${parameter}\\"\\)`));
    assert.match(board, new RegExp(`syncParam\\(\\"${parameter}\\"`));
  }
  assert.match(board, /window\.history\.replaceState/);
  assert.match(page, /await searchParams/);
  assert.match(page, /filterJobs\(DEFAULT_JOBS, initialFilters\)/);
  assert.match(page, /params\.salary_from/);
  assert.match(page, /params\.salary_to/);
});

test("contains the CMS and finished social metadata", async () => {
  const [admin, layout] = await Promise.all([
    readProjectFile("app/admin/AdminJobs.tsx"),
    readProjectFile("app/layout.tsx"),
  ]);

  assert.match(admin, /Run the shady operation/);
  assert.match(admin, /Publish this job/);
  assert.match(admin, /Published jobs/);
  assert.match(layout, /SHADY JOBS DOT COM/);
  assert.match(layout, /VERCEL_PROJECT_PRODUCTION_URL/);
  assert.match(layout, /\/og\.png/);
  await access(new URL("../public/og.png", import.meta.url));
});
