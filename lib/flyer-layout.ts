// Cómo se acomodan los flyers con su forma real. Copia de mobile/src/lib/flyer-layout.ts (allá tiene
// tests); spec: mobile/docs/superpowers/specs/2026-11-19-feed-flyers-design.md.

/** El más alto que se muestra: una historia de Instagram. */
export const MIN_ASPECT = 9 / 16
/** El más ancho: la portada apaisada que se recortaba antes. */
export const MAX_ASPECT = 16 / 10
/** Sin medidas guardadas (portadas viejas que el backfill no pudo leer, o sin portada). */
export const DEFAULT_ASPECT = 16 / 10

/** Ancho / alto, o `DEFAULT_ASPECT` si falta alguna medida. */
export function aspectOf(width?: number, height?: number): number {
  if (!width || !height || width <= 0 || height <= 0) return DEFAULT_ASPECT
  return width / height
}

/** La proporción de la tarjeta: la del flyer, dentro del rango 9:16–16:10. */
export function clampAspect(aspect: number): number {
  return Math.min(MAX_ASPECT, Math.max(MIN_ASPECT, aspect))
}

/**
 * `cover` si la tarjeta tiene la forma del flyer (no corta nada); `contain` si se limitó la
 * proporción, y entonces va sobre un relleno del mismo flyer desenfocado.
 */
export function flyerFit(aspect: number, shown: number): "cover" | "contain" {
  return Math.abs(aspect - shown) < 0.01 ? "cover" : "contain"
}

/**
 * Reparte en dos columnas en orden: cada ítem va a la más corta (empate, la izquierda). Sólo
 * depende de los ítems anteriores, así que sumar más al final no mueve los de arriba.
 */
export function splitColumns<T>(items: T[], heightOf: (item: T) => number, gap: number): [T[], T[]] {
  const cols: [T[], T[]] = [[], []]
  const heights = [0, 0]
  for (const item of items) {
    const i = heights[1] < heights[0] ? 1 : 0
    cols[i].push(item)
    const h = heightOf(item)
    // Un ítem que no se ve (anuncio sin cargar) tampoco suma el espacio entre tarjetas.
    if (h > 0) heights[i] += h + gap
  }
  return cols
}

/**
 * A qué tamaño se achica la portada antes de subirla: a `maxWidth` de ancho, salvo que así pase
 * `maxHeight` de alto (una captura larguísima pesaría más de 2 MB y el backend la rechaza).
 */
export function coverResize(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number } | { height: number } {
  return (height * maxWidth) / width > maxHeight ? { height: maxHeight } : { width: maxWidth }
}

/** Alto del nombre y el lugar debajo de un flyer de la grilla. */
export const FLYER_TEXT_HEIGHT = 48
