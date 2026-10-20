import type { Metadata } from "next"

import { site } from "@/lib/site"

/**
 * Next reemplaza el objeto `openGraph` entero cuando una página define el
 * suyo, así que los defaults del root layout se pierden. Este helper los
 * vuelve a poner y arma título, canónica y OG de una (GRI-22).
 *
 * `title` va corto: el sufijo lo agrega el template del root layout.
 */
export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  index = true,
}: {
  title: string
  description: string
  /** Ruta absoluta desde la raíz, con barra inicial. */
  path: string
  /** Título para redes cuando el corto queda ambiguo fuera del sitio. */
  ogTitle?: string
  index?: boolean
}): Metadata {
  const shared = ogTitle ?? `${title} · ${site.name.toUpperCase()}`

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index ? undefined : { index: false, follow: true },
    openGraph: {
      siteName: site.name.toUpperCase(),
      locale: site.locale.replace("-", "_"),
      type: "website",
      title: shared,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: shared,
      description,
    },
  }
}
