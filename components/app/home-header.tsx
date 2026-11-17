import Link from "next/link"
import { UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { text } from "@/components/app/ui"
import type { Viewer } from "@/lib/convex"
import { cn } from "@/lib/utils"

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
