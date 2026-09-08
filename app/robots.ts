import type { MetadataRoute } from "next"

import { site } from "@/lib/site"

/**
 * Robots del sitio (GRI-22). `/perfil` y `/kitchen-sink` no tienen nada que
 * indexar; el resto es público y queremos que se indexe.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/perfil", "/kitchen-sink"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
