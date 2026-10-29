import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="MBM Technologies home">
      <span className="official-logo-crop" aria-hidden="true">
        <img src="/mbm-logo.webp" alt="" width={422} height={160} decoding="async" />
      </span>
      {!compact && (
        <span className="brand-copy">
          <strong>MBM</strong>
          <small>TECHNOLOGIES</small>
        </span>
      )}
    </Link>
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M7 5h8v8M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
