"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight01Icon, Cancel01Icon, Search01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import { Icon, iconButtonClass, text } from "@/components/app/ui"
import { cn } from "@/lib/utils"

/** Sin tildes ni mayúsculas: "citroen" encuentra "Citroën". */
const normalize = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

/**
 * Selector de la app (mobile/src/components/option-picker.tsx): un campo con la etiqueta arriba que
 * abre la lista a pantalla completa, con buscador si son muchas opciones.
 */
export function OptionPicker<T extends string | number>({
  label,
  value,
  options,
  onChange,
  placeholder = "Elegir",
  disabled,
  searchable,
}: {
  label: string
  value: T | null
  options: T[]
  onChange: (value: T) => void
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const search = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", esc)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", esc)
      document.body.style.overflow = ""
    }
  }, [open])

  const visible = query ? options.filter((o) => normalize(String(o)).includes(normalize(query))) : options

  return (
    <div className="flex flex-col gap-2">
      <span className={cn(text.overline, "text-muted-foreground")}>{label}</span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setQuery("")
          setOpen(true)
        }}
        className="flex min-h-14 items-center gap-3 rounded-[12px] border border-border bg-card px-4 text-left outline-none active:opacity-75 focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:opacity-60"
      >
        <span className={cn("flex-1 text-[17px] font-medium", value === null && "text-disabled")}>{value ?? placeholder}</span>
        <Icon icon={ArrowRight01Icon} className="size-[18px] text-muted-foreground" />
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-50 flex flex-col bg-background pt-[env(safe-area-inset-top)]">
          <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-4 pt-2 pb-3">
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className={iconButtonClass()}>
              <Icon icon={Cancel01Icon} strokeWidth={2} />
            </button>
            <p className={cn(text.title, "flex-1 truncate text-center")}>{label}</p>
            <span className="w-11" />
          </div>
          {searchable && (
            <div className="mx-auto w-full max-w-xl px-4 pb-2">
              <label className="relative block">
                <span className="sr-only">Buscar</span>
                <Icon icon={Search01Icon} className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={search}
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar"
                  className="h-12 w-full rounded-full border border-border bg-card pr-4 pl-11 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
                />
              </label>
            </div>
          )}
          <ul className="mx-auto w-full max-w-xl flex-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
            {visible.length === 0 && <li className={cn(text.body, "py-6 text-center text-muted-foreground")}>No hay resultados.</li>}
            {visible.map((option) => {
              const selected = option === value
              return (
                <li key={String(option)}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option)
                      setOpen(false)
                    }}
                    className="flex min-h-13 w-full items-center gap-2 border-b border-border text-left outline-none active:opacity-70"
                  >
                    <span className={cn(text.body, "flex-1", selected && "font-semibold text-brand-text")}>{option}</span>
                    {selected && <Icon icon={Tick02Icon} className="size-[18px] text-brand-text" strokeWidth={2} />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
