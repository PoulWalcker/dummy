import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import {
  DEFAULT_JOBS,
  EMPTY_JOB_FILTERS,
  filterJobs,
} from "../app/data/jobs.ts";

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
  assert.match(page, /Promise\.all\(\[searchParams, getJobs\(\)\]\)/);
  assert.match(page, /initialJobs=\{filterJobs\(jobs, initialFilters\)\}/);
  assert.match(page, /params\.salary_from/);
  assert.match(page, /params\.salary_to/);
});

test("filters jobs by the shared URL fields", () => {
  const matching = filterJobs(DEFAULT_JOBS, {
    ...EMPTY_JOB_FILTERS,
    location: "Remote",
    role: "NFT Enterprise Sales Executive",
    type: "Full-time",
  });
  const mismatching = filterJobs(DEFAULT_JOBS, {
    ...EMPTY_JOB_FILTERS,
    location: "Remote",
    role: "NFT Enterprise Sales Executive",
    type: "Internship",
  });

  assert.deepEqual(matching.map((job) => job.id), ["nft-enterprise-sales"]);
  assert.equal(mismatching.length, 0);
});

test("uses the shared database instead of browser storage", async () => {
  const [board, admin, serverJobs, api] = await Promise.all([
    readProjectFile("app/JobBoard.tsx"),
    readProjectFile("app/admin/AdminJobs.tsx"),
    readProjectFile("app/data/jobs.server.ts"),
    readProjectFile("app/api/jobs/route.ts"),
  ]);

  assert.doesNotMatch(board, /localStorage|loadJobs|workly-jobs/);
  assert.match(board, /fetch\("\/api\/jobs", \{ cache: "no-store" \}\)/);
  assert.doesNotMatch(admin, /localStorage|saveJobs|workly-jobs/);
  assert.match(serverJobs, /process\.env\.DATABASE_URL/);
  assert.match(serverJobs, /CREATE TABLE IF NOT EXISTS jobs/);
  assert.match(api, /export async function POST/);
  assert.match(api, /export async function PATCH/);
  assert.match(api, /export async function DELETE/);
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
