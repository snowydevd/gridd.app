/**
 * Datos del sitio que se repiten en metadata, páginas legales y footer.
 */
export const site = {
  name: "Gridd",
  /** TODO: confirmar el dominio definitivo antes del primer deploy a producción. */
  url: "https://gridd.app",
  /** `lang` del documento. La variante OG (`es_UY`) sale de acá. */
  locale: "es-UY",
  description:
    "La app de los encuentros fierreros de Uruguay: junadas, rodadas, expos y fechas de pista cerca tuyo, en un solo lugar.",
  /** TODO: reemplazar por la casilla real antes de publicar las páginas legales. */
  contactEmail: "hola@gridd.app",
  /** Jurisdicción declarada en términos y privacidad. */
  jurisdiction: "Uruguay",
  /** Última revisión de los textos legales. Actualizar al cambiarlos. */
  legalUpdatedAt: "20 de octubre de 2026",
} as const
