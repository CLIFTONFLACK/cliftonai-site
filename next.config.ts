import type { NextConfig } from "next";

/**
 * The Healthy site moved to its own project and domain on 2026-10-04
 * (github.com/CLIFTONFLACK/GetBrianHealthy). Everything that used to live under
 * getbrian.xyz/healthy is sent there permanently. Query strings are kept by
 * Next's redirects, so `/healthy/confirm?t=...` links already emailed still work.
 */
export const HEALTHY_HOST = "https://www.getbrianhealthy.xyz";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The three picks were all Thorne until 2026-10-01, and those product
      // pages were live and indexed. Go straight to the new site's page for the
      // ingredient so the old address costs one hop, not two.
      {
        source: "/healthy/products/thorne-magnesium-glycinate",
        destination: `${HEALTHY_HOST}/products/pure-encapsulations-magnesium-glycinate`,
        permanent: true,
      },
      {
        source: "/healthy/products/thorne-creatine-stick-packs",
        destination: `${HEALTHY_HOST}/products/pure-encapsulations-creatine`,
        permanent: true,
      },
      {
        source: "/healthy/products/thorne-theanine",
        destination: `${HEALTHY_HOST}/products/pure-encapsulations-l-theanine`,
        permanent: true,
      },
      // Static files keep their /healthy/ prefix on the new site (public/healthy/),
      // so social cards and cached images that point at the old host still load.
      {
        source: "/healthy/products/:file(.+\\.(?:png|jpg|webp))",
        destination: `${HEALTHY_HOST}/healthy/products/:file`,
        permanent: true,
      },
      {
        source: "/healthy/:dir(brand|goals|mascot|video)/:path*",
        destination: `${HEALTHY_HOST}/healthy/:dir/:path*`,
        permanent: true,
      },
      {
        source: "/healthy/:file(.+\\.(?:png|jpg|webp|mp4))",
        destination: `${HEALTHY_HOST}/healthy/:file`,
        permanent: true,
      },
      // Pages: the /healthy prefix is dropped on the new site.
      { source: "/healthy", destination: HEALTHY_HOST, permanent: true },
      { source: "/healthy/:path*", destination: `${HEALTHY_HOST}/:path*`, permanent: true },
    ];
  },
};

export default nextConfig;
