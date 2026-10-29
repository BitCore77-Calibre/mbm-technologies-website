import type { Metadata } from "next";
import { PageHero } from "../../components/page-hero";
import { capabilities } from "../../lib/content";

export const metadata: Metadata = { title: "Capabilities", description: "Integrated cybersecurity, blockchain, AI, DeFi, cryptography and cryptoeconomic engineering capabilities.", alternates: { canonical: "/capabilities" } };

const details = [
  ["Security architecture and zero-trust design", "Detection engineering and security operations", "Adversarial testing and incident readiness", "Smart-contract and protocol security"],
  ["Protocol and consensus architecture", "Cross-chain and interoperability systems", "Smart contracts, wallets and node services", "Protocol specifications and threat models"],
  ["Agentic workflow systems", "Decision support and operational automation", "Model evaluation and guardrails", "Blockchain and security intelligence"],
  ["Non-custodial exchange architecture", "DEX, bridge, solver and intent integration", "Liquidity and route intelligence", "Execution evidence and reconciliation"],
  ["Key and identity architecture", "Cryptographic protocol design", "Post-quantum readiness assessment", "Migration and cryptographic agility planning"],
  ["Mechanism and incentive design", "Token and treasury systems", "Decentralized governance architecture", "Economic attack and stress modelling"],
];

export default function CapabilitiesPage() {
  return (
    <main>
      <PageHero index="01" eyebrow="CAPABILITIES" title="Integrated expertise for systems that cannot be fragmented." description="The strongest digital infrastructure emerges when security, cryptography, software, intelligence and economics are engineered as one system—not handed between disconnected teams." />
      <section className="content-section shell">
        <div className="content-intro">
          <h2>From research question to operational system.</h2>
          <p>MBM Technologies works across the full engineering chain: threat and opportunity definition, architecture, protocol design, implementation, validation and operational readiness. Engagements can begin with one specialist workstream and expand into a complete programme.</p>
        </div>
        <div className="detail-grid">
          {capabilities.map((item, index) => (
            <article className={`detail-card accent-${item.accent}`} key={item.number}>
              <span className="mono">CAPABILITY / {item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <ul className="detail-list">{details[index].map(detail => <li key={detail}>{detail}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="principle-strip">
          {["Security before scale", "Evidence over theatre", "Modular architecture", "Human accountability"].map((item, i) => <div key={item}><span>0{i + 1}</span><strong>{item}</strong></div>)}
        </div>
        <section className="capability-delivery">
          <div className="content-intro"><h2>What an engagement can deliver.</h2><p>The exact output depends on the programme stage. MBM defines deliverables as evidence that another engineer, reviewer or decision-maker can inspect—not as a presentation that disappears after the meeting.</p></div>
          <div className="delivery-grid">
            {[
              ["ARCHITECTURE", "Decision-ready system definition", ["System and trust-boundary maps", "Threat and failure models", "Protocol or service specifications", "Phased implementation roadmap"]],
              ["ENGINEERING", "Controlled implementation", ["Reviewable source components", "Interfaces and integration contracts", "Configuration and dependency records", "Release and rollback criteria"]],
              ["ASSURANCE", "Inspectable technical evidence", ["Automated and adversarial test results", "Telemetry and evidence packages", "Known limitations and residual risk", "Remediation and retest plan"]],
            ].map(([label,title,items]) => <article key={label as string}><span className="mono">{label as string}</span><h3>{title as string}</h3><ul>{(items as string[]).map(item => <li key={item}>{item}</li>)}</ul></article>)}
          </div>
        </section>
      </section>
    </main>
  );
}
