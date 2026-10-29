import type { Metadata } from "next";
import Link from "next/link";
import { company } from "../../lib/site-config";

export const metadata: Metadata = { title: "Privacy", description: "Privacy information for MBM Technologies website enquiries and talent registrations.", alternates: { canonical: "/privacy" } };

// Change this date whenever the notice changes.
const LAST_UPDATED = "29 October 2026";

export default function PrivacyPage() {
  const controllerName = company.legalName || company.brandName;
  return <main className="privacy shell">
    <p className="eyebrow"><span />PRIVACY</p><h1>Privacy notice</h1>
    <p>This notice explains how {company.brandName} handles personal data submitted through this website, in line with the EU General Data Protection Regulation (GDPR) and the law of the Republic of Cyprus. Last updated: {LAST_UPDATED}.</p>

    <h2>Who is responsible</h2>
    <dl>
      <dt>Controller</dt><dd>{controllerName}</dd>
      {company.registrationNumber && <><dt>Registration</dt><dd>{company.registrationNumber}</dd></>}
      {company.address && <><dt>Address</dt><dd>{company.address}</dd></>}
      <dt>Contact</dt>
      <dd>{company.privacyEmail
        ? <a href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</a>
        : <>Use the <Link href="/contact">project enquiry form</Link> and start your message with “Privacy request”.</>}</dd>
    </dl>

    <h2>What we collect and why</h2>
    <table>
      <thead><tr><th>Form</th><th>Data</th><th>Purpose</th><th>Legal basis</th></tr></thead>
      <tbody>
        <tr><td>Start a project</td><td>Name, email, organization, area, country, telephone, message</td><td>To reply to your enquiry and assess whether we can help</td><td>Steps taken at your request before a possible contract (Art. 6(1)(b) GDPR)</td></tr>
        <tr><td>Talent network</td><td>Name, email, specialism, location, professional links, availability, telephone, message</td><td>To consider you for relevant work or collaboration</td><td>Your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time</td></tr>
        <tr><td>All forms</td><td>A one-way scrambled (hashed) form of your IP address, kept briefly</td><td>To limit automated spam submissions</td><td>Our legitimate interest in protecting the website (Art. 6(1)(f) GDPR)</td></tr>
      </tbody>
    </table>
    <p>Please do not send confidential technical details or special categories of personal data through the forms.</p>

    <h2>Who can see it</h2>
    <ul>
      <li>Authorised MBM Technologies staff who handle enquiries and recruitment.</li>
      <li>Our hosting and security provider (Cloudflare), which stores and serves the website for us under a data processing agreement. Cloudflare operates a global network, so data may be processed outside the European Economic Area under the European Commission’s Standard Contractual Clauses or an adequacy decision.</li>
      <li>When a new submission arrives, we may receive an internal alert that contains only the form type and topic — never your name, email or message.</li>
    </ul>
    <p>We do not sell personal data and we do not use it for advertising.</p>

    <h2>How long we keep it</h2>
    <ul>
      <li>Project enquiries: up to 24 months after our last contact, unless a contract follows.</li>
      <li>Talent registrations: up to 24 months, or sooner if you withdraw consent.</li>
      <li>Spam-protection records: deleted automatically within 48 hours.</li>
    </ul>

    <h2>Cookies and tracking</h2>
    <p>This website does not set advertising or tracking cookies. If a spam check is shown on a form, it is provided by Cloudflare Turnstile, which processes technical signals only to tell people from automated programs.</p>

    <h2>Your rights</h2>
    <p>You can ask to access, correct or delete your data, to restrict or object to its use, to receive it in a portable format, and to withdraw consent at any time. You also have the right to complain to the Commissioner for Personal Data Protection in Cyprus (<a href="https://www.dataprotection.gov.cy" target="_blank" rel="noopener noreferrer">dataprotection.gov.cy</a>) or to the authority where you live.</p>
  </main>;
}
