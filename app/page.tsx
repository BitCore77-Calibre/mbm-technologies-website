import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "../components/brand";
import { ProjectCard } from "../components/project-card";
import { EcosystemPortalCard } from "../components/ecosystem-portal-card";
import { SystemOrb } from "../components/system-orb";
import { capabilities, ecosystemPortals, projects } from "../lib/content";
import { siteConfig } from "../lib/site-config";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const laboratoryProjects = ["calibre-tests", "calibre-artificial-intelligence-test-lab", "calibre-cybersecurity-test-lab"]
  .map(slug => projects.find(project => project.slug === slug))
  .filter((project): project is NonNullable<typeof project> => Boolean(project));

const numberWords = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
function countWord(count: number) {
  return numberWords[count] ?? String(count);
}

export default function Home() {
  return (
    <main>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><span />GLOBAL DEEP-TECH ENGINEERING</p>
          <h1>
            We engineer the<br />
            <em>infrastructure</em> of<br />
            the digital future.
          </h1>
          <p className="hero-lead">
            MBM Technologies brings cybersecurity, blockchain, artificial intelligence,
            cryptography and decentralized finance into one high-assurance engineering discipline.
          </p>
          <div className="hero-actions">
            <Link href="/contact" className="button">Start a project <ArrowIcon /></Link>
            <Link href="/projects" className="text-link">Explore our systems <ArrowIcon /></Link>
          </div>
          <div className="hero-proof mono">
            <span><i className="pulse-dot" />CYPRUS · GLOBAL DELIVERY</span>
            <span>SECURITY-FIRST</span>
            <span>RESEARCH-LED</span>
          </div>
        </div>
        <SystemOrb />
      </section>

      <section className="technology-rail" aria-label="Core disciplines">
        <div className="rail-track mono">
          {["CRYPTOGRAPHY", "BLOCKCHAIN ENGINEERING", "ARTIFICIAL INTELLIGENCE", "CRYPTOECONOMICS", "WEB3", "DECENTRALIZED FINANCE", "POST-QUANTUM CRYPTOGRAPHY"].map((item) => (
            <span key={item}>{item}<i /></span>
          ))}
        </div>
      </section>

      <section className="section shell" id="capabilities">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />ONE ENGINEERING SYSTEM</p>
            <h2>Complex technologies.<br /><em>One accountable team.</em></h2>
          </div>
          <p>
            We merge disciplines that are too often treated separately. Security informs architecture;
            cryptography establishes trust; AI expands intelligence; economics protects the system under pressure.
          </p>
        </div>
        <div className="capability-grid">
          {capabilities.map((item) => (
            <article className={`capability-card accent-${item.accent}`} key={item.number}>
              <div className="capability-number mono">{item.number}</div>
              <span className="capability-line" />
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
          ))}
        </div>
        <div className="section-link-wrap">
          <Link className="text-link" href="/capabilities">View every capability <ArrowIcon /></Link>
        </div>
      </section>

      <section className="ecosystem-section" id="ecosystem">
        <div className="shell">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow"><span />MBM TECHNOLOGIES ECOSYSTEM</p>
              <h2>One company.<br /><em>{countWord(ecosystemPortals.length)} dedicated destinations.</em></h2>
            </div>
            <p>
              Enter the specialist portals for the CALIBRE post-quantum network, Calibre protocol testing,
              non-custodial exchange engineering, Cyprus blockchain education and advanced trading-intelligence research.
            </p>
          </div>
          <div className="ecosystem-grid">
            {ecosystemPortals.map((portal, index) => (
              <EcosystemPortalCard portal={portal} index={index} key={portal.slug} />
            ))}
          </div>
          <div className="ecosystem-access-note"><span className="mono">ACCESS GUIDE</span><p><strong>Public</strong> opens a live website. <strong>MBM</strong> opens a programme page on this site.{siteConfig.showLocalPortals && <> <strong>Local</strong> opens a development service running on this computer only.</>}</p></div>
        </div>
      </section>

      <section className="laboratories-section shell section">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow"><span />CALIBRE RESEARCH LABORATORIES</p>
            <h2>Ideas become credible<br />when they <em>survive testing.</em></h2>
          </div>
          <p>Three complementary test environments connect distributed systems, artificial intelligence and cybersecurity. Each laboratory turns a different class of claim into measurable experiments and preserved evidence.</p>
        </div>
        <div className="laboratory-grid">
          {laboratoryProjects.map((project, index) => (
            <Link href={`/projects/${project.slug}`} className={`laboratory-card accent-${project.accent}`} key={project.slug}>
              <div className="laboratory-image"><img src={project.image} alt={project.imageAlt ?? ""} width="1600" height="900" loading="lazy" decoding="async" /></div>
              <div className="laboratory-card-copy">
                <span className="mono">LAB / 0{index + 1}</span>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <strong>Enter the laboratory <ArrowIcon /></strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="systems-section">
        <div className="shell">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow"><span />FLAGSHIP SYSTEMS</p>
              <h2>Built at the convergence<br />of <em>trust and intelligence.</em></h2>
            </div>
            <p>Our projects are living engineering programmes—each with a defined purpose, a visible status and a disciplined path from research to production.</p>
          </div>
          <div className="project-grid">
            <ProjectCard project={projects[0]} featured />
            <ProjectCard project={projects[1]} featured />
            {projects.slice(2, 5).map((project) => <ProjectCard project={project} key={project.slug} />)}
          </div>
          <div className="section-link-wrap">
            <Link className="text-link" href="/projects">Enter the project portfolio <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      <section className="operating-model shell section">
        <div className="operating-copy">
          <p className="eyebrow"><span />OUR OPERATING MODEL</p>
          <h2>We do not bolt security on at the end.</h2>
          <p>Every engagement moves through the same rigorous system: establish the threat model, define the architecture, build measurable controls, then verify how the complete system behaves.</p>
          <Link href="/company" className="text-link">How we engineer <ArrowIcon /></Link>
        </div>
        <div className="model-diagram">
          {[
            ["01", "DEFINE", "Threats, trust and system boundaries"],
            ["02", "ARCHITECT", "Protocols, controls and evidence paths"],
            ["03", "ENGINEER", "Composable systems with clear ownership"],
            ["04", "VERIFY", "Tests, telemetry and adversarial review"],
          ].map(([num, title, copy]) => (
            <div className="model-step" key={num}>
              <span className="mono">{num}</span><div><strong>{title}</strong><p>{copy}</p></div><i />
            </div>
          ))}
        </div>
      </section>

      <section className="engagement-section">
        <div className="shell">
          <div className="section-heading compact-heading">
            <div><p className="eyebrow"><span />HOW WE CAN ENGAGE</p><h2>One difficult question<br />or a <em>complete programme.</em></h2></div>
            <p>MBM can enter at the research, architecture, implementation or assurance stage. The engagement boundary is defined before work begins so responsibilities and evidence remain clear.</p>
          </div>
          <div className="engagement-grid">
            {[
              ["01", "Research & specification", "Turn a new concept into precise questions, system boundaries, protocol specifications and a staged experiment plan."],
              ["02", "Architecture & threat modelling", "Define trust, custody, data, identity, economic and operational boundaries before implementation creates lock-in."],
              ["03", "Engineering & integration", "Build controlled components, interfaces and infrastructure with measurable ownership, security and release criteria."],
              ["04", "Testing & assurance", "Exercise assumptions through adversarial tests, simulations, telemetry, evidence preservation and disciplined retesting."],
            ].map(([number, title, copy]) => <article key={number}><span className="mono">{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <div className="section-link-wrap"><Link href="/contact" className="text-link">Define an engagement <ArrowIcon /></Link></div>
        </div>
      </section>

      <section className="research-banner">
        <div className="shell research-inner">
          <div>
            <p className="eyebrow"><span />RESEARCH & FORESIGHT</p>
            <h2>Engineering for the threats—and opportunities—ahead.</h2>
          </div>
          <div className="research-topics">
            <span>POST-QUANTUM TRANSITION</span>
            <span>DECENTRALIZED GOVERNANCE</span>
            <span>CRYPTOGRAPHIC TRANSPARENCY</span>
            <span>AI SYSTEM ASSURANCE</span>
          </div>
          <Link href="/research" className="round-link" aria-label="Explore research"><ArrowIcon /></Link>
        </div>
      </section>

      <section className="talent-callout shell section">
        <div className="talent-visual" aria-hidden="true">
          <div className="talent-ring" /><div className="talent-ring second" />
          <span>BUILD<br />WHAT<br />MATTERS</span>
        </div>
        <div className="talent-copy">
          <p className="eyebrow"><span />GLOBAL TALENT NETWORK</p>
          <h2>The hardest systems need uncommon engineers.</h2>
          <p>We are building a network of protocol engineers, security researchers, AI specialists, DeFi engineers and systems thinkers who want to solve consequential problems.</p>
          <Link href="/careers" className="button">Explore opportunities <ArrowIcon /></Link>
        </div>
      </section>

      <section className="final-cta shell">
        <p className="eyebrow"><span />START A CONVERSATION</p>
        <h2>Bring us the problem<br />that <em>cannot fail.</em></h2>
        <p>We will help you turn complexity into a secure, intelligible and buildable system.</p>
        <Link href="/contact" className="button">Start a project <ArrowIcon /></Link>
      </section>
    </main>
  );
}
