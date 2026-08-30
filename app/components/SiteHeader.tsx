type SiteHeaderProps = {
  active: "jobs" | "admin";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Shady Jobs Dot Com home">
        <span className="brand-mark">SJ</span>
        <span>SHADY JOBS <em>DOT COM</em></span>
      </a>
      <nav aria-label="Main navigation">
        <a className={`nav-link ${active === "jobs" ? "active" : ""}`} href="/">
          Find jobs
        </a>
        <a
          className={active === "admin" ? "button button-small" : "button button-small"}
          href="/admin"
          aria-current={active === "admin" ? "page" : undefined}
        >
          Manage jobs
        </a>
      </nav>
    </header>
  );
}
