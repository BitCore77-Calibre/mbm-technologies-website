import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const registrations = sqliteTable("registrations", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["project", "talent"] }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization"),
  role: text("role"),
  country: text("country"),
  phone: text("phone"),
  linkedin: text("linkedin"),
  portfolio: text("portfolio"),
  availability: text("availability"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

/** Short-lived, hashed counters used to limit spam submissions. */
export const rateLimits = sqliteTable("rate_limits", {
  bucket: text("bucket").primaryKey(),
  hits: integer("hits").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
