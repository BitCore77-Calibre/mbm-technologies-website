import Link from "next/link";
import { ArrowIcon } from "../components/brand";

export default function NotFound() {
  return (
    <main className="not-found shell">
      <p className="eyebrow"><span />404 · PAGE NOT FOUND</p>
      <h1>This page is not part of the system.</h1>
      <p>The address may be mistyped, or the page may have moved. Start from the homepage or explore our programmes.</p>
      <div className="hero-actions">
        <Link href="/" className="button">Go to the homepage <ArrowIcon /></Link>
        <Link href="/projects" className="text-link">Explore projects <ArrowIcon /></Link>
      </div>
    </main>
  );
}
