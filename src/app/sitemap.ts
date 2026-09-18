import type { MetadataRoute } from "next";
import { siteUrl } from "./layout";
import { LAUNCHED, products } from "./healthy/data";

/**
 * The product subdomains (flow/crm/diffdoc/dealmaker/... on getbrian.xyz)
 * are deliberately absent: they are separate sites on separate hosts, and a
 * sitemap may only list URLs on its own host. GetBrianApp's legal pages are
 * on this host, so they're listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // /healthy stays out until LAUNCHED, so draft product figures are never
  // submitted for indexing (the pages are noindex until then as well).
  const healthy: MetadataRoute.Sitemap = LAUNCHED
    ? [
        "/healthy",
        "/healthy/method",
        "/healthy/why-these-picks",
        "/healthy/about",
        "/healthy/disclosures",
        ...products.map((p) => `/healthy/products/${p.slug}`),
      ].map((path) => ({
        url: `${siteUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: path === "/healthy" ? 0.8 : 0.6,
      }))
    : [];

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/legal/getbrianapp/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/legal/getbrianapp/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...healthy,
  ];
}
