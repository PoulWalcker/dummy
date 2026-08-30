import type { Metadata } from "next";
import { AdminJobs } from "./AdminJobs";

export const metadata: Metadata = {
  title: "Manage jobs",
  description: "Create, edit, and remove jobs shown on SHADY JOBS DOT COM.",
};

export default function AdminPage() {
  return <AdminJobs />;
}
