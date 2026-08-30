import "server-only";

import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import { DEFAULT_JOBS, Job } from "./jobs";

export type JobInput = Omit<Job, "id">;

type JobRow = {
  id: string;
  title: string;
  description: string;
  company: string;
  salary: string;
  location: string;
  type: string;
};

let initializationPromise: Promise<void> | null = null;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL or POSTGRES_URL is not configured.");
  }

  return neon(databaseUrl);
}

function toJob(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    company: row.company,
    salary: row.salary,
    location: row.location,
    type: row.type,
  };
}

async function initializeDatabase() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      company TEXT NOT NULL,
      salary TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const rows = await sql`SELECT COUNT(*)::int AS count FROM jobs`;
  if (Number(rows[0]?.count ?? 0) > 0) return;

  for (const job of DEFAULT_JOBS) {
    await sql`
      INSERT INTO jobs (id, title, description, company, salary, location, type)
      VALUES (${job.id}, ${job.title}, ${job.description}, ${job.company}, ${job.salary}, ${job.location}, ${job.type})
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

async function ensureDatabase() {
  if (!initializationPromise) initializationPromise = initializeDatabase();

  try {
    await initializationPromise;
  } catch (error) {
    initializationPromise = null;
    throw error;
  }
}

export async function getJobs(): Promise<Job[]> {
  await ensureDatabase();
  const sql = getSql();
  const rows = await sql`
    SELECT id, title, description, company, salary, location, type
    FROM jobs
    ORDER BY created_at ASC, id ASC
  `;

  return (rows as JobRow[]).map(toJob);
}

export async function createJob(input: JobInput): Promise<Job> {
  await ensureDatabase();
  const sql = getSql();
  const id = randomUUID();
  const rows = await sql`
    INSERT INTO jobs (id, title, description, company, salary, location, type)
    VALUES (${id}, ${input.title}, ${input.description}, ${input.company}, ${input.salary}, ${input.location}, ${input.type})
    RETURNING id, title, description, company, salary, location, type
  `;

  return toJob(rows[0] as JobRow);
}

export async function updateJob(id: string, input: JobInput): Promise<Job | null> {
  await ensureDatabase();
  const sql = getSql();
  const rows = await sql`
    UPDATE jobs
    SET title = ${input.title},
        description = ${input.description},
        company = ${input.company},
        salary = ${input.salary},
        location = ${input.location},
        type = ${input.type},
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, title, description, company, salary, location, type
  `;

  return rows[0] ? toJob(rows[0] as JobRow) : null;
}

export async function deleteJob(id: string): Promise<boolean> {
  await ensureDatabase();
  const sql = getSql();
  const rows = await sql`DELETE FROM jobs WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
