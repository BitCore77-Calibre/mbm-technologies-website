import Link from "next/link";
import { Brand } from "./brand";
import { company, siteConfig, siteHost } from "../lib/site-config";

type FooterLink = { label: string; href: string };

function portalLinks(): FooterLink[] {
  const links: FooterLink[] = [];
  if (siteConfig.calibreWebsiteUrl) links.push({ label: "CALIBRE Network", href: siteConfig.calibreWebsiteUrl });
  links.push({ label: "Cyprus Blockchain Association", href: "https://cyprusblockchainassociation.com.cy/" });
  if (siteConfig.calibreExchangeUrl) links.push({ label: "Calibre Exchange", href: siteConfig.calibreExchangeUrl });
  else if (siteConfig.showLocalPortals) links.push({ label: "Exchange · local dev", href: siteConfig.localExchangeUrl });
  if (siteConfig.calibreSwapUrl) links.push({ label: "Calibre Swap", href: siteConfig.calibreSwapUrl });
  else if (siteConfig.showLocalPortals) links.push({ label: "Swap · local dev", href: siteConfig.localSwapUrl });
  return links;
}

export function SiteFooter() {
  const social: FooterLink[] = [
    company.linkedinUrl ? { label: "LINKEDIN", href: company.linkedinUrl } : null,
    company.githubUrl ? { label: "GITHUB", href: company.githubUrl } : null,
    company.xUrl ? { label: "X", href: company.xUrl } : null,
  ].filter((item): item is FooterLink => item !== null);

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>Secure. Intelligent. Decentralized.</p>
          <span>Engineering high-assurance digital systems from Cyprus to the world.</span>
          {(company.legalName || company.address || company.email) && (
            <address className="footer-company">
              {company.legalName && <span>{company.legalName}{company.registrationNumber ? ` · Reg. ${company.registrationNumber}` : ""}</span>}
              {company.address && <span>{company.address}</span>}
              {company.email && <a href={`mailto:${company.email}`}>{company.email}</a>}
            </address>
          )}
          {social.length > 0 && (
            <div className="footer-social">
              {social.map(item => <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>)}
            </div>
          )}
        </div>
        <div>
          <strong>Explore</strong>
          <Link href="/capabilities">Capabilities</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/projects/calibre-blockchain">CALIBRE</Link>
          <Link href="/research">Research</Link>
        </div>
        <div>
          <strong>Connect</strong>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Start a project</Link>
          <Link href="/company">Company</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <div>
          <strong>Laboratories</strong>
          <Link href="/projects/calibre-tests">Distributed Systems</Link>
          <Link href="/projects/calibre-artificial-intelligence-test-lab">Artificial Intelligence</Link>
          <Link href="/projects/calibre-cybersecurity-test-lab">Cybersecurity</Link>
        </div>
        <div>
          <strong>Portals</strong>
          {portalLinks().map(link => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
          ))}
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} {company.legalName || company.brandName}. All rights reserved.</span>
        <span>{siteHost()}</span>
      </div>
    </footer>
  );
}
