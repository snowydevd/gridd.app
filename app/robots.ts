import type { MetadataRoute } from "next"

import { site } from "@/lib/site"

/** Robots del sitio (GRI-22): todo es público y queremos que se indexe. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
