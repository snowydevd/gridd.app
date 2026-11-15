import Link from "next/link"
import { AndroidIcon, AppleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

// TODO: reemplazar por las URLs reales de Play Store y App Store cuando existan.
const stores = [
  {
    href: "#descargar",
    icon: AndroidIcon,
    eyebrow: "Descargala en",
    name: "Google Play",
    android: true,
    // Android manda con holgura en Uruguay: es el que va en flúor.
    primary: true,
  },
  {
    href: "#descargar",
    icon: AppleIcon,
    eyebrow: "Descargala en",
    name: "App Store",
    android: false,
    primary: false,
  },
] as const

/** `androidOnly` deja sólo Google Play (en `/nosotros` no se promete la app de iPhone). */
function StoreButtons({ className, androidOnly = false }: { className?: string; androidOnly?: boolean }) {
  const shown = androidOnly ? stores.filter((store) => store.android) : stores
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap gap-3">
        {shown.map((store) => (
          <Link
            key={store.name}
            href={store.href}
            className={cn(
              "group inline-flex items-center gap-3 rounded-4xl px-5 py-3 transition-all outline-none",
              "focus-visible:ring-[3px]",
              store.primary
                ? "bg-brand text-brand-foreground hover:bg-[color-mix(in_oklch,var(--brand),white_12%)] focus-visible:ring-brand/40"
                : "border border-border bg-input/30 text-foreground hover:bg-input/60 focus-visible:ring-ring/50"
            )}
          >
            <HugeiconsIcon
              icon={store.icon}
              strokeWidth={1.8}
              aria-hidden
              className="size-6 shrink-0 transition-transform group-hover:-translate-y-px"
            />
            <span className="flex flex-col items-start leading-none">
              <span
                className={cn(
                  "text-[0.6rem] font-semibold tracking-[0.12em] uppercase",
                  store.primary ? "text-brand-foreground/70" : "text-muted-foreground"
                )}
              >
                {store.eyebrow}
              </span>
              <span className="mt-1 text-sm font-medium">{store.name}</span>
            </span>
          </Link>
        ))}
      </div>
      <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {androidOnly ? "Muy pronto en Google Play." : "Muy pronto en Google Play y App Store."}
      </p>
    </div>
  )
}

export { StoreButtons }
