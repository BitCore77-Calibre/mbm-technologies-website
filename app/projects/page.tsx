import type { Metadata } from "next";
import { PageHero } from "../../components/page-hero";
import { ProjectCard } from "../../components/project-card";
import { EcosystemPortalCard } from "../../components/ecosystem-portal-card";
import { ecosystemPortals, projects } from "../../lib/content";
import { siteConfig } from "../../lib/site-config";

export const metadata: Metadata = { title: "Projects", description: "Explore the protocol, exchange, cybersecurity and AI systems in the MBM Technologies portfolio.", alternates: { canonical: "/projects" } };

export default function ProjectsPage() {
  return (
    <main>
      <PageHero index="02" eyebrow="PROJECT PORTFOLIO" title="Research translated into systems with a defined purpose." description="Our portfolio spans a post-quantum Layer 1 network, protocol R&D, multichain exchange infrastructure, cybersecurity operations, white-label systems and applied AI. Every project states where it is today—without pretending research is already production." />
      <section className="content-section shell ecosystem-page-section">
        <div className="content-intro">
          <h2>Enter the MBM ecosystem.</h2>
          <p>These gateways are designed to become independent specialist portals. Today they provide authoritative programme overviews; as each platform launches, the same gateway can lead directly to its dedicated destination.</p>
        </div>
        <div className="ecosystem-grid">
          {ecosystemPortals.map((portal, index) => <EcosystemPortalCard portal={portal} index={index} key={portal.slug} />)}
        </div>
        <div className="ecosystem-access-note"><span className="mono">ACCESS GUIDE</span><p><strong>Public</strong> opens a live website. <strong>MBM</strong> opens a programme page on this site.{siteConfig.showLocalPortals && <> <strong>Local</strong> works only on a computer currently running that development service.</>}</p></div>
      </section>
      <section className="content-section shell">
        <div className="content-intro">
          <h2>Built as programmes, not product theatre.</h2>
          <p>Each flagship combines a clear problem statement, explicit system boundaries and measurable engineering milestones. Explore the current focus and design principles behind each programme.</p>
        </div>
        <div className="status-guide">
          {[['RESEARCH','Questions, models and bounded experiments.'],['DEVELOPMENT','Systems being implemented and validated.'],['ARCHITECTURE','Defined structure before full implementation.'],['INITIATIVE','Organizational or ecosystem programme being formed.']].map(([label,copy]) => <div key={label}><span className="mono">{label}</span><p>{copy}</p></div>)}
        </div>
        <div className="project-grid all-projects">
          {projects.map((project, index) => <ProjectCard project={project} featured={index < 2} key={project.slug} />)}
        </div>
      </section>
    </main>
  );
}
