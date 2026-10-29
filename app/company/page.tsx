import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "../../components/brand";
import { PageHero } from "../../components/page-hero";

export const metadata: Metadata = { title: "Company", description: "Learn how MBM Technologies combines global engineering disciplines from its base in Cyprus.", alternates: { canonical: "/company" } };

export default function CompanyPage() {
  return <main>
    <PageHero index="04" eyebrow="COMPANY" title="Cyprus-rooted. Globally minded. Engineering-led." description="MBM Technologies is a deep-technology engineering company focused on the infrastructure behind secure digital economies. We assemble specialist disciplines around hard systems—not generic software delivery." />
    <section className="content-section shell">
      <div className="content-intro"><h2>Secure. Intelligent. Decentralized.</h2><div><p>That is not only a slogan; it is the test applied to our architecture. Secure means threats and trust boundaries are explicit. Intelligent means systems produce useful evidence and controlled automation. Decentralized means power, custody and verification are distributed where the use case demands it.</p><p>Our work connects research with implementation across cybersecurity, blockchain protocols, AI systems, cryptography, cryptoeconomics, Web3 and decentralized finance.</p></div></div>
      <div className="company-values">
        {[['01','Truth over theatre','We distinguish research, development and production readiness. Technical credibility begins with honest status.'],['02','Security as architecture','Security owns boundaries, evidence and response paths from the first system diagram—not after release.'],['03','Integration with discipline','We combine technologies only when the combination creates measurable system value and clearer control.'],['04','User sovereignty','Non-custodial and decentralized systems should strengthen user control without concealing risk or complexity.'],['05','Research into practice','Threat models, protocol specifications and experiments must translate into better engineering decisions.'],['06','Global talent','Consequential problems need uncommon people. We build teams across borders, disciplines and schools of thought.']].map(([n,t,c]) => <article className="value-card" key={n}><span>{n} / PRINCIPLE</span><h3>{t}</h3><p>{c}</p></article>)}
      </div>
      <section className="company-structure">
        <div className="content-intro"><h2>A connected deep-technology ecosystem.</h2><p>MBM Technologies is the parent engineering system. Specialist programmes keep their own technical identity while sharing governance, security principles, research discipline and company infrastructure.</p></div>
        <div className="division-grid">
          {[
            ["CALIBRE", "Protocol, exchange and test laboratories", "Distributed systems · non-custodial exchange · protocol evidence"],
            ["CYBERSECURITY", "Defence, assurance and digital forensics", "Threat modelling · cyber range · incident evidence"],
            ["ARTIFICIAL INTELLIGENCE", "Models, agents and physical intelligence", "Evaluation · automation · robotics · human control"],
            ["RESEARCH", "Cryptography, economics and systems inquiry", "PQC · governance · monetary transparency · assurance"],
            ["PLATFORM ENGINEERING", "Reusable infrastructure and governed delivery", "Components · telemetry · release controls · operations"],
            ["ECOSYSTEM", "Education and professional participation", "Cyprus Blockchain Association initiative · publications · talent"],
          ].map(([label,title,copy],index) => <article key={label}><span className="mono">0{index + 1} / {label}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>
      <section className="company-truth">
        <div><p className="eyebrow"><span />STATUS DISCIPLINE</p><h2>We label what exists today.</h2></div>
        <div className="truth-list">
          <p><strong>Research</strong><span>A question, model or experiment under investigation.</span></p>
          <p><strong>Development</strong><span>A system being implemented and tested, not yet represented as production-ready.</span></p>
          <p><strong>Operational</strong><span>A deployed capability with defined ownership, monitoring and support boundaries.</span></p>
        </div>
      </section>
      <div className="final-cta"><p className="eyebrow"><span />WORK WITH MBM</p><h2>Let’s define what the system must prove.</h2><p>Bring the objective, constraints and risk. We will bring the engineering system.</p><Link href="/contact" className="button">Start a conversation <ArrowIcon /></Link></div>
    </section>
  </main>;
}
