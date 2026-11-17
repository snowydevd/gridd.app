import { TabBar } from "@/components/app/tab-bar"
import { getViewer, isPublisher } from "@/lib/convex"
import { getToken } from "@/lib/session"

/**
 * Las cuatro pestañas de la app (Inicio, Mapa, Guardados, Perfil) con la barra fija abajo. Las demás
 * pantallas (la ficha, el garage, publicar…) se abren encima, sin barra, como en la app.
 *
 * El token es el que haya, sin renovar: si venció, la página lo renueva y vuelve, y ahí el botón de
 * publicar ya aparece. `getViewer` está cacheado por token, así no se pide dos veces con la página.
 */
export default async function TabsLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer(await getToken())
  return (
    <div className="flex min-h-dvh flex-1 flex-col pb-[calc(4rem+env(safe-area-inset-bottom))]">
      {children}
      <TabBar canPublish={!!viewer && isPublisher(viewer)} />
    </div>
  )
}
