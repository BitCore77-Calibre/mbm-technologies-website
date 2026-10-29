/** robots.txt and sitemap.xml, generated from the site's own page list. */
import { projects } from "../lib/content";
import { siteConfig } from "../lib/site-config";

const STATIC_PATHS = ["/", "/capabilities", "/projects", "/research", "/careers", "/company", "/contact", "/privacy"];

const textHeaders = { "Cache-Control": "public, max-age=3600" };

/** Preview addresses (workers.dev) and local machines must never be indexed. */
function isIndexableHost(request: Request) {
  const host = new URL(request.url).hostname;
  return !(host.endsWith(".workers.dev") || host === "localhost" || host === "127.0.0.1" || host.endsWith(".local"));
}

export function robotsTxt(request: Request): Response {
  const body = isIndexableHost(request)
    ? ["User-agent: *", "Allow: /", "Disallow: /admin", "Disallow: /api/", "", `Sitemap: ${siteConfig.siteUrl}/sitemap.xml`, ""].join("\n")
    : ["User-agent: *", "Disallow: /", ""].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", ...textHeaders } });
}

export function sitemapXml(): Response {
  const paths = [...STATIC_PATHS, ...projects.map(project => `/projects/${project.slug}`)];
  const urls = paths
    .map(path => `  <url><loc>${siteConfig.siteUrl}${path === "/" ? "/" : path}</loc><changefreq>${path === "/" ? "weekly" : "monthly"}</changefreq><priority>${path === "/" ? "1.0" : path.startsWith("/projects/") ? "0.7" : "0.8"}</priority></url>`)
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", ...textHeaders } });
}
