import Link from "next/link";
import { ArrowIcon, Brand } from "./brand";

const links = [
  ["Capabilities", "/capabilities"],
  ["Projects", "/projects"],
  ["Ecosystem", "/#ecosystem"],
  ["Research", "/research"],
  ["Careers", "/careers"],
  ["Company", "/company"],
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <Link className="button button-small header-cta" href="/contact">
          Start a project <ArrowIcon />
        </Link>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            <Link href="/contact">Start a project</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
