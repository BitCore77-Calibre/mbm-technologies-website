import type { Metadata } from "next";
import { PageHero } from "../../components/page-hero";
import { SubmissionForm } from "../../components/submission-form";
import { roles } from "../../lib/content";

export const metadata: Metadata = { title: "Careers", description: "Join the MBM Technologies global talent network for cybersecurity, blockchain, AI, DeFi and systems engineering roles." };

export default function CareersPage() {
  return <main>
    <PageHero index="05" eyebrow="CAREERS & TALENT" title="Do the strongest work of your career." description="MBM Technologies is forming a global network of engineers, researchers and builders for demanding cybersecurity, blockchain, artificial intelligence, DeFi and cryptography programmes." />
    <section className="content-section shell">
      <div className="content-intro"><h2>Specialists who can see the whole system.</h2><p>The roles below identify capabilities we expect to need as programmes grow. They are invitations to join our talent network, not a promise that every position is immediately open. We value evidence of deep work, intellectual honesty and the ability to collaborate across disciplines.</p></div>
      <div className="role-grid">
        {roles.map(role => <article className="role-card" key={role.title}><div><div className="role-meta"><span>{role.location}</span><span>{role.type}</span></div><h3>{role.title}</h3><p>{role.team}</p></div><div className="role-skills">{role.skills.map(skill => <span key={skill}>{skill}</span>)}</div></article>)}
      </div>
      <section className="talent-standard">
        <div className="content-intro"><h2>What matters more than a perfect résumé.</h2><p>We look for people who can explain their decisions, expose uncertainty and show evidence of difficult work. Different educational and professional paths are welcome when the technical foundation is real.</p></div>
        <div className="talent-standard-grid">
          {[
            ["DEPTH", "You understand at least one field beyond surface-level tools and terminology."],
            ["EVIDENCE", "You can show code, research, systems, tests, publications or documented problem-solving."],
            ["JUDGMENT", "You know when an assumption is unproven and when a safety boundary must stop the work."],
            ["COLLABORATION", "You can translate specialist knowledge for engineers working in adjacent disciplines."],
          ].map(([title,copy],index) => <article key={title}><span className="mono">0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
        <div className="selection-path"><span className="mono">TALENT NETWORK PATH</span><div>{["Register your expertise", "Human review", "Relevant programme match", "Technical conversation", "Defined opportunity"].map((item,index) => <span key={item}><i>0{index + 1}</i>{item}</span>)}</div></div>
      </section>
    </section>
    <section className="systems-section" id="talent-registration"><div className="shell form-section">
      <div className="form-intro"><p className="eyebrow"><span />TALENT REGISTRATION</p><h2>Show us what you can build.</h2><p>Register once for future project and employment opportunities. Tell us where your expertise is deepest and include evidence of your work.</p><div className="signal-list"><span>GLOBAL / REMOTE <i /></span><span>ENGINEERING & RESEARCH <i /></span><span>HUMAN-REVIEWED <i /></span></div></div>
      <SubmissionForm kind="talent" />
    </div></section>
  </main>;
}
