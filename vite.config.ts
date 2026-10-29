import vinext from "vinext";
import { defineConfig } from "vite";

/**
 * Cloudflare D1 database for form submissions.
 * Local runs (dev, Docker) use a local SQLite file automatically.
 * For the public deployment, set CF_D1_DATABASE_ID to the ID shown in the
 * Cloudflare dashboard (Workers & Pages → D1) before building.
 */
const LOCAL_PLACEHOLDER_DATABASE_ID = "00000000-0000-4000-8000-000000000000";


export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state inside the project folder.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: {
      host: "0.0.0.0",
    },
    preview: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: true,
    },
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: {
          name: process.env.CF_WORKER_NAME || "mbm-technologies-website",
          main: "./worker/index.ts",
          compatibility_flags: ["nodejs_compat"],
          d1_databases: [
            {
              binding: "DB",
              database_name: process.env.CF_D1_DATABASE_NAME || "mbm-technologies",
              database_id: process.env.CF_D1_DATABASE_ID || LOCAL_PLACEHOLDER_DATABASE_ID,
              migrations_dir: "drizzle",
            },
          ],
          observability: { enabled: true },
        },
      }),
    ],
  };
});
