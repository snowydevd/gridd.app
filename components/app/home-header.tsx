"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { Navigation03Icon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { RadiusOptions } from "@/components/app/radius-options"
import { text } from "@/components/app/ui"
import { setSearchRadius } from "@/lib/actions"
import type { Viewer } from "@/lib/convex"
import { searchRadiusLabel, type SearchRadius } from "@/lib/search-radius"
import { cn } from "@/lib/utils"

/** Cápsula con el rango de "Cerca tuyo"; al tocarla despliega las opciones debajo. */
export function RadiusPill({ radius, signedIn }: { radius: SearchRadius; signedIn: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  // Se muestra el elegido al toque, sin esperar al servidor (como el optimistic update de la app).
  const [value, setValue] = useState(radius)
  const [, startTransition] = useTransition()
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", esc)
    }
  }, [open])

  const toggle = () => {
    if (!signedIn) return router.push("/ingresar?next=/")
    setOpen((o) => !o)
  }

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={`Rango de búsqueda: ${searchRadiusLabel(value)}. Cambiar rango`}
        className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 outline-none active:opacity-75 focus-visible:ring-[3px] focus-visible:ring-ring/60"
      >
        <HugeiconsIcon icon={Navigation03Icon} strokeWidth={1.8} aria-hidden className="size-3.5 text-muted-foreground" />
        <span className={text.label}>{searchRadiusLabel(value)}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-60 rounded-[12px] border border-border bg-card px-4 pt-3 pb-1 shadow-xl">
          <p className={cn(text.overline, "mb-1 text-muted-foreground")}>Encuentros a menos de</p>
          <RadiusOptions
            value={value}
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
    </div>
  )
}

/** Foto del usuario; sin foto, sus iniciales con borde punteado para invitar a subirla. */
export function ProfilePill({ viewer }: { viewer: Viewer | null }) {
  const name = viewer?.name?.trim()
  const initials = name
    ? name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : null
  return (
    <Link
      href={viewer ? "/perfil" : "/ingresar"}
      aria-label={viewer ? "Ir a tu perfil" : "Iniciar sesión"}
      className={cn(
        "flex size-9 items-center justify-center overflow-hidden rounded-full bg-card outline-none active:opacity-75 focus-visible:ring-[3px] focus-visible:ring-ring/60",
        !viewer?.image && "border-[1.5px] border-dashed border-brand-text"
      )}
    >
      {viewer?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={viewer.image} alt="" className="size-full object-cover" />
      ) : initials ? (
        <span className={text.label}>{initials}</span>
      ) : (
        <HugeiconsIcon icon={UserIcon} strokeWidth={1.8} aria-hidden className="size-[18px] text-muted-foreground" />
      )}
    </Link>
  )
}
