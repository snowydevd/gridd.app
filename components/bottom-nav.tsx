"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"

import { isActive, primaryNav } from "@/lib/nav"
import { cn } from "@/lib/utils"

/**
 * Nav inferior, sólo mobile. El chrome se mantiene neutro: el activo se marca
 * con una barra flúor de 2px para no competir con la acción primaria del contenido.
 */
function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-4">
        {primaryNav.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-16 flex-col items-center justify-center gap-1.5 outline-none transition-colors focus-visible:bg-muted/50",
                  active ? "text-foreground" : "text-muted-foreground active:text-foreground"
                )}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-5 top-0 h-0.5 bg-brand"
                  />
                )}
                <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
                <span className="font-mono text-[0.625rem] tracking-[0.06em]">
                  {item.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export { BottomNav }
