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
    "Encuentros fierreros en un solo lugar: junadas, rodadas, expos y fechas de pista. Publicá el tuyo en un minuto.",
  /** TODO: reemplazar por la casilla real antes de publicar las páginas legales. */
  contactEmail: "hola@gridd.app",
  /** Jurisdicción declarada en términos y privacidad. */
  jurisdiction: "Uruguay",
  /** Última revisión de los textos legales. Actualizar al cambiarlos. */
  legalUpdatedAt: "7 de setiembre de 2026",
} as const
