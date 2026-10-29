"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowIcon } from "./brand";
import { siteConfig } from "../lib/site-config";

type TurnstileApi = {
  render(element: HTMLElement, options: { sitekey: string; theme?: "dark" | "light" | "auto"; action?: string }): string;
  reset(widgetId?: string): void;
};

declare global {
  interface Window { turnstile?: TurnstileApi }
}

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Loads Cloudflare Turnstile once per page, only when a site key is configured. */
function loadTurnstile(): Promise<TurnstileApi> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = TURNSTILE_SCRIPT;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", () => window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile unavailable")));
    script.addEventListener("error", () => reject(new Error("Turnstile unavailable")));
  });
}

type FormKind = "project" | "talent";

export function SubmissionForm({ kind, selectedRole }: { kind: FormKind; selectedRole?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const siteKey = siteConfig.turnstileSiteKey;
    const element = turnstileRef.current;
    if (!siteKey || !element) return;
    let cancelled = false;
    loadTurnstile()
      .then(api => {
        if (!cancelled && widgetId.current === undefined) {
          widgetId.current = api.render(element, { sitekey: siteKey, theme: "dark", action: kind });
        }
      })
      .catch(() => { /* The server reports a clear error if the check is required. */ });
    return () => { cancelled = true; };
  }, [kind]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, type: kind }),
      });
      const result = await response.json().catch(() => ({})) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "We could not submit your details.");
      setStatus("success");
      setMessage(result.message || "Thank you. Your submission has been received.");
      form.reset();
      if (window.turnstile && widgetId.current !== undefined) window.turnstile.reset(widgetId.current);
    } catch (error) {
      if (window.turnstile && widgetId.current !== undefined) window.turnstile.reset(widgetId.current);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${kind}-website`}>Website</label>
        <input id={`${kind}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field">
        <label htmlFor={`${kind}-name`}>Full name *</label>
        <input id={`${kind}-name`} name="name" required maxLength={100} placeholder="Your name" autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor={`${kind}-email`}>Email address *</label>
        <input id={`${kind}-email`} name="email" type="email" required maxLength={160} placeholder="you@company.com" autoComplete="email" />
      </div>
      {kind === "project" ? (
        <>
          <div className="field">
            <label htmlFor="organization">Organization <span>(optional)</span></label>
            <input id="organization" name="organization" maxLength={140} placeholder="Company or institution" autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor="project-type">Primary area *</label>
            <select id="project-type" name="role" required defaultValue="">
              <option value="" disabled>Select an area</option>
              <option>Cybersecurity engineering</option>
              <option>Blockchain protocol</option>
              <option>Artificial intelligence</option>
              <option>DeFi / exchange infrastructure</option>
              <option>Cryptography / post-quantum readiness</option>
              <option>Research collaboration</option>
              <option>Other complex system</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="country">Country / region</label>
            <input id="country" name="country" maxLength={100} placeholder="Where your team is based" autoComplete="country-name" />
          </div>
          <div className="field">
            <label htmlFor="phone">Telephone <span>(optional)</span></label>
            <input id="phone" name="phone" maxLength={40} placeholder="Include country code" autoComplete="tel" />
          </div>
          <div className="field field-full">
            <label htmlFor="project-message">What must the system achieve? *</label>
            <textarea id="project-message" name="message" required maxLength={3000} placeholder="Describe the objective, current stage, critical constraints and the risks that matter most." />
          </div>
        </>
      ) : (
        <>
          <div className="field">
            <label htmlFor="talent-role">Specialism *</label>
            <input id="talent-role" name="role" required maxLength={140} defaultValue={selectedRole} placeholder="e.g. Protocol security engineer" />
          </div>
          <div className="field">
            <label htmlFor="talent-country">Location *</label>
            <input id="talent-country" name="country" required maxLength={100} placeholder="City, country" autoComplete="country-name" />
          </div>
          <div className="field">
            <label htmlFor="linkedin">LinkedIn <span>(optional)</span></label>
            <input id="linkedin" name="linkedin" type="url" maxLength={300} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="field">
            <label htmlFor="portfolio">GitHub / portfolio <span>(optional)</span></label>
            <input id="portfolio" name="portfolio" type="url" maxLength={300} placeholder="https://github.com/..." />
          </div>
          <div className="field">
            <label htmlFor="availability">Availability</label>
            <select id="availability" name="availability" defaultValue="">
              <option value="" disabled>Select availability</option>
              <option>Immediately</option><option>Within 1 month</option><option>Within 3 months</option><option>Future opportunities</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="talent-phone">Telephone <span>(optional)</span></label>
            <input id="talent-phone" name="phone" maxLength={40} placeholder="Include country code" autoComplete="tel" />
          </div>
          <div className="field field-full">
            <label htmlFor="talent-message">Tell us what you can build *</label>
            <textarea id="talent-message" name="message" required maxLength={3000} placeholder="Share your strongest technical work, the systems you want to build and the problems that interest you." />
          </div>
        </>
      )}
      <label className="checkbox-field">
        <input name="consent" type="checkbox" value="yes" required />
        <span>I agree that MBM Technologies may use this information to respond to my enquiry and, for talent submissions, consider me for relevant opportunities, as described in the <Link href="/privacy" target="_blank">privacy notice</Link>. *</span>
      </label>
      {siteConfig.turnstileSiteKey && <div className="field field-full turnstile-field" ref={turnstileRef} />}
      {status !== "idle" && status !== "sending" && <div className={`form-status ${status}`} role="status">{message}</div>}
      <div className="form-actions">
        <span className="form-note">Fields marked * are required.</span>
        <button className="button" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Submitting…" : kind === "project" ? "Submit project brief" : "Join the talent network"} <ArrowIcon />
        </button>
      </div>
    </form>
  );
}
