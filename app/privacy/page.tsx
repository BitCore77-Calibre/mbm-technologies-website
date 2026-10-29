import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy", description: "Privacy information for MBM Technologies website enquiries and talent registrations." };

export default function PrivacyPage() {
  return <main className="privacy shell">
    <p className="eyebrow"><span />PRIVACY</p><h1>Privacy information</h1>
    <p>MBM Technologies uses the information submitted through this website only to respond to project enquiries, evaluate potential collaborations and consider talent registrations for relevant opportunities.</p>
    <h2>Information we collect</h2><p>Depending on the form you use, this may include your name, contact details, organization, location, professional links, specialism, availability and the message you choose to provide.</p>
    <h2>Why we use it</h2><ul><li>To respond to your request or project brief.</li><li>To assess whether our capabilities fit your objective.</li><li>To consider you for relevant work or collaboration opportunities when you join the talent network.</li><li>To protect the website and detect misuse.</li></ul>
    <h2>Retention and your choices</h2><p>Information should be kept only as long as needed for the purpose described or applicable legal obligations. You may ask for access, correction or deletion by contacting MBM Technologies through the project enquiry form and clearly marking the request as privacy-related.</p>
    <h2>Important note</h2><p>This page is an initial website privacy notice and should be reviewed with the company’s legal and data-protection advisers before the public commercial launch.</p>
  </main>;
}
