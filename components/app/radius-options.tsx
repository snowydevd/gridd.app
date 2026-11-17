"use client"

import { Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { text } from "@/components/app/ui"
import { SEARCH_RADII, searchRadiusLabel, type SearchRadius } from "@/lib/search-radius"
import { cn } from "@/lib/utils"

/** Lista de rangos de "Cerca tuyo", con el elegido marcado. La usan el perfil e Inicio. */
export function RadiusOptions({
  value,
  onSelect,
  className,
}: {
  value: SearchRadius
  onSelect: (radius: SearchRadius) => void
  className?: string
}) {
  return (
    <ul role="listbox" aria-label="Rango de búsqueda">
      {SEARCH_RADII.map((option, i) => {
        const selected = option === value
        return (
          <li key={option} role="option" aria-selected={selected}>
            <button
              type="button"
              onClick={() => onSelect(option)}
              className={cn(
                "flex min-h-12 w-full items-center gap-2 text-left outline-none active:opacity-70 focus-visible:underline",
                i < SEARCH_RADII.length - 1 && "border-b border-border",
                className
              )}
            >
              <span className={cn(text.label, "flex-1", selected ? "text-brand-text" : "text-foreground")}>
                {searchRadiusLabel(option)}
              </span>
              {option === "all" && <span className={cn(text.caption, "text-muted-foreground")}>Todo el país</span>}
              {selected && <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} aria-hidden className="size-[18px] text-brand-text" />}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
