import type { Metadata } from "next";
import { JobBoard } from "./JobBoard";
import { DEFAULT_JOBS, EMPTY_JOB_FILTERS, JobFilters, filterJobs } from "./data/jobs";

export const metadata: Metadata = {
  title: "SHADY JOBS DOT COM",
  description: "Serious jobs with suspiciously good branding.",
};

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const initialFilters: JobFilters = {
    query: firstParam(params.q),
    salaryFrom: firstParam(params.salary_from),
    salaryTo: firstParam(params.salary_to),
    location: firstParam(params.location) || EMPTY_JOB_FILTERS.location,
    role: firstParam(params.role) || EMPTY_JOB_FILTERS.role,
    type: firstParam(params.type) || EMPTY_JOB_FILTERS.type,
  };

  return (
    <JobBoard
      initialJobs={filterJobs(DEFAULT_JOBS, initialFilters)}
      initialFilters={initialFilters}
    />
  );
}
