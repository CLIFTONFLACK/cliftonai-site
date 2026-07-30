import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

/**
 * The host that actually serves: the apex 308-redirects to `www`, so pointing
 * canonical/OG at the apex would aim them at a redirect. Exported because
 * robots.ts and sitemap.ts must agree with it — a sitemap listing a URL that
 * disagrees with the page's own canonical is worse than no sitemap.
 */
export const siteUrl = "https://www.getbrian.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // cliftonai.co still serves this exact site with no redirect between the two
  // domains, so both hosts emit this tag and it names getbrian.xyz as the
  // authoritative copy. Without it the two domains compete as duplicates and
  // the one being retired keeps ranking.
  alternates: { canonical: "/" },
  title: "GetBrian: AI & Automation for UK Small Business",
  description:
    "Brian builds AI-powered apps and workflows that replace the CRM, project management, supply chain, and marketing software you're renting, for a £2,500 build fee (more for bigger projects) plus half your current subscription cost, and it's yours outright after three years. If you see Brian, get him.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "GetBrian: AI & Automation for UK Small Business",
    description:
      "If you see Brian, get him. He replaces the software you rent with software you own, for a £2,500 build fee (more for bigger projects) plus half of what you're already paying.",
    url: siteUrl,
    siteName: "GetBrian",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GetBrian. If you see Brian, get him." }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg font-body antialiased">
        {children}
      </body>
    </html>
  );
}
