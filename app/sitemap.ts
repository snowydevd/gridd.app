import type { MetadataRoute } from "next"

import { site } from "@/lib/site"

/** Sitemap (GRI-22): la landing, la lista de encuentros y las páginas legales. */
const staticRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/eventos", changeFrequency: "daily", priority: 0.9 },
  { path: "/normas", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terminos", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
  { path: "/contacto", changeFrequency: "yearly", priority: 0.3 },
] as const satisfies readonly {
  path: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
  priority: number
}[]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return staticRoutes.map((route) => ({
    // La raíz va sin barra final, igual que su canónica.
    url: route.path === "/" ? site.url : `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
