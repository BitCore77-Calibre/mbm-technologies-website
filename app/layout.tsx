import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { absoluteUrl, company, siteConfig } from "../lib/site-config";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description =
  "Global cybersecurity, blockchain, artificial intelligence, DeFi and cryptography engineering for high-assurance digital systems.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "MBM Technologies — Secure. Intelligent. Decentralized.",
    template: "%s | MBM Technologies",
  },
  description,
  applicationName: "MBM Technologies",
  keywords: [
    "cybersecurity engineering",
    "blockchain engineering",
    "post-quantum blockchain",
    "artificial intelligence",
    "DeFi infrastructure",
    "post-quantum cryptography",
    "Web3 engineering",
    "Cyprus technology company",
  ],
  openGraph: {
    title: "MBM Technologies",
    description: "Engineering secure, intelligent and decentralized systems.",
    type: "website",
    siteName: "MBM Technologies",
    locale: "en_GB",
    url: absoluteUrl("/"),
    images: [{ url: absoluteUrl("/og.jpg"), width: 1200, height: 630, alt: "MBM Technologies — Secure. Intelligent. Decentralized." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MBM Technologies",
    description: "Secure. Intelligent. Decentralized.",
    images: [absoluteUrl("/og.jpg")],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#060a13",
  colorScheme: "dark",
};

function organizationJsonLd() {
  const sameAs = [company.linkedinUrl, company.githubUrl, company.xUrl].filter(Boolean);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.brandName,
    url: siteConfig.siteUrl,
    logo: absoluteUrl("/icon-512.png"),
    description,
    areaServed: "Worldwide",
    address: { "@type": "PostalAddress", addressCountry: "CY", ...(company.address ? { streetAddress: company.address } : {}) },
  };
  if (company.legalName) data.legalName = company.legalName;
  if (company.email) data.email = company.email;
  if (sameAs.length) data.sameAs = sameAs;
  // Escape "<" so the JSON can never close the script tag early.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationJsonLd() }} />
      </body>
    </html>
  );
}
