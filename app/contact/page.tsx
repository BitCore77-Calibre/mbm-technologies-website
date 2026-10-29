import type { Metadata } from "next";
import { PageHero } from "../../components/page-hero";
import { SubmissionForm } from "../../components/submission-form";

export const metadata: Metadata = { title: "Start a Project", description: "Discuss a cybersecurity, blockchain, AI, DeFi or cryptography engineering project with MBM Technologies." };

export default function ContactPage() {
  return <main>
    <PageHero index="06" eyebrow="START A PROJECT" title="Bring us the complex system—not a simplified version of it." description="Tell us what the system must achieve, what cannot fail and where the uncertainty sits. We will use that context to structure a serious first conversation." />
    <section className="content-section shell form-section">
      <div className="form-intro"><p className="eyebrow"><span />PROJECT BRIEF</p><h2>Define the mission.</h2><p>We work best on consequential infrastructure where security, intelligence, distributed systems or economic design materially affect the outcome.</p><div className="signal-list"><span>CYPRUS / GLOBAL <i /></span><span>RESEARCH-LED <i /></span><span>SECURITY-FIRST <i /></span></div></div>
      <SubmissionForm kind="project" />
    </section>
    <section className="project-fit-section"><div className="shell">
      <div className="content-intro"><h2>A useful first brief does not need all the answers.</h2><p>It should tell us enough to identify the real engineering boundary. Confidential technical detail can wait until the appropriate discussion and controls are in place.</p></div>
      <div className="project-fit-grid">
        {[
          ["THE OBJECTIVE", "What should become possible when the work succeeds?"],
          ["THE FAILURE", "What outcome, exposure or dependency cannot be accepted?"],
          ["THE CURRENT STATE", "What already exists: research, code, infrastructure, team or evidence?"],
          ["THE CONSTRAINTS", "Which deadlines, regulations, technologies, budgets or trust assumptions matter?"],
        ].map(([title,copy],index) => <article key={title}><span className="mono">0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}
      </div>
      <div className="after-submit"><span className="mono">AFTER SUBMISSION</span><p>Your brief is reviewed for technical fit. A submission does not create a contract or guarantee acceptance. If the programme aligns, the next step is a focused conversation to define scope, confidentiality, responsibilities and evidence.</p></div>
    </div></section>
  </main>;
}
