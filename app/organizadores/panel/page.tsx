import { requirePublisherPage } from "@/lib/guards"
import { redirect } from "next/navigation"

/**
 * "Mis eventos" vive en Guardados, como en la app (el segmento de los organizadores). Esta ruta queda
 * para los links viejos.
 */
export default async function PanelPage() {
  await requirePublisherPage("/organizadores/panel")
  redirect("/guardados?ver=mios")
}
