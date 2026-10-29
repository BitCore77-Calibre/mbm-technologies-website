import Link from "next/link";
import type { Project } from "../lib/content";
import { ArrowIcon } from "./brand";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article className={`project-card accent-${project.accent} ${featured ? "project-featured" : ""}`}>
      <div className="project-card-top mono">
        <span>{project.eyebrow}</span>
        <span className="status-dot">{project.status}</span>
      </div>
      <div>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
      </div>
      <div className="project-card-bottom">
        <span>{project.capabilities.slice(0, featured ? 3 : 2).join(" · ")}</span>
        <Link href={`/projects/${project.slug}`} aria-label={`Explore ${project.name}`}><ArrowIcon /></Link>
      </div>
    </article>
  );
}
