import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>Secure. Intelligent. Decentralized.</p>
          <span>Engineering high-assurance digital systems from Cyprus to the world.</span>
        </div>
        <div>
          <strong>Explore</strong>
          <Link href="/capabilities">Capabilities</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/research">Research</Link>
        </div>
        <div>
          <strong>Connect</strong>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Start a project</Link>
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
          <a href="https://cyprusblockchainassociation.com.cy/" target="_blank" rel="noopener noreferrer">Cyprus Blockchain Association</a>
          <a href="http://localhost:3001" target="_blank">Exchange Dev · :3001</a>
          <a href="http://localhost:3030" target="_blank">Swap Dev · :3030</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} MBM Technologies</span>
        <span>mbm-technologies.com</span>
      </div>
    </footer>
  );
}
