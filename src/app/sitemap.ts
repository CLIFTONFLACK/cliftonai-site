import type { MetadataRoute } from "next";
import { siteUrl } from "./layout";

/**
 * The product subdomains (flow/crm/diffdoc/dealmaker/... on getbrian.xyz)
 * are deliberately absent: they are separate sites on separate hosts, and a
 * sitemap may only list URLs on its own host. GetBrianApp's legal pages are
 * on this host, so they're listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
}
