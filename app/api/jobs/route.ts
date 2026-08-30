import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  JobInput,
  createJob,
  deleteJob,
  getJobs,
  updateJob,
} from "../../data/jobs.server";

export const dynamic = "force-dynamic";

const EMPLOYMENT_TYPES = new Set([
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
]);

function cleanText(value: unknown, maximumLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned && cleaned.length <= maximumLength ? cleaned : null;
}

function parseJobInput(value: unknown): JobInput | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const title = cleanText(body.title, 120);
  const description = cleanText(body.description, 240);
  const company = cleanText(body.company, 120);
  const salary = cleanText(body.salary, 80);
  const location = cleanText(body.location, 120);
  const type = cleanText(body.type, 40);

  if (!title || !description || !company || !salary || !location || !type) return null;
  if (!EMPLOYMENT_TYPES.has(type)) return null;

  return { title, description, company, salary, location, type };
}

function refreshJobPages() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function GET() {
  try {
    return NextResponse.json(await getJobs(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Unable to load jobs." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = parseJobInput(await request.json());
    if (!input) return NextResponse.json({ error: "Invalid job details." }, { status: 400 });

    const job = await createJob(input);
    refreshJobPages();
    return NextResponse.json(job, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create the job." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = cleanText(body?.id, 120);
    const input = parseJobInput(body);
    if (!id || !input) return NextResponse.json({ error: "Invalid job details." }, { status: 400 });

    const job = await updateJob(id, input);
    if (!job) return NextResponse.json({ error: "Job not found." }, { status: 404 });

    refreshJobPages();
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Unable to update the job." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const id = cleanText(body?.id, 120);
    if (!id) return NextResponse.json({ error: "A job ID is required." }, { status: 400 });

    const deleted = await deleteJob(id);
    if (!deleted) return NextResponse.json({ error: "Job not found." }, { status: 404 });

    refreshJobPages();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete the job." }, { status: 500 });
  }
}
