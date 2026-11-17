"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Add01Icon, Bookmark02Icon, DashboardSquare01Icon, MapsIcon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

/** Las cuatro pestañas de la app (mobile/src/components/tab-bar.tsx): sólo íconos, el texto es para lectores. */
const TABS: { href: string; label: string; icon: IconSvgElement }[] = [
  { href: "/", label: "Inicio", icon: DashboardSquare01Icon },
  { href: "/mapa", label: "Mapa", icon: MapsIcon },
  { href: "/guardados", label: "Guardados", icon: Bookmark02Icon },
  { href: "/perfil", label: "Perfil", icon: UserIcon },
]

/** Alto de la barra sin la zona segura, como `TabBarHeight` en la app. */
export const TAB_BAR_HEIGHT = 64

/**
 * Barra de pestañas fija abajo, con la zona segura del iPhone. En el medio, el botón flúor de
 * publicar, que sólo ven los organizadores (como en la app).
 */
export function TabBar({ canPublish }: { canPublish: boolean }) {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex h-16 w-full max-w-xl items-stretch">
        {TABS.map((tab, i) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href)
          return (
            <div key={tab.href} className="contents">
              {i === 2 && canPublish && (
                <div className="flex flex-1 items-center justify-center">
                  <Link
                    href="/organizadores/panel/nuevo"
                    aria-label="Publicar evento"
                    className="flex size-[52px] items-center justify-center rounded-full bg-brand text-brand-foreground outline-none transition-transform active:scale-95 focus-visible:ring-[3px] focus-visible:ring-ring/60"
                  >
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2.2} aria-hidden className="size-6.5" />
                  </Link>
                </div>
              )}
              <Link
                href={tab.href}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-1 items-center justify-center outline-none focus-visible:bg-raised",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <HugeiconsIcon icon={tab.icon} strokeWidth={active ? 2 : 1.7} aria-hidden className="size-[22px]" />
                {active && <span aria-hidden className="absolute -top-px h-0.5 w-6 rounded-[1px] bg-brand-text" />}
              </Link>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
