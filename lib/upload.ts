/**
 * Sube una imagen elegida en el navegador directo al storage de Convex, como hace la app
 * (mobile/src/lib/upload.ts): se recorta al centro con la proporción pedida, se achica a `width` px
 * y se comprime como JPEG. Así nunca pasa los 2 MB que acepta Convex.
 * Sólo cliente: usa canvas.
 */
export async function uploadImage(uploadUrl: string, file: File, { width, aspect }: { width: number; aspect: number }) {
  const blob = await resize(file, width, aspect)
  const res = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": "image/jpeg" }, body: blob })
  if (!res.ok) throw new Error(`upload ${res.status}`)
  const { storageId } = (await res.json()) as { storageId: string }
  return storageId
}

async function resize(file: File, width: number, aspect: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  // Recorte centrado con la proporción `aspect` (ancho / alto).
  let sw = bitmap.width
  let sh = Math.round(sw / aspect)
  if (sh > bitmap.height) {
    sh = bitmap.height
    sw = Math.round(sh * aspect)
  }
  const sx = Math.round((bitmap.width - sw) / 2)
  const sy = Math.round((bitmap.height - sh) / 2)
  const outW = Math.min(width, sw)
  const outH = Math.round(outW / aspect)

  const canvas = document.createElement("canvas")
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("canvas no disponible")
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, outW, outH)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8))
  if (!blob) throw new Error("no se pudo comprimir la imagen")
  return blob
}

/** Lo que acepta el `<input type="file">`: los mismos formatos que `AVATAR_TYPES` del backend. */
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp"
