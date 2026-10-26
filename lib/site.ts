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
    "La app de los encuentros fierreros de Uruguay: rodadas, expos, cars & coffee y fechas de pista cerca tuyo, en un solo lugar.",
  /** Casillas de contacto (Cloudflare Email Routing). Cada una ordena un tipo de consulta. */
  emails: {
    /** Lo general: prensa y lo que no entre en las otras. */
    hola: "hola@gridd.app",
    /** Dudas y problemas con la app, bajas de cuenta o de evento. */
    soporte: "soporte@gridd.app",
    /** Publicar eventos, alianzas, predios. */
    organizadores: "organizadores@gridd.app",
    /** Reportes de eventos y reclamos por moderación. */
    moderacion: "moderacion@gridd.app",
    /** Pedidos sobre datos personales. */
    privacidad: "privacidad@gridd.app",
  },
  /** Cuenta de Instagram de Gridd. */
  instagram: "gridd.app",
  /** Jurisdicción declarada en términos y privacidad. */
  jurisdiction: "Uruguay",
  /** Última revisión de los textos legales. Actualizar al cambiarlos. */
  legalUpdatedAt: "26 de octubre de 2026",
} as const
