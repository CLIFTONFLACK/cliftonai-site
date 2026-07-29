import type { MetadataRoute } from "next";
import { siteUrl } from "./layout";

/**
 * One route. The product subdomains (flow/crm/diffdoc/dealmaker/... on
 * getbrian.xyz) are deliberately absent: they are separate sites on separate
 * hosts, and a sitemap may only list URLs on its own host.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
