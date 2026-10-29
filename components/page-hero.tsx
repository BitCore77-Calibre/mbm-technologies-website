import Link from "next/link";
import { ArrowIcon } from "./brand";

export function PageHero({ eyebrow, title, description, index }: { eyebrow: string; title: string; description: string; index: string }) {
  return (
    <section className="page-hero shell">
      <div className="page-hero-index mono">{index} / MBM</div>
      <div className="page-hero-copy">
        <p className="eyebrow"><span />{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <Link href="/contact" className="page-hero-link">Discuss a project <ArrowIcon /></Link>
    </section>
  );
}
