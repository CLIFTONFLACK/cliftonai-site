import type { MetadataRoute } from "next";
import { siteUrl } from "./layout";

/**
 * Both getbrian.xyz and the retiring cliftonai.co serve this app, so this file
 * is emitted under both. The sitemap URL is absolute and always points at
 * getbrian.xyz, which — together with the canonical tag in layout.tsx — is what
 * tells crawlers which of the two domains is the real one.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
