/**
 * Contenido legal que se repite fuera de las páginas: links del footer y
 * motivos de reporte. Los textos largos viven en cada página de app/(app).
 */

/** Links legales. Orden del footer y del menú mobile. */
export const legalNav = [
  { href: "/terminos", label: "Términos" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/normas", label: "Normas" },
  { href: "/contacto", label: "Contacto" },
] as const

/**
 * Motivos de reporte de un evento. El primero es el que motiva todo esto,
 * así que va primero y no escondido en "Otro".
 */
export const reportReasons = [
  {
    value: "picada",
    label: "Picada o carrera en la vía pública",
    hint: "Competencia de velocidad fuera de un circuito habilitado.",
  },
  {
    value: "peligro",
    label: "Pone en riesgo a terceros",
    hint: "Maniobras en calle, lugar sin condiciones, convocatoria peligrosa.",
  },
  {
    value: "falso",
    label: "El evento no existe",
    hint: "Inventado, duplicado o cancelado hace rato.",
  },
  {
    value: "datos",
    label: "Datos incorrectos",
    hint: "Fecha, hora o lugar que no coinciden con la realidad.",
  },
  {
    value: "spam",
    label: "Spam o publicidad",
    hint: "No es un evento: es una venta o promoción.",
  },
  {
    value: "abuso",
    label: "Odio, acoso o contenido violento",
    hint: "Contra una persona o un grupo.",
  },
  {
    value: "otro",
    label: "Otro",
    hint: "Contanos abajo qué pasa.",
  },
] as const

export type ReportReason = (typeof reportReasons)[number]["value"]

/** Motivos que exigen una descripción para poder mandar el reporte. */
export const reasonsNeedingDetail: ReportReason[] = ["otro"]
