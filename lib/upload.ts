import { coverResize } from "@/lib/flyer-layout"

/**
 * Cómo se achica la imagen antes de subirla: recortada al centro con una proporción (`aspect`, la foto
 * de perfil) o entera con su forma, sin pasar `maxWidth` × `maxHeight` (el flyer de un evento).
 */
export type ImageFit = { width: number; aspect: number } | { maxWidth: number; maxHeight: number }

/**
 * Sube una imagen elegida en el navegador directo al storage de Convex, como hace la app
 * (mobile/src/lib/upload.ts): se achica según `fit` y se comprime como JPEG, así nunca pasa los 2 MB
 * que acepta Convex. Devuelve también las medidas de lo que se subió (la grilla de flyers las usa).
 * Sólo cliente: usa canvas.
 */
export async function uploadImage(uploadUrl: string, file: File, fit: ImageFit) {
  const { blob, width, height } = await resize(file, fit)
  const res = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": "image/jpeg" }, body: blob })
  if (!res.ok) throw new Error(`upload ${res.status}`)
  const { storageId } = (await res.json()) as { storageId: string }
  return { storageId, width, height }
}

async function resize(file: File, fit: ImageFit): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file)
  let sx = 0
  let sy = 0
  let sw = bitmap.width
  let sh = bitmap.height
  let outW: number
  let outH: number
  if ("aspect" in fit) {
    // Recorte centrado con la proporción `aspect` (ancho / alto).
    sh = Math.round(sw / fit.aspect)
    if (sh > bitmap.height) {
      sh = bitmap.height
      sw = Math.round(sh * fit.aspect)
    }
    sx = Math.round((bitmap.width - sw) / 2)
    sy = Math.round((bitmap.height - sh) / 2)
    outW = Math.min(fit.width, sw)
    outH = Math.round(outW / fit.aspect)
  } else {
    // Entera: por ancho, o por alto si es tan larga que pasaría `maxHeight`. Nunca se agranda.
    const size = coverResize(sw, sh, fit.maxWidth, fit.maxHeight)
    const scale = Math.min(1, "width" in size ? size.width / sw : size.height / sh)
    outW = Math.round(sw * scale)
    outH = Math.round(sh * scale)
  }

  const canvas = document.createElement("canvas")
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("canvas no disponible")
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, outW, outH)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8))
  if (!blob) throw new Error("no se pudo comprimir la imagen")
  return { blob, width: outW, height: outH }
}

/** Lo que acepta el `<input type="file">`: los mismos formatos que `AVATAR_TYPES` del backend. */
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp"
