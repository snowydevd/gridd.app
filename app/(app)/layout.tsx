import { BottomNav } from "@/components/bottom-nav"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/toast"

/**
 * Shell de la app: header con wordmark, contenido, pie legal y nav inferior
 * en mobile. El aire que ocupa la nav inferior fija lo deja el pie.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Toaster>
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 pt-8 pb-16 sm:px-8 lg:px-12">
          {children}
        </main>
        <SiteFooter />
        <BottomNav />
      </div>
    </Toaster>
  )
}
