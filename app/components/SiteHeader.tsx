import Link from "next/link";

type SiteHeaderProps = {
  active: "jobs" | "admin";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Shady Jobs Dot Com home">
        <span className="brand-mark">SJ</span>
        <span>SHADY JOBS <em>DOT COM</em></span>
      </Link>
      <nav aria-label="Main navigation">
        <Link className={`nav-link ${active === "jobs" ? "active" : ""}`} href="/">
          Find jobs
        </Link>
        <Link
          className={active === "admin" ? "button button-small" : "button button-small"}
          href="/admin"
          aria-current={active === "admin" ? "page" : undefined}
        >
          Manage jobs
        </Link>
      </nav>
    </header>
  );
}
