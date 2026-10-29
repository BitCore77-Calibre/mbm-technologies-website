import type { EcosystemPortal } from "../lib/content";
import { ArrowIcon } from "./brand";

export function EcosystemPortalCard({ portal, index }: { portal: EcosystemPortal; index: number }) {
  return (
    <article className={`ecosystem-card accent-${portal.accent}`}>
      <div className="ecosystem-card-head mono">
        <span>0{index + 1}</span>
        <span>{portal.access === "local" ? "LOCAL DEVELOPMENT" : portal.access === "public" ? "PUBLIC WEBSITE" : portal.category}</span>
      </div>
      <div className="ecosystem-card-copy">
        <h3>{portal.shortName}</h3>
        <p>{portal.description}</p>
      </div>
      <div className="ecosystem-card-foot">
        <span className="mono">{portal.signal}</span>
        <div className="ecosystem-link-stack">
          {portal.links.map(link => (
            <a href={link.href} key={`${link.href}-${link.label}`} target={link.access === "internal" ? undefined : "_blank"} rel={link.access === "public" ? "noopener noreferrer" : undefined}>
              <small>{link.access === "local" ? "LOCAL" : link.access === "public" ? "PUBLIC" : "MBM"}</small>
              {link.label} <ArrowIcon />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
