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

const siteUrl = "https://cliftonai.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CliftonAi — AI Integrator for Commercial Operations",
  description:
    "CliftonAi builds and integrates AI-powered tools that streamline commercial operations — ContentFlowSuite, SLC-CRM, Merlow's, and Empirely.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "CliftonAi — AI Integrator for Commercial Operations",
    description:
      "We build and integrate AI-powered tools that streamline commercial operations.",
    url: siteUrl,
    siteName: "CliftonAi",
    type: "website",
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
