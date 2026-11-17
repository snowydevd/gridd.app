import type { MetadataRoute } from "next"

import { listUpcomingEvents } from "@/lib/convex"
import { site } from "@/lib/site"

// Se arma en cada pedido: los eventos cambian todo el tiempo y el build no tiene que depender de Convex.
export const dynamic = "force-dynamic"

/** Cuántas fichas de eventos entran como máximo (el límite de un sitemap es 50.000 URLs). */
const MAX_EVENTS = 500

/**
 * Sitemap (GRI-22): Inicio (los encuentros), la lista completa, la landing, las páginas legales y la
 * ficha de cada encuentro próximo (`/e/<slug>`), que es el contenido propio del sitio.
 */
const staticRoutes = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/eventos", changeFrequency: "daily", priority: 0.9 },
  { path: "/mapa", changeFrequency: "daily", priority: 0.8 },
  { path: "/nosotros", changeFrequency: "weekly", priority: 0.8 },
  { path: "/testers", changeFrequency: "monthly", priority: 0.6 },
  { path: "/normas", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terminos", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
  { path: "/contacto", changeFrequency: "yearly", priority: 0.3 },
] as const satisfies readonly {
  path: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
  priority: number
}[]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    // La raíz va sin barra final, igual que su canónica.
    url: route.path === "/" ? site.url : `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  // Si Convex no responde, el sitemap sale igual con las páginas fijas.
  const events = await listUpcomingEvents(MAX_EVENTS)
    .then((r) => r.events)
    .catch((error) => {
      console.error("[sitemap] no se pudieron leer los eventos:", error)
      return []
    })

  return [
    ...pages,
    ...events.map((event) => ({
      url: `${site.url}/e/${event.slug}`,
      lastModified: new Date(event.updatedAt ?? lastModified),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ]
}
