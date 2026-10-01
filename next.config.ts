import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The three picks were all Thorne until 2026-10-01, and those product
    // pages were live and indexed. Each old address goes to its ingredient's
    // new page; the product page then sends UK visitors on to their own
    // country's pick when this one is not sold there.
    return [
      {
        source: "/healthy/products/thorne-magnesium-glycinate",
        destination: "/healthy/products/pure-encapsulations-magnesium-glycinate",
        permanent: true,
      },
      {
        source: "/healthy/products/thorne-creatine-stick-packs",
        destination: "/healthy/products/pure-encapsulations-creatine",
        permanent: true,
      },
      {
        source: "/healthy/products/thorne-theanine",
        destination: "/healthy/products/pure-encapsulations-l-theanine",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
