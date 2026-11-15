import Link from "next/link"
import { cookies } from "next/headers"

import { Wordmark } from "@/components/brand/wordmark"

/**
 * Header de las páginas internas: logo a la izquierda y, a la derecha, `children` (si la página
 * pone algo) y el acceso a la cuenta. Sólo mira si hay cookie de sesión: no consulta a Convex.
 */
export async function SiteHeader({ children }: { children?: React.ReactNode }) {
  const store = await cookies()
  const signedIn = store.has("GRIDD_SESSION_REFRESH") || store.has("GRIDD_SESSION_JWT")
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-3 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Gridd — inicio"
          className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Wordmark className="h-3.5 text-foreground" />
        </Link>
        <div className="flex items-center gap-2">
          {children}
          <Link
            href={signedIn ? "/perfil" : "/ingresar"}
            className="rounded-4xl border border-border px-4 py-2 text-sm font-medium outline-none hover:bg-input/30 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {signedIn ? "Mi perfil" : "Ingresar"}
          </Link>
        </div>
      </div>
    </header>
  )
}
