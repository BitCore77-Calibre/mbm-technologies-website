import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "../../../components/brand";
import { ProjectCard } from "../../../components/project-card";
import { projectDetails, projects } from "../../../lib/content";
import { absoluteUrl } from "../../../lib/site-config";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) return {};
  const image = absoluteUrl(project.image ?? "/og.jpg");
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: absoluteUrl(`/projects/${project.slug}`) },
    openGraph: { title: project.name, description: project.summary, url: absoluteUrl(`/projects/${project.slug}`), images: [image] },
    twitter: { card: "summary_large_image", title: project.name, description: project.summary, images: [image] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const detail = projectDetails[project.slug];
  const related = projects.filter(item => item.slug !== project.slug).slice(0, 2);
  return (
    <main className={`accent-${project.accent}`}>
      <section className="project-detail-hero shell">
        <Link href="/projects" className="project-detail-back"><ArrowIcon />Back to projects</Link>
        <div className="project-title-row">
          <div>
            <p className="eyebrow"><span />{project.eyebrow}</p>
            <h1>{project.name}</h1>
          </div>
          <div>
            <span className="project-status"><i />{project.status.toUpperCase()}</span>
            <p>{project.summary}</p>
          </div>
        </div>
      </section>
      {project.image && (
        <section className="project-lab-visual shell" aria-label={`${project.name} laboratory`}>
          <figure>
            <div className="project-lab-frame">
              <img src={project.image} alt={project.imageAlt ?? ""} width="1600" height="900" decoding="async" fetchPriority="high" />
              <span className="project-lab-scan" aria-hidden="true" />
            </div>
            <figcaption>
              <span className="mono">CALIBRE RESEARCH ENVIRONMENT</span>
              <span className="mono">{project.imageCaption}</span>
            </figcaption>
          </figure>
        </section>
      )}
      <section className="project-body shell">
        <div>
          <p className="eyebrow"><span />THE PROGRAMME</p>
          <h2>Architecture follows purpose. Evidence follows engineering.</h2>
        </div>
        <div className="project-body-copy">
          <p>{project.description}</p>
          <div className="project-capabilities">
            {project.capabilities.map((item, index) => <div key={item}><span>{item}</span><i>0{index + 1}</i></div>)}
          </div>
          <div className="project-principles">{project.principles.map(item => <span key={item}>{item.toUpperCase()}</span>)}</div>
          {project.notice && <p className="project-notice"><strong>Research boundary</strong>{project.notice}</p>}
          {project.destinations && (
            <div className="project-destinations">
              <span className="mono">PROGRAMME DESTINATIONS</span>
              {project.destinations.map(destination => <a href={destination.href} target="_blank" rel="noopener noreferrer" key={destination.href}><span><strong>{destination.label}</strong><small>{destination.note}</small></span><ArrowIcon /></a>)}
            </div>
          )}
        </div>
      </section>
      {detail && (
        <section className="programme-depth">
          <div className="shell">
            <div className="section-heading compact-heading">
              <div>
                <p className="eyebrow"><span />PROGRAMME DEFINITION</p>
                <h2>The problem, the response<br />and the <em>proof required.</em></h2>
              </div>
              <p>MBM programmes are defined by the boundary they must test and the evidence needed to support the next decision—not by ambitious language alone.</p>
            </div>
            <div className="programme-argument-grid">
              <article><span className="mono">01 / THE CHALLENGE</span><h3>Why this programme exists</h3><p>{detail.challenge}</p></article>
              <article><span className="mono">02 / ENGINEERING RESPONSE</span><h3>How MBM approaches it</h3><p>{detail.response}</p></article>
            </div>
            <div className="programme-work-grid">
              <article>
                <span className="mono">CURRENT WORKSTREAMS</span>
                <h3>What is being developed and tested</h3>
                <ol>{detail.currentWork.map((item, index) => <li key={item}><i>0{index + 1}</i><span>{item}</span></li>)}</ol>
              </article>
              <article>
                <span className="mono">EVIDENCE STANDARD</span>
                <h3>What credible progress should produce</h3>
                <ol>{detail.evidence.map((item, index) => <li key={item}><i>0{index + 1}</i><span>{item}</span></li>)}</ol>
              </article>
            </div>
            <div className="programme-audience">
              <span className="mono">BUILT FOR SERIOUS COLLABORATION</span>
              <div>{detail.audience.map(item => <span key={item}>{item}</span>)}</div>
              <Link href="/contact" className="text-link">Discuss this programme <ArrowIcon /></Link>
            </div>
          </div>
        </section>
      )}
      <section className="systems-section">
        <div className="shell">
          <div className="content-intro"><h2>Continue exploring.</h2><p>Discover other MBM Technologies programmes working across the same security-first engineering system.</p></div>
          <div className="project-grid">{related.map(project => <ProjectCard project={project} featured key={project.slug} />)}</div>
        </div>
      </section>
    </main>
  );
}
