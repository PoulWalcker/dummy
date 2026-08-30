export type Job = {
  id: string;
  title: string;
  description: string;
  company: string;
  salary: string;
  location: string;
  type: string;
};

export const JOBS_STORAGE_KEY = "workly-jobs";
const SEED_VERSION_KEY = "shady-jobs-seed-version";
const CURRENT_SEED_VERSION = "2";

const LEGACY_SEED_IDS = new Set([
  "product-designer",
  "frontend-engineer",
  "customer-success",
  "content-strategist",
  "data-analyst",
  "marketing-intern",
]);

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

export function loadJobs(): Job[] {
  if (typeof window === "undefined") return DEFAULT_JOBS;

  try {
    const stored = window.localStorage.getItem(JOBS_STORAGE_KEY);
    if (!stored) {
      window.localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(DEFAULT_JOBS));
      window.localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
      return DEFAULT_JOBS;
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return DEFAULT_JOBS;

    if (window.localStorage.getItem(SEED_VERSION_KEY) !== CURRENT_SEED_VERSION) {
      const containsOnlyOriginalSamples = parsed.every((job: Job) => LEGACY_SEED_IDS.has(job.id));
      const nextJobs = containsOnlyOriginalSamples
        ? DEFAULT_JOBS
        : [
            ...parsed,
            ...DEFAULT_JOBS.filter((sample) => !parsed.some((job: Job) => job.id === sample.id)),
          ];

      window.localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(nextJobs));
      window.localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
      return nextJobs;
    }

    return parsed;
  } catch {
    return DEFAULT_JOBS;
  }
}

export function saveJobs(jobs: Job[]) {
  window.localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
}
