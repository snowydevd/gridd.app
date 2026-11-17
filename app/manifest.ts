import type { MetadataRoute } from "next"

import { site } from "@/lib/site"

/**
 * Para "Agregar a pantalla de inicio" en iPhone (y Android): abre a pantalla completa, sin la barra
 * del navegador, como una app. Mientras no esté la app de iOS, esto es lo que usan en iPhone.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GRIDD — Encuentros fierreros",
    short_name: site.name,
    description: site.description,
    lang: site.locale,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // El fondo del splash de la app (app.json) es oscuro.
    background_color: "#0B0B0C",
    theme_color: "#0B0B0C",
    categories: ["lifestyle", "social", "travel"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
