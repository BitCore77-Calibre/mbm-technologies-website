/** Cloudflare Worker entry point for the MBM Technologies website. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { handleAdmin } from "./admin";
import type { Env, ExecutionContext } from "./env";
import { handleRegistration } from "./registrations";
import { withSecurityHeaders } from "./security";
import { robotsTxt, sitemapXml } from "./seo";

async function route(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/api/registrations") return handleRegistration(request, env, ctx);
  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) return handleAdmin(request, env);
  if (url.pathname === "/robots.txt") return robotsTxt(request);
  if (url.pathname === "/sitemap.xml") return sitemapXml();
  if (url.pathname === "/healthz") return new Response("ok", { headers: { "content-type": "text/plain", "Cache-Control": "no-store" } });

  if (url.pathname === "/_vinext/image") {
    const images = env.IMAGES;
    if (!images) return new Response("Image optimization is not configured.", { status: 404 });
    const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
    return handleImageOptimization(request, {
      fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
      transformImage: async (body, { width, format, quality }) => {
        const result = await images.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
        return result.response();
      },
    }, allowedWidths);
  }

  return handler.fetch(request, env, ctx);
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const response = await route(request, env, ctx);
    // Leave the Vite development server alone (hot reload needs websockets and eval).
    if (import.meta.env.DEV) return response;
    return withSecurityHeaders(response, request);
  },
};

export default worker;
