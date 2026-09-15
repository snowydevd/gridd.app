"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon, Search01Icon } from "@hugeicons/core-free-icons"

import { Wordmark } from "@/components/brand/wordmark"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { isActive, primaryNav } from "@/lib/nav"
import { cn } from "@/lib/utils"

const secondaryNav = [
  { href: "/kitchen-sink", label: "Kitchen sink" },
] as const

function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-14 items-center gap-4 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Gridd — inicio"
          className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Wordmark className="h-3.5 text-foreground" />
        </Link>

        <nav aria-label="Principal" className="ml-4 hidden items-center gap-1 md:flex">
          {primaryNav.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-4xl px-3 py-1.5 text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  active
                    ? "text-foreground after:absolute after:inset-x-3 after:-bottom-[13px] after:h-px after:bg-brand after:content-['']"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Buscar"
            nativeButton={false}
            render={<Link href="/eventos" />}
          >
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </Button>

          {/* Chrome neutro: el flúor queda para la acción primaria de cada página (GRI-4). */}
          <Button
            variant="secondary"
            size="sm"
            className="hidden md:inline-flex"
            nativeButton={false}
            render={<Link href="/publicar">Publicar</Link>}
          />

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Abrir menú"
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
          </Button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="sr-only">Menú</SheetTitle>
            <SheetDescription className="sr-only">
              Navegación principal de Gridd
            </SheetDescription>
            <Wordmark className="h-3.5 self-start text-foreground" />
          </SheetHeader>

          <nav aria-label="Menú" className="flex flex-col px-3">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <SheetClose
                  key={item.href}
                  nativeButton={false}
                  render={
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-4" />
                      {item.label}
                    </Link>
                  }
                />
              )
            })}

            <Separator className="my-3" />

            {secondaryNav.map((item) => (
              <SheetClose
                key={item.href}
                nativeButton={false}
                render={
                  <Link
                    href={item.href}
                    className="rounded-xl px-3 py-2.5 font-mono text-xs tracking-[0.06em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                }
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export { SiteHeader }
