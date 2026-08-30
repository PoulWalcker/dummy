"use client";

import { FormEvent, useEffect, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { DEFAULT_JOBS, Job, loadJobs, saveJobs } from "../data/jobs";

type JobDraft = Omit<Job, "id">;

const EMPTY_DRAFT: JobDraft = {
  title: "",
  company: "",
  location: "",
  salary: "",
  type: "Full-time",
  description: "",
};

export function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS);
  const [draft, setDraft] = useState<JobDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => setJobs(loadJobs()), []);

  function updateJobs(nextJobs: Job[], message: string) {
    setJobs(nextJobs);
    saveJobs(nextJobs);
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function updateDraft(field: keyof JobDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanDraft = Object.fromEntries(
      Object.entries(draft).map(([key, value]) => [key, value.trim()]),
    ) as JobDraft;

    if (editingId) {
      updateJobs(
        jobs.map((job) => (job.id === editingId ? { ...cleanDraft, id: editingId } : job)),
        "Job updated successfully.",
      );
    } else {
      const newJob: Job = {
        ...cleanDraft,
        id: `${Date.now()}-${cleanDraft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
      };
      updateJobs([newJob, ...jobs], "Job created successfully.");
    }

    resetForm();
  }

  function startEditing(job: Job) {
    const { id, ...editableFields } = job;
    setEditingId(id);
    setDraft(editableFields);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteJob(job: Job) {
    if (!window.confirm(`Delete “${job.title}” at ${job.company}?`)) return;
    updateJobs(jobs.filter((item) => item.id !== job.id), "Job deleted.");
    if (editingId === job.id) resetForm();
  }

  return (
    <main className="admin-page">
      <SiteHeader active="admin" />

      {notice && <div className="toast" role="status">✓ {notice}</div>}

      <div className="admin-shell">
        <div className="admin-intro">
          <div>
            <p className="section-kicker">Back office-ish</p>
            <h1>Run the shady operation</h1>
            <p>Publish respectable opportunities from a delightfully suspicious control room.</p>
          </div>
          <a className="view-site-link" href="/">View public board <span aria-hidden="true">↗</span></a>
        </div>

        <div className="admin-layout">
          <aside className="editor-card" aria-labelledby="job-form-title">
            <div className="editor-heading">
              <div>
                <p className="editor-label">{editingId ? "Editing role" : "New role"}</p>
                <h2 id="job-form-title">{editingId ? "Update job" : "Add a job"}</h2>
              </div>
              {editingId && <button className="close-button" type="button" onClick={resetForm} aria-label="Cancel editing">×</button>}
            </div>

            <form className="job-form" onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="title">Job title</label>
                  <input id="title" required placeholder="e.g. Product Designer" value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="company">Company</label>
                  <input id="company" required placeholder="e.g. Northstar Labs" value={draft.company} onChange={(event) => updateDraft("company", event.target.value)} />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="location">Location</label>
                  <input id="location" required placeholder="e.g. Remote" value={draft.location} onChange={(event) => updateDraft("location", event.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="salary">Salary</label>
                  <input id="salary" required placeholder="e.g. $80k – $100k" value={draft.salary} onChange={(event) => updateDraft("salary", event.target.value)} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="job-type">Employment type</label>
                <select id="job-type" required value={draft.type} onChange={(event) => updateDraft("type", event.target.value)}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                  <option>Temporary</option>
                </select>
              </div>

              <div className="field">
                <div className="label-line">
                  <label htmlFor="description">Description</label>
                  <span>{draft.description.length}/240</span>
                </div>
                <textarea id="description" required maxLength={240} rows={5} placeholder="Describe the role and what makes it meaningful..." value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} />
              </div>

              <button className="button submit-button" type="submit">
                {editingId ? "Save the evidence" : "Publish this job"}
              </button>
              {editingId && <button className="text-button cancel-button" type="button" onClick={resetForm}>Cancel editing</button>}
            </form>
          </aside>

          <section className="manage-list" aria-labelledby="published-jobs-heading">
            <div className="list-heading">
              <div>
                <h2 id="published-jobs-heading">Published jobs</h2>
                <p>{jobs.length} {jobs.length === 1 ? "active listing" : "active listings"}</p>
              </div>
              <span className="live-badge"><span /> Allegedly live</span>
            </div>

            {jobs.length > 0 ? (
              <div className="admin-job-list">
                {jobs.map((job) => (
                  <article className={`admin-job-row ${editingId === job.id ? "is-editing" : ""}`} key={job.id}>
                    <div className="company-logo small" aria-hidden="true">{job.company.charAt(0).toUpperCase()}</div>
                    <div className="admin-job-copy">
                      <h3>{job.title}</h3>
                      <p>{job.company} · {job.location} · {job.type}</p>
                      <span>{job.salary}</span>
                    </div>
                    <div className="row-actions">
                      <button type="button" className="icon-button" onClick={() => startEditing(job)} aria-label={`Edit ${job.title}`}>Edit</button>
                      <button type="button" className="icon-button danger" onClick={() => deleteJob(job)} aria-label={`Delete ${job.title}`}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state compact">
                <div className="empty-icon" aria-hidden="true">＋</div>
                <h3>No jobs yet</h3>
                <p>Use the form to publish your first opportunity.</p>
              </div>
            )}
          </section>
        </div>

        <p className="storage-note">Your operation is saved in this browser. No offshore server required.</p>
      </div>
    </main>
  );
}
