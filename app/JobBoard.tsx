"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "./components/SiteHeader";
import { Job, JobFilters, filterJobs } from "./data/jobs";

type JobBoardProps = {
  initialJobs: Job[];
  initialFilters: JobFilters;
};

export function JobBoard({ initialJobs, initialFilters }: JobBoardProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [query, setQuery] = useState(initialFilters.query);
  const [location, setLocation] = useState(initialFilters.location);
  const [role, setRole] = useState(initialFilters.role);
  const [type, setType] = useState(initialFilters.type);
  const [salaryFrom, setSalaryFrom] = useState(initialFilters.salaryFrom);
  const [salaryTo, setSalaryTo] = useState(initialFilters.salaryTo);

  useEffect(() => {
    let isCurrent = true;
    fetch("/api/jobs", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to refresh jobs.");
        return response.json() as Promise<Job[]>;
      })
      .then((nextJobs) => {
        if (isCurrent) setJobs(nextJobs);
      })
      .catch(() => {
        // Keep the server-rendered results if a background refresh fails.
      });

    const syncFiltersFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      setSalaryFrom(params.get("salary_from") ?? "");
      setSalaryTo(params.get("salary_to") ?? "");
      setLocation(params.get("location") ?? "All locations");
      setRole(params.get("role") ?? "All roles");
      setType(params.get("type") ?? "All types");
    };

    window.addEventListener("popstate", syncFiltersFromUrl);
    return () => {
      isCurrent = false;
      window.removeEventListener("popstate", syncFiltersFromUrl);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const syncParam = (key: string, value: string, emptyValue?: string) => {
      if (!value || value === emptyValue) params.delete(key);
      else params.set(key, value);
    };

    syncParam("q", query);
    syncParam("salary_from", salaryFrom);
    syncParam("salary_to", salaryTo);
    syncParam("location", location, "All locations");
    syncParam("role", role, "All roles");
    syncParam("type", type, "All types");

    const queryString = params.toString();
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  }, [location, query, role, salaryFrom, salaryTo, type]);

  const locations = useMemo(
    () => [
      "All locations",
      ...Array.from(new Set([
        ...(location !== "All locations" ? [location] : []),
        ...jobs.map((job) => job.location),
      ])).sort(),
    ],
    [jobs, location],
  );
  const roles = useMemo(
    () => [
      "All roles",
      ...Array.from(new Set([
        ...(role !== "All roles" ? [role] : []),
        ...jobs.map((job) => job.title),
      ])).sort(),
    ],
    [jobs, role],
  );
  const types = useMemo(
    () => [
      "All types",
      ...Array.from(new Set([
        ...(type !== "All types" ? [type] : []),
        ...jobs.map((job) => job.type),
      ])).sort(),
    ],
    [jobs, type],
  );

  const filteredJobs = useMemo(() => {
    return filterJobs(jobs, { query, location, role, type, salaryFrom, salaryTo });
  }, [jobs, location, query, role, salaryFrom, salaryTo, type]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    document.getElementById("open-roles-heading")?.scrollIntoView({ behavior: "smooth" });
  }

  function clearFilters() {
    setQuery("");
    setLocation("All locations");
    setRole("All roles");
    setType("All types");
    setSalaryFrom("");
    setSalaryTo("");
  }

  return (
    <main>
      <SiteHeader active="jobs" />

      <section className="hero">
        <span className="hero-sticker sticker-one" aria-hidden="true">100% REAL-ISH</span>
        <span className="hero-sticker sticker-two" aria-hidden="true">NO SUITS REQUIRED</span>
        <div className="eyebrow"><span /> Definitely not a pyramid scheme</div>
        <h1>SHADY JOBS<br /><span>DOT COM</span></h1>
        <p>Serious jobs. Questionable branding. Zero “quick calls” that should have been emails.</p>
        <form className="search-shell" aria-label="Search jobs" onSubmit={handleSearch}>
          <span className="search-icon" aria-hidden="true">⌕</span>
          <label className="sr-only" htmlFor="job-search">Search by title or company</label>
          <input
            id="job-search"
            type="search"
            placeholder="Search by title or company"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="button">Find something legal</button>
        </form>
        <p className="hero-footnote">✓ We checked. Most of these companies exist.</p>
      </section>

      <section className="jobs-section" aria-labelledby="open-roles-heading">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Freshly acquired opportunities</p>
            <h2 id="open-roles-heading">Open roles</h2>
          </div>
          <p className="result-count">
            {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} available
          </p>
        </div>

        <div className="filter-bar" aria-label="Job filters">
          <div className="filter-group salary-filter-group">
            <label htmlFor="salary-from">Salary range</label>
            <div className="salary-inputs">
              <input id="salary-from" type="number" min="0" inputMode="numeric" placeholder="From" aria-label="Minimum salary" value={salaryFrom} onChange={(event) => setSalaryFrom(event.target.value)} />
              <span aria-hidden="true">–</span>
              <input id="salary-to" type="number" min="0" inputMode="numeric" placeholder="To" aria-label="Maximum salary" value={salaryTo} onChange={(event) => setSalaryTo(event.target.value)} />
            </div>
          </div>
          <div className="filter-group">
            <label htmlFor="location-filter">Location</label>
            <select id="location-filter" value={location} onChange={(event) => setLocation(event.target.value)}>
              {locations.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="role-filter">Role</label>
            <select id="role-filter" value={role} onChange={(event) => setRole(event.target.value)}>
              {roles.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="type-filter">Employment</label>
            <select id="type-filter" value={type} onChange={(event) => setType(event.target.value)}>
              {types.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          {(query || salaryFrom || salaryTo || location !== "All locations" || role !== "All roles" || type !== "All types") && (
            <button className="text-button" type="button" onClick={clearFilters}>Clear filters</button>
          )}
        </div>

        {filteredJobs.length > 0 ? (
          <div className="job-grid">
            {filteredJobs.map((job) => (
              <article className="job-card" key={job.id}>
                <div className="job-card-top">
                  <div className="company-logo" aria-hidden="true">{job.company.charAt(0).toUpperCase()}</div>
                  <span className="job-type">{job.type}</span>
                </div>
                <div>
                  <p className="company-name">{job.company}</p>
                  <h3>{job.title}</h3>
                </div>
                <p className="job-description">{job.description}</p>
                <div className="job-meta">
                  <span>⌖ {job.location}</span>
                  <span>{job.salary}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">⌕</div>
            <h3>The void has no openings</h3>
            <p>Try a less specific alibi—or clear the filters and browse everything.</p>
            <button className="button button-secondary" type="button" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </section>
    </main>
  );
}
