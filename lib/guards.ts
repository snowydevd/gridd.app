import { redirect } from "next/navigation"

import { getViewer, isPublisher, type Viewer } from "@/lib/convex"
import { loginUrl, pageToken } from "@/lib/session"

/**
 * Para las páginas del panel: sin sesión manda a `/ingresar` (y vuelve a `path`); con sesión pero sin
 * permiso para publicar, a pedirlo. El rol sale de Convex (`users.me`), nunca del cliente; igual cada
 * mutation lo vuelve a exigir con `requirePublisher`.
 */
export async function requirePublisherPage(path: string): Promise<{ token: string; viewer: Viewer }> {
  const token = await pageToken(path)
  const viewer = await getViewer(token)
  if (!token || !viewer) redirect(loginUrl(path))
  if (!isPublisher(viewer)) redirect("/perfil/organizar")
  return { token, viewer }
}
