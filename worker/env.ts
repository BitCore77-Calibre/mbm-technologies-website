/** Bindings and settings available to the Worker at runtime. */
export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES?: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };

  /** Secret. Password for /admin (any user name). Unset or under 12 characters = inbox switched off. */
  ADMIN_PASSWORD?: string;
  /** Secret. Telegram bot token for "new submission" alerts. Optional. */
  TELEGRAM_BOT_TOKEN?: string;
  /** Telegram chat that receives the alerts. Optional. */
  TELEGRAM_CHAT_ID?: string;
  /** Secret. Cloudflare Turnstile secret key. When set, forms must pass the spam check. */
  TURNSTILE_SECRET_KEY?: string;
  /** Secret. Random text mixed into hashed IP addresses for rate limiting. */
  RATE_LIMIT_SALT?: string;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}
