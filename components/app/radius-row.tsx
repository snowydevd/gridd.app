"use client"

import { useState, useTransition } from "react"
import { ArrowRight01Icon, Location01Icon } from "@hugeicons/core-free-icons"

import { RadiusOptions } from "@/components/app/radius-options"
import { Icon, rowClass, text } from "@/components/app/ui"
import { setSearchRadius } from "@/lib/actions"
import { searchRadiusLabel, type SearchRadius } from "@/lib/search-radius"
import { cn } from "@/lib/utils"

/** "Ubicación" del perfil: despliega los rangos de "Cerca tuyo" debajo, como en la app. */
export function RadiusRow({ radius }: { radius: SearchRadius }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(radius)
  const [, startTransition] = useTransition()
  return (
    <>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={cn(rowClass, "border-b border-border")}>
        <Icon icon={Location01Icon} className="text-muted-foreground" />
        <span className={cn(text.heading, "flex-1 text-base")}>Ubicación</span>
        <span className={cn(text.label, "text-muted-foreground")}>{searchRadiusLabel(value)}</span>
        <Icon icon={ArrowRight01Icon} className={cn("size-[18px] text-muted-foreground transition-transform", open && "rotate-90")} />
      </button>
      {open && (
        <div className="border-b border-border">
          <RadiusOptions
            value={value}
            className="pl-9"
            onSelect={(option) => {
              setValue(option)
              setOpen(false)
              startTransition(async () => {
                const result = await setSearchRadius({ radius: option })
                if (!result.ok) setValue(radius)
              })
            }}
          />
        </div>
      )}
    </>
  )
}
