import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://mbm-technologies.com"),
  title: {
    default: "MBM Technologies — Secure. Intelligent. Decentralized.",
    template: "%s | MBM Technologies",
  },
  description:
    "Global cybersecurity, blockchain, artificial intelligence, DeFi and cryptography engineering for high-assurance digital systems.",
  keywords: [
    "cybersecurity engineering",
    "blockchain engineering",
    "artificial intelligence",
    "DeFi infrastructure",
    "post-quantum cryptography",
    "Web3 engineering",
  ],
  openGraph: {
    title: "MBM Technologies",
    description: "Engineering secure, intelligent and decentralized systems.",
    type: "website",
    images: ["https://mbm-technologies.lakdepal.chatgpt.site/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MBM Technologies",
    description: "Secure. Intelligent. Decentralized.",
    images: ["https://mbm-technologies.lakdepal.chatgpt.site/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
