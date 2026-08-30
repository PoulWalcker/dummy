import type { Metadata } from "next";
import { AdminJobs } from "./AdminJobs";
import { getJobs } from "../data/jobs.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage jobs",
  description: "Create, edit, and remove jobs shown on SHADY JOBS DOT COM.",
};

export default async function AdminPage() {
  return <AdminJobs initialJobs={await getJobs()} />;
}
