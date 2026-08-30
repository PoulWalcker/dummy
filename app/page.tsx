import type { Metadata } from "next";
import { JobBoard } from "./JobBoard";

export const metadata: Metadata = {
  title: "SHADY JOBS DOT COM",
  description: "Serious jobs with suspiciously good branding.",
};

export default function Home() {
  return <JobBoard />;
}
