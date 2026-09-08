import { BottomNav } from "@/components/bottom-nav"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/toast"

/**
 * Shell de la app: header con wordmark, contenido y nav inferior en mobile.
 * El `pb-24` del main deja el aire que ocupa la nav inferior fija.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Toaster>
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 pt-8 pb-24 sm:px-8 md:pb-16 lg:px-12">
          {children}
        </main>
        <BottomNav />
      </div>
    </Toaster>
  )
}
