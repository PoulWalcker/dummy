export type Job = {
  id: string;
  title: string;
  description: string;
  company: string;
  salary: string;
  location: string;
  type: string;
};

export type JobFilters = {
  query: string;
  salaryFrom: string;
  salaryTo: string;
  location: string;
  role: string;
  type: string;
};

export const EMPTY_JOB_FILTERS: JobFilters = {
  query: "",
  salaryFrom: "",
  salaryTo: "",
  location: "All locations",
  role: "All roles",
  type: "All types",
};

export const DEFAULT_JOBS: Job[] = [
  {
    id: "hustle-operations-lead",
    title: "Hustle Operations Lead",
    company: "Definitely Legal LLC",
    location: "Dubai, UAE",
    salary: "$90k – $140k",
    type: "Full-time",
    description:
      "Turn suspiciously specific opportunities into revenue streams. Telegram fluency and selective memory preferred.",
  },
  {
    id: "nft-enterprise-sales",
    title: "NFT Enterprise Sales Executive",
    company: "JPEG Dynamics",
    location: "Remote",
    salary: "$40k – $400k",
    type: "Full-time",
    description:
      "Sell premium pixel ownership to enterprises still recovering from their 2021 metaverse strategy decks.",
  },
  {
    id: "exit-liquidity-evangelist",
    title: "Senior Exit Liquidity Evangelist",
    company: "MoonBag Capital",
    location: "Remote",
    salary: "$100k – $250k",
    type: "Full-time",
    description:
      "Build community excitement precisely three minutes before the founders discover a new time zone.",
  },
  {
    id: "offshore-spreadsheet-coordinator",
    title: "Offshore Spreadsheet Coordinator",
    company: "Tax Haven & Sons",
    location: "Cayman Islands",
    salary: "$80k – $120k",
    type: "Contract",
    description:
      "Move cells between tabs with discretion. Advanced VLOOKUP skills and a waterproof passport required.",
  },
  {
    id: "chief-vibes-laundering-officer",
    title: "Chief Vibes Laundering Officer",
    company: "Aura Holdings",
    location: "Miami, FL",
    salary: "$110k – $160k",
    type: "Full-time",
    description:
      "Repackage alarming quarterly numbers as bold energy shifts, preferably before the board meeting starts.",
  },
  {
    id: "corporate-apology-ghostwriter",
    title: "Corporate Apology Ghostwriter",
    company: "Oopsly",
    location: "London, UK",
    salary: "£70k – £95k",
    type: "Part-time",
    description:
      "Write heartfelt statements that accept full responsibility without identifying what actually happened.",
  },
  {
    id: "prompt-whisperer-intern",
    title: "AI Prompt Whisperer Intern",
    company: "Totally Human AI",
    location: "San Francisco, CA",
    salary: "$25 – $35 / hour",
    type: "Internship",
    description:
      "Ask the robot nicely, paste the answer into slides, and nod thoughtfully when someone says agentic.",
  },
  {
    id: "synergy-consultant",
    title: "Unlicensed Synergy Consultant",
    company: "Pivot & Disappear",
    location: "New York, NY",
    salary: "$75k – $105k",
    type: "Contract",
    description:
      "Host workshops, invent three-by-three matrices, and leave before anyone requests measurable outcomes.",
  },
];

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  const normalizedQuery = filters.query.trim().toLowerCase();
  const minimumSalary = filters.salaryFrom === "" ? null : Number(filters.salaryFrom);
  const maximumSalary = filters.salaryTo === "" ? null : Number(filters.salaryTo);

  return jobs.filter((job) => {
    const searchable = `${job.title} ${job.company} ${job.description}`.toLowerCase();
    const salaryNumbers = Array.from(job.salary.matchAll(/\d+(?:\.\d+)?/g), (match) => Number(match[0]));
    const jobSalaryFrom = salaryNumbers[0] ?? 0;
    const jobSalaryTo = salaryNumbers[1] ?? jobSalaryFrom;

    return (
      (!normalizedQuery || searchable.includes(normalizedQuery)) &&
      (filters.location === "All locations" ||
        job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.role === "All roles" || job.title.toLowerCase() === filters.role.toLowerCase()) &&
      (filters.type === "All types" || job.type.toLowerCase() === filters.type.toLowerCase()) &&
      (minimumSalary === null || Number.isNaN(minimumSalary) || jobSalaryTo >= minimumSalary) &&
      (maximumSalary === null || Number.isNaN(maximumSalary) || jobSalaryFrom <= maximumSalary)
    );
  });
}
