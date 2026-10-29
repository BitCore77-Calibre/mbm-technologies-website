import type { Metadata } from "next";
import { PageHero } from "../../components/page-hero";

export const metadata: Metadata = { title: "Research", description: "MBM Technologies research across post-quantum cryptography, decentralized governance, AI assurance and cryptographic transparency.", alternates: { canonical: "/research" } };

const topics = [
  ["R-01", "Post-quantum transition", "How should long-lived platforms gain cryptographic agility and move toward quantum-resistant primitives without creating a fragile migration event?", "CRYPTOGRAPHY · SYSTEMS"],
  ["R-02", "Cryptographic monetary transparency", "How can networks prove monetary behavior, liabilities and system state while preserving appropriate privacy and operational security?", "CRYPTOECONOMICS · PRIVACY"],
  ["R-03", "Decentralized governance", "How can protocol governance remain legitimate, transparent and resilient against capture, voter apathy and incentive manipulation?", "GOVERNANCE · MECHANISM DESIGN"],
  ["R-04", "AI system assurance", "How should agentic systems expose evidence, permissions, evaluations and human override when operating inside consequential infrastructure?", "AI · CYBERSECURITY"],
  ["R-05", "Cross-chain security", "What architecture and evidence are required to reason about route risk across bridges, solvers, intents and heterogeneous finality models?", "INTEROPERABILITY · DEFI"],
  ["R-06", "Bitcoin-secured systems", "Where can Bitcoin’s security model extend to new systems without weakening its trust assumptions or overstating inherited security?", "BITCOIN · PROTOCOLS"],
];

export default function ResearchPage() {
  return <main>
    <PageHero index="03" eyebrow="RESEARCH & FORESIGHT" title="We study the assumptions that tomorrow will attack." description="Our research connects cryptography, cybersecurity, distributed systems, artificial intelligence and economics. The objective is practical: make better architectural decisions before complexity becomes exposure." />
    <section className="content-section shell">
      <div className="content-intro"><h2>Questions before claims.</h2><p>MBM research programmes begin with precise questions and explicit limitations. Findings inform internal architecture, protocol specifications and future technical publications.</p></div>
      <div className="research-grid">
        {topics.map(([code,title,copy,tags]) => <article className="research-card" key={code}><span className="mono">{code} / ACTIVE THEME</span><h3>{title}</h3><p>{copy}</p><span>{tags}</span></article>)}
      </div>
      <section className="research-method">
        <div className="content-intro"><h2>How a research idea becomes evidence.</h2><p>Every theme moves through the same controlled sequence. A promising result remains a bounded result until it has survived replication, adversarial testing and independent review.</p></div>
        <div className="method-track">
          {[
            ["01", "QUESTION", "Define one falsifiable claim and why it matters."],
            ["02", "MODEL", "State actors, assumptions, states and failure conditions."],
            ["03", "EXPERIMENT", "Build the smallest environment able to test the claim."],
            ["04", "EVIDENCE", "Preserve inputs, outputs, checksums and interpretation."],
            ["05", "REVIEW", "Publish limitations, reproduce results and decide the next test."],
          ].map(([n,t,c]) => <article key={n}><span className="mono">{n}</span><strong>{t}</strong><p>{c}</p></article>)}
        </div>
        <div className="research-status-note"><span className="mono">PUBLICATION STANDARD</span><p>Research topics on this site describe active directions. A theme becomes a formal MBM publication only when its authors, version, evidence, limitations and review status are explicitly identified.</p></div>
      </section>
    </section>
  </main>;
}
